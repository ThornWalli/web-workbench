import InteractionTool from '../InteractionTool';
import type { InteractionOptions } from '../InteractionTool';

export default class None<
  TOptions extends InteractionOptions = InteractionOptions
> extends InteractionTool<TOptions> {}
