/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IPoint } from '@js-basics/vector';
import type { DomEvents } from '@web-workbench/core/services/domEvents';
import type { App } from '../App';
import type { TOOLS } from '../../types/select';
import type { ModelActions } from '../../types';

export interface ToolEvent {
  /**
   * Display dimension in pixels.
   */
  dimension: IPoint & number;
  ctx: CanvasRenderingContext2D;
}
export interface ToolPointerEvent extends ToolEvent {
  /**
   * Display zoom level.
   */
  zoomLevel: number;
  /**
   * Position in pixels relative to the display.
   */
  position: IPoint & number;
  /**
   * Normalized position in the display. 0.1 is 10% of the display width/height.
   */
  normalizedPosition: IPoint & number;
  normalizePosition: (point: IPoint & number) => IPoint & number;
  unnormalizePosition: (point: IPoint & number) => IPoint & number;

  normalizeDimension: (point: IPoint & number) => IPoint & number;
  unnormalizeDimension: (point: IPoint & number) => IPoint & number;

  positionToRealPosition: (point: IPoint & number) => IPoint & number;
  realPositionToPosition: (point: IPoint & number) => IPoint & number;
  fixedPosition: (point: IPoint & number) => IPoint & number;
  fixedDimension: (point: IPoint & number) => IPoint & number;
  fixedRealPosition: (point: IPoint & number) => IPoint & number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ActionContext {}

export interface ToolConstructorOptions<
  TOptions extends ToolUseOptions = ToolUseOptions
> {
  type: TOOLS;
  app: App;
  actions: ModelActions;
  options: TOptions;
  domEvents?: DomEvents;
}

export type ToolUseOptions = {
  stackable?: boolean;
  passive?: boolean;
  abstract?: boolean;
};

export default class Tool<
  TOptions extends ToolUseOptions = ToolUseOptions,
  TActionOptions extends ActionContext = ActionContext
> {
  type: TOOLS;
  app: App;
  actions: ModelActions;
  options: TOptions;
  domEvents?: DomEvents;

  constructor({
    type,
    app,
    actions,
    domEvents,
    options
  }: ToolConstructorOptions<TOptions>) {
    this.type = type;
    this.app = app;
    this.actions = actions;
    this.options = options || ({} as TOptions);
    this.domEvents = domEvents;
  }

  destroy() {
    // Clean up any resources or listeners
  }

  getDisplay() {
    return this.app.currentDisplay!;
  }

  action(options: Partial<TOptions> = {}, context: TActionOptions) {
    // Method to be implemented by subclasses
    // This method should be overridden in subclasses to perform specific actions
  }
}
