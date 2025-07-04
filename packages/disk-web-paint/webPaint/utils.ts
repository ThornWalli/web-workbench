import { CONFIG_NAMES } from './types';

import demoImageLenna from './assets/lenna.jpg?url';
import demoImageDisk from './assets/disk.png?url';
import demoImageWebPaint from './assets/web_paint.png?url';
import demoImageCuby from './assets/cuby.png?url';
import demoImageTest from './assets/test.png?url';

export function getDefaultConfig() {
  return {
    [CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]: '#CCCCCCFF',
    [CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]: '#FFFFFFFF',
    [CONFIG_NAMES.WEB_PAINT_DISPLAY_GRID_COLOR]: '#00000033',
    [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE]: false,
    [CONFIG_NAMES.WEB_PAINT_NATIVE_THEME]: false,
    [CONFIG_NAMES.WEB_PAINT_DEBUG]: true
  };
}
export const DEMO_IMAGES = {
  LENNA: demoImageLenna,
  DISK: demoImageDisk,
  WEB_PAINTING: demoImageWebPaint,
  CUBY: demoImageCuby,
  TEST: demoImageTest
};
