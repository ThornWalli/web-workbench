import { ipoint } from '@js-basics/vector';
import { SYMBOL as SYMBOL_CORE } from '@web-workbench/core/utils/symbols';

import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';

import webPainting from './webPainting';
import { getDefaultConfig as getDefaultWebPaintConfig } from './webPainting/utils';
import webBasic from './webBasic';
import { getDefaultConfig as getDefaultWebBasicConfig } from './webBasic/utils';

import base64ConverterAction from './tools/base64Converter';
import basicDemos from './webBasic/basicDemos';
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
      component: await import(
        './assets/symbols/web_painting.svg?component'
      ).then(module => module.default),
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
      {
        id: 'Tools',
        name: 'Tools',
        meta: [
          [ITEM_META.WINDOW_SIZE, ipoint(160, 120)],
          [ITEM_META.WINDOW_SYMBOL_REARRANGE, true]
        ],
        createdDate: new Date(2024, 8, 9).getTime(),
        editedDate: new Date(2024, 8, 9).getTime(),
        items: [
          {
            meta: [[ITEM_META.SYMBOL, SYMBOL_CORE.DEFAULT]],
            id: 'Base64Converter.app',
            name: 'Base64Converter',
            createdDate: new Date(2023, 8, 4).getTime(),
            editedDate: new Date(2023, 8, 4).getTime(),
            action: base64ConverterAction(core)
          }
        ]
      },
      ...(await webPainting({ core })),
      ...(await webBasic({ core })),
      ...(await basicDemos({ core }))
    ]
  };
});
