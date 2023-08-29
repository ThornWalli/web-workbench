import { unref, reactive } from 'vue';
import Track from './classes/Track';
import { INPUT_OPERTATIONS, KEYBOARD_ALIGNMENT, KEYBOARD_SIZES } from './utils';
import { EXAMPLE_NOTES } from './examples/index';

export default function synthesizer(core) {
  return async ({ modules }) => {
    const { windows } = modules;

    const [SynthesizerTracks, SynthesizerTrack, SynthesizerTest] =
      await Promise.all([
        import('./components/Tracks').then(module => module.default),
        import('./components/Track').then(module => module.default),
        import('./components/Debug').then(module => module.default)
      ]);

    const trackWindows = unref([]);

    const model = reactive(getDefaultModel(core));
    const mainWindow = windows.addWindow(
      {
        title: 'Synthesizer',
        component: SynthesizerTracks,
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
      newProject: () => {
        // empty
      },
      newTrack: () => {
        // empty
      },

      editTrack: (channel, modelOverides = {}) => {
        const window = windows.addWindow(
          {
            title: `Track: ${channel.name}`,
            component: SynthesizerTrack,
            componentData: {
              parentWindow: mainWindow,
              model: {
                ...{
                  ...model,
                  actions: { openDebug: model.actions.openDebug }
                },
                ...getDefaultTrackModel(channel),
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
          close: mainWindow.awaitClose(),
          ready: mainWindow.awaitReady()
        };
      },
      openDebug: () => {
        const window = windows.addWindow(
          {
            title: `Test`,
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
          close: mainWindow.awaitClose(),
          ready: mainWindow.awaitReady()
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
  SYNTHESIZER_CHANNEL: 'extras13_synthesizer_track',
  SYNTHESIZER_CHANNELS: 'extras13_synthesizer_tracks',
  SYNTHESIZER_INPUT_DOT: 'extras13_synthesizer_input_dot',
  SYNTHESIZER_INPUT_TRIPLET: 'extras13_synthesizer_input_triplet'
};

export const CONFIG_DEFAULTS = {};
function getDefaultTrackModel(channel) {
  return {
    [CONFIG_NAMES.SYNTHESIZER_CHANNEL]: channel,
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_ALIGNMENT]: KEYBOARD_ALIGNMENT.TOP,
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE]: KEYBOARD_SIZES.SMALL,
    [CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_DURATION]: '2n',
    [CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    [CONFIG_NAMES.SYNTHESIZER_SHOW_KEYBOARD]: true,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_DOT]: false,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_TRIPLET]: false,
    [CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]: 1,
    [CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]: 6
  };
}
export function getDefaultModel() {
  return {
    [CONFIG_NAMES.SYNTHESIZER_CHANNELS]: [
      new Track({
        name: 'Alle Meine Enten',
        type: 'Synth',
        notes: EXAMPLE_NOTES.alleMeineEnten,
        bpm: 480,
        beatCount: 2
      })
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
    [CONFIG_NAMES.SYNTHESIZER_BPM]: 120,

    // old

    [CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_INSTRUMENT]: 'Synth',
    [CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]: 2,
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE]: 'small',
    [CONFIG_NAMES.SYNTHESIZER_DURATION]: '2n',
    [CONFIG_NAMES.SYNTHESIZER_BEAT_COUNT]: 4,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    [CONFIG_NAMES.SYNTHESIZER_BASE_NOTE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_NOTE_COUNT]: '4n'
  };
}
