import { unref, reactive } from 'vue';
import Track from './classes/Track';
import { INPUT_OPERTATIONS, KEYBOARD_ALIGNMENT, KEYBOARD_SIZES } from './utils';
import { EXAMPLE_NOTES } from './examples/index';
import Project from './classes/Project';

export default function synthesizer(core) {
  return async ({ modules }) => {
    const { windows } = modules;

    const [SynthesizerProject, SynthesizerTrack, SynthesizerTest] =
      await Promise.all([
        import('./components/Project').then(module => module.default),
        import('./components/Track').then(module => module.default),
        import('./components/Debug').then(module => module.default)
      ]);

    const trackWindows = unref([]);

    const model = reactive(getDefaultModel(core));
    const mainWindow = windows.addWindow(
      {
        title: 'Synthesizer',
        component: SynthesizerProject,
        componentData: { core, model },
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
          console.log(project);
          model[CONFIG_NAMES.SYNTHESIZER_PROJECT] = project;
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
              model: {
                ...{
                  ...model,
                  actions: { openDebug: model.actions.openDebug }
                },
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
      openDebug: () => {
        const window = windows.addWindow(
          {
            title: `Debug`,
            component: SynthesizerTest,
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

    return mainWindow.awaitClose();
  };
}

export const CONFIG_NAMES = {
  SYNTHESIZER_SHOW_NOTE_LABELS: 'extras13_synthesizer_showNoteLabels',
  SYNTHESIZER_SHOW_KEYBOARD: 'extras13_synthesizer_showKeyboard',
  SYNTHESIZER_INSTRUMENT: 'extras13_synthesizer_instrument',
  SYNTHESIZER_START_OCTAVE: 'extras13_synthesizer_startOctave',
  SYNTHESIZER_OCTAVE_COUNT: 'extras13_synthesizer_octaveCount',

  SYNTHESIZER_KEYBOARD_ALIGNMENT: 'extras13_synthesizer_keyboardAlignment',
  SYNTHESIZER_KEYBOARD_SIZE: 'extras13_synthesizer_keyboardSize',

  SYNTHESIZER_DURATION: 'extras13_synthesizer_duration',
  SYNTHESIZER_BEAT_COUNT: 'extras13_synthesizer_beat_count',
  SYNTHESIZER_BASE_NOTE: 'extras13_synthesizer_base_note',
  SYNTHESIZER_NOTE_COUNT: 'extras13_synthesizer_note_count',
  SYNTHESIZER_INPUT_OPERATION: 'extras13_synthesizer_input_operation',
  SYNTHESIZER_BPM: 'extras13_synthesizer_bpm',
  SYNTHESIZER_PROJECT: 'extras13_synthesizer_project',
  SYNTHESIZER_TRACK: 'extras13_synthesizer_track',
  SYNTHESIZER_TRACKS: 'extras13_synthesizer_tracks',
  SYNTHESIZER_INPUT_DOT: 'extras13_synthesizer_input_dot',
  SYNTHESIZER_INPUT_TRIPLET: 'extras13_synthesizer_input_triplet',
  SYNTHESIZER_INPUT_SHARP: 'extras13_synthesizer_input_sharp',
  SYNTHESIZER_INPUT_DOUBLE_SHARP: 'extras13_synthesizer_input_double_sharp'
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

function getDefaultProject() {
  const project = new Project({
    tracks: [
      // new Track({
      //   name: 'Test',
      //   type: 'Synth',
      //   notes: [{ duration: 2.5 }],
      //   beatCount: 2
      // }),
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

function getDefaultTrackModel(track) {
  return {
    [CONFIG_NAMES.SYNTHESIZER_TRACK]: track,
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_ALIGNMENT]: KEYBOARD_ALIGNMENT.TOP,
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE]: KEYBOARD_SIZES.SMALL,
    [CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_DURATION]: '2n',
    [CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    [CONFIG_NAMES.SYNTHESIZER_SHOW_KEYBOARD]: true,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_DOT]: false,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_TRIPLET]: false,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_SHARP]: false,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_DOUBLE_SHARP]: false,
    [CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]: 2
  };
}
export function getDefaultModel() {
  return {
    [CONFIG_NAMES.SYNTHESIZER_PROJECT]: getDefaultProject(),
    [CONFIG_NAMES.SYNTHESIZER_TRACKS]: [
      // new Track({
      //   name: 'Alle Meine Enten',
      //   type: 'Synth',
      //   notes: EXAMPLE_NOTES.alleMeineEnten,
      //   beatCount: 2
      // }),
      // new Track({
      //   name: 'Chocobo Theme V1',
      //   type: 'Synth',
      //   notes: EXAMPLE_NOTES.chocoboThemeV1,
      //   // bpm: 150
      //   baseNote: 8,
      //   noteCount: 8,
      //   beatCount: 4
      // })
      // new Track({
      //   name: 'Chocobo Test',
      //   type: 'Synth',
      //   notes: EXAMPLE_NOTES.chocobo,
      //   bpm: 120
      // }),
      // new Track({
      //   name: 'Test A',
      //   type: 'Synth',
      //   notes: EXAMPLE_NOTES.testA,
      //   bpm: 120
      // })
    ],
    [CONFIG_NAMES.SYNTHESIZER_BPM]: 120

    // // old

    // [CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS]: false,
    // [CONFIG_NAMES.SYNTHESIZER_INSTRUMENT]: 'Synth',
    // [CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]: 2,
    // [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE]: 'small',
    // [CONFIG_NAMES.SYNTHESIZER_DURATION]: '2n',
    // [CONFIG_NAMES.SYNTHESIZER_BEAT_COUNT]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    // [CONFIG_NAMES.SYNTHESIZER_BASE_NOTE]: 4,
    // [CONFIG_NAMES.SYNTHESIZER_NOTE_COUNT]: '4n'
  };
}
