import {
  defineMenuItems,
  MENU_ITEM_TYPE
} from '@web-workbench/core/classes/MenuItem';
import { btoa, unwrapString } from '@web-workbench/core/utils/helper';
import WbComponentsWebBasicInfo from './components/Info.vue';

import { PROPERTY, CONFIG_NAMES } from '.';
import type Core from '@web-workbench/core/classes/Core';
import { markRaw } from 'vue';
import type Windows from '@web-workbench/core/classes/modules/Windows';
import type Parser from '@web-workbench/core/classes/modules/Parser';
import type { Model } from '.';
import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '@web-workbench/core/classes/modules/Windows/utils';
import type { ExecuteCallbackOptions } from '@web-workbench/core/classes/Core/types';
import type { CallbackMessage } from '@web-workbench/core/classes/BasicInterpreter';

export default defineMenuItems(
  ({ core, model }: { core: Core; model: Model }) => {
    const windows = (core.modules.windows || {}) as Windows;
    const parser = (core.modules.parser || {}) as Parser;

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
            name: WINDOWS_CONFIG_NAMES.HAS_WINDOW_OUTPUT,
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
        action(checked: boolean) {
          return core.config.set(CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW, checked);
        }
      }
    ];

    function actionNew() {
      model.actions.reset?.();
    }

    function actionSave() {
      return save();
    }

    function actionSaveAs() {
      return save(true);
    }

    async function save(saveAs = false) {
      const value = {
        ...model.value,
        content: model.value[PROPERTY.CONTENT].split(/\n/g)
      };
      const convertedValue = await btoa(JSON.stringify(value));
      let item;
      if (!saveAs && model.fsItem) {
        item = await core.executeCommand(
          `editfile "${model.fsItem.getPath()}" --data="${convertedValue}"`
        );
        if (item) {
          return core.executeCommand('openDialog "File saved."');
        } else {
          return core.executeCommand('openDialog "File could not be saved."');
        }
      } else {
        const fsItem = await core.executeCommand(
          `saveFileDialog --data="${value}" --extension="bs"`
        );
        if (fsItem) {
          model.fsItem = markRaw(fsItem);
          return model.fsItem;
        }
        return null;
      }
    }

    async function actionOpen() {
      const data = await core.executeCommand('openFileDialog');
      if (data) {
        if (PROPERTY.CONTENT in data.value) {
          const value = {
            ...data.value,
            [PROPERTY.CONTENT]: []
              .concat(data.value[PROPERTY.CONTENT])
              .join('\n')
          };
          model.fsItem = data.fsItem;
          model.openValue = value;
        } else {
          throw new Error("Can't read file content");
        }
      }
    }

    async function actionRun() {
      const lines: CallbackMessage[] = [];
      await parser.parseBasic(
        model.value[PROPERTY.CONTENT].split(/\n/),
        async (value: string, options: ExecuteCallbackOptions) => {
          const parsedValue = await core.executeCommand(value, options);
          if (options.message) {
            if (Array.isArray(options.message)) {
              lines.push(...options.message);
            } else {
              lines.push(options.message);
            }
          }
          return parsedValue;
        }
      );
      model.output = lines.map(line => unwrapString(line));
    }

    function actionClose() {
      return model.actions.close?.();
    }

    function actionInfo() {
      windows.addWindow(
        {
          component: WbComponentsWebBasicInfo,
          componentData: {
            model
          },
          options: {
            title: 'Info',
            scaleX: false,
            scaleY: false,
            scrollX: false,
            scrollY: false
          }
        },
        {
          group: 'extras13WebBasic'
        }
      );
    }
  }
);
