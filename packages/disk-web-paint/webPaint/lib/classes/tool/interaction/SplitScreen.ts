import { TOOLS, type ToolSelect } from '../../../../types/select';
import type { ToolConstructorOptions } from '../../Tool';
import InteractionTool from '../InteractionTool';

export default class SplitScreen extends InteractionTool {
  constructor(options: Omit<ToolConstructorOptions, 'type' | 'options'>) {
    super({
      ...options,
      type: TOOLS.SPLIT_SCREEN,
      options: {}
    });
  }

  override async click(e: MouseEvent, toolSelect: ToolSelect): Promise<void> {
    super.click(e, toolSelect);
    const { value } = await this.actions.prompt<number>({
      type: 'number',
      text: 'Screen Count? (1-4)',
      value: 1,
      min: 1,
      max: 4,
      size: 1,
      step: 1,
      required: true
    });
    this.app.setDisplays(value!);
  }
}
