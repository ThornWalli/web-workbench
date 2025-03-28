import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';

import contextMenu from '@web-workbench/core/classes/modules/Windows/contextMenu';

import WbSynthesizerInfo from './components/Info';
import {
  getBaseNotes,
  getKeyboardAlignment,
  getKeyboardSizes,
  getNoteCount
} from './utils';
import { CONFIG_NAMES, renamingDialog } from './synthesizer';

export default ({
  core,
  mainWindow,
  parentWindow,
  preserveContextMenu,
  model,
  trackModel
}) => {
  const { windows } = core.modules;

  function actionClose() {
    return (parentWindow || mainWindow).close();
  }

  const project = model[CONFIG_NAMES.SYNTHESIZER_PROJECT];
  const track = trackModel && trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK];

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
          items: [
            {
              title: 'Notes',
              async action() {
                preserveContextMenu(true);
                const { window: debugWindow } = model.actions.openDebugNotes();
                await debugWindow.awaitClose();
                preserveContextMenu(false);
                mainWindow.focus();
              }
            },
            {
              title: 'Midi',
              async action() {
                preserveContextMenu(true);
                const { window: debugWindow } = model.actions.openDebugMidi();
                await debugWindow.awaitClose();
                preserveContextMenu(false);
                mainWindow.focus();
              }
            },
            {
              title: 'Timeline',
              async action() {
                preserveContextMenu(true);
                const { window: debugWindow } =
                  model.actions.openDebugTimeline();
                await debugWindow.awaitClose();
                preserveContextMenu(false);
                mainWindow.focus();
              }
            }
          ]
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
    ...(trackModel
      ? []
      : [
          {
            title: 'Project',
            items: [
              {
                title: 'New…',
                action: async () => {
                  preserveContextMenu(true);
                  await model.actions.newProject();
                  preserveContextMenu(false);
                  mainWindow.focus();
                }
              },
              {
                title: 'Edit Name…',
                action: async () => {
                  preserveContextMenu(true);
                  const value = await renamingDialog(
                    core,
                    'Project renaming:',
                    project.name
                  );
                  if (value) {
                    project.name = value;
                    // mainWindow.options.title = track.name;
                  }
                  preserveContextMenu(false);
                  mainWindow.focus();
                }
              },
              {
                title: 'Open…',
                hotKey: 'O',
                keyCode: 79,
                action: async () => {
                  await model.actions.openProject();
                }
              },
              {
                title: 'Save…',
                hotKey: 'S',
                keyCode: 83,
                action: async () => {
                  return await model.actions.saveProject();
                }
              },
              {
                type: MENU_ITEM_TYPE.SEPARATOR
              },
              {
                title: 'Import… (JSON)',
                hotKey: 'S',
                keyCode: 83,
                type: MENU_ITEM_TYPE.UPLOAD,
                async action(files) {
                  return await model.actions.importProject(files[0]);
                }
              },
              {
                title: 'Export (JSON)',
                action: async () => {
                  return await model.actions.exportProject();
                }
              }
              // {
              //   title: 'New',
              //   action: () => {
              //     model.actions.new();
              //   }
              // },
              // {
              //   title: 'Open',
              //   options: {
              //     disabled: true
              //   }
              // },
              // {
              //   type: MENU_ITEM_TYPE.SEPARATOR
              // },
              // {
              //   title: 'Save',
              //   options: {
              //     disabled: true
              //   }
              // }
            ]
          },
          {
            title: 'Track',
            items: [
              {
                title: 'New…',
                action: async () => {
                  preserveContextMenu(true);
                  await model.actions.newTrack();
                  preserveContextMenu(false);
                  mainWindow.focus();
                }
              },
              {
                type: MENU_ITEM_TYPE.SEPARATOR
              },
              {
                title: 'Clear',
                async action() {
                  preserveContextMenu(true);
                  await model.actions.clearTracks();
                  preserveContextMenu(false);
                  mainWindow.focus();
                }
              }
              // {
              //   title: 'Save',
              //   options: {
              //     disabled: true
              //   }
              // }
            ]
          }
        ]),
    ...((trackModel && [
      {
        title: 'Track Options',
        items: [
          {
            type: MENU_ITEM_TYPE.CHECKBOX,
            title: 'Show Note Labels',
            name: CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS,
            model: trackModel
          },
          {
            type: MENU_ITEM_TYPE.CHECKBOX,
            title: 'Show Keyboard',
            name: CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_KEYBOARD,
            model: trackModel
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: 'Keyboard Size',
            items: Object.entries(getKeyboardSizes()).map(([value, title]) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title,
              model: trackModel,
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE,
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
                model: trackModel,
                name: CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_ALIGN,
                value
              })
            )
          },
          {
            type: MENU_ITEM_TYPE.SEPARATOR
          },
          {
            title: 'Edit Name…',
            action: async () => {
              preserveContextMenu(true);
              const value = await renamingDialog(
                core,
                'Track renaming:',
                track.name
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
          //     name: CONFIG_NAMES.SYNTHESIZER_TRACK_NOTE,
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
    //           name: CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE,
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
    //           name: CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT,
    //           value: index + 1
    //         }))
    //     }
    //   ]
    // },
  ].filter(Boolean);
};
