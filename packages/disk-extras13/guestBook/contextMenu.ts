import {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemUpload
} from '@web-workbench/core/classes/MenuItem';
import type { WindowMenuItems } from '@web-workbench/core/types/contextMenu';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import type { Model } from './types';
import { computed } from 'vue';
import { KEYBOARD_CODE } from '@web-workbench/core/services/dom';

export default defineMenuItems<{ model: Model } & WindowMenuItems>(
  ({ model }) => {
    const menuItems = [];

    menuItems.push(
      new MenuItemInteraction({
        title: 'GuestBook',
        items: [
          new MenuItemInteraction({
            hotKey: {
              alt: true,
              code: KEYBOARD_CODE.KEY_I,
              title: 'I'
            },
            title: 'Info',
            async action() {
              return model.actions?.openInfo();
            }
          }),
          new MenuItemSeparator(),
          new MenuItemInteraction({
            title: 'Close',
            action() {
              return model.actions?.close();
            }
          })
        ]
      })
    );

    if (!model.isLocked) {
      menuItems.push(
        new MenuItemInteraction({
          title: 'Options',
          items: [
            new MenuItemInteraction({
              title: 'Setup Storage…',
              action() {
                return model.actions?.setupStorage();
              }
            }),
            new MenuItemInteraction({
              title: 'Update Storage',
              action() {
                return model.actions?.updateStorage();
              }
            }),
            new MenuItemSeparator(),
            new MenuItemUpload({
              title: 'Import… (JSON)',
              hotKey: {
                alt: true,
                shift: true,
                code: KEYBOARD_CODE.KEY_I,
                title: 'I'
              },
              action(files: File[]) {
                return model.actions?.import(files[0]);
              }
            }),
            new MenuItemInteraction({
              title: 'Export (JSON)',
              hotKey: {
                alt: true,
                shift: true,
                code: KEYBOARD_CODE.KEY_E,
                title: 'E'
              },
              action: async () => {
                return model.actions?.export();
              }
            }),
            new MenuItemSeparator(),
            new MenuItemInteraction({
              title: 'Truncate…',
              action: async () => {
                return model.actions?.truncate();
              }
            })
          ]
        }),

        new MenuItemInteraction({
          options: {
            disabled: computed(() => !model.selectedEntries?.length)
          },
          title: computed(() => {
            return `Entry (${model.selectedEntries?.length ?? 0})`;
          }),
          items: [
            new MenuItemInteraction({
              title: 'Publish',
              action: async () => {
                return model.actions?.publishEntries(
                  model.selectedEntries ?? [],
                  true
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Unpublish',
              action: () => {
                return model.actions?.publishEntries(
                  model.selectedEntries ?? [],
                  false
                );
              }
            }),
            new MenuItemSeparator(),
            new MenuItemInteraction({
              title: 'Edit',
              action: () => {
                return model.actions?.editEntries(model.selectedEntries ?? []);
              }
            }),
            new MenuItemInteraction({
              title: 'Delete',
              action: () => {
                return model.actions?.removeEntries(
                  model.selectedEntries ?? []
                );
              }
            })
          ].filter(Boolean)
        })
      );
    }

    return menuItems;
  }
);
