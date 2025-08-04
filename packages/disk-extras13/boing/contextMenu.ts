import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import type { WindowMenuItems } from '@web-workbench/core/types/contextMenu';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import type { Model } from './types';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';
import { computed } from 'vue';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';

export default defineMenuItems<{ model: Model } & WindowMenuItems>(
  ({ model }) => {
    const menuItems = [];

    menuItems.push(
      new MenuItemInteraction({
        title: 'Boing!',
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
            title: 'Debug',
            items: [
              new MenuItemInteraction({
                title: 'Controls',
                type: INTERACTION_TYPE.CUSTOM,
                options: {
                  checked: computed(() => model.rendererOptions.controls)
                },
                action() {
                  model.actions.setControls(!model.rendererOptions.controls);
                }
              }),
              new MenuItemInteraction({
                title: 'Grids',
                type: INTERACTION_TYPE.CUSTOM,
                options: {
                  checked: computed(() => model.options.grids)
                },
                action() {
                  model.actions.setGridsVisible(!model.options.grids);
                }
              }),
              new MenuItemInteraction({
                title: 'Pixelration',
                items: Array(10)
                  .fill(null)
                  .map((_, i) => {
                    const pixelSize = i + 1;
                    return new MenuItemInteraction({
                      title: `${pixelSize}px`,
                      type: INTERACTION_TYPE.CUSTOM,
                      options: {
                        checked: computed(
                          () =>
                            model.rendererOptions.pixelSize === (pixelSize || 3)
                        )
                      },
                      action() {
                        model.actions.setPixelSize(pixelSize);
                      }
                    });
                  })
              }),
              new MenuItemInteraction({
                title: 'Ball Radius',
                items: [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2].map(
                  size => {
                    return new MenuItemInteraction({
                      title: String(size),
                      type: INTERACTION_TYPE.CUSTOM,
                      options: {
                        checked: computed(
                          () => model.options?.ballRadius === (size || 1)
                        )
                      },
                      action() {
                        model.actions.setBallRadius(size);
                      }
                    });
                  }
                )
              }),
              new MenuItemInteraction({
                title: 'Ball Segmentation',
                items: Array(10)
                  .fill(null)
                  .map((_, index) => index * 3)
                  .map(ballSegments => {
                    return new MenuItemInteraction({
                      title: String(ballSegments),
                      type: INTERACTION_TYPE.CUSTOM,
                      options: {
                        checked: computed(
                          () =>
                            model.options?.ballSegments === (ballSegments || 18)
                        )
                      },
                      action() {
                        model.actions.setBallSegmentation(ballSegments);
                      }
                    });
                  })
              })
            ]
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

    return menuItems;
  }
);
