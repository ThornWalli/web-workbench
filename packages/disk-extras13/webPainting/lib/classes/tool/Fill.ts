import { TOOLS } from '../../../types/select';
import type {
  ToolConstructorOptions,
  ToolPointerEvent,
  ToolUseOptions
} from '../Tool';
import Tool from '../Tool';

export type FillOptions = ToolUseOptions;
export default class Fill<
  TOptions extends FillOptions = FillOptions
> extends Tool<TOptions> {
  constructor(options: Omit<ToolConstructorOptions<TOptions>, 'type'>) {
    super({
      ...options,
      type: TOOLS.FILL_TOOL,
      options: {
        ...options.options,
        stackable: true
      }
    });
  }

  override async pointerDown(e: ToolPointerEvent) {
    await super.pointerDown(e);
    await this.startStack();
    await this.action(e, {} as TOptions);
    await this.stopStack();
  }
}
