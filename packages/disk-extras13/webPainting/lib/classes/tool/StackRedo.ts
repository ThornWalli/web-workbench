import { TOOLS, type ToolSelect } from '../../../types/select';
import Tool, { type ToolConstructorOptions } from '../Tool';

export default class StackRedo extends Tool {
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
