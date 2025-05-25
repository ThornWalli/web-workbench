import { btoa, unwrapString } from '@web-workbench/core/utils/helper';

import type Core from '@web-workbench/core/classes/Core';
import { markRaw } from 'vue';

import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '@web-workbench/core/modules/Windows/utils';
import type { ExecuteCallbackOptions } from '@web-workbench/core/classes/Core/types';
import type { CallbackMessage } from '@web-workbench/core/classes/BasicInterpreter';
import { CONFIG_NAME, PROPERTY, type Model } from './types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import { KEYBOARD_CODE } from '@web-workbench/core/services/dom';

export default defineMenuItems(
  ({ core, model }: { core: Core; model: Model }) => {
    return [
      new MenuItemInteraction({
        order: 0,
        title: 'Editor',
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
            action() {
              return model.actions?.openInfo();
            }
          }),
          new MenuItemInteraction({
            title: 'Close',
            action() {
              return model.actions?.close();
            }
          })
        ]
      }),
      new MenuItemInteraction({
        order: 1,
        title: 'Document Settings',
        items: [
          new MenuItemInteraction<WINDOWS_CONFIG_NAMES>({
            title: 'Has Window Output',
            type: INTERACTION_TYPE.CHECKBOX,
            name: WINDOWS_CONFIG_NAMES.HAS_WINDOW_OUTPUT,
            model: model.value
          })
        ]
      }),

      new MenuItemInteraction({
        order: 1,
        title: 'Run',
        hotKey: { code: KEYBOARD_CODE.KEY_R, title: 'R' },
        action: actionRun
      }),
      new MenuItemInteraction<CONFIG_NAME>({
        order: 2,
        title: 'Preview',
        type: INTERACTION_TYPE.CHECKBOX,
        name: CONFIG_NAME.WEB_BASIC_SHOW_PREVIEW,
        model: core.config.observable,
        action(checked: boolean) {
          return core.config.set(CONFIG_NAME.WEB_BASIC_SHOW_PREVIEW, checked);
        }
      })
    ];

    function actionNew() {
      model.actions?.reset();
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
          `saveFileDialog --data="${convertedValue}" --extension="bs"`
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
          model.value = value;
        } else {
          throw new Error("Can't read file content");
        }
      }
    }

    async function actionRun() {
      const lines: CallbackMessage[] = [];
      await core.modules.parser?.parseBasic(
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
  }
);
