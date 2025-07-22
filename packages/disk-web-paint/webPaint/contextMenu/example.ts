import type { Model } from '../types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';

import { getDocumentFromUrl } from '../lib/utils/document';
import { DEMO_IMAGES } from '../utils';

export default defineMenuItems<{ model: Model }>(options => {
  const { model } = options;

  return [
    new MenuItemInteraction({
      title: 'Example',
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
        }),
        new MenuItemInteraction({
          title: 'Cuby (1080p)',
          async action() {
            return model.app.setDocument(
              await getDocumentFromUrl(DEMO_IMAGES.CUBY_1080)
            );
          }
        })
      ]
    })
  ].filter(Boolean);
});
