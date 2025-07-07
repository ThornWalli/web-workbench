import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL as SYMBOL_CORE } from '@web-workbench/core/utils/symbols';
import { getDefaultConfig } from './webPaint/utils';
import { SYMBOL } from './types';
import webPaint from './webPaint';

export default defineFloppyDisk(async ({ core }) => {
  const [readmeContent] = (await Promise.all([import('./README.md?raw')])).map(
    module => module.default || module
  );

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
      [ITEM_META.SYMBOL, SYMBOL_CORE.DISK_2],
      [ITEM_META.WINDOW_SYMBOL_REARRANGE, true],
      [ITEM_META.VISIBLE, true]
    ],
    name: 'Web Paint',
    items: [
      {
        id: 'Readme.md',
        name: 'Readme',
        data: {
          type: 'markdown',
          content: readmeContent,
          fontSize: 16
        },
        meta: [
          [ITEM_META.POSITION, { x: 90, y: 5 }],
          [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
          [ITEM_META.SYMBOL, SYMBOL_CORE.LARGE_NOTE_RICH]
        ]
      },
      ...(await webPaint({ core }))
    ]
  };
});
