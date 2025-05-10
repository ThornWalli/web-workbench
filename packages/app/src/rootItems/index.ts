import {
  ITEM_META,
  type ItemMeta,
  type ItemRawDefinition
} from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import { FONT_TYPES } from '@web-workbench/disk-workbench13/documentEditor/types';
import {
  DEFAULT_FONT_SIZE,
  FONT_FAMILES
} from '@web-workbench/disk-workbench13/documentEditor/utils';

export default defineFileItems(async () => {
  const [changelogContent, imprintContent, disclaimerContent] = (
    await Promise.all([
      import('../../../../CHANGELOG.md?raw'),
      import('./imprint.md?raw'),
      import('./disclaimer.md?raw')
    ])
  ).map(module => module.default || module);

  const files: {
    id: string;
    name: string;
    data?: object;
    meta?: ItemMeta;
    items?: ItemRawDefinition[];
  }[] = [
    {
      id: 'Cuby_Generator.link',
      name: 'Cuby Generator',
      meta: [
        [ITEM_META.POSITION, { x: 236, y: 394 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://cuby.lammpee.de'],
        [ITEM_META.SYMBOL, SYMBOL.CUBY]
      ]
    },
    {
      id: 'Nuxt_Booster.link',
      name: 'Nuxt Booster',
      meta: [
        [ITEM_META.POSITION, { x: 357, y: 378 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://basics.github.io/nuxt-booster/'],
        [ITEM_META.SYMBOL, SYMBOL.NUXT_BOOSTER]
      ]
    },
    {
      id: 'Vue_Semantic_Structure.link',
      name: 'Vue Semantic Structure',
      meta: [
        [ITEM_META.POSITION, { x: 222, y: 275 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://basics.github.io/vue-semantic-structure/'],
        [ITEM_META.SYMBOL, SYMBOL.VUE_SEMANTIC_STRUCTURE]
      ]
    },
    {
      id: 'Github.link',
      name: 'Github',
      meta: [
        [ITEM_META.POSITION, { x: 159, y: 386 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://github.com/ThornWalli/web-workbench/'],
        [ITEM_META.SYMBOL, SYMBOL.GITHUB]
      ]
    }
  ];

  files.push({
    id: 'Imprint.md',
    name: 'Imprint',
    data: createMdContent({
      content: String(imprintContent),
      fontFamily: FONT_FAMILES[FONT_TYPES.Monospace]['Lucida Console'],
      fontSize: 14
    }),
    meta: [
      [ITEM_META.POSITION, { x: 0, y: 390 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]
    ]
  });
  files.push({
    id: 'Disclaimer.md',
    name: 'Disclaimer',
    data: createMdContent({
      content: String(disclaimerContent),
      fontFamily: FONT_FAMILES[FONT_TYPES.Monospace]['Lucida Console'],
      fontSize: 14
    }),
    meta: [
      [ITEM_META.POSITION, { x: 80, y: 390 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]
    ]
  });
  files.push({
    id: 'Changelog.md',
    name: 'Changelog',
    data: createMdContent({
      content: String(changelogContent),
      fontFamily: FONT_FAMILES[FONT_TYPES.Monospace]['Lucida Console'],
      fontSize: 14
    }),
    meta: [
      [ITEM_META.POSITION, { x: 0, y: 305 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH]
    ]
  });
  files.push({
    id: 'Press',
    name: 'Press',
    meta: [
      [ITEM_META.WINDOW_SIDEBAR, false],
      [ITEM_META.WINDOW_SCALE, false],
      [ITEM_META.WINDOW_SCROLL_X, false],
      [ITEM_META.WINDOW_SCROLL_Y, false],
      [ITEM_META.POSITION, { x: 80, y: 320 }],
      [ITEM_META.WINDOW_SIZE, { x: 120, y: 120 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true]
    ],
    items: [
      {
        id: 'Amiga-News.link',
        name: 'Amiga-News.de',
        meta: [
          [
            ITEM_META.WEB_URL,
            'https://www.amiga-news.de/de/news/AN-2022-07-00094-DE.html'
          ],
          [ITEM_META.SYMBOL, SYMBOL.LARGE_NOTE_RICH],
          [ITEM_META.POSITION, { x: 10, y: 10 }]
        ]
      }
    ]
  });
  return files;
});

function createMdContent({
  content,
  fontFamily,
  fontSize
}: {
  content: string;
  fontFamily?: string;
  fontSize?: number;
}) {
  return {
    openMaximized: true,
    type: 'markdown',
    content,
    fontFamily: fontFamily || FONT_FAMILES[FONT_TYPES.SansSerif].Arial,
    fontSize: fontSize || DEFAULT_FONT_SIZE
  };
}
