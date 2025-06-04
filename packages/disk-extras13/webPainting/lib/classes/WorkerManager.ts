import { Subscription, fromEvent, lastValueFrom, of } from 'rxjs';
import { workerManager as logger } from '../../utils/logger';
import actionsMain from '../../workers/client/client.actionsMain';
import actionsDisplay from '../../workers/client/client.actionsDisplay';
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
import type Display from './Display';
import type { ClientIncomingAction } from '../../types/worker.message.client';
import type {
  AddDisplayWorkerPortPayload,
  InitDisplayPayload,
  InitPayload,
  ReplaceCanvasPayload
} from '../../types/worker.payload';
import { serializeWorkerPostMessage } from '../../operators';

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
              options: display.options,
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

  async action<Action extends IAction = MainWorkerIncomingAction>(
    action: Action,
    transfer?: Transferable[],
    worker: Worker = this.mainWorker!
  ) {
    const id = crypto.randomUUID();
    const resolver = Promise.withResolvers<undefined>();
    resolveMap.set(id, resolver.resolve);

    logger.withTag('action').withTag(action.type).start(action, worker);

    const data = await lastValueFrom(
      of<DisplayOutgoingPostMessage<Action>>({
        id,
        data: action
      }).pipe(serializeWorkerPostMessage())
    );

    worker.postMessage<DisplayOutgoingPostMessage<Action>>(
      data,
      transfer || []
    );

    return resolver.promise.then(data => {
      resolveMap.delete(id);
      return data;
    });
  }

  async onMessageMainWorker(
    event: MessageEvent<WorkerManagerIncomingPostMessage>
  ) {
    const { id, data } = event.data;
    await actionsMain(this, data);
    resolveMap.get(id)?.(data);
  }

  async onMessageDisplayWorker(
    event: MessageEvent<WorkerManagerIncomingPostMessage<ClientIncomingAction>>,
    display: Display
  ) {
    const { id, data } = event.data;
    await actionsDisplay(this, display, data);
    resolveMap.get(id)?.(data);
  }
}

const resolveMap = new Map<string, CallableFunction>();
