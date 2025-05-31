import type { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  WORKER_ACTION_TYPE,
  type DisplayOutgoingPostMessage,
  type IAction,
  type WorkerManagerIncomingPostMessage
} from '../../types/worker';
import type {
  AddDisplayWorkerPortMessage,
  InitActionToMainWorker,
  MainWorkerIncomingAction,
  ReplaceCanvasActionToMainWorker
} from '../../types/worker.message.main';
import type { InitMessageToDisplayWorker } from '../../types/worker.message.display';
import { workerManager as logger } from '../../utils/logger';
import type Display from './Display';

export default class WorkerManager {
  private messageSubscription?: Subscription;

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

    const action: InitActionToMainWorker = {
      type: WORKER_ACTION_TYPE.INIT,
      payload: { canvas: offscreen }
    };

    this.messageSubscription = fromEvent<
      MessageEvent<WorkerManagerIncomingPostMessage>
    >(this.mainWorker, 'message').subscribe(this.onMessage.bind(this));

    await this.action<InitActionToMainWorker>(action, [offscreen]);

    this.readyResolver.resolve();
  }

  async onMessage(event: MessageEvent<WorkerManagerIncomingPostMessage>) {
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

      case WORKER_ACTION_TYPE.UPDATE_CANVAS: {
        console.log('[WorkerManager] BOOOOM', event.data);
        // Hier können Sie die Logik für die Verarbeitung von Zoom-Updates hinzufügen
      }
    }

    resolveMap.get(id)?.(data);
  }

  get ready() {
    return this.readyResolver.promise;
  }

  destroy() {
    this.messageSubscription?.unsubscribe();
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
      const action: ReplaceCanvasActionToMainWorker = {
        type: WORKER_ACTION_TYPE.REPLACE_CANVAS,
        payload: { canvas: offscreen }
      };
      await this.action<ReplaceCanvasActionToMainWorker>(action, [offscreen]);
    } else {
      // this.destroy();
      this.setup(canvas);
    }
  }

  addDisplay(display: Display, canvas: HTMLCanvasElement) {
    logger.info('[WorkerManager] Register Canvas', canvas);
    const workerInstance = new Worker(
      new URL('../../workers/display.ts', import.meta.url),
      {
        type: 'module'
      }
    );

    display.setWorker(workerInstance);

    this.displayWorkers.push(workerInstance);

    if (canvas) {
      const offscreen = canvas.transferControlToOffscreen();
      const channel = new MessageChannel();

      // Sende den Port1 an den Zoom-Worker und die OffscreenCanvas
      const renderInitMessage: InitMessageToDisplayWorker = {
        type: WORKER_ACTION_TYPE.INIT,
        payload: { canvas: offscreen },
        port: channel.port1
      };

      this.action(
        renderInitMessage,
        [offscreen, channel.port1],
        workerInstance
      );

      window.test = window.test || [];
      window.test.push(() => {
        this.action(
          {
            type: WORKER_ACTION_TYPE.DEBUG
          },
          [],
          workerInstance
        );
      });

      // Sende den Port2 an den Haupt-Worker, damit dieser mit dem Zoom-Worker kommunizieren kann
      if (this.mainWorker) {
        const addPortMessage: AddDisplayWorkerPortMessage = {
          type: WORKER_ACTION_TYPE.ADD_RENDER_WORKER_PORT,
          payload: {
            port: channel.port2
          }
        };
        this.action(addPortMessage, [channel.port2]);
      }
    }
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

    logger
      .withTag('main')
      .withTag('action')
      .withTag(action.type)
      .start(action, worker);

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
