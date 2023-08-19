import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';
import { btoa, cleanString } from '@web-workbench/core/utils/helper';
import WbComponentsWebBasicInfo from './components/Info';

import { PROPERTY, CONFIG_NAMES } from './index';

export default ({ model, core }) => {
  const { windows } = core.modules;
  return [
    {
      order: 0,
      title: 'Editor',
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
          title: 'Has Window Output',
          type: MENU_ITEM_TYPE.CHECKBOX,
          name: PROPERTY.HAS_WINDOW_OUTPUT,
          model: model.value
        }
      ]
    },

    {
      order: 1,
      title: 'Run',
      hotKey: 'R',
      keyCode: 82,
      action: actionRun
    },
    {
      order: 2,
      title: 'Preview',
      type: MENU_ITEM_TYPE.CHECKBOX,
      name: CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW,
      model: core.config.observable,
      action(checked) {
        return core.config.set(CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW, checked);
      }
    }
  ];

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
    let value = Object.assign({}, model.value, {
      content: model.value.content.split(/\n/g)
    });
    value = await btoa(JSON.stringify(value));
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
      model.fsItem = await core.executeCommand(
        `saveFileDialog --data="${value}" --extension="bs"`
      );
      return model.fsItem;
    }
  }

  async function actionOpen() {
    const data = await core.executeCommand('openFileDialog');
    if (data) {
      if (PROPERTY.CONTENT in data.value) {
        const value = Object.assign({}, data.value, {
          [PROPERTY.CONTENT]: [].concat(data.value[PROPERTY.CONTENT]).join('\n')
        });
        model.fsItem = data.fsItem;
        model.openValue = value;
      } else {
        throw new Error("Can't read file content");
      }
    }
  }

  async function actionRun() {
    const lines = [];
    await core.modules.parser.parseBasic(
      model.value[PROPERTY.CONTENT].split(/\n/),
      async (value, options) => {
        const parsedValue = await core.executeCommand(value, options);
        if (options.message) {
          lines.push(options.message);
        }
        return parsedValue;
      }
    );
    model.output = lines.map(line => cleanString(line));
  }

  function actionClose() {
    return model.actions.close();
  }

  function actionInfo() {
    windows.addWindow(
      {
        title: 'Info',
        component: WbComponentsWebBasicInfo,
        componentData: {
          model
        },
        options: {
          scale: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'extras13WebBasic'
      }
    );
  }
};
