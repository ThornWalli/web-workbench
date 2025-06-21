import Tool, {
  type ToolConstructorOptions,
  type ToolPointerEvent,
  type ToolUseOptions
} from '../Tool';

export default class Brush<
  TOptions extends ToolUseOptions = ToolUseOptions
> extends Tool<TOptions> {
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
    this.action(e);
  }

  override async pointerDown(e: ToolPointerEvent): Promise<void> {
    await super.pointerDown(e);
    await this.startStack();
    this.action(e);
  }
  override async pointerUp(e: ToolPointerEvent): Promise<void> {
    await super.pointerUp(e);
    await this.stopStack();
  }
}
