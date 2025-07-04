import { TOOLS } from '../../../../types/select';
import type { ToolSelect } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import InteractionTool from '../InteractionTool';

export default class StackRedo extends InteractionTool {
  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.STACK_REDO,
      options: {}
    });
  }

  override click(e: MouseEvent, value: ToolSelect): void {
    super.click(e, value);
    this.app.actions.stackRedo();
  }
}
