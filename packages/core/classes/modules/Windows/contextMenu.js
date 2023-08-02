import { MENU_ITEM_TYPE } from '../../MenuItem';
import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES, WINDOW_POSITION } from './utils';

export default ({ core }) => {
  return [
    {
      order: 10,
      title: 'Window',
      items: [
        {
          type: MENU_ITEM_TYPE.CHECKBOX,
          title: 'Show Disk Space',
          model: core.config.observable,
          name: WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE,
          action (checked) {
            return core.config.set(WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE, checked);
          }
        },
        {
          separator: true
        },
        {
          title: 'Order',
          items: [
            {
              title: 'Center',
              action () {
                core.modules.windows.contentWrapper.setWindowPositions(WINDOW_POSITION.CENTER);
              }
            },
            {
              separator: true
            },
            {
              title: 'Diagonal (Left to right)',
              action () {
                core.modules.windows.contentWrapper.setWindowPositions(WINDOW_POSITION.ORDER_DIAGONAL_RIGHT);
              }
            },
            {
              title: 'Diagonal (Right to left)',
              action () {
                core.modules.windows.contentWrapper.setWindowPositions(WINDOW_POSITION.ORDER_DIAGONAL_LEFT);
              }
            },
            {
              separator: true
            },
            {
              title: 'Split (Horizontal)',
              action () {
                core.modules.windows.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL);
              }
            },
            {
              title: 'Split (Vertical)',
              action () {
                core.modules.windows.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_VERTICAL);
              }
            }
          ]
        }
      ]
    }
  ];
};
