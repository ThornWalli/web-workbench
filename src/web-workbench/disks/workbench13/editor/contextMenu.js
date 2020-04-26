import { MENU_ITEM_TYPE } from '../../../classes/MenuItem';
import { CONFIG_NAMES, PROPERTY } from '../index';
import { btoa } from '@/web-workbench/utils/helper';

import WbComponentsEditorInfo from '@/components/disks/workbench13/editor/Info';

async function save (core, model, saveAs = false) {
  const value = await btoa(JSON.stringify(model.value));
  let item;
  if (!saveAs && model.fsItem) {
    item = await core.executeCommand(`editfile "${model.fsItem.getPath()}" --data="${value}"`);
    if (item) {
      return core.executeCommand('openDialog "File saved."');
    } else {
      return core.executeCommand('openDialog "File could not be saved."');
    }
  } else {
    model.fsItem = await core.executeCommand(`saveFileDialog --data="${value}"`);
    return model.fsItem;
  }
}
async function open (core, model) {
  const data = await core.executeCommand('openFileDialog');
  if (data) {
    debugger;
    if ('content' in data.value) {
      model.fsItem = data.fsItem;
      model.value = data.value;
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
              component: WbComponentsEditorInfo,
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
              model: model.value,
              value: 'markdown'
            },
            {
              title: 'HTML',
              type: MENU_ITEM_TYPE.RADIO,
              name: PROPERTY.OUTPUT_TYPE,
              model: model.value,
              value: 'html'
            }
          ]
        }
      ]
    },
    {
      order: 2,
      title: 'Preview',
      type: MENU_ITEM_TYPE.CHECKBOX,
      name: CONFIG_NAMES.EDITOR_SHOW_PREVIEW,
      model: core.config.observable,
      action (checked) {
        return core.config.set(CONFIG_NAMES.EDITOR_SHOW_PREVIEW, checked);
      }
    }
  ];
};
