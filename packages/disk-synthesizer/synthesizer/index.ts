import { unref, reactive, type Reactive } from 'vue';
import { formatFilenameDate } from '@web-workbench/core/utils/date';
import { snakeCase } from 'change-case';
import type { Model, TrackModel } from './types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import {
  ITEM_META,
  type ItemActionCallback
} from '@web-workbench/core/classes/FileSystem/types';
import { CONFIG_NAMES, SYMBOL } from '../types';
import type Window from '@web-workbench/core/classes/Window';
import type Track from './classes/Track';
import {
  confirmDialog,
  getDefaultModel,
  getDefaultTrackModel,
  renamingDialog
} from './utils';
// import { EXAMPLE_NOTES } from './examples/EXAMPLE_NOTES';

export default defineFileItems(() => {
  return [
    {
      id: 'Synthesizer.app',
      name: 'Synthesizer',
      meta: [
        [ITEM_META.SYMBOL, SYMBOL.SYNTHESIZER],
        [ITEM_META.POSITION, { x: 10, y: 5 }],
        [ITEM_META.IGNORE_SYMBOL_REARRANGE, true]
      ],
      createdDate: new Date(2023, 8, 4).getTime(),
      editedDate: new Date(2023, 8, 4).getTime(),
      action: action()
    }
  ];
});

