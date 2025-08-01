import type { IPoint } from '@js-basics/vector';
import type { ToolConstructorOptions } from '../../Tool';
import { TOOL } from '../../../../types/select';
import type { PlacementOptions } from '../PlacementTool';
import PlacementTool from '../PlacementTool';
import type ToolPointerEvent from '../../ToolPointerEvent';
import { copyImageToClipboard } from '../../../utils/clipboard';
import { getImageDataFromView } from '../../../utils/image';
import type {
  ActionSuccess,
  WORKER_ACTION_TYPE
} from '../../../../types/worker';
import type { UseToolSuccessPayload } from '../../../../types/worker.payload';

export enum CROP_STATE {
  ABORT = 'ABORT',
  START = 'START',
  MOVE = 'MOVE',
  RESIZE = 'RESIZE',
  STOP = 'STOP',
  // ########
  COPY = 'COPY',
  CUT = 'CUT'
}

enum BUTTON {
  APPLY = 'apply',
  ABORT = 'abort',
  COPY = 'copy',
  CUT = 'cut'
}

export interface CropOptions extends PlacementOptions<CROP_STATE> {
  state?: CROP_STATE;
  position: IPoint & number;
  dimension: IPoint & number;
  cut?: boolean;
}

export default class Crop<
  TOptions extends CropOptions = CropOptions
> extends PlacementTool<CROP_STATE, TOptions, BUTTON> {
  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      type: TOOL.CROP,
      resizeableAfterMove: false,
      options: {
        ...options.options
      }
    });
  }

  override pointerDown(e: ToolPointerEvent): Promise<void> {
    this.options.cut = this.domEvents.shiftActive;
    return super.pointerDown(e);
  }

  override async pointerMove(e: ToolPointerEvent): Promise<void> {
    await super.pointerMove(e);
    if (!this.isResize) {
      this.resizeable = false;
    }
  }

  async onClickCopy(e) {
    const result = await this.action<
      ActionSuccess<UseToolSuccessPayload, WORKER_ACTION_TYPE.USE_TOOL_SUCCESS>
    >(
      {
        state: CROP_STATE.COPY,
        stackable: false,
        position: e.normalizePosition(this.bounds.position),
        dimension: e.normalizeDimension(this.bounds.dimension)
      } as TOptions,
      { event: e }
    );
    await copyImageToClipboard(
      await getImageDataFromView(result.payload.view, result.payload.dimension)
    );
    this.cancel(e);
  }

  async onClickCut(e) {
    const result = await this.action<
      ActionSuccess<UseToolSuccessPayload, WORKER_ACTION_TYPE.USE_TOOL_SUCCESS>
    >(
      {
        state: CROP_STATE.CUT,
        stackable: false,
        position: e.normalizePosition(this.bounds.position),
        dimension: e.normalizeDimension(this.bounds.dimension)
      } as TOptions,
      { event: e }
    );
    await this.app.actions.stopStack();
    await copyImageToClipboard(
      await getImageDataFromView(result.payload.view, result.payload.dimension)
    );
    this.cancel(e);
  }

  override cancel(e: ToolPointerEvent): void {
    this.reset(e);
  }
}
