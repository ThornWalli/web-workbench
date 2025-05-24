import type Core from '../classes/Core';
import type Window from '../classes/Window';

export interface WindowMenuItems {
  core: Core;
  mainWindow: Window;
  parentWindow?: Window;
  preserveContextMenu: (value?: boolean) => void;
}
