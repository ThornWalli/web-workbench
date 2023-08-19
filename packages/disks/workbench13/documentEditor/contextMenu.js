import { markRaw } from 'vue';

import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';
import { btoa } from '@web-workbench/core/utils/helper';

import WbComponentsDocumentEditorInfo from './components/Info';
import {
  PROPERTY,
  FONT_FAMILES,
  FONT_TYPES,
  CONFIG_NAMES,
  FONT_SIZES,
  getDefaultDocumentModel
} from './index';

export default ({ model, core }) => {
  const { windows } = core.modules;
  return [
    {
      order: 0,
      title: 'Document Editor',
      items: [
        {
          title: 'New',
          hotKey: 'N',
          keyCode: 78,
          action: actionNew
        },
        {
          title: 'Open…',
          hotKey: 'O',
          keyCode: 79,
          action: actionOpen
        },
        {
          title: 'Save',
          hotKey: 'S',
          keyCode: 83,
          action: actionSave
        },
        {
          title: 'Save As…',
          action: actionSaveAs
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action: actionInfo
        },
        {
          title: 'Close',
          action: actionClose
        }
      ]
    },

    {
      order: 1,
      title: 'Document Settings',
      items: [
        {
          title: 'Open maximized',
          type: MENU_ITEM_TYPE.CHECKBOX,
          name: PROPERTY.OPEN_MAXIMIZED,
          model: model.value
        },
        {
          title: 'Output Format',
          items: [
            {
              title: 'Markdown',
              type: MENU_ITEM_TYPE.RADIO,
              name: PROPERTY.OUTPUT_TYPE,
              value: 'markdown',
              model: model.value
            },
            {
              title: 'HTML',
              type: MENU_ITEM_TYPE.RADIO,
              name: PROPERTY.OUTPUT_TYPE,
              value: 'html',
              model: model.value
            }
          ]
        },
        {
          title: 'Font Family',
          items: Object.keys(FONT_FAMILES).map(type => {
            const typeFonts = FONT_FAMILES[String(type)];
            return {
              title: FONT_TYPES[String(type)],
              items: Object.keys(typeFonts).map(title => {
                const value = typeFonts[String(title)];
                return {
                  title,
                  type: MENU_ITEM_TYPE.RADIO,
                  name: PROPERTY.FONT_FAMILY,
                  value,
                  model: model.value
                };
              })
            };
          })
        },
        {
          title: 'Font Size',
          items: FONT_SIZES.map(value => {
            return {
              title: `${value}px`,
              type: MENU_ITEM_TYPE.RADIO,
              name: PROPERTY.FONT_SIZE,
              value,
              model: model.value
            };
          })
        }
      ]
    },
    {
      order: 2,
      title: 'Preview',
      type: MENU_ITEM_TYPE.CHECKBOX,
      name: CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW,
      model: core.config.observable,
      action(checked) {
        return core.config.set(
          CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW,
          checked
        );
      }
    }
  ];

  function actionClose() {
    return model.actions.close();
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
    model.actions.reset();
  }

  function actionSave() {
    return save();
  }
  function actionSaveAs() {
    return save(true);
  }

  async function save(saveAs = false) {
    const value = await btoa(JSON.stringify(model.value));
    let item;
    if (!saveAs && model.fsItem) {
      item = await core.executeCommand(
        `editfile "${model.fsItem.getPath()}" --data="${value}"`
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
      model.fsItem = markRaw(
        await core.executeCommand(
          `saveFileDialog --data="${value}" --extension="${extension}"`
        )
      );
      return model.fsItem;
    }
  }

  function actionInfo() {
    windows.addWindow(
      {
        title: 'Info',
        component: WbComponentsDocumentEditorInfo,
        componentData: {
          model
        },
        options: {
          scale: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'workbench13DocumentEditor'
      }
    );
  }
};
