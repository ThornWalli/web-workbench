import type { IPoint } from '@js-basics/vector';
import type { ToolConstructorOptions } from '../../Tool';
import { TOOL } from '../../../../types/select';
import type { PLACEMENT_STATE, PlacementOptions } from '../PlacementTool';
import PlacementTool from '../PlacementTool';

export interface RectangleOptions extends PlacementOptions {
  state?: PLACEMENT_STATE;
  position: IPoint & number;
  dimension: IPoint & number;
}

export default class Rectangle<
  TOptions extends RectangleOptions = RectangleOptions
> extends PlacementTool<PLACEMENT_STATE, TOptions> {
  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      type: TOOL.RECTANGLE,
      resizeableAfterMove: true,
      options: {
        ...options.options
      }
    });
  }
}
