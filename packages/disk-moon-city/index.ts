import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { SYMBOL as SYMBOL_CORE } from '@web-workbench/core/utils/symbols';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';
import moonCity from './moon-city';
import { SYMBOL } from './types';

export default defineFloppyDisk(async ({ core }) => {
  const readmeContent = await import('./README.md?raw').then(
    module => module.default
  );

  core.modules.symbols?.addSymbols([
    {
      key: SYMBOL.MOON_CITY,
      component: await import('./assets/symbols/moon_city.svg?component').then(
        module => module.default
      ),
      group: 'disk_moon_city'
    }
  ]);

  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL_CORE.DISK_2],
      [ITEM_META.VISIBLE, true]
    ],
    name: 'Moon City',
    items: [
      {
        id: 'Readme.md',
        name: 'Readme',
        data: {
          type: 'markdown',
          content: readmeContent,
          position: { x: 50, y: 0 },
          fontSize: 16
        },
        meta: [
          [ITEM_META.POSITION, { x: 70, y: 5 }],
          [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
          [ITEM_META.SYMBOL, SYMBOL_CORE.LARGE_NOTE_RICH]
        ]
      },
      ...(await moonCity({ core }))
    ]
  };
});
