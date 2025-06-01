import { Subscription, fromEvent } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  WORKER_ACTION_TYPE,
  type DisplayOutgoingPostMessage,
  type IAction,
  type WorkerManagerIncomingPostMessage
} from '../../types/worker';
import type {
  ActionCommandToMainWorker,
  MainWorkerIncomingAction
} from '../../types/worker.message.main';
import type { ActionCommandToDisplayWorker } from '../../types/worker.message.display';
import { workerManager as logger } from '../../utils/logger';
import type Display from './Display';
import { ipoint } from '@js-basics/vector';
import type { ClientIncomingAction } from '../../types/worker.message.client';
import type {
  AddDisplayWorkerPortPayload,
  InitDisplayPayload,
  InitPayload,
  ReplaceCanvasPayload
} from '../../types/worker.payload';

export default class WorkerManager {
  private subscription?: Subscription = new Subscription();

  private readyResolver: PromiseWithResolvers<void> = Promise.withResolvers();
  canvas!: HTMLCanvasElement;
  mainWorker: Worker | null = null;
  displayWorkers: Worker[] = [];

  private async setup(canvas: HTMLCanvasElement) {
    const workerInstance = new Worker(
      new URL('../../workers/main.ts', import.meta.url),
      {
        type: 'module'
      }
    );
    this.mainWorker = workerInstance;

    this.canvas = canvas;
    const offscreen = this.canvas!.transferControlToOffscreen();

    const action: ActionCommandToMainWorker<InitPayload> = {
      type: WORKER_ACTION_TYPE.INIT,
      payload: { canvas: offscreen }
    };

    this.subscription?.add(
      fromEvent<MessageEvent<WorkerManagerIncomingPostMessage>>(
        this.mainWorker,
        'message'
      ).subscribe(this.onMessageMainWorker.bind(this))
    );

    await this.action(action, [offscreen]);

    this.readyResolver.resolve();
  }

  async onMessageMainWorker(
    event: MessageEvent<WorkerManagerIncomingPostMessage>
  ) {
    const { id, data } = event.data;

    switch (data.type) {
      case WORKER_ACTION_TYPE.INIT:
        {
          logger
            .withTag('Incoming')
            .withTag('action')
            .withTag(WORKER_ACTION_TYPE.INIT)
            .success(event.data);
        }
        break;

      case WORKER_ACTION_TYPE.UPDATE_CANVAS:
        {
          console.log('[WorkerManager] BOOOOM', event.data);
          // Hier können Sie die Logik für die Verarbeitung von Zoom-Updates hinzufügen
        }
        break;

      default:
        {
          logger
            .withTag('Incoming')
            .withTag('main')
            .withTag('action')
            .warn('Action not handled in WorkerManager:', data);
        }
        break;
    }

    resolveMap.get(id)?.(data);
  }

  async onMessageDisplayWorker(
    event: MessageEvent<WorkerManagerIncomingPostMessage<ClientIncomingAction>>,
    display: Display
  ) {
    const { id, data } = event.data;

    switch (data.type) {
      case WORKER_ACTION_TYPE.SET_ZOOM_SUCCESS:
        {
          if (data.payload && 'position' in data.payload) {
            display.options.position = ipoint(
              data.payload.position.x,
              data.payload.position.y
            );
            logger.error(
              '[WorkerManager] Zoom set successfully',
              data,
              display.options.position.toArray()
            );
          }
        }
        break;

      default:
        {
          logger
            .withTag('Incoming')
            .withTag('display')
            .withTag('action')
            .warn('Action not handled in WorkerManager:', data);
        }
        break;
    }

    resolveMap.get(id)?.(data);
  }

  get ready() {
    return this.readyResolver.promise;
  }

  destroy() {
    this.subscription?.unsubscribe();
    if (this.mainWorker) {
      this.mainWorker.terminate();
      this.mainWorker = null;
    }
    this.displayWorkers.forEach(worker => worker.terminate());
    this.displayWorkers = [];
  }

  async setCanvas(canvas: HTMLCanvasElement) {
    if (this.mainWorker) {
      // worker exist, only canvas needs to be updated
      logger.info('[WorkerManager] Update Canvas', canvas);
      const offscreen = canvas.transferControlToOffscreen();
      const action: ActionCommandToMainWorker<ReplaceCanvasPayload> = {
        type: WORKER_ACTION_TYPE.REPLACE_CANVAS,
        payload: { canvas: offscreen }
      };
      await this.action(action, [offscreen]);
    } else {
      // this.destroy();
      this.setup(canvas);
    }
  }

  addDisplay(display: Display, canvas: HTMLCanvasElement) {
    return new Promise<void>(resolve => {
      logger.info('[WorkerManager] Register Canvas', canvas);
      const workerInstance = new Worker(
        new URL('../../workers/display.ts', import.meta.url),
        {
          type: 'module'
        }
      );

      display.setWorker(workerInstance);

      this.subscription?.add(
        fromEvent<
          MessageEvent<WorkerManagerIncomingPostMessage<ClientIncomingAction>>
        >(workerInstance, 'message').subscribe(e =>
          this.onMessageDisplayWorker(e, display)
        )
      );

      this.displayWorkers.push(workerInstance);

      if (canvas) {
        const offscreen = canvas.transferControlToOffscreen();
        const channel = new MessageChannel();
        const renderInitMessage: ActionCommandToDisplayWorker<InitDisplayPayload> =
          {
            type: WORKER_ACTION_TYPE.INIT,
            payload: {
              options: display.options.toJSON(),
              canvas: offscreen,
              port: channel.port1
            }
          };

        if (this.mainWorker) {
          const addPortMessage: ActionCommandToMainWorker<AddDisplayWorkerPortPayload> =
            {
              type: WORKER_ACTION_TYPE.ADD_RENDER_WORKER_PORT,
              payload: {
                port: channel.port2
              }
            };
          this.action(addPortMessage, [channel.port2]).then(resolve);
        }

        this.action(
          renderInitMessage,
          [offscreen, channel.port1],
          workerInstance
        );
      }
    });
  }

  removeDisplay(display: Display) {
    this.displayWorkers = this.displayWorkers.filter(
      worker => worker !== display.worker
    );
    display.worker?.terminate();
    display.worker = undefined;
  }

  resolveMap = new Map<string, CallableFunction>();

  action<Action extends IAction = MainWorkerIncomingAction>(
    action: Action,
    transfer?: Transferable[],
    worker: Worker = this.mainWorker!
  ) {
    const id = uuidv4();
    const resolver = Promise.withResolvers<undefined>();
    resolveMap.set(id, resolver.resolve);

    logger.withTag('action').withTag(action.type).start(action, worker);

    worker.postMessage<DisplayOutgoingPostMessage<Action>>(
      {
        id,
        data: action
      },
      transfer || []
    );

    return resolver.promise.then(data => {
      resolveMap.delete(id);
      return data;
    });
  }
}

const resolveMap = new Map<string, CallableFunction>();
