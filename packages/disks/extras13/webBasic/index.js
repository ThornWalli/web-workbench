import { filter } from 'rxjs';
import { reactive } from 'vue';
import themeBlackContrast from '@web-workbench/core/themes/blackContrast';
import { WINDOW_POSITION } from '@web-workbench/core/classes/WindowWrapper';
import { ipoint } from '@js-basics/vector';

import { PROPERTY as PROPERTY_FILES_COMMANDS } from '@web-workbench/core/classes/modules/Files/commands';

export default function webBasic(core) {
  const windowsModule = core.modules.windows;
  return async ({ modules }, path) => {
    const executionResolve = core.addExecution();

    let fsItem;
    const model = reactive({
      actions: {},
      value: getDefaultModel(),
      fsItem: null,
      output: [],
      openValue: null
    });
    if (path) {
      fsItem = await modules.files.fs.get(path);
      if (PROPERTY.CONTENT in fsItem.data) {
        const value = Object.assign({}, fsItem.data, {
          [PROPERTY.CONTENT]: []
            .concat(fsItem.data[PROPERTY.CONTENT])
            .join('\n')
        });
        model.fsItem = fsItem;
        model.value = value;
      } else {
        throw new Error("Can't read file content");
      }
    }
    const [WbComponentsWebBasic, WbComponentsWebBasicPreview] =
      await Promise.all([
        import('./components/WebBasic').then(module => module.default),
        import('./components/Preview').then(module => module.default)
      ]);

    const windowEditor = modules.windows.addWindow(
      {
        title: 'WebBasic - Extras 1.3',
        component: WbComponentsWebBasic,
        componentData: { model },
        options: {
          scaleX: true,
          scaleY: true,
          scrollX: true,
          scrollY: true,
          center: false,
          embed: false,
          borderless: true
        },
        layout: {
          size: ipoint(540, 360)
        }
      },
      {
        group: 'extras13WebBasic'
      }
    );

    Object.assign(model.actions, {
      close: () => {
        windowEditor.close();
      },
      focus: () => {
        windowEditor.focus();
      },
      reset: () => {
        model.value = getDefaultModel();
        model.fsItem = null;
        model.output = [];
        model.openValue = null;
      }
    });

    let previewWindow;
    model.actions.togglePreview = (toggle = true) => {
      if (toggle) {
        previewWindow = modules.windows.addWindow(
          {
            title: 'Preview - WebBasic - Extras 1.3',
            component: WbComponentsWebBasicPreview,
            componentData: { model },
            options: {
              scaleX: true,
              scaleY: true,
              scrollX: true,
              scrollY: true,
              center: false,
              close: false,
              embed: false,
              borderless: true
            },
            layout: {
              size: ipoint(540, 360)
            }
          },
          {
            group: 'extras13WebBasic',
            active: false
          }
        );
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(
            WINDOW_POSITION.SPLIT_HORIZONTAL,
            [windowEditor, previewWindow]
          );
        }, 0);
      } else if (previewWindow) {
        windowEditor.unfocus();
        previewWindow.close();
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(
            WINDOW_POSITION.SPLIT_HORIZONTAL,
            [windowEditor]
          );
          windowEditor.focus();
        });
      }
    };

    core.modules.screen.setTheme(themeBlackContrast);

    return new Promise(resolve => {
      executionResolve();
      windowEditor.events
        .pipe(filter(({ name }) => name === 'close'))
        .subscribe(() => {
          if (previewWindow) {
            previewWindow.close();
          }
          core.modules.screen.setTheme(null);
          resolve();
        });
    });
  };
}
export const CONFIG_NAMES = {
  // WebBasic
  WEB_BASIC_SHOW_PREVIEW: 'extras13_web_basic_show_preview',

  // WebPainting
  WEB_PAINTING_DISPLAY_BACKGROUND: 'extras13_web_painting_display_background',
  WEB_PAINTING_DISPLAY_FOREGROUND: 'extras13_web_painting_display_foreground'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW]: true
};

export const PROPERTY = {
  HAS_WINDOW_OUTPUT: PROPERTY_FILES_COMMANDS.HAS_WINDOW_OUTPUT,
  CONTENT: 'content',
  OUTPUT_TYPE: 'type'
};

export function getDefaultModel() {
  return {
    [PROPERTY.HAS_WINDOW_OUTPUT]: false,
    [PROPERTY.CONTENT]: '',
    [PROPERTY.OUTPUT_TYPE]: 'basic'
  };
}
