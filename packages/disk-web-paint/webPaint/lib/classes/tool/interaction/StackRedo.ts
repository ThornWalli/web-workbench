import { TOOL } from '../../../../types/select';
import type { ToolSelect } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';

export default class StackRedo extends InteractionTool {
  constructor(
    options: Omit<ToolConstructorOptions<InteractionOptions>, 'type'>
  ) {
    super({
      ...options,
      type: TOOL.STACK_REDO
    });
  }

  override click(e: MouseEvent, value: ToolSelect): void {
    super.click(e, value);
    this.app.actions.stackRedo();
  }
}
