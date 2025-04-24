import { filter } from 'rxjs';
import { reactive, type Reactive } from 'vue';
import { ipoint } from '@js-basics/vector';
import themeBlackContrast from '@web-workbench/core/themes/blackContrast';
import { WINDOW_POSITION } from '@web-workbench/core/classes/WindowWrapper';
import type FsItem from '@web-workbench/core/classes/FileSystem/Item';
import type Core from '@web-workbench/core/classes/Core';
import type Windows from '@web-workbench/core/classes/modules/Windows';
import type Window from '@web-workbench/core/classes/Window';
import type Screen from '@web-workbench/core/classes/modules/Screen';
import type { ItemModel } from '@web-workbench/core/classes/MenuItem';
import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '@web-workbench/core/classes/modules/Windows/utils';

export interface Value extends ItemModel {
  [PROPERTY.CONTENT]: string;
  [PROPERTY.OUTPUT_TYPE]?: string;
  [WINDOWS_CONFIG_NAMES.HAS_WINDOW_OUTPUT]?: boolean;
}

export interface Model {
  value: Value;
  output: string[];
  fsItem?: FsItem;
  openValue?: Value;
  actions: {
    reset?: () => void;
    close?: () => void;
    togglePreview?: (toggle?: boolean) => void;
  };
}

export default function webBasic(core: Core) {
  const windowsModule = (core.modules.windows || {}) as Windows;
  const screenModule = (core.modules.screen || {}) as Screen;
  return async (
    {
      modules
    }: {
      modules: Core['modules'];
    },
    path: string
  ) => {
    const executionResolve = core.addExecution();

    let fsItem;
    const model: Reactive<Model> = reactive({
      actions: {},
      value: getDefaultModel(),
      fsItem: undefined,
      output: [],
      openValue: undefined
    });
    if (path) {
      fsItem = await modules.files?.fs.get(path);
      if (fsItem && PROPERTY.CONTENT in fsItem.data) {
        const value = {
          ...(fsItem.data as Value),
          [PROPERTY.CONTENT]: ([] as string[])
            .concat(fsItem.data[PROPERTY.CONTENT])
            .join('\n')
        };
        model.fsItem = fsItem;
        model.value = value;
      } else {
        throw new Error("Can't read file content");
      }
    }
    const [WbComponentsWebBasic, WbComponentsWebBasicPreview] =
      await Promise.all([
        import('./components/WebBasic.vue').then(module => module.default),
        import('./components/Preview.vue').then(module => module.default)
      ]);

    const windowEditor = windowsModule.addWindow(
      {
        component: WbComponentsWebBasic,
        componentData: {
          model,
          setValue: (value: Value) => (model.value = value)
        },
        options: {
          title: 'WebBasic - Extras 1.3',
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
        model.fsItem = undefined;
        model.output = [];
        model.openValue = undefined;
      }
    });

    let previewWindow: Window;
    model.actions.togglePreview = (toggle = true) => {
      if (toggle) {
        previewWindow = windowsModule.addWindow(
          {
            component: WbComponentsWebBasicPreview,
            componentData: { model },
            options: {
              title: 'Preview - WebBasic - Extras 1.3',
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
            [windowEditor, previewWindow],
            { embed: true }
          );
        });
      } else if (previewWindow) {
        windowEditor.unfocus();
        previewWindow.close();
        window.requestAnimationFrame(() => {
          windowsModule.contentWrapper.setWindowPositions(
            WINDOW_POSITION.SPLIT_HORIZONTAL,
            [windowEditor],
            { embed: true }
          );
          windowEditor.focus();
        });
      }
    };

    screenModule.setTheme(themeBlackContrast);

    return new Promise(resolve => {
      executionResolve();
      windowEditor.events
        .pipe(filter(({ name }) => name === 'close'))
        .subscribe(() => {
          if (previewWindow) {
            previewWindow.close();
          }
          screenModule.setTheme(undefined);
          resolve(true);
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

export enum PROPERTY {
  CONTENT = 'content',
  OUTPUT_TYPE = 'type'
}

export function getDefaultModel() {
  return {
    [WINDOWS_CONFIG_NAMES.HAS_WINDOW_OUTPUT]: false,
    [PROPERTY.CONTENT]: '',
    [PROPERTY.OUTPUT_TYPE]: 'basic'
  };
}
