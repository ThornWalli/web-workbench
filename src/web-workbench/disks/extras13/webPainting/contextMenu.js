
import { PROPERTY } from '../index';
import { DISPLAY_SPLIT_VALUES } from './lib/App';
import WbComponentsWebPaintingInfo from '@/components/disks/extras13/webPainting/Info';
import WbComponentsWebPaintingDocumentSettings from '@/components/disks/extras13/webPainting/DocumentSettings';
import { MENU_ITEM_TYPE } from '@/web-workbench/classes/MenuItem';

export default ({ model, core }) => {
  const { windows } = core.modules;
  return [
    {
      order: 0,
      title: 'WebPainting',
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
          separator: true
        },
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action () {
            windows.addWindow({
              title: 'Info',
              component: WbComponentsWebPaintingInfo,
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
      action () {
        windows.addWindow({
          title: 'Document Settings',
          component: WbComponentsWebPaintingDocumentSettings,
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
    },
    {
      order: 2,
      title: 'Display split',
      items: [
        {
          title: 'Full',
          type: MENU_ITEM_TYPE.RADIO,
          name: 'displaySplit',
          model,
          value: DISPLAY_SPLIT_VALUES.FULL
        },
        {
          title: 'Half',
          type: MENU_ITEM_TYPE.RADIO,
          name: 'displaySplit',
          model,
          value: DISPLAY_SPLIT_VALUES.HALF
        },
        {
          title: 'Third',
          type: MENU_ITEM_TYPE.RADIO,
          name: 'displaySplit',
          model,
          value: DISPLAY_SPLIT_VALUES.THIRD
        },
        {
          title: 'Quarter',
          type: MENU_ITEM_TYPE.RADIO,
          name: 'displaySplit',
          model,
          value: DISPLAY_SPLIT_VALUES.QUARTER
        }
      ]
    }
  ];

  function actionNew () {
    model.fsItem = null;
    model.canvas.clearStack();
  }
  function actionOpen () {
    return open(core, model);
  }
  function actionSave () {
    return save(core, model);
  }
  function actionSaveAs () {
    return save(core, model, true);
  }
};

async function save (core, model, saveAs = false) {
  const content = await model.canvas.toBase64();
  let value = Object.assign({ [PROPERTY.OUTPUT_TYPE]: 'image', [PROPERTY.CONTENT]: content });
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
    model.fsItem = await core.executeCommand(`saveFileDialog --data="${value}"`);
    return model.fsItem;
  }
}
async function open (core, model) {
  const data = await core.executeCommand('openFileDialog');
  if (data) {
    if (PROPERTY.CONTENT in data.value) {
      model.canvas.loadImage(await createImageFromBase64(data.value[PROPERTY.CONTENT]));
      model.fsItem = data.fsItem;
    } else {
      throw new Error('Can\'t read file content');
    }
  }
}
function createImageFromBase64 (base64) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = base64;
    image.onload = () => resolve(image);
  });
}
