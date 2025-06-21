import Interaction, { type InteractionMenuItemOption } from './Interaction';

export interface UploadMenuItemOption extends InteractionMenuItemOption {
  accept?: string | string[];
}

export default class Upload extends Interaction {
  accept?: string | string[];
  constructor({ accept, ...options }: UploadMenuItemOption) {
    super({
      ...options
    });
    this.accept = accept;
  }
}
