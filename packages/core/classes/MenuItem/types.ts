import type {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemSpacer,
  MenuItemText,
  MenuItemUpload
} from './index';
import type { InteractionMenuItemOption } from './Interaction';
import type { TextMenuItemOption } from './Text';

export type MenuItems =
  | MenuItemInteraction
  | MenuItemText
  | MenuItemUpload
  | MenuItemSeparator
  | MenuItemSpacer;
export type MenuItemOptions = InteractionMenuItemOption | TextMenuItemOption;
