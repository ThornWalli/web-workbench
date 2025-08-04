import { saveStorageItem } from '../../utils/fileSystem';
import type Core from '../../classes/Core';
import type Symbols from '.';
import { FileSystemSymbolWrapper } from '../../classes/SymbolWrapper/FileSystem';
import { CONFIG_NAMES, ORDER_DIRECTION, ORDER_TYPE } from './types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import { INTERACTION_TYPE } from '../../classes/MenuItem/Interaction';
import { MenuItemInteraction, MenuItemSeparator } from '../../classes/MenuItem';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';

export default defineMenuItems(
  ({ module, core }: { module: Symbols; core: Core }) => {
    return [
      new MenuItemInteraction({
        order: 30,
        title: 'Symbol',
        items: [
          new MenuItemInteraction<CONFIG_NAMES>({
            type: INTERACTION_TYPE.CHECKBOX,
            title: 'Show Invisible Symbols',
            model: core.config.observable,
            name: CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS,
            action({ value }) {
              return core.config.set(
                CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS,
                value
              );
            }
          }),
          new MenuItemSeparator(),
          new MenuItemInteraction({
            title: 'Rearrange Symbols',
            hotKey: { alt: true, code: KEYBOARD_CODE.KEY_R, title: 'R' },
            // eslint-disable-next-line complexity
            action() {
              const defaultWrapper = module.getDefaultWrapper();
              const symbolWrapper = module.getPrimaryWrapper();
              if (
                symbolWrapper instanceof FileSystemSymbolWrapper &&
                symbolWrapper?.id !== defaultWrapper?.id
              ) {
                symbolWrapper?.rearrangeIcons();
                if (symbolWrapper?.fsItem) {
                  return saveStorageItem(symbolWrapper?.fsItem);
                } else {
                  throw new Error('No fsItem found');
                }
              } else if (defaultWrapper instanceof FileSystemSymbolWrapper) {
                defaultWrapper?.rearrangeIcons({
                  root: true
                });
                if (defaultWrapper?.fsItem) {
                  return saveStorageItem(defaultWrapper?.fsItem);
                } else {
                  throw new Error('No fsItem found');
                }
              }
            }
          }),
          new MenuItemInteraction({
            title: 'Order Type',
            items: [
              new MenuItemInteraction<CONFIG_NAMES>({
                model: core.config.observable,
                type: INTERACTION_TYPE.RADIO,
                name: CONFIG_NAMES.ORDER_TYPE,
                value: ORDER_TYPE.NAME,
                title: 'Name',
                action() {
                  return core.config.set(
                    CONFIG_NAMES.ORDER_TYPE,
                    ORDER_TYPE.NAME
                  );
                }
              }),
              new MenuItemInteraction<CONFIG_NAMES>({
                model: core.config.observable,
                type: INTERACTION_TYPE.RADIO,
                name: CONFIG_NAMES.ORDER_TYPE,
                value: ORDER_TYPE.TYPE,
                title: 'Type',
                action() {
                  return core.config.set(
                    CONFIG_NAMES.ORDER_TYPE,
                    ORDER_TYPE.TYPE
                  );
                }
              }),
              new MenuItemInteraction<CONFIG_NAMES>({
                model: core.config.observable,
                type: INTERACTION_TYPE.RADIO,
                name: CONFIG_NAMES.ORDER_TYPE,
                value: ORDER_TYPE.CREATED_DATE,
                title: 'Created Date',
                action() {
                  return core.config.set(
                    CONFIG_NAMES.ORDER_TYPE,
                    ORDER_TYPE.CREATED_DATE
                  );
                }
              }),
              new MenuItemInteraction<CONFIG_NAMES>({
                model: core.config.observable,
                type: INTERACTION_TYPE.RADIO,
                name: CONFIG_NAMES.ORDER_TYPE,
                value: ORDER_TYPE.EDITED_DATE,
                title: 'Edited Date',
                action() {
                  return core.config.set(
                    CONFIG_NAMES.ORDER_TYPE,
                    ORDER_TYPE.EDITED_DATE
                  );
                }
              })
            ]
          }),
          new MenuItemInteraction({
            title: 'Order Direction',
            items: [
              new MenuItemInteraction<CONFIG_NAMES>({
                model: core.config.observable,
                type: INTERACTION_TYPE.RADIO,
                name: CONFIG_NAMES.ORDER_DIRECTION,
                value: ORDER_DIRECTION.ASCENDING,
                title: 'Ascending',
                action() {
                  return core.config.set(
                    CONFIG_NAMES.ORDER_DIRECTION,
                    ORDER_DIRECTION.ASCENDING
                  );
                }
              }),
              new MenuItemInteraction<CONFIG_NAMES>({
                model: core.config.observable,
                type: INTERACTION_TYPE.RADIO,
                name: CONFIG_NAMES.ORDER_DIRECTION,
                value: ORDER_DIRECTION.DESCENDING,
                title: 'Descending',
                action() {
                  return core.config.set(
                    CONFIG_NAMES.ORDER_DIRECTION,
                    ORDER_DIRECTION.DESCENDING
                  );
                }
              })
            ]
          })
        ]
      })
    ];
  }
);
