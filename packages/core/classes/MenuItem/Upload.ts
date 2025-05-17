import Interaction, { type InteractionMenuItemOption } from './Interaction';

export interface UploadMenuItemOption extends InteractionMenuItemOption {
  accept?: string;
}

export default class Upload extends Interaction {
  accept?: string;
  constructor({ accept, ...options }: UploadMenuItemOption) {
    super({
      ...options
    });
    this.accept = accept;
  }
}
