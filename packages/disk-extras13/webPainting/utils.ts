import { CONFIG_NAMES } from './types';

import demoImageLenna from './assets/lenna.jpg?url';
import demoImageDisk from './assets/disk.jpg?url';

export function getDefaultConfig() {
  return {
    [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: '#CCCCCC',
    [CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND]: '#FFFFFF'
  };
}
export const DEMO_IMAGES = {
  LENNA: demoImageLenna,
  DISK: demoImageDisk
};
