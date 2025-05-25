import { ipoint } from '@js-basics/vector';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import base64Converter from './base64Converter';

export default defineFileItems(async ({ core }) => {
  return [
    {
      id: 'Tools',
      name: 'Tools',
      meta: [
        [ITEM_META.WINDOW_SIZE, ipoint(160, 120)],
        [ITEM_META.WINDOW_SYMBOL_REARRANGE, true]
      ],
      createdDate: new Date(2024, 8, 9).getTime(),
      editedDate: new Date(2024, 8, 9).getTime(),
      items: [...(await base64Converter({ core }))]
    }
  ];
});
