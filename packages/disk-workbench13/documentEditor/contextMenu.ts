import { markRaw } from 'vue';

import { btoa } from '@web-workbench/core/utils/helper';

import { CONFIG_NAMES, FONT_TYPES, PROPERTY } from './types';
import type { Model } from './types';
import {
  FONT_FAMILES,
  FONT_TYPE_TITLES,
  getDefaultDocumentModel,
  getFontSizeItems,
  getLineHeightItems,
  getModularScaleItems
} from './utils';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';

export default defineMenuItems<{ model: Model }>(({ core, model }) => {
  return [
    new MenuItemInteraction({
      order: 0,
      title: 'Document Editor',
      items: [
        new MenuItemInteraction({
          title: 'New',
          hotKey: {
            alt: true,
            code: KEYBOARD_CODE.KEY_N,
            title: 'N'
          },
          action: actionNew
        }),
        new MenuItemInteraction({
          title: 'Open…',
          hotKey: {
            alt: true,
            code: KEYBOARD_CODE.KEY_O,
            title: 'O'
          },
          action: actionOpen
        }),
        new MenuItemInteraction({
          title: 'Save',
          hotKey: {
            alt: true,
            code: KEYBOARD_CODE.KEY_S,
            title: 'S'
          },
          action: actionSave
        }),
        new MenuItemInteraction({
          title: 'Save As…',
          action: actionSaveAs
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          hotKey: {
            alt: true,
            code: KEYBOARD_CODE.KEY_I,
            title: 'I'
          },
          title: 'Info',
          action: () => {
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
      title: 'Document Settings',
      items: [
        new MenuItemInteraction({
          title: 'Open maximized',
          type: INTERACTION_TYPE.CHECKBOX,
          name: PROPERTY.OPEN_MAXIMIZED,
          model: model.value
        }),
        new MenuItemInteraction({
          title: 'Output Format',
          items: [
            new MenuItemInteraction({
              title: 'Markdown',
              type: INTERACTION_TYPE.RADIO,
              name: PROPERTY.OUTPUT_TYPE,
              value: 'markdown',
              model: model.value
            }),
            new MenuItemInteraction({
              title: 'HTML',
              type: INTERACTION_TYPE.RADIO,
              name: PROPERTY.OUTPUT_TYPE,
              value: 'html',
              model: model.value
            })
          ]
        }),
        new MenuItemInteraction({
          title: 'Font Family',
          items: Object.values(FONT_TYPES).map(type => {
            const typeFonts = FONT_FAMILES[type];
            return new MenuItemInteraction({
              title: FONT_TYPE_TITLES[type],
              items: Object.entries(typeFonts).map(([title, value]) => {
                return new MenuItemInteraction({
                  title,
                  type: INTERACTION_TYPE.RADIO,
                  name: PROPERTY.FONT_FAMILY,
                  value,
                  model: model.value
                });
              })
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
    }),
    new MenuItemInteraction<CONFIG_NAMES>({
      order: 2,
      title: 'Preview',
      type: INTERACTION_TYPE.CHECKBOX,
      name: CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW,
      model: core.config.observable,
      action({ value }) {
        return core.config.set(
          CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW,
          value
        );
      }
    })
  ];

  function actionClose() {
    return model.actions?.close();
  }

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

  function actionNew() {
    model.actions?.reset();
  }

  function actionSave() {
    return save();
  }
  function actionSaveAs() {
    return save(true);
  }

  async function save(saveAs = false) {
    const convertedValue = await btoa(JSON.stringify(model.value));
    let item;
    if (!saveAs && model.fsItem) {
      item = await core.executeCommand(
        `editfile "${model.fsItem.getPath()}" --data="${convertedValue}"`
      );
      if (item) {
        return core.executeCommand('openDialog "File saved."');
      } else {
        return core.executeCommand('openDialog "File could not be saved."');
      }
    } else {
      const extension = {
        html: 'html',
        markdown: 'md'
      }[String(model.value[PROPERTY.OUTPUT_TYPE])];
      const fsItem = await core.executeCommand(
        `saveFileDialog --data="${convertedValue}" --extension="${extension}"`
      );
      if (fsItem) {
        model.fsItem = markRaw(fsItem);
        return model.fsItem;
      }
      return null;
    }
  }
});
