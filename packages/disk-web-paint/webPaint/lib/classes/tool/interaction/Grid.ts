import { TOOLS } from '../../../../types/select';
import type { ToolSelect } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import InteractionTool from '../InteractionTool';

export default class Grid extends InteractionTool {
  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.GRID,
      options: {}
    });
  }

  override async click(e: MouseEvent, toolSelect: ToolSelect): Promise<void> {
    super.click(e, toolSelect);
    await this.actions.openGridSettings();
    // this.app.setDisplays(value!);
  }
}
