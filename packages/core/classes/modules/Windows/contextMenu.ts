import type Core from '../../Core';
import { MENU_ITEM_TYPE } from '../../MenuItem';
import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES, WINDOW_POSITION } from './utils';

export default ({ core }: { core: Core }) => {
  return [
    {
      order: 20,
      title: 'Window',
      items: [
        {
          type: MENU_ITEM_TYPE.CHECKBOX,
          title: 'Show Disk Space',
          model: core.config.observable,
          name: WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE,
          action(checked: boolean) {
            return core.config.set(
              WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE,
              checked
            );
          }
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          title: 'Order',
          items: [
            {
              title: 'Center',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.CENTER
                );
              }
            },
            {
              type: MENU_ITEM_TYPE.SEPARATOR
            },
            {
              title: 'Diagonal (Left to right)',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.ORDER_DIAGONAL_RIGHT
                );
              }
            },
            {
              title: 'Diagonal (Right to left)',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.ORDER_DIAGONAL_LEFT
                );
              }
            },
            {
              type: MENU_ITEM_TYPE.SEPARATOR
            },
            {
              title: 'Split (Horizontal)',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.SPLIT_HORIZONTAL
                );
              }
            },
            {
              title: 'Split (Vertical)',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.SPLIT_VERTICAL
                );
              }
            }
          ]
        }
      ]
    }
  ];
};