function action(): ItemActionCallback {
  return async core => {
    let infoWindow: Window | undefined;
    let debugTimelineWindow: Window | undefined;
    let debugMidiWindow: Window | undefined;
    let debugNotesWindow: Window | undefined;
    let editTrackWindow: Window | undefined;

    const [MidiController, Track, Project] = await Promise.all([
      import('./classes/MidiController').then(module => module.default),
      import('./classes/Track').then(module => module.default),
      import('./classes/Project').then(module => module.default)
    ]);

    const midiController = new MidiController();
    midiController.start();

    const trackWindows = unref<Window[]>([]);

    const model = reactive<Model>(await getDefaultModel());
    const mainWindow = core.modules.windows?.addWindow(
      {
        component: await import('./components/Project.vue').then(
          module => module.default
        ),
        componentData: { core, midiController, model },
        options: {
          title: 'Synthesizer',
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: true,
          embed: true,
          borderless: true
        }
      },
      {
        group: 'extras13Synthesizer',
        full: true
      }
    );

    mainWindow?.awaitClose().then(() => {
      infoWindow?.close();
      debugTimelineWindow?.close();
      debugMidiWindow?.close();
      debugNotesWindow?.close();
      editTrackWindow?.close();
    });

    model.actions = {
      openInfo: () => openInfo(model),
      removeTrack: async (track: Track) => {
        const value = await confirmDialog(
          core,
          `Remove Track \\"${track.name}\\" from Project??`
        );
        if (value) {
          model[CONFIG_NAMES.SYNTHESIZER_PROJECT].tracks = model[
            CONFIG_NAMES.SYNTHESIZER_PROJECT
          ].tracks.filter(t => t !== track);
        }
      },

      clearTracks: async () => {
        const value = await confirmDialog(
          core,
          'Remove all Tracks from Project??'
        );
        if (value) {
          model[CONFIG_NAMES.SYNTHESIZER_PROJECT].tracks = [];
        }
      },

      newProject: async () => {
        const project = new Project();
        const name = await renamingDialog(core, 'New Project:', project.name);
        if (name) {
          project.name = name;
          model[CONFIG_NAMES.SYNTHESIZER_PROJECT] = project;
        }
      },
      openProject: async () => {
        const data = await core.executeCommand('openFileDialog');
        if (data) {
          const project = new Project(data.value);
          model[CONFIG_NAMES.SYNTHESIZER_PROJECT] = project;
        }
      },

      saveProject: async () => {
        const value = await btoa(
          JSON.stringify(model[CONFIG_NAMES.SYNTHESIZER_PROJECT])
        );
        const fsItem = await core.executeCommand(
          `saveFileDialog --data="${value}" --extension="json"`
        );
        model.fsItem = fsItem;
        return fsItem;
      },

      importProject: async file => {
        const project = new Project(JSON.parse(await file.text()));
        model[CONFIG_NAMES.SYNTHESIZER_PROJECT] = project;
      },

      exportProject: async () => {
        const FileSaver = await import('file-saver').then(
          module => module.default
        );

        try {
          const project = model[CONFIG_NAMES.SYNTHESIZER_PROJECT];
          const blob = new Blob([JSON.stringify(project)], {
            type: 'application/json;charset=utf-8'
          });

          await FileSaver.saveAs(
            blob,
            `${formatFilenameDate(new Date())}_${snakeCase(project.name)}.json`
          );
        } catch (error) {
          console.error('An error occurred during export.', error);
        }
      },

      newTrack: async () => {
        const track = new Track();
        const name = await renamingDialog(core, 'New Track:', track.name);
        if (name) {
          track.name = name;
          console.log(track);
          model[CONFIG_NAMES.SYNTHESIZER_PROJECT].tracks.push(track);
        }
      },

      editTrack,
      openDebugNotes,
      openDebugMidi,
      openDebugTimeline,

      closeTracks: () => {
        trackWindows.forEach(window => window.close());
      },
      close: () => {
        trackWindows.forEach(window => window.close());
        mainWindow?.close();
      },
      focus: () => {
        mainWindow?.focus();
      }
    };

    async function openInfo(model: Reactive<Model>) {
      if (infoWindow) {
        return infoWindow;
      }
      infoWindow = core.modules.windows!.addWindow(
        {
          component: await import('./components/Info.vue').then(
            module => module.default
          ),
          componentData: { model },
          options: {
            title: 'Info'
          }
        },
        {
          group: 'extras13Synthesizer'
        }
      );

      infoWindow.awaitClose().then(() => {
        infoWindow = undefined;
      });
      return infoWindow;
    }

    async function openDebugTimeline() {
      debugTimelineWindow = core.modules.windows!.addWindow(
        {
          parentWindow: mainWindow,
          component: await import('./components/debug/Timeline.vue').then(
            module => module.default
          ),
          componentData: {
            midiController,
            parentWindow: mainWindow
          },

          options: {
            title: `Debug Timeline`,
            scaleX: false,
            scaleY: true,
            scrollX: false,
            scrollY: true
          }
        },
        {
          group: 'extras13Synthesizer',
          full: true
        }
      );
      debugTimelineWindow.awaitClose().then(() => {
        debugTimelineWindow = undefined;
      });
      return debugTimelineWindow;
    }

    async function openDebugMidi() {
      debugMidiWindow = core.modules.windows!.addWindow(
        {
          parentWindow: mainWindow,
          component: await import('./components/debug/Midi.vue').then(
            module => module.default
          ),
          componentData: {
            midiController,
            parentWindow: mainWindow
          },

          options: {
            title: `Debug Midi`,
            scaleX: false,
            scaleY: true,
            scrollX: false,
            scrollY: true
          }
        },
        {
          group: 'extras13Synthesizer',
          full: true
        }
      );
      debugMidiWindow.awaitClose().then(() => {
        debugMidiWindow = undefined;
      });
      return debugMidiWindow;
    }

    async function openDebugNotes() {
      debugNotesWindow = core.modules.windows!.addWindow(
        {
          parentWindow: mainWindow,
          component: await import('./components/debug/Notes.vue').then(
            module => module.default
          ),
          componentData: {
            parentWindow: mainWindow
          },

          options: {
            title: `Debug Notes`,
            scaleX: false,
            scaleY: true,
            scrollX: false,
            scrollY: true
          }
        },
        {
          group: 'extras13Synthesizer',
          full: true
        }
      );
      debugNotesWindow.awaitClose().then(() => {
        debugNotesWindow = undefined;
      });
      return debugNotesWindow;
    }

    async function editTrack(
      track: Track,
      modelOverides?: Partial<TrackModel>
    ) {
      editTrackWindow = core.modules.windows!.addWindow(
        {
          parentWindow: mainWindow,
          component: await import('./components/Track.vue').then(
            module => module.default
          ),
          componentData: {
            parentWindow: mainWindow,
            model,
            trackModel: {
              ...getDefaultTrackModel(track),
              ...modelOverides
            }
          },

          options: {
            title: `Track: ${track.name}`,
            scaleX: false,
            scaleY: true,
            scrollX: false,
            scrollY: false
          }
        },
        {
          group: 'extras13Synthesizer',
          full: true
        }
      );
      editTrackWindow?.awaitClose().then(() => {
        editTrackWindow = undefined;
      });

      // model.actions?.openDebugMidi();
      // model.actions?.openDebugNotes();
      // model.actions?.openDebugTimeline();

      return {
        window: editTrackWindow,
        close: editTrackWindow.awaitClose().then(() => new Track(track)),
        ready: editTrackWindow.awaitReady()
      };
    }
  };
}
