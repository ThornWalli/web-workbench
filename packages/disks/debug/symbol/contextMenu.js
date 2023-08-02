import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';

export const CONFIG_NAMES = {
  SHOW_SYMBOL_USED: 'showSymbolUsed',
  SHOW_SELECTED: 'showSelected'
};

export default ({ model }) => {
  return [
    {

      type: MENU_ITEM_TYPE.CHECKBOX,
      title: 'Show Symbol Used',
      name: CONFIG_NAMES.SHOW_SYMBOL_USED,
      model
    },
    {

      type: MENU_ITEM_TYPE.CHECKBOX,
      title: 'Show Selected',
      name: CONFIG_NAMES.SHOW_SELECTED,
      model
    }
  ];
};

