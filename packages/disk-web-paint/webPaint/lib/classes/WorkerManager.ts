import { Subscription, fromEvent, lastValueFrom, map, of } from 'rxjs';
import { workerManager as logger } from '../../utils/logger';
import actionsMain from '../../workers/client/client.actionsMain';
import actionsDisplay from '../../workers/client/client.actionsDisplay';
import { WORKER_ACTION_TYPE } from '../../types/worker';
import type {
  DisplayOutgoingPostMessage,
  IAction,
  IActionResult,
  WorkerManagerIncomingPostMessage
} from '../../types/worker';
import type {
  ActionCommandToMainWorker,
  MainWorkerIncomingAction
} from '../../types/worker.message.main';
import type {
  ActionCommandToDisplayWorker,
  DisplayWorkerIncomingAction
} from '../../types/worker.message.display';
import type Display from './Display';
import type { ClientIncomingAction } from '../../types/worker.message.client';
import type {
  AddDisplayWorkerPortPayload,
  InitDisplayPayload,
  InitPayload
  // ReplaceCanvasPayload
} from '../../types/worker.payload';
import {
  deserializeWorkerPostMessage,
  serializeWorkerPostMessage
} from '../../operators';
import type { App } from '../App';
import type Config from '@web-workbench/core/classes/Config';

export interface WorkerManagerOptions {
  debug?: boolean;
}

export default class WorkerManager {
  private subscription?: Subscription = new Subscription();
  private readyResolver: PromiseWithResolvers<void> = Promise.withResolvers();

  mainWorker: Worker | null = null;
  displayWorkers: Worker[] = [];

  constructor(
    private app: App,
    public config: Config,
    public options: { debug: boolean } = { debug: false }
  ) {}

  async setup() {
    const workerInstance = new Worker(
      new URL('../../workers/main.ts', import.meta.url),
      {
        type: 'module'
      }
    );
    this.mainWorker = workerInstance;

    const action: ActionCommandToMainWorker<InitPayload> = {
      type: WORKER_ACTION_TYPE.INIT,
      payload: {
        debug: this.options.debug
      }
    };

    this.subscription?.add(
      fromEvent<MessageEvent<WorkerManagerIncomingPostMessage>>(
        this.mainWorker,
        'message'
      )
        .pipe(
          map(event => event.data),
          deserializeWorkerPostMessage()
        )
        .subscribe(e => {
          this.onMessageMainWorker(e);
        })
    );

    await this.action(action);

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

  // async setCanvas(canvas: HTMLCanvasElement) {
  //   if (this.mainWorker) {
  //     // worker exist, only canvas needs to be updated
  //     logger.info('[WorkerManager] Update Canvas', canvas);
  //     const offscreen = canvas.transferControlToOffscreen();
  //     const action: ActionCommandToMainWorker<ReplaceCanvasPayload> = {
  //       type: WORKER_ACTION_TYPE.REPLACE_CANVAS,
  //       payload: { canvas: offscreen }
  //     };
  //     await this.action(action, [offscreen]);
  //   } else {
  //     // this.destroy();
  //     this.setup(canvas);
  //   }
  // }

  addDisplay(display: Display, canvas: HTMLCanvasElement) {
    return new Promise<void>(resolve => {
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
        >(workerInstance, 'message')
          .pipe(
            map(event => event.data),
            deserializeWorkerPostMessage()
          )
          .subscribe(e => this.onMessageDisplayWorker(e, display))
      );

      this.displayWorkers.push(workerInstance);

      if (canvas) {
        const offscreen = canvas.transferControlToOffscreen();
        const channel = new MessageChannel();
        const renderInitMessage: ActionCommandToDisplayWorker<InitDisplayPayload> =
          {
            type: WORKER_ACTION_TYPE.INIT,
            payload: {
              debug: this.options.debug,
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
          this.action(addPortMessage, [channel.port2]).then(() => resolve());
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

  async action<
    Action extends IAction =
      | MainWorkerIncomingAction
      | DisplayWorkerIncomingAction,
    Result extends IActionResult = ClientIncomingAction
  >(
    action: Action,
    transfer?: Transferable[],
    worker: Worker = this.mainWorker!
  ) {
    const id = crypto.randomUUID();
    const resolver = Promise.withResolvers<Result>();
    resolveMap.set(id, resolver.resolve);

    if (this.options.debug) {
      logger.withTag('action').withTag(action.type).start(action, worker);
    }

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
      return data as Result;
    });
  }

  async onMessageMainWorker(
    event: WorkerManagerIncomingPostMessage<
      DisplayWorkerIncomingAction | ClientIncomingAction
    >
  ) {
    const { id, data } = event;
    await actionsMain(this, this.app, data);
    resolveMap.get(id)?.(data);
  }

  async onMessageDisplayWorker(
    event: WorkerManagerIncomingPostMessage<ClientIncomingAction>,
    display: Display
  ) {
    const { id, data } = event;
    await actionsDisplay(this, this.app, display, data);
    resolveMap.get(id)?.(data);
  }
}

const resolveMap = new Map<string, CallableFunction>();
