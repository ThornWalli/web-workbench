import contextMenu from '@web-workbench/core/modules/Windows/contextMenu';

import { getBaseNotes } from './utils/note';
import { CONFIG_NAMES } from '../types';
import type Core from '@web-workbench/core/classes/Core';
import {
  KEYBOARD_ALIGNMENT_LABEL,
  KEYBOARD_SIZE_LABEL,
  NOTE_COUNT
} from './types';
import type { Model, TrackModel } from './types';
import type Window from '@web-workbench/core/classes/Window';
import { renamingDialog } from './utils';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemUpload
} from '@web-workbench/core/classes/MenuItem';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';

export default defineMenuItems<{
  core: Core;
  mainWindow: Window;
  parentWindow: Window | null;
  preserveContextMenu: (value: boolean) => void;
  model: Model;
  trackModel: TrackModel;
}>(
  ({
    core,
    mainWindow,
    parentWindow,
    preserveContextMenu,
    model,
    trackModel
  }: {
    core: Core;
    mainWindow: Window;
    parentWindow: Window | null;
    preserveContextMenu: (value: boolean) => void;
    model: Model;
    trackModel: TrackModel;
  }) => {
    function actionClose() {
      return (parentWindow || mainWindow).close();
    }

    const project = model[CONFIG_NAMES.SYNTHESIZER_PROJECT];
    const track = trackModel && trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK];

    return [
      new MenuItemInteraction({
        title: 'Synthesizer',
        items: [
          new MenuItemInteraction({
            hotKey: { alt: true, code: KEYBOARD_CODE.KEY_I, title: 'I' },
            title: 'Info',
            async action() {
              return model.actions?.openInfo();
            }
          }),
          new MenuItemSeparator(),
          new MenuItemInteraction({
            title: 'Debug',
            items: [
              new MenuItemInteraction({
                title: 'Notes',
                async action() {
                  if (model.actions?.openDebugNotes) {
                    preserveContextMenu(true);
                    const debugWindow = await model.actions.openDebugNotes();
                    await debugWindow.awaitClose();
                    preserveContextMenu(false);
                    mainWindow.focus();
                  }
                }
              }),
              new MenuItemInteraction({
                title: 'Midi',
                async action() {
                  if (model.actions?.openDebugMidi) {
                    preserveContextMenu(true);
                    const debugWindow = await model.actions.openDebugMidi();
                    await debugWindow.awaitClose();
                    preserveContextMenu(false);
                    mainWindow.focus();
                  }
                }
              }),
              new MenuItemInteraction({
                title: 'Timeline',
                async action() {
                  if (model.actions?.openDebugTimeline) {
                    preserveContextMenu(true);
                    const debugWindow = await model.actions.openDebugTimeline();
                    await debugWindow.awaitClose();
                    preserveContextMenu(false);
                    mainWindow.focus();
                  }
                }
              })
            ]
          }),
          new MenuItemSeparator(),
          new MenuItemInteraction({
            title: 'Close',
            action: actionClose
          })
        ]
      }),
      ...(trackModel
        ? []
        : [
            new MenuItemInteraction({
              title: 'Project',
              items: [
                new MenuItemInteraction({
                  title: 'New…',
                  action: async () => {
                    if (model.actions) {
                      preserveContextMenu(true);
                      await model.actions.newProject();
                      preserveContextMenu(false);
                      mainWindow.focus();
                    }
                  }
                }),
                new MenuItemInteraction({
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
                }),
                new MenuItemInteraction({
                  title: 'Open…',
                  hotKey: { alt: true, code: KEYBOARD_CODE.KEY_O, title: 'O' },
                  action: async () => {
                    await model.actions?.openProject();
                  }
                }),
                new MenuItemInteraction({
                  title: 'Save…',
                  hotKey: { alt: true, code: KEYBOARD_CODE.KEY_S, title: 'S' },
                  action: async () => {
                    return await model.actions?.saveProject();
                  }
                }),
                new MenuItemSeparator(),
                new MenuItemUpload({
                  title: 'Import… (JSON)',
                  hotKey: {
                    alt: true,
                    shift: true,
                    code: KEYBOARD_CODE.KEY_I,
                    title: 'I'
                  },
                  async action({ files }) {
                    return await model.actions?.importProject(files![0]);
                  }
                }),
                new MenuItemInteraction({
                  title: 'Export (JSON)',
                  action: async () => {
                    return await model.actions?.exportProject();
                  }
                })
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
            }),
            new MenuItemInteraction({
              title: 'Track',
              items: [
                new MenuItemInteraction({
                  title: 'New…',
                  action: async () => {
                    if (model.actions) {
                      preserveContextMenu(true);
                      await model.actions.newTrack();
                      preserveContextMenu(false);
                      mainWindow.focus();
                    }
                  }
                }),
                new MenuItemSeparator(),
                new MenuItemInteraction({
                  title: 'Clear',
                  async action() {
                    if (model.actions) {
                      preserveContextMenu(true);
                      await model.actions.clearTracks();
                      preserveContextMenu(false);
                      mainWindow.focus();
                    }
                  }
                })
                // {
                //   title: 'Save',
                //   options: {
                //     disabled: true
                //   }
                // }
              ]
            })
          ]),
      ...((trackModel && [
        new MenuItemInteraction({
          title: 'Track Options',
          items: [
            new MenuItemInteraction({
              type: INTERACTION_TYPE.CHECKBOX,
              title: 'Show Note Labels',
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS,
              model: trackModel
            }),
            new MenuItemInteraction({
              type: INTERACTION_TYPE.CHECKBOX,
              title: 'Show Keyboard',
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_KEYBOARD,
              model: trackModel
            }),
            new MenuItemInteraction({
              title: 'Keyboard Size',
              items: Object.entries(KEYBOARD_SIZE_LABEL).map(
                ([value, title]) =>
                  new MenuItemInteraction({
                    type: INTERACTION_TYPE.RADIO,
                    title,
                    model: trackModel,
                    name: CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE,
                    value
                  })
              )
            }),
            new MenuItemInteraction({
              title: 'Keyboard Alignment',
              items: Object.entries(KEYBOARD_ALIGNMENT_LABEL).map(
                ([value, title]) =>
                  new MenuItemInteraction({
                    type: INTERACTION_TYPE.RADIO,
                    title,
                    model: trackModel,
                    name: CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_ALIGN,
                    value
                  })
              )
            }),
            new MenuItemSeparator(),
            new MenuItemInteraction({
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
            }),
            new MenuItemInteraction({
              title: 'Note Count',
              items: Object.entries(NOTE_COUNT).map(
                ([title, value]) =>
                  new MenuItemInteraction({
                    type: INTERACTION_TYPE.RADIO,
                    title: `${title} (${value})`,
                    model: track,
                    name: 'noteCount',
                    value
                  })
              )
            }),
            new MenuItemInteraction({
              title: 'Base Note',
              items: Object.entries(getBaseNotes()).map(
                ([title, value]) =>
                  new MenuItemInteraction({
                    type: INTERACTION_TYPE.RADIO,
                    title,
                    model: track,
                    name: 'baseNote',
                    value
                  })
              )
            }),
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
            new MenuItemSeparator(),
            new MenuItemInteraction({
              title: 'Beat Count',
              items: Array(9)
                .fill({})
                .map(
                  (v, index) =>
                    new MenuItemInteraction({
                      type: INTERACTION_TYPE.RADIO,
                      title: String(index + 1),
                      model: track,
                      name: 'beatCount',
                      value: index + 1
                    })
                )
            })
          ]
        })
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

      new MenuItemInteraction({
        title: 'Options',
        items: [
          new MenuItemInteraction({
            title: `BPM (${model[CONFIG_NAMES.SYNTHESIZER_BPM]})`,
            items: [30, 60, 120, 240, 480].map(
              value =>
                new MenuItemInteraction({
                  type: INTERACTION_TYPE.RADIO,
                  title: String(value),
                  model,
                  name: CONFIG_NAMES.SYNTHESIZER_BPM,
                  value
                })
            )
          })
        ]
      }),
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
  }
);
