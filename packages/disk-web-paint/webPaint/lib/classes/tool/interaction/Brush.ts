import type {
  ToolConstructorOptions,
  ToolPointerEvent,
  ToolUseOptions
} from '../../Tool';
import InteractionTool from '../InteractionTool';

export default class Brush<
  TOptions extends ToolUseOptions = ToolUseOptions
> extends InteractionTool<TOptions> {
  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      options: {
        ...options.options,
        stackable: true
      }
    });
  }

  override pointerMove(e: ToolPointerEvent): void {
    super.pointerMove(e);
    this.action({}, { event: e });
  }

  override async pointerDown(e: ToolPointerEvent): Promise<void> {
    await super.pointerDown(e);
    await this.app.actions.startStack();
    this.action({}, { event: e });
  }
  override async pointerUp(e: ToolPointerEvent): Promise<void> {
    await super.pointerUp(e);
    await this.app.actions.stopStack();
  }
}
