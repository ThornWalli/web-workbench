import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';
import WbComponentsWebPaintingInfo from './components/Info';

import WbComponentsWebPaintingDisplaySettings from './components/webPainting/DisplaySettings';
import WbComponentsWebPaintingDocumentSettings from './components/webPainting/DocumentSettings';

import Color from './lib/Color';
import { DISPLAY_SPLIT_VALUES } from './lib/App';
import { CONFIG_NAMES, PROPERTY } from './index';

export default ({ model, core }) => {
  const { windows } = core.modules;
  const app = model.app;

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
      action: actionDocumentSettings
    },
    model.app && {
      order: 2,
      title: 'Display',
      items: [
        {
          title: 'Settings',
          action: actionDisplaySettings
        },
        {
          title: 'Split',
          items: [
            {
              title: 'Full',
              type: MENU_ITEM_TYPE.RADIO,
              name: 'displaySplit',
              model: model.app,
              value: DISPLAY_SPLIT_VALUES.FULL
            },
            {
              title: 'Half',
              type: MENU_ITEM_TYPE.RADIO,
              name: 'displaySplit',
              model: model.app,
              value: DISPLAY_SPLIT_VALUES.HALF
            },
            {
              title: 'Third',
              type: MENU_ITEM_TYPE.RADIO,
              name: 'displaySplit',
              model: model.app,
              value: DISPLAY_SPLIT_VALUES.THIRD
            },
            {
              title: 'Quarter',
              type: MENU_ITEM_TYPE.RADIO,
              name: 'displaySplit',
              model: model.app,
              value: DISPLAY_SPLIT_VALUES.QUARTER
            }
          ]
        }
      ]
    }
  ].filter(Boolean);

  function actionNew() {
    model.fsItem = null;
    app.reset();
  }
  function actionOpen() {
    return open(core, model);
  }
  function actionSave() {
    return save(core, model);
  }
  function actionSaveAs() {
    return save(core, model, true);
  }
  function actionClose() {
    return model.actions.close();
  }

  function actionDocumentSettings() {
    const window = windows.addWindow(
      {
        title: 'Document Settings',
        component: WbComponentsWebPaintingDocumentSettings,
        componentData: {
          model: {
            paletteSteps: app.colorSelect.paletteSteps.toJSON(),
            size: {
              width: app.canvas.size.x,
              height: app.canvas.size.y
            }
          }
        },
        options: {
          scale: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'extras13WebPainting'
      }
    );
    return new Promise(resolve => {
      window.events.subscribe(({ name, value }) => {
        if (name === 'close') {
          if (value) {
            app.colorSelect.paletteSteps = new Color(
              value.paletteSteps.red,
              value.paletteSteps.green,
              value.paletteSteps.blue
            );
            app.canvas.setSize(
              Number(value.size.width),
              Number(value.size.height)
            );
          }
          resolve();
        }
      });
    });
  }

  function actionDisplaySettings(params) {
    const window = windows.addWindow(
      {
        title: 'Display Settings',
        component: WbComponentsWebPaintingDisplaySettings,
        componentData: {
          model: {
            background: app.options.display.background,
            foreground: app.options.display.foreground
          }
        },
        options: {
          scale: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'extras13WebPainting'
      }
    );
    return new Promise(resolve => {
      window.events.subscribe(({ name, value }) => {
        if (name === 'close') {
          if (value) {
            const { background, foreground } = value;
            core.config.set(
              CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND,
              background
            );
            core.config.set(
              CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND,
              foreground
            );
            Object.assign(app.options.display, { background, foreground });
          }
          resolve();
        }
      });
    });
  }

  function actionInfo() {
    windows.addWindow(
      {
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
      },
      {
        group: 'extras13WebPainting'
      }
    );
  }
};

async function save(core, model, saveAs = false) {
  const content = await model.app.canvas.toBase64();
  let value = Object.assign({
    [PROPERTY.OUTPUT_TYPE]: 'image',
    [PROPERTY.CONTENT]: content
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
      `saveFileDialog --data="${value}" --extension="img"`
    );
    return model.fsItem;
  }
}
async function open(core, model) {
  const data = await core.executeCommand('openFileDialog');
  if (data) {
    if (PROPERTY.CONTENT in data.value) {
      model.app.canvas.loadImage(
        await createImageFromBase64(data.value[PROPERTY.CONTENT])
      );
      model.fsItem = data.fsItem;
    } else {
      throw new Error("Can't read file content");
    }
  }
}
function createImageFromBase64(base64) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = base64;
    image.onload = () => resolve(image);
  });
}
