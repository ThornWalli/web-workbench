import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';

import moonCity from './moon-city';

export default defineFloppyDisk(async ({ core }) => {
  const readmeContent = await import('./README.md?raw').then(
    module => module.default
  );

  console.log({ readmeContent });

  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_2],
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
          [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]
        ]
      },
      ...(await moonCity({ core }))
    ]
  };
});
