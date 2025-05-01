import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils.js';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import synthesizer from './synthesizer';
import { getDefaultConfig } from './utils';

export default defineFloppyDisk(async ({ core }) => {
  const [readmeContent] = (await Promise.all([import('./README.md?raw')])).map(
    module => module.default || module
  );

  core.config.setDefaults(getDefaultConfig());

  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_2],
      [ITEM_META.VISIBLE, true]
    ],
    name: 'Synthesizer',
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
          [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]
        ]
      },
      ...(await synthesizer({ core }))
    ]
  };
});
