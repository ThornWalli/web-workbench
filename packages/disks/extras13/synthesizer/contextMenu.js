import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';

import contextMenu from '@web-workbench/core/classes/modules/Windows/contextMenu';

import WbSynthesizerInfo from './components/Info';
import {
  getBaseNotes,
  getKeyboardAlignment,
  getKeyboardSizes,
  getNoteCount
} from './utils';
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

  const track = model[CONFIG_NAMES.SYNTHESIZER_TRACK];

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
          title: 'Debug',
          hotKey: 'D',
          async action() {
            preserveContextMenu(true);
            const { window: debugWindow } = model.actions.openDebug();
            await debugWindow.awaitClose();
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
    // {
    //   title: 'Project',
    //   items: [
    //     {
    //       title: 'New',
    //       action: () => {
    //         model.actions.new();
    //       }
    //     },
    //     {
    //       title: 'Open',
    //       options: {
    //         disabled: true
    //       }
    //     },
    //     {
    //       type: MENU_ITEM_TYPE.SEPARATOR
    //     },
    //     {
    //       title: 'Save',
    //       options: {
    //         disabled: true
    //       }
    //     }
    //   ]
    // },
    // {
    //   title: 'Track',
    //   items: [
    //     {
    //       title: 'New',
    //       action: () => {
    //         model.actions.new();
    //       }
    //     },
    //     {
    //       title: 'Open',
    //       options: {
    //         disabled: true
    //       }
    //     },
    //     {
    //       type: MENU_ITEM_TYPE.SEPARATOR
    //     },
    //     {
    //       title: 'Save',
    //       options: {
    //         disabled: true
    //       }
    //     }
    //   ]
    // },
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
    ...((model[CONFIG_NAMES.SYNTHESIZER_TRACK] && [
      {
        title: 'Track Options',
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
            type: MENU_ITEM_TYPE.DEFAULT,
            title: 'Keyboard Alignment',
            items: Object.entries(getKeyboardAlignment()).map(
              ([value, title]) => ({
                type: MENU_ITEM_TYPE.RADIO,
                title,
                model,
                name: CONFIG_NAMES.SYNTHESIZER_KEYBOARD_ALIGNMENT,
                value
              })
            )
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
                `openDialog -title="${message}" -prompt -prompt-value="${track.name}" -apply="Save" -abort="Cancel"`
              );
              if (value) {
                track.name = value;
                mainWindow.options.title = track.name;
              }
              preserveContextMenu(false);
              mainWindow.focus();
            }
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: 'Note Count',
            items: Object.entries(getNoteCount()).map(([title, value]) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title: `${title} (${value})`,
              model: track,
              name: 'noteCount',
              value
            }))
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: 'Base Note',
            items: Object.entries(getBaseNotes()).map(([title, value]) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title,
              model: track,
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
                model: track,
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
      //       track.notes = notes;
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
  ].filter(Boolean);
};
