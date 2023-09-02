import { unref, reactive } from 'vue';
import { formatFilenameDate } from '@web-workbench/core/utils/date';
import { paramCase } from 'change-case';
import {
  INPUT_MODIFICATIONS,
  INPUT_OPERTATIONS,
  KEYBOARD_ALIGNMENT,
  KEYBOARD_SIZES
} from './types';
import { EXAMPLE_NOTES } from './examples/index';

export default function synthesizer(core) {
  return async ({ modules }) => {
    const { windows } = modules;

    const [MidiController, Track, Project] = await Promise.all([
      import('./classes/MidiController').then(module => module.default),
      import('./classes/Track').then(module => module.default),
      import('./classes/Project').then(module => module.default)
    ]);

    const midiController = new MidiController();
    midiController.start();

    const [
      SynthesizerProject,
      SynthesizerTrack,
      SynthesizerDebugNotes,
      SynthesizerDebugMidi
    ] = await Promise.all([
      import('./components/Project').then(module => module.default),
      import('./components/Track').then(module => module.default),
      import('./components/debug/Notes').then(module => module.default),
      import('./components/debug/Midi').then(module => module.default)
    ]);

    const trackWindows = unref([]);

    const model = reactive(await getDefaultModel(core));
    const mainWindow = windows.addWindow(
      {
        title: 'Synthesizer',
        component: SynthesizerProject,
        componentData: { core, midiController, model },
        options: {
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

    model.actions = {
      removeTrack: async track => {
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
        model.fsItem = await core.executeCommand(
          `saveFileDialog --data="${value}" --extension="json"`
        );
        return model.fsItem;
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
            `${formatFilenameDate(new Date())}-${paramCase(project.name)}.json`
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

      editTrack: (track, modelOverides = {}) => {
        const window = windows.addWindow(
          {
            title: `Track: ${track.name}`,
            component: SynthesizerTrack,
            componentData: {
              parentWindow: mainWindow,
              model,
              trackModel: {
                ...getDefaultTrackModel(track),
                ...modelOverides
              }
            },

            options: {
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
        trackWindows.push(window);

        return {
          window,
          close: window.awaitClose().then(() => new Track(track)),
          ready: window.awaitReady()
        };
      },

      openDebugNotes: () => {
        const window = windows.addWindow(
          {
            title: `Debug Notes`,
            component: SynthesizerDebugNotes,
            componentData: {
              parentWindow: mainWindow
            },

            options: {
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
        trackWindows.push(window);
        return {
          window,
          close: window.awaitClose(),
          ready: window.awaitReady()
        };
      },

      openDebugMidi: () => {
        const window = windows.addWindow(
          {
            title: `Debug Midi`,
            component: SynthesizerDebugMidi,
            componentData: {
              midiController,
              parentWindow: mainWindow
            },

            options: {
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
        trackWindows.push(window);
        return {
          window,
          close: window.awaitClose(),
          ready: window.awaitReady()
        };
      },

      closeTracks: () => {
        trackWindows.forEach(window => window.close());
      },
      close: () => {
        trackWindows.forEach(window => window.close());
        mainWindow.close();
      },
      focus: () => {
        mainWindow.focus();
      }
    };
  };
}
export const CONFIG_NAMES = {
  SYNTHESIZER_BPM: 'extras13_synthesizer_bpm',
  SYNTHESIZER_PROJECT: 'extras13_synthesizer_project',
  SYNTHESIZER_TRACK: 'extras13_synthesizer_track',

  SYNTHESIZER_TRACK_SHOW_NOTE_LABELS: 'extras13_synthesizer_showNoteLabels',
  SYNTHESIZER_TRACK_SHOW_KEYBOARD: 'extras13_synthesizer_showKeyboard',
  SYNTHESIZER_TRACK_INSTRUMENT: 'extras13_synthesizer_instrument',
  SYNTHESIZER_TRACK_START_OCTAVE: 'extras13_synthesizer_startOctave',
  SYNTHESIZER_TRACK_OCTAVE_COUNT: 'extras13_synthesizer_octaveCount',

  SYNTHESIZER_TRACK_KEYBOARD_ALIGN: 'extras13_synthesizer_keyboardAlign',
  SYNTHESIZER_TRACK_KEYBOARD_SIZE: 'extras13_synthesizer_keyboardSize',

  SYNTHESIZER_TRACK_DURATION: 'extras13_synthesizer_duration',
  SYNTHESIZER_TRACK_BEAT_COUNT: 'extras13_synthesizer_beat_count',
  SYNTHESIZER_TRACK_BASE_NOTE: 'extras13_synthesizer_base_note',
  SYNTHESIZER_TRACK_NOTE_COUNT: 'extras13_synthesizer_note_count',
  SYNTHESIZER_TRACK_INPUT_OPERATION: 'extras13_synthesizer_input_operation',
  SYNTHESIZER_TRACK_INPUT_DOT: 'extras13_synthesizer_input_dot',
  SYNTHESIZER_TRACK_INPUT_TRIPLET: 'extras13_synthesizer_input_triplet',
  SYNTHESIZER_TRACK_INPUT_MODIFICATION:
    'extras13_synthesizer_input_modification'
};

export const CONFIG_DEFAULTS = {};

export function renamingDialog(core, message, defaultValue = '') {
  return core.executeCommand(
    `openDialog -title="${message}" -prompt -prompt-value="${defaultValue}" -apply="Save" -abort="Cancel"`
  );
}
export function confirmDialog(core, message) {
  return core.executeCommand(`openDialog "${message}" -confirm`);
}

async function getDefaultProject() {
  const [Track, Project] = await Promise.all([
    import('./classes/Track').then(module => module.default),
    import('./classes/Project').then(module => module.default)
  ]);

  const project = new Project({
    tracks: [
      new Track({
        name: 'Test',
        type: 'Synth',
        notes: [
          { name: 'C2', time: '2n' },
          { name: 'C5', time: '2n' },
          { name: 'C4', time: '4n' },
          { name: 'fb3', time: '2n' }
          // { name: 'Cbb4', time: '4t.' },
          // { name: 'GB4', time: '4t.' }
          // { name: 'BB5', time: '4n' },
          // { name: 'BBB5', time: '4n' }
        ],
        beatCount: 2
      }),
      new Track({
        name: 'Alle Meine Enten',
        type: 'Synth',
        notes: EXAMPLE_NOTES.alleMeineEnten,
        beatCount: 2
      }),
      new Track({
        name: 'Chocobo Theme V1',
        type: 'Synth',
        notes: EXAMPLE_NOTES.chocoboThemeV1,
        // bpm: 150
        baseNote: 8,
        noteCount: 8,
        beatCount: 4
      })
    ]
  });
  return project;
}

export function getDefaultTrackModel(track) {
  return {
    [CONFIG_NAMES.SYNTHESIZER_TRACK]: track,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_ALIGN]: KEYBOARD_ALIGNMENT.TOP,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE]: KEYBOARD_SIZES.SMALL,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_DURATION]: '2n',
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_KEYBOARD]: true,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_DOT]: false,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_TRIPLET]: false,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION]:
      INPUT_MODIFICATIONS.NATURAL,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE]: 3,
    [CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT]: 2
  };
}
export async function getDefaultModel() {
  return {
    [CONFIG_NAMES.SYNTHESIZER_PROJECT]: await getDefaultProject(),
    [CONFIG_NAMES.SYNTHESIZER_BPM]: 120

    // // old

    // [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS]: false,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_INSTRUMENT]: 'Synth',
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT]: 2,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE]: 'small',
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_DURATION]: '2n',
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_BEAT_COUNT]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_BASE_NOTE]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_TRACK_NOTE_COUNT]: '4n'
  };
}
