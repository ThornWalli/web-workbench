import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import type Core from '../../Core';
import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES, WINDOW_POSITION } from './utils';
import { MenuItemInteraction, MenuItemSeparator } from '../../MenuItem';
import { INTERACTION_TYPE } from '../../MenuItem/Interaction';

export default defineMenuItems(({ core }: { core: Core }) => {
  return [
    {
      order: 20,
      title: 'Window',
      items: [
        new MenuItemInteraction({
          type: INTERACTION_TYPE.CHECKBOX,
          title: 'Show Disk Space',
          model: core.config.observable,
          name: WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE,
          action(checked: boolean) {
            return core.config.set(
              WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE,
              checked
            );
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Order',
          items: [
            new MenuItemInteraction({
              title: 'Center',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.CENTER
                );
              }
            }),
            new MenuItemSeparator(),
            new MenuItemInteraction({
              title: 'Diagonal (Left to right)',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.ORDER_DIAGONAL_RIGHT
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Diagonal (Right to left)',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.ORDER_DIAGONAL_LEFT
                );
              }
            }),
            new MenuItemSeparator(),
            new MenuItemInteraction({
              title: 'Split (Horizontal)',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.SPLIT_HORIZONTAL
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Split (Vertical)',
              action() {
                core.modules.windows?.contentWrapper.setWindowPositions(
                  WINDOW_POSITION.SPLIT_VERTICAL
                );
              }
            })
          ]
        })
      ]
    }
  ];
});
