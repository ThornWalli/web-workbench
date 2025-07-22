import Interaction from './Interaction';
import type { InteractionMenuItemOption } from './Interaction';

export interface UploadMenuItemOption extends InteractionMenuItemOption {
  accept?: string | string[];
  multiple?: boolean;
}

export default class Upload extends Interaction {
  accept?: string | string[];
  multiple?: boolean;
  constructor({ accept, multiple, ...options }: UploadMenuItemOption) {
    super({
      ...options
    });
    this.accept = accept;
    this.multiple = multiple ?? false;
  }
}
