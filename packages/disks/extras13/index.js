import { filter } from 'rxjs/operators';
import { ipoint } from '@js-basics/vector';
import { markRaw, reactive } from 'vue';

import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import themeBlackContrast from '@web-workbench/core/themes/blackContrast';
import { WINDOW_POSITION } from '@web-workbench/core/classes/WindowWrapper';

import App from './webPainting/lib/App';
import Bounds from './webPainting/lib/Bounds';

import { CONFIG_DEFAULTS, PROPERTY, CONFIG_NAMES, getBasicDefaultModelValue } from './utils';

import basicDemos from './webBasic/basicDemos';

export default ({ core }) => {
  core.config.setDefaults(CONFIG_DEFAULTS);

  return {
    locked: true,
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_WORKBENCH13
      ],
      [
        ITEM_META.WINDOW_SIZE, ipoint(320, 140)
      ],
      [
        ITEM_META.WINDOW_POSITION, ipoint(310, 10)
      ],
      [
        ITEM_META.WINDOW_SYMBOL_REARRANGE, true
      ]
    ],
    name: 'Extras 1.3',
    items: [

      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.WEB_PAINTING
          ]
        ],
        id: 'WebPainting.app',
        name: 'WebPainting',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: webPaintingAction(core)
      },
      {
        meta: [
          [
            ITEM_META.SYMBOL, SYMBOL.WEB_BASIC
          ],
          [
            ITEM_META.WINDOW_SIZE, ipoint(360, 200)
          ]
        ],
        id: 'WebBasic.app',
        name: 'WebBasic',
        createdDate: new Date(2017, 7, 5).getTime(),
        editedDate: new Date(2020, 3, 14).getTime(),
        action: webBasicAction(core)
      },
      basicDemos
    ]
  };
};

function webBasicAction (core) {
  const windowsModule = core.modules.windows;
  return async ({ modules }, path) => {
    const executionResolve = core.addExecution();

    let fsItem;
    const model = reactive({
      actions: {},
      value: getBasicDefaultModelValue(),
      fsItem: null,
      output: [],
      openValue: null
    });
    if (path) {
      fsItem = await modules.files.fs.get(path);
      if (PROPERTY.CONTENT in fsItem.data) {
        const value = Object.assign({}, fsItem.data, {
          [PROPERTY.CONTENT]: [].concat(fsItem.data[PROPERTY.CONTENT]).join('\n')
        });
        model.fsItem = fsItem;
        model.value = value;
      } else {
        throw new Error('Can\'t read file content');
      }
    }
    const [
      WbComponentsWebBasic,
      WbComponentsWebBasicPreview
    ] = await Promise.all([
      import('./components/WebBasic').then(module => module.default),
      import('./components/webBasic/Preview').then(module => module.default)
    ]);

    const windowEditor = modules.windows.addWindow({
      title: 'WebBasic - Extras 1.3',
      component: WbComponentsWebBasic,
      componentData: { model },
      options: {
        scale: true,
        scrollX: true,
        scrollY: true,
        center: false,
        embed: true,
        borderless: true
      },
      layout: {
        size: ipoint(540, 360)
      }
    },
    {
      group: 'extras13WebBasic'
    });

    Object.assign(model.actions, {
      close: () => {
        windowEditor.close();
      },
      focus: () => {
        windowEditor.focus();
      },
      reset: () => {
        model.value = getBasicDefaultModelValue();
        model.fsItem = null;
        model.output = [];
        model.openValue = null;
      }
    });

    let previewWindow;
    model.actions.togglePreview = (toggle = true) => {
      if (toggle) {
        previewWindow = modules.windows.addWindow({
          title: 'Preview - WebBasic - Extras 1.3',
          component: WbComponentsWebBasicPreview,
          componentData: { model },
          options: {
            scale: true,
            scrollX: true,
            scrollY: true,
            center: false,
            close: false,
            embed: true,
            borderless: true
          },
          layout: {
            size: ipoint(540, 360)
          }
        },
        {
          group: 'extras13WebBasic',
          active: false
        });
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL, [
            windowEditor, previewWindow
          ]);
        }, 0);
      } else if (previewWindow) {
        windowEditor.unfocus();
        previewWindow.close();
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(WINDOW_POSITION.SPLIT_HORIZONTAL, [
            windowEditor
          ]);
          windowEditor.focus();
        });
      }
    };

    core.modules.screen.setTheme(themeBlackContrast);

    return new Promise((resolve) => {
      executionResolve();
      windowEditor.events.pipe(filter(({ name }) => name === 'close')).subscribe(() => {
        if (previewWindow) {
          previewWindow.close();
        }
        core.modules.screen.setTheme(null);
        resolve();
      });
    });
  };
}

function webPaintingAction (core) {
  const windowsModule = core.modules.windows;
  return async ({ modules }) => {
    const executionResolve = core.addExecution();
    const [
      WbComponentsWebPainting
    ] = await Promise.all([
      import('./components/WebPainting').then(module => module.default)
    ]);

    const contentLayout = core.modules.screen.contentLayout;
    const app = markRaw(new App(new Bounds(contentLayout.position, ipoint(() => contentLayout.position + contentLayout.size))));

    app.options.display.background = core.config.get(CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND);
    app.options.display.foreground = core.config.get(CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND);

    const model = reactive({
      fsItem: null,
      app
    });

    const window = windowsModule.addWindow({
      title: 'WebPainting - Extras 1.3',
      component: WbComponentsWebPainting,
      componentData: {
        model
      },
      options: {
        scale: false,
        scrollX: false,
        scrollY: false,
        embed: true
      }
    },
    {
      group: 'extras13WebPainting',
      full: true
    });

    model.actions = {
      close: () => {
        window.close();
      },
      focus: () => {
        window.focus();
      }
    };

    executionResolve();
  };
}
