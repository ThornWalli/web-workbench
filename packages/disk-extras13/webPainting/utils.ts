import { CONFIG_NAMES } from './types';

import demoImageLenna from './assets/lenna.jpg?url';
import demoImageDisk from './assets/disk.jpg?url';
import demoImageWebPainting from './assets/web_painting.png?url';
import demoImageCuby from './assets/cuby.png?url';

export function getDefaultConfig() {
  return {
    [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: '#CCCCCC',
    [CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND]: '#FFFFFF'
  };
}
export const DEMO_IMAGES = {
  LENNA: demoImageLenna,
  DISK: demoImageDisk,
  WEB_PAINTING: demoImageWebPainting,
  CUBY: demoImageCuby
};
