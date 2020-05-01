import { MENU_ITEM_TYPE } from '../../../classes/MenuItem';
import { CONFIG_NAMES, PROPERTY } from '../index';
import { btoa, cleanString } from '@/web-workbench/utils/helper';

import WbComponentsWebBasicInfo from '@/components/disks/extras13/webBasic/Info';

async function save (core, model, saveAs = false) {
  let value = Object.assign({}, model.value, { content: model.value.content.split(/\n/g) });
  value = await btoa(JSON.stringify(value));
  let item;
  if (!saveAs && model.fsItem) {
    item = await core.executeCommand(`editfile "${model.fsItem.getPath()}" --data="${value}"`);
    if (item) {
      return core.executeCommand('openDialog "File saved."');
    } else {
      return core.executeCommand('openDialog "File could not be saved."');
    }
  } else {
    model.fsItem = await core.executeCommand(`saveFileDialog --data="${value}" --extension="bs"`);
    return model.fsItem;
  }
}
async function open (core, model) {
  const data = await core.executeCommand('openFileDialog');
  if (data) {
    if (PROPERTY.CONTENT in data.value) {
      const value = Object.assign({}, data.value, {
        [PROPERTY.CONTENT]: [].concat(data.value[PROPERTY.CONTENT]).join('\n')
      });
      model.fsItem = data.fsItem;
      model.openValue = value;
    } else {
      throw new Error('Can\'t read file content');
    }
  }
}

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
          action () {
            model.reset();
          }
        },
        {
          title: 'Open…',
          hotKey: 'O',
          keyCode: 79,
          action () {
            return open(core, model);
          }
        },
        {
          title: 'Save',
          hotKey: 'S',
          keyCode: 83,
          action () {
            return save(core, model);
          }
        },
        {
          title: 'Save As…',
          action () {
            return save(core, model, true);
          }
        },
        {
          separator: true
        },
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action () {
            windows.addWindow({
              title: 'Info',
              component: WbComponentsWebBasicInfo,
              componentData: {
                model
              },
              options: {
                scale: false,
                prompt: false,
                scrollX: false,
                scrollY: false
              }
            });
          }
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
      action (checked) {
        return core.config.set(CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW, checked);
      }
    }
  ];

  async function actionRun () {
    const lines = [];
    await core.modules.parser.parseBasic(model.value[PROPERTY.CONTENT].split(/\n/), async (value, options) => {
      const parsedValue = await core.executeCommand(value, options);
      if (options.message) {
        lines.push(options.message);
      }
      return parsedValue;
    });
    model.output = lines.map(line => cleanString(line));
  }
};
