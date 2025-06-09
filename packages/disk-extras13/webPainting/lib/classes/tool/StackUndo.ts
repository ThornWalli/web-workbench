import { TOOLS, type ToolSelect } from '../../../types/select';
import Tool, { type ToolConstructorOptions } from '../Tool';

export default class StackUndo extends Tool {
  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.STACK_UNDO,
      options: {}
    });
  }

  override onClick(e: MouseEvent, value: ToolSelect): void {
    super.onClick(e, value);
    this.app.actions.stackUndo();
  }
}
