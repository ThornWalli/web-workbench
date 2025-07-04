import { TOOLS } from '../../../../types/select';
import type {
  ToolConstructorOptions,
  ToolPointerEvent,
  ToolUseOptions
} from '../../Tool';
import InteractionTool from '../InteractionTool';

export type FillOptions = ToolUseOptions;
export default class Fill<
  TOptions extends FillOptions = FillOptions
> extends InteractionTool<TOptions> {
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
    await this.app.actions.startStack();
    await this.action({} as TOptions, { event: e });
    await this.app.actions.stopStack();
  }
}
