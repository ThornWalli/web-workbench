import type { ToolUseOptions } from '../../Tool';
import InteractionTool from '../InteractionTool';

export default class None<
  TOptions extends ToolUseOptions = ToolUseOptions
> extends InteractionTool<TOptions> {}
