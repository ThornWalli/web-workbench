import { ipoint } from '@js-basics/vector';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

import basicDemos from './webBasic/basicDemos';

import webPaintingAction, {
  CONFIG_DEFAULTS as CONFIG_DEFAULTS_WEB_PAINT
} from './webPainting';
import webBasicAction, {
  CONFIG_DEFAULTS as CONFIG_DEFAULTS_WEB_BASIC
} from './webBasic';
import base64ConverterAction from './tools/base64Converter';

export default ({ core }) => {
  core.config.setDefaults(CONFIG_DEFAULTS_WEB_PAINT);
  core.config.setDefaults(CONFIG_DEFAULTS_WEB_BASIC);

  return {
    locked: true,
    meta: [
      [ITEM_META.SYMBOL, SYMBOL.DISK_WORKBENCH13],
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
            meta: [[ITEM_META.SYMBOL, SYMBOL.DEFAULT]],
            id: 'Base64Converter.app',
            name: 'Base64Converter',
            createdDate: new Date(2023, 8, 4).getTime(),
            editedDate: new Date(2023, 8, 4).getTime(),
            action: base64ConverterAction(core)
          }
        ]
      },
      {
        meta: [[ITEM_META.SYMBOL, SYMBOL.WEB_PAINTING]],
        id: 'WebPainting.app',
        name: 'WebPainting',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: webPaintingAction(core)
      },
      {
        meta: [
          [ITEM_META.SYMBOL, SYMBOL.WEB_BASIC],
          [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
        ],
        id: 'WebBasic.app',
        name: 'WebBasic',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: webBasicAction(core)
      },
      basicDemos
    ]
  };
};
