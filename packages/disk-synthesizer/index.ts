import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFloppyDisk } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL as SYMBOL_CORE } from '@web-workbench/core/utils/symbols';
import synthesizer from './synthesizer';
import { getDefaultConfig } from './utils';
import { SYMBOL } from './types';
import './style.pcss';

export default defineFloppyDisk(async ({ core }) => {
  const [readmeContent] = (await Promise.all([import('./README.md?raw')])).map(
    module => module.default || module
  );

  core.modules.symbols?.addSymbols([
    {
      key: SYMBOL.SYNTHESIZER,
      component:
        await import('./assets/symbols/synthesizer.svg?component').then(
          module => module.default
        ),
      group: 'disk_synthesizer'
    }
  ]);

  core.config.setDefaults(getDefaultConfig());

  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL_CORE.DISK_2],
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
          [ITEM_META.SYMBOL, SYMBOL_CORE.LARGE_NOTE_RICH]
        ]
      },
      ...(await synthesizer({ core }))
    ]
  };
});
