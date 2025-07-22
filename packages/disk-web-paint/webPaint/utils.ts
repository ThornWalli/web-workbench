import { CONFIG_NAMES } from './types';

import demoImageLenna from './assets/example/lenna.jpg?url';
import demoImageDisk from './assets/example/disk.png?url';
import demoImageWebPaint from './assets/example/web_paint.png?url';
import demoImageCuby from './assets/example/cuby.png?url';
import demoImageCuby1080 from './assets/example/cuby_1080.png?url';
import demoImageTest from './assets/example/test.png?url';

export function getDefaultConfig() {
  return {
    [CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND]: '#FFFFFFFF',
    [CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]: '#CCCCCCFF',
    [CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]: '#FFFFFFFF',
    [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE]: true,
    [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_OFFSET]: 0.1,
    [CONFIG_NAMES.WEB_PAINT_NATIVE_THEME]: false,
    [CONFIG_NAMES.WEB_PAINT_DEBUG]: false,
    [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_COLOR]: '#00000033',
    [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_LINE_WIDTH]: 1,
    [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT]: 10
  };
}
export const DEMO_IMAGES = {
  LENNA: demoImageLenna,
  DISK: demoImageDisk,
  WEB_PAINTING: demoImageWebPaint,
  CUBY: demoImageCuby,
  TEST: demoImageTest,
  CUBY_1080: demoImageCuby1080
};
