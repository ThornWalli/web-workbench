import {
  defineMenuItems,
  MENU_ITEM_TYPE
} from '@web-workbench/core/classes/MenuItem';
import type { Model } from './types';
import {
  FONT_FAMILES,
  FONT_TYPE_TITLES,
  getDefaultDocumentModel,
  getFontFamilyItems,
  getFontSizeItems
} from '../documentEditor/utils';
import { FONT_TYPES } from '../documentEditor/types';

export default defineMenuItems<{ model: Model }>(({ core, model }) => {
  return [
    {
      title: 'Document Reader',
      items: [
        {
          title: 'Open…',
          hotKey: 'O',
          keyCode: 79,
          action: actionOpen
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action: actionInfo
        }
      ]
    },
    {
      title: 'Font Family',
      items: Object.values(FONT_TYPES).map(type => {
        const typeFonts = FONT_FAMILES[type];
        return {
          title: FONT_TYPE_TITLES[type],
          items: getFontFamilyItems(typeFonts, model.value)
        };
      })
    },
    {
      title: 'Font Size',
      items: getFontSizeItems(model.value)
    }
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
