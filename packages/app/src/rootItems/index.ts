import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import type {
  ItemMeta,
  ItemRawDefinition
} from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { SYMBOL as SYMBOL_CORE } from '@web-workbench/core/utils/symbols';
import { SYMBOL as SYMBOL_EXTRAS13 } from '@web-workbench/disk-extras13/types';
import { SYMBOL as SYMBOL_SYNTHESIZER } from '@web-workbench/disk-synthesizer/types';
import { SYMBOL as SYMBOL_MOON_CITY } from '@web-workbench/disk-moon-city/types';
import { SYMBOL as SYMBOL_WEB_PAINT } from '@web-workbench/disk-web-paint/types';

import { FONT_TYPES } from '@web-workbench/disk-workbench13/documentEditor/types';
import {
  DEFAULT_FONT_SIZE,
  FONT_FAMILES,
  FONT_FAMILY
} from '@web-workbench/disk-workbench13/documentEditor/utils';
import { SYMBOL } from '~/workbench.config';

export default defineFileItems(async () => {
  const [changelogContent, imprintContent, disclaimerContent] = (
    await Promise.all([
      import('../../../../CHANGELOG.md?raw'),
      import('./imprint.md?raw'),
      import('./disclaimer.md?raw')
    ])
  ).map(module => module.default || module);

  const offset = { x: 0, y: 437 };

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
        [ITEM_META.POSITION, { x: offset.x + 235, y: offset.y }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://cuby.lammpee.de'],
        [ITEM_META.SYMBOL, SYMBOL.CUBY]
      ]
    },
    {
      id: 'Nuxt_Booster.link',
      name: 'Nuxt Booster',
      meta: [
        [ITEM_META.POSITION, { x: offset.x + 355, y: offset.y - 16 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://basics.github.io/nuxt-booster/'],
        [ITEM_META.SYMBOL, SYMBOL.NUXT_BOOSTER]
      ]
    },
    {
      id: 'Vue_Semantic_Structure.link',
      name: 'Vue Semantic Structure',
      meta: [
        [ITEM_META.POSITION, { x: offset.x + 215, y: offset.y - 110 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://basics.github.io/vue-semantic-structure/'],
        [ITEM_META.SYMBOL, SYMBOL.VUE_SEMANTIC_STRUCTURE]
      ]
    },
    {
      id: 'Github.link',
      name: 'Github',
      meta: [
        [ITEM_META.POSITION, { x: offset.x + 159, y: offset.y - 8 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.WEB_URL, 'https://github.com/ThornWalli/web-workbench/'],
        [ITEM_META.SYMBOL, SYMBOL.GITHUB]
      ]
    },
    {
      id: 'GuestBook.ref',
      name: 'Guestbook',
      meta: [
        [ITEM_META.REFERENCE, 'DF1:GuestBook.app'],
        [ITEM_META.POSITION, { x: offset.x + 340, y: offset.y - 101 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.SYMBOL, SYMBOL_EXTRAS13.GUEST_BOOK]
      ]
    },
    {
      id: 'WebPaint.ref',
      name: 'Web Paint',
      meta: [
        [ITEM_META.REFERENCE, 'DF2:WebPaint.app'],
        [ITEM_META.POSITION, { x: offset.x + 155, y: offset.y - 162 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.SYMBOL, SYMBOL_WEB_PAINT.WEB_PAINT]
      ]
    },
    {
      id: 'Boing.ref',
      name: 'Boing!',
      meta: [
        [ITEM_META.REFERENCE, 'DF1:Boing.app'],
        [ITEM_META.POSITION, { x: offset.x + 80, y: offset.y - 170 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.SYMBOL, SYMBOL_EXTRAS13.BOING]
      ]
    },
    {
      id: 'Synthesizer.ref',
      name: 'Synthesizer',
      meta: [
        [ITEM_META.REFERENCE, 'DF3:Synthesizer.app'],
        [ITEM_META.POSITION, { x: offset.x + 250, y: offset.y - 195 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.SYMBOL, SYMBOL_SYNTHESIZER.SYNTHESIZER]
      ]
    },
    {
      id: 'MoonCity.ref',
      name: 'Moon City',
      meta: [
        [ITEM_META.REFERENCE, 'DF4:Mooncity.app'],
        [ITEM_META.POSITION, { x: offset.x + 340, y: offset.y - 195 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.SYMBOL, SYMBOL_MOON_CITY.MOON_CITY]
      ]
    },
    {
      id: 'Press.ref',
      name: 'Press',
      meta: [
        [ITEM_META.REFERENCE, 'CDLAMMPEE:Press'],
        [ITEM_META.POSITION, { x: offset.x + 80, y: offset.y - 75 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.SYMBOL, SYMBOL_CORE.DIRECTORY]
      ]
    },
    {
      id: 'Links.ref',
      name: 'Links',
      meta: [
        [ITEM_META.REFERENCE, 'CDLAMMPEE:Links'],
        [ITEM_META.POSITION, { x: 157, y: offset.y - 75 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
        [ITEM_META.SYMBOL, SYMBOL_CORE.DIRECTORY]
      ]
    }
  ];

  files.push({
    id: 'Imprint.md',
    name: 'Imprint',
    data: createMdContent({
      content: String(imprintContent),
      fontFamily: FONT_FAMILES[FONT_TYPES.Monospace][FONT_FAMILY.MONOSPACE],
      fontSize: 14
    }),
    meta: [
      [ITEM_META.POSITION, { x: offset.x, y: offset.y - 5 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.SYMBOL, SYMBOL_CORE.LARGE_NOTE_RICH]
    ]
  });
  files.push({
    id: 'Disclaimer.md',
    name: 'Disclaimer',
    data: createMdContent({
      content: String(disclaimerContent),
      fontFamily: FONT_FAMILES[FONT_TYPES.Monospace][FONT_FAMILY.MONOSPACE],
      fontSize: 14
    }),
    meta: [
      [ITEM_META.POSITION, { x: offset.x + 80, y: offset.y - 5 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.SYMBOL, SYMBOL_CORE.LARGE_NOTE_RICH]
    ]
  });
  files.push({
    id: 'Changelog.md',
    name: 'Changelog',
    data: createMdContent({
      content: String(changelogContent),
      fontFamily: FONT_FAMILES[FONT_TYPES.Monospace][FONT_FAMILY.MONOSPACE],
      fontSize: 14
    }),
    meta: [
      [ITEM_META.POSITION, { x: offset.x, y: offset.y - 90 }],
      [ITEM_META.IGNORE_SYMBOL_REARRANGE, true],
      [ITEM_META.SYMBOL, SYMBOL_CORE.LARGE_NOTE_RICH]
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
