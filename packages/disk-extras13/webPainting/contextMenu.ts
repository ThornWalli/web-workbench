import Color from './lib/Color';
import { DISPLAY_SPLIT_VALUES } from './lib/App';
import { CONFIG_NAMES, PROPERTY, type Model } from './types';
import type Core from '@web-workbench/core/classes/Core';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import {
  INTERACTION_TYPE,
  type ItemModel
} from '@web-workbench/core/classes/MenuItem/Interaction';
import { KEYBOARD_CODE } from '@web-workbench/core/services/dom';

export default defineMenuItems<{ model: Model }>(({ core, model }) => {
  const { windows } = core.modules;
  const app = model.app;

  return [
    new MenuItemInteraction({
      order: 0,
      title: 'WebPainting',
      items: [
        new MenuItemInteraction({
          title: 'New',
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_N, title: 'N' },
          action: actionNew
        }),
        new MenuItemInteraction({
          title: 'Open…',
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_O, title: 'O' },
          action: actionOpen
        }),
        new MenuItemInteraction({
          title: 'Save',
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_S, title: 'S' },
          action: actionSave
        }),
        new MenuItemInteraction({
          title: 'Save As…',
          action: actionSaveAs
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
          title: 'Info',
          action: actionInfo
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
      action: actionDocumentSettings
    }),
    model.app &&
      new MenuItemInteraction({
        order: 2,
        title: 'Display',
        items: [
          new MenuItemInteraction({
            title: 'Settings',
            action: actionDisplaySettings
          }),
          new MenuItemInteraction({
            title: 'Split',
            items: [
              new MenuItemInteraction({
                title: 'Full',
                type: INTERACTION_TYPE.RADIO,
                name: 'displaySplit',
                model: model.app as ItemModel,
                value: DISPLAY_SPLIT_VALUES.FULL
              }),
              new MenuItemInteraction({
                title: 'Half',
                type: INTERACTION_TYPE.RADIO,
                name: 'displaySplit',
                model: model.app,
                value: DISPLAY_SPLIT_VALUES.HALF
              }),
              new MenuItemInteraction({
                title: 'Third',
                type: INTERACTION_TYPE.RADIO,
                name: 'displaySplit',
                model: model.app,
                value: DISPLAY_SPLIT_VALUES.THIRD
              }),
              new MenuItemInteraction({
                title: 'Quarter',
                type: INTERACTION_TYPE.RADIO,
                name: 'displaySplit',
                model: model.app,
                value: DISPLAY_SPLIT_VALUES.QUARTER
              })
            ]
          })
        ]
      })
  ].filter(Boolean);

  function actionNew() {
    model.fsItem = undefined;
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
    return model.actions?.close();
  }

  async function actionDocumentSettings() {
    const component = await import(
      './components/webPainting/DocumentSettings.vue'
    ).then(module => module.default);
    const window = windows?.addWindow(
      {
        component,
        componentData: {
          model: {
            paletteSteps: app.colorSelect.paletteSteps.toJSON(),
            size: {
              width: app.canvas?.size.x || 0,
              height: app.canvas?.size.y || 0
            }
          }
        },
        options: {
          title: 'Document Settings',
          prompt: false,
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'extras13WebPainting'
      }
    );
    return new Promise<void>(resolve => {
      window?.events.subscribe(({ name, value }) => {
        if (name === 'close') {
          if (value) {
            const { size, paletteSteps } = value as Options;
            app.colorSelect.paletteSteps = new Color(
              paletteSteps.red,
              paletteSteps.green,
              paletteSteps.blue
            );
            app.canvas?.setSize(Number(size.width), Number(size.height));
          }
          resolve();
        }
      });
    });
  }

  async function actionDisplaySettings() {
    const component = await import(
      './components/webPainting/DisplaySettings.vue'
    ).then(module => module.default);
    const window = windows?.addWindow(
      {
        component,
        componentData: {
          model: {
            background: app.options.display.background,
            foreground: app.options.display.foreground
          }
        },
        options: {
          title: 'Display Settings',
          prompt: false,
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'extras13WebPainting'
      }
    );
    return new Promise<void>(resolve => {
      window?.events.subscribe(({ name, value }) => {
        if (name === 'close') {
          if (value) {
            const { background, foreground } = value as Options;
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

  async function actionInfo() {
    const component = await import('./components/Info.vue').then(
      module => module.default
    );
    windows?.addWindow(
      {
        component,
        componentData: {
          model
        },
        options: {
          title: 'Info',
          prompt: false,
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'extras13WebPainting'
      }
    );
  }
});

async function save(core: Core, model: Model, saveAs = false) {
  const content = await model.app.canvas?.toBase64();
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
async function open(core: Core, model: Model) {
  const data = await core.executeCommand('openFileDialog');
  if (data) {
    if (PROPERTY.CONTENT in data.value) {
      model.app.canvas?.loadImage(
        await createImageFromBase64(data.value[PROPERTY.CONTENT])
      );
      model.fsItem = data.fsItem;
    } else {
      throw new Error("Can't read file content");
    }
  }
}
function createImageFromBase64(base64: string) {
  return new Promise<HTMLImageElement>(resolve => {
    const image = new Image();
    image.src = base64;
    image.onload = () => resolve(image);
  });
}

interface Options {
  background: Color;
  foreground: Color;
  paletteSteps: Color;
  size: {
    width: number;
    height: number;
  };
}
