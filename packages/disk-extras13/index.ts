import { ipoint } from '@js-basics/vector';

import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';

import webPaint from './webPaint';
import { getDefaultConfig as getDefaultWebPaintConfig } from './webPaint/utils';
import webBasic from './webBasic';
import { getDefaultConfig as getDefaultWebBasicConfig } from './webBasic/utils';

import basicDemos from './webBasic/basicDemos';
import guestBook from './guestBook';
import tools from './tools';
import { SYMBOL } from './types';
import './style.pcss';

export default defineFloppyDisk(async ({ core }) => {
  core.config.setDefaults(getDefaultWebPaintConfig());
  core.config.setDefaults(getDefaultWebBasicConfig());

  core.modules.symbols?.addSymbols([
    {
      key: SYMBOL.DISK_EXTRAS13,
      component: await import(
        './assets/symbols/disk_extras13.svg?component'
      ).then(module => module.default),
      group: 'disk_extras13'
    },
    {
      key: SYMBOL.WEB_BASIC,
      component: await import('./assets/symbols/web_basic.svg?component').then(
        module => module.default
      ),
      group: 'disk_extras13'
    },
    {
      key: SYMBOL.WEB_PAINTING,
      component: await import('./assets/symbols/web_paint.svg?component').then(
        module => module.default
      ),
      group: 'disk_extras13'
    },
    {
      key: SYMBOL.GUEST_BOOK,
      component: await import('./assets/symbols/guest_book.svg?component').then(
        module => module.default
      ),
      group: 'disk_extras13'
    }
  ]);

  return {
    locked: true,
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_EXTRAS13],
      [ITEM_META.WINDOW_SIZE, ipoint(320, 220)],
      [ITEM_META.WINDOW_POSITION, ipoint(310, 10)],
      [ITEM_META.WINDOW_SYMBOL_REARRANGE, true]
    ],
    name: 'Extras 1.3',
    items: [
      ...(await tools({ core })),
      ...(await webPaint({ core })),
      ...(await webBasic({ core })),
      ...(await basicDemos({ core })),
      ...(await guestBook({ core }))
    ]
  };
});
