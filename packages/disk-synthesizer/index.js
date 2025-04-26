import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default async ({ core }) => {
  const {
    default: synthesizerAction,
    CONFIG_DEFAULTS: CONFIG_DEFAULTS_SYNTHESIZER
  } = await import('./synthesizer.js');

  const [readmeContent] = (await Promise.all([import('./README.md?raw')])).map(
    module => module.default || module
  );

  core.config.setDefaults(CONFIG_DEFAULTS_SYNTHESIZER);

  return {
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_2],
      // [ITEM_META.WINDOW_SYMBOL_REARRANGE, true],
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
      {
        id: 'Synthesizer.app',
        name: 'Synthesizer',
        meta: [
          [ITEM_META.SYMBOL, SYMBOL.SYNTHESIZER],
          [ITEM_META.POSITION, { x: 10, y: 5 }],
          [ITEM_META.IGNORE_SYMBOL_REARRANGE, true]
        ],
        createdDate: new Date(2023, 8, 4).getTime(),
        editedDate: new Date(2023, 8, 4).getTime(),
        action: synthesizerAction(core)
      }
    ]
  };
};
