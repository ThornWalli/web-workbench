import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL as CORE_SYMBOL } from '@web-workbench/core/utils/symbols';
import { getDefaultConfig } from './webPaint/utils';
import { SYMBOL } from './types';
import webPaint from './webPaint';

export default defineFloppyDisk(async ({ core }) => {
  core.config.setDefaults(getDefaultConfig());

  core.modules.symbols?.addSymbols([
    {
      key: SYMBOL.WEB_PAINT,
      component: await import('./assets/symbols/web_paint.svg?component').then(
        module => module.default
      ),
      group: 'disk_web_paint'
    }
  ]);

  return {
    meta: [
      [ITEM_META.SYMBOL, CORE_SYMBOL.DISK_2],
      [ITEM_META.WINDOW_SYMBOL_REARRANGE, true],
      [ITEM_META.VISIBLE, true]
    ],
    name: 'Web Paint',
    items: [...(await webPaint({ core }))]
  };
});
