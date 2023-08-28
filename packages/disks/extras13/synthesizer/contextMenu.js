import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';

import contextMenu from '@web-workbench/core/classes/modules/Windows/contextMenu';

import WbSynthesizerInfo from './components/Info';
import { getKeyboardSizes, getNotes } from './utils';
import { CONFIG_NAMES } from './index';

export default ({
  core,
  mainWindow,
  parentWindow,
  preserveContextMenu,
  model
}) => {
  const { windows } = core.modules;

  function actionClose() {
    return (parentWindow || mainWindow).close();
  }

  const channel = model[CONFIG_NAMES.SYNTHESIZER_CHANNEL];

  return [
    {
      title: 'Synthesizer',
      items: [
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          async action() {
            preserveContextMenu(true);
            const infoWindow = windows.addWindow(
              {
                title: 'Info',
                component: WbSynthesizerInfo,
                componentData: { model },
                options: {
                  prompt: false,
                  scaleX: false,
                  scaleY: false,
                  scrollX: false,
                  scrollY: false
                }
              },
              {
                group: 'extras13Synthesizer'
              }
            );
            await infoWindow.awaitClose();
            preserveContextMenu(false);
            mainWindow.focus();
          }
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          title: 'Test',
          async action() {
            preserveContextMenu(true);
            const { window: testWindow } = model.actions.openTest();
            await testWindow.awaitClose();
            preserveContextMenu(false);
            mainWindow.focus();
          }
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          title: 'Close',
          action: actionClose
        }
      ]
    },
    {
      title: 'Options',
      items: [
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: `BPM (${model[CONFIG_NAMES.SYNTHESIZER_BPM]})`,
          items: [30, 60, 120, 240, 480].map(value => ({
            type: MENU_ITEM_TYPE.RADIO,
            title: String(value),
            model,
            name: CONFIG_NAMES.SYNTHESIZER_BPM,
            value
          }))
        }
      ]
    },
    ...((model[CONFIG_NAMES.SYNTHESIZER_CHANNEL] && [
      {
        title: 'Instrument Options',
        items: [
          {
            type: MENU_ITEM_TYPE.CHECKBOX,
            title: 'Show Note Labels',
            name: CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS,
            model
          },
          {
            type: MENU_ITEM_TYPE.CHECKBOX,
            title: 'Show Keyboard',
            name: CONFIG_NAMES.SYNTHESIZER_SHOW_KEYBOARD,
            model
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: 'Keyboard Size',
            items: Object.entries(getKeyboardSizes()).map(([value, title]) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title,
              model,
              name: CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE,
              value
            }))
          },
          {
            type: MENU_ITEM_TYPE.SEPARATOR
          },
          {
            title: 'Edit Name...',
            action: async () => {
              preserveContextMenu(true);
              const message = 'Instrument renaming:';
              const value = await core.executeCommand(
                `openDialog -title="${message}" -prompt -prompt-value="${channel.name}" -apply="Save" -abort="Cancel"`
              );
              if (value) {
                channel.name = value;
                mainWindow.options.title = channel.name;
              }
              preserveContextMenu(false);
              mainWindow.focus();
            }
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: 'Note Count',
            items: Object.entries(getNotes()).map(([value, title]) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title: `${title} (${value})`,
              model: channel,
              name: 'noteCount',
              value
            }))
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: 'Base Note',
            items: [2, 4, 8, 16].map(value => ({
              type: MENU_ITEM_TYPE.RADIO,
              title: String(value),
              model: channel,
              name: 'baseNote',
              value
            }))
          },
          // {
          //   type: MENU_ITEM_TYPE.DEFAULT,
          //   title: 'Note',
          //   items: Object.entries(getNotes()).map(([value, title]) => ({
          //     type: MENU_ITEM_TYPE.RADIO,
          //     title: `${title} (${value})`,
          //     model,
          //     name: CONFIG_NAMES.SYNTHESIZER_NOTE,
          //     value
          //   }))
          // },
          {
            type: MENU_ITEM_TYPE.SEPARATOR
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: 'Beat Count',
            items: Array(9)
              .fill({})
              .map((v, index) => ({
                type: MENU_ITEM_TYPE.RADIO,
                title: String(index + 1),
                model: channel,
                name: 'beatCount',
                value: index + 1
              }))
          }
        ]
      }
      // {
      //   title: 'Example Notes',
      //   items: Object.entries(EXAMPLE_NOTES).map(([title, notes]) => ({
      //     title,
      //     action() {
      //       channel.notes = notes;
      //     }
      //   }))
      // }
    ]) ||
      []),

    ...contextMenu({ core })
    //     {
    //       type: MENU_ITEM_TYPE.SEPARATOR
    //     },
    //     {
    //       type: MENU_ITEM_TYPE.DEFAULT,
    //       title: 'Start Octave',
    //       items: Array(10)
    //         .fill({})
    //         .map((v, index) => ({
    //           type: MENU_ITEM_TYPE.RADIO,
    //           title: String(index + 1),
    //           model,
    //           name: CONFIG_NAMES.SYNTHESIZER_START_OCTAVE,
    //           value: index + 1
    //         }))
    //     },
    //     {
    //       type: MENU_ITEM_TYPE.DEFAULT,
    //       title: 'Octave Count',
    //       items: Array(10)
    //         .fill({})
    //         .map((v, index) => ({
    //           type: MENU_ITEM_TYPE.RADIO,
    //           title: String(index + 1),
    //           model,
    //           name: CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT,
    //           value: index + 1
    //         }))
    //     }
    //   ]
    // },
    // {
    //   title: 'View',
    //   items: [
    //     {
    //       type: MENU_ITEM_TYPE.RADIO,
    //       title: 'Default',
    //       model,
    //       name: CONFIG_NAMES.SYNTHESIZER_VIEW,
    //       value: 'default'
    //     },
    //     {
    //       type: MENU_ITEM_TYPE.RADIO,
    //       title: 'Record',
    //       model,
    //       name: CONFIG_NAMES.SYNTHESIZER_VIEW,
    //       value: 'record'
    //     }
    //   ]
    // },
  ].filter(Boolean);
};
