import type { Model } from '../types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';

import { getDocumentFromUrl } from '../lib/utils/document';
import { computed } from 'vue';
import { DEMO_IMAGES } from '../utils';

export default defineMenuItems<{ model: Model }>(options => {
  const { model } = options;

  return [
    new MenuItemInteraction({
      title: 'Debug',
      items: [
        new MenuItemInteraction({
          title: 'Document',
          items: [
            new MenuItemInteraction({
              title: 'Lenna',
              async action() {
                return model.app.setDocument(
                  await getDocumentFromUrl(DEMO_IMAGES.LENNA)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Disk',
              async action() {
                return model.app.setDocument(
                  await getDocumentFromUrl(DEMO_IMAGES.DISK)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Web Painting',
              async action() {
                return model.app.setDocument(
                  await getDocumentFromUrl(DEMO_IMAGES.WEB_PAINTING)
                );
              }
            }),
            new MenuItemInteraction({
              title: 'Cuby',
              async action() {
                return model.app.setDocument(
                  await getDocumentFromUrl(DEMO_IMAGES.CUBY)
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
          title: 'Color Pickers…',
          action() {
            return model.actions?.openDebugColorPickers();
          }
        })
      ]
    })
  ].filter(Boolean);
});
