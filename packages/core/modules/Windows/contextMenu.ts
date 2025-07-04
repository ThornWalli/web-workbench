import { defineMenuItems } from '../../utils/menuItems';
import type Core from '../../classes/Core';
import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from './utils';
import { MenuItemInteraction, MenuItemSeparator } from '../../classes/MenuItem';
import { INTERACTION_TYPE } from '../../classes/MenuItem/Interaction';
import { WINDOW_POSITION } from '../../classes/WindowWrapper';

export default defineMenuItems(({ core }: { core: Core }) => {
  return [
    new MenuItemInteraction({
      order: 20,
      title: 'Window',
      items: [
        new MenuItemInteraction<WINDOWS_CONFIG_NAMES>({
          type: INTERACTION_TYPE.CHECKBOX,
          title: 'Show Disk Space',
          model: core.config.observable,
          name: WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE,
          action({ checked }) {
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
    })
  ];
});
