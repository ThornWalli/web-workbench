import type { Model } from './types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';
import { KEYBOARD_CODE } from '@web-workbench/core/services/dom';

import { loadDocumentFromImage } from './lib/utils/document';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import { computed } from 'vue';
import { DEMO_IMAGES } from './utils';
import { ipoint } from '@js-basics/vector';

export default defineMenuItems<{ model: Model }>(({ model }) => {
  return [
    new MenuItemInteraction({
      order: 0,
      title: 'WebPainting',
      items: [
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
          title: 'Info',
          action() {
            return model.actions?.openInfo();
          }
        }),
        new MenuItemInteraction({
          title: 'Close',
          action: actionClose
        })
      ]
    }),
    new MenuItemInteraction({
      order: 1,
      title: 'Display',
      options: {
        disabled: computed(() => !model.app.currentDisplay)
      },
      items: [
        new MenuItemInteraction({
          title: 'Reset',
          items: [
            new MenuItemInteraction({
              title: 'Position',
              action() {
                return model.app.currentDisplay?.actions.setPosition(
                  ipoint(0, 0)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Zoom',
              action() {
                return model.app.currentDisplay?.actions.setZoom(
                  ipoint(0, 0),
                  1
                );
              }
            })
          ]
        })
      ]
    }),
    new MenuItemInteraction({
      order: 2,
      title: 'Debug',
      items: [
        new MenuItemInteraction({
          title: 'Document',
          items: [
            new MenuItemInteraction({
              title: 'Lenna',
              async action() {
                return model.app.setDocument(
                  await loadDocumentFromImage(DEMO_IMAGES.LENNA)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Disk',
              async action() {
                return model.app.setDocument(
                  await loadDocumentFromImage(DEMO_IMAGES.DISK)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Web Painting',
              async action() {
                return model.app.setDocument(
                  await loadDocumentFromImage(DEMO_IMAGES.WEB_PAINTING)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Cuby',
              async action() {
                return model.app.setDocument(
                  await loadDocumentFromImage(DEMO_IMAGES.CUBY)
                );
              }
            })
          ]
        }),
        new MenuItemInteraction({
          title: 'Display',
          items: [
            new MenuItemInteraction({
              title: 'Add',
              options: {
                disabled: computed(() => model.app.hasMaxDisplays)
              },
              action() {
                return model.app.addDisplay();
              }
            }),
            new MenuItemInteraction({
              title: 'Remove',
              options: {
                disabled: computed(() => !model.app.displays.length)
              },
              action() {
                return model.app.removeDisplay(
                  model.app.displays[model.app.displays.length - 1]
                );
              }
            })
          ]
        }),
        new MenuItemInteraction({
          title: 'Density',
          items: [
            new MenuItemInteraction({
              title: '1x',
              type: INTERACTION_TYPE.RADIO,
              model: model.app.options,
              name: 'density',
              value: 1
            }),
            new MenuItemInteraction({
              title: '2x',
              type: INTERACTION_TYPE.RADIO,
              model: model.app.options,
              name: 'density',
              value: 2
            }),
            new MenuItemInteraction({
              title: '3x',
              type: INTERACTION_TYPE.RADIO,
              model: model.app.options,
              name: 'density',
              value: 3
            }),
            new MenuItemInteraction({
              title: '4x',
              type: INTERACTION_TYPE.RADIO,
              model: model.app.options,
              name: 'density',
              value: 4
            })
          ]
        })
      ]
    })
  ].filter(Boolean);

  function actionClose() {
    return model.actions?.close();
  }
});
