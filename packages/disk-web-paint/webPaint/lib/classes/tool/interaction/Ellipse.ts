import type { IPoint } from '@js-basics/vector';
import type { ToolConstructorOptions } from '../../Tool';
import { TOOL } from '../../../../types/select';
import type { PLACEMENT_STATE, PlacementOptions } from '../PlacementTool';
import PlacementTool from '../PlacementTool';

export interface EllipseOptions extends PlacementOptions {
  state?: PLACEMENT_STATE;
  position: IPoint & number;
  dimension: IPoint & number;
  square?: boolean;
}

export default class Ellipse<
  TOptions extends EllipseOptions = EllipseOptions
> extends PlacementTool<PLACEMENT_STATE, TOptions> {
  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      type: TOOL.ELLIPSE,
      options: {
        ...options.options
      }
    });
  }
}
