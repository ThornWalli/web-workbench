import { TOOL } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import type ToolPointerEvent from '../../ToolPointerEvent';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';

export type FillOptions = InteractionOptions;
export default class Fill<
  TOptions extends FillOptions = FillOptions
> extends InteractionTool<TOptions> {
  constructor(options: Omit<ToolConstructorOptions<TOptions>, 'type'>) {
    super({
      ...options,
      type: TOOL.FILL_TOOL,
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
