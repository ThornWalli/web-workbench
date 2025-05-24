import type { Model } from './types';
import {
  FONT_FAMILES,
  FONT_TYPE_TITLES,
  getDefaultDocumentModel,
  getFontFamilyItems,
  getFontSizeItems,
  getLineHeightItems,
  getModularScaleItems
} from '../documentEditor/utils';
import { FONT_TYPES } from '../documentEditor/types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import { KEYBOARD_CODE } from '@web-workbench/core/services/dom';

export default defineMenuItems<{ model: Model }>(({ core, model }) => {
  return [
    new MenuItemInteraction({
      title: 'Document Reader',
      items: [
        new MenuItemInteraction({
          title: 'Open…',
          hotKey: {
            alt: true,
            code: KEYBOARD_CODE.KEY_O,
            title: 'O'
          },
          action: actionOpen
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          hotKey: {
            alt: true,
            code: KEYBOARD_CODE.KEY_I,
            title: 'I'
          },
          title: 'Info',
          action: actionInfo
        })
      ]
    }),
    new MenuItemInteraction({
      title: 'Document Settings',
      items: [
        new MenuItemInteraction({
          title: 'Font Family',
          items: Object.values(FONT_TYPES).map(type => {
            const typeFonts = FONT_FAMILES[type];
            return new MenuItemInteraction({
              title: FONT_TYPE_TITLES[type],
              items: getFontFamilyItems(typeFonts, model.value)
            });
          })
        }),
        new MenuItemInteraction({
          title: 'Font Size',
          items: getFontSizeItems(model.value)
        }),
        new MenuItemInteraction({
          title: 'Line Height',
          items: getLineHeightItems(model.value)
        }),
        new MenuItemInteraction({
          title: 'Modular Scale',
          items: getModularScaleItems(model.value)
        })
      ]
    })
  ];

  async function actionOpen() {
    const data = await core.executeCommand('openFileDialog');
    if (data) {
      if ('content' in data.value) {
        model.fsItem = data.fsItem;
        model.value = Object.assign(
          model.value,
          getDefaultDocumentModel(),
          data.value
        );
      } else {
        throw new Error("Can't read file content");
      }
    }
  }

  async function actionInfo() {
    const component = await import('./components/Info.vue').then(
      module => module.default
    );
    core.modules.windows?.addWindow(
      {
        component,
        componentData: {
          model
        },
        options: {
          title: 'Info',
          scaleX: false,
          scaleY: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'workbench13DocumentReader'
      }
    );
  }
});
