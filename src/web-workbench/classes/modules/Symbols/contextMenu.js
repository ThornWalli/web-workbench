import { MENU_ITEM_TYPE } from '../../MenuItem';
import { CONFIG_NAMES, ORDER_TYPE, ORDER_DIRECTION } from './index';
import { saveStorageItem } from '@/web-workbench/utils/fileSystem';

export default ({ module, core }) => {
  return [
    {
      order: 11,
      title: 'Symbol',
      items: [
        {
          type: MENU_ITEM_TYPE.CHECKBOX,
          title: 'Show Invisible Symbols',
          model: core.config.observable,
          name: CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS,
          action (checked) {
            return core.config.set(CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS, checked);
          }
        },
        {
          title: 'Rearrange Symbols',
          hotKey: 'R',
          keyCode: 82,
          action () {
            const defaultWrapper = module.getDefaultWrapper();
            const symbolWrapper = module.getPrimaryWrapper();
            if (symbolWrapper.id !== defaultWrapper.id) {
              symbolWrapper.rearrangeIcons();
              return saveStorageItem((symbolWrapper).fsItem);
            } else {
              defaultWrapper.rearrangeIcons({
                root: true
              });
              return saveStorageItem((defaultWrapper).fsItem);
            }
          }
        },
        {
          title: 'Order Type',
          items: [
            {
              model: core.config.observable,
              type: MENU_ITEM_TYPE.RADIO,
              name: CONFIG_NAMES.ORDER_TYPE,
              value: ORDER_TYPE.NAME,
              title: 'Name',
              action () {
                return core.config.set(CONFIG_NAMES.ORDER_TYPE, ORDER_TYPE.NAME);
              }
            },
            {
              model: core.config.observable,
              type: MENU_ITEM_TYPE.RADIO,
              name: CONFIG_NAMES.ORDER_TYPE,
              value: ORDER_TYPE.TYPE,
              title: 'Type',
              action () {
                return core.config.set(CONFIG_NAMES.ORDER_TYPE, ORDER_TYPE.TYPE);
              }
            },
            {
              model: core.config.observable,
              type: MENU_ITEM_TYPE.RADIO,
              name: CONFIG_NAMES.ORDER_TYPE,
              value: ORDER_TYPE.CREATED_DATE,
              title: 'Created Date',
              action () {
                return core.config.set(CONFIG_NAMES.ORDER_TYPE, ORDER_TYPE.CREATED_DATE);
              }
            },
            {
              model: core.config.observable,
              type: MENU_ITEM_TYPE.RADIO,
              name: CONFIG_NAMES.ORDER_TYPE,
              value: ORDER_TYPE.EDITED_DATE,
              title: 'Edited Date',
              action () {
                return core.config.set(CONFIG_NAMES.ORDER_TYPE, ORDER_TYPE.EDITED_DATE);
              }
            }
          ]
        },
        {
          title: 'Order Direction',
          items: [
            {
              model: core.config.observable,
              type: MENU_ITEM_TYPE.RADIO,
              name: CONFIG_NAMES.ORDER_DIRECTION,
              value: ORDER_DIRECTION.ASCENDING,
              title: 'Ascending',
              action () {
                return core.config.set(CONFIG_NAMES.ORDER_DIRECTION, ORDER_DIRECTION.ASCENDING);
              }
            },
            {
              model: core.config.observable,
              type: MENU_ITEM_TYPE.RADIO,
              name: CONFIG_NAMES.ORDER_DIRECTION,
              value: ORDER_DIRECTION.DESCENDING,
              title: 'Descending',
              action () {
                return core.config.set(CONFIG_NAMES.ORDER_DIRECTION, ORDER_DIRECTION.DESCENDING);
              }
            }
          ]
        }
      ]
    }
  ];
};
