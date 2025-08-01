/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IPoint } from '@js-basics/vector';
import type { DomEvents } from '@web-workbench/core/services/domEvents';
import type { App } from '../App';
import type { TOOL } from '../../types/select';
import type { ModelActions } from '../../types';

export interface ToolEvent {
  /**
   * Display dimension in pixels.
   */
  dimension: IPoint & number;
  ctx?: CanvasRenderingContext2D;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ActionContext {}

export interface ToolConstructorOptions<
  TOptions extends ToolUseOptions = ToolUseOptions
> {
  type: TOOL;
  app: App;
  actions: ModelActions;
  options: Partial<TOptions>;
  domEvents?: DomEvents;
  resizeableAfterMove?: boolean;
}

export type ToolUseOptions = {
  stackable?: boolean;
  passive?: boolean;
  abstract?: boolean;
  drawing?: boolean;
};

export default class Tool<
  TOptions extends ToolUseOptions = ToolUseOptions,
  TActionOptions extends ActionContext = ActionContext
> {
  type: TOOL;
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
    this.options = (options || {}) as TOptions;
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
