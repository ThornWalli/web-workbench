import { unref, reactive } from 'vue';
import Track from './classes/Track';
import { INPUT_OPERTATIONS } from './utils';

export default function synthesizer(core) {
  return async ({ modules }) => {
    const { windows } = modules;

    const [SynthesizerTracks, SynthesizerTrack, SynthesizerTest] =
      await Promise.all([
        import('./components/Tracks').then(module => module.default),
        import('./components/Track').then(module => module.default),
        import('./components/Test').then(module => module.default)
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
      editTrack: (channel, modelOverides = {}) => {
        console.log('channel', channel);
        const window = windows.addWindow(
          {
            title: `Track: ${channel.name}`,
            component: SynthesizerTrack,
            componentData: {
              parentWindow: mainWindow,
              model: {
                ...{ ...model, actions: undefined },
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
      openTest: () => {
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

export const getOcatveNotes = (start, length, time = '8n') => {
  const notes = [];

  for (let i = start; i < start + length; i++) {
    notes.push(
      { name: `C${i}`, time },
      { name: `D${i}`, time },
      { name: `E${i}`, time },
      { name: `F${i}`, time },
      { name: `G${i}`, time },
      { name: `A${i}`, time },
      { name: `B${i}`, time },
      { name: `C${i + 1}`, time }
    );
  }
  return notes;
};

export const EXAMPLE_NOTES = {
  getOcatveNotes,
  test2000: [
    // { name: 'C2', time: '8n' },
    // { name: 'C5', time: '2n' },
    // { name: 'C6', time: '2n' }
    // { name: 'Cx4', time: '8n' },
    // { name: 'Dx4', time: '8n' }
    // { name: 'C4', time: '8n' },
    // { name: 'D4', time: '8n' },
    // { name: 'E4', time: '8n' },
    // { name: 'F4', time: '8n' },
    // { name: 'G4', time: '8n' },
    // { name: 'B4', time: '8n' },
    // { name: 'D5', time: '8n' },
    // { name: 'E5', time: '8n' },
    // { name: 'F5', time: '2n' }
    // { name: 'E4', time: '8n' }
    // { name: 'F4', time: '8n' },
    // { name: 'G4', time: '8n' },
    // { name: 'A4', time: '8n' },
    // { name: 'B4', time: '8n' },
    // { name: 'C5', time: '8n' }
    // { name: 'C5', time: '8n' },
    // { name: 'B4', time: '8n' },
    // { name: 'A4', time: '8n' },
    // { name: 'G4', time: '8n' },
    // { name: 'F4', time: '8n' },
    // { name: 'E4', time: '8n' },
    // { name: 'D4', time: '8n' },
    // { name: 'C4', time: '8n' },
    // { name: 'D4', time: '8n' },
    // { name: 'C4', time: '8n' },
    // { name: 'D4', time: '8n' },
    // { name: 'C4', time: '8n' },
    // { name: 'C4', time: '8n' },
    // { name: 'D4', time: '8n' },
    // { name: 'C4', time: '8n' },
    // { name: 'D4', time: '8n' }
    // { name: 'C4', time: '8n' },
    // { name: 'D4', time: '8n' },
    // { name: 'E4', time: '8n' },
    // { name: 'F4', time: '8n' },
    // { name: 'G4', time: '8n' },
    // { name: 'A4', time: '8n' },
    // { name: 'B4', time: '8n' },
    // { name: 'C5', time: '8n' },
    // { name: 'D5', time: '8n' }
    // { name: 'E5', time: '8n' },
    // { name: 'F5', time: '8n' },
    // { name: 'G5', time: '8n' },
    // { name: 'A5', time: '8n' },
    // { name: 'B5', time: '8n' },
    // { name: 'C6', time: '8n' },
    // { name: 'D6', time: '8n' },
    // { name: 'E6', time: '8n' },
    // { name: 'F6', time: '8n' },
    // { name: 'G6', time: '8n' },
    // { name: 'A6', time: '8n' },
    // { name: 'B6', time: '8n' },
    // { name: 'C7', time: '8n' },
    // { name: 'D7', time: '8n' },
    // { name: 'E7', time: '8n' },
    // { name: 'F7', time: '8n' },
    // { name: 'G7', time: '8n' },
    // { name: 'A7', time: '8n' },
    // { name: 'B7', time: '8n' },
    // { name: 'C8', time: '8n' }
    // // { name: 'D5', time: '8n' },
    // // { name: 'B4', time: '8n' },
    // { name: 'G4', time: '8n' },
    // { name: 'E4', time: '8n' },
    // { name: 'D5', time: '8n' },
    // { name: 'B4', time: '8n' },
    // { name: 'G4', time: '8n' },
    // { name: 'C4', time: '4n' },
    // { name: 'D4', time: '4n' },
    // { name: 'E4', time: '4n' },
    // { name: 'F4', time: '4n' },
    // { name: 'C4', time: '32n' },
    // { name: 'D6', time: '32n' },
    // { name: 'E4', time: '32n' },
    // // { name: 'F4', time: '32n' },
    // // { name: 'E4', time: '32n' },
    // // { name: 'F4', time: '32n' },
    // { name: 'F4', time: '32n' },
    // { name: 'E4', time: '32n' },
    // { name: 'F4', time: '32n' },
    // { name: 'F4', time: '32n' },
    // { name: 'F4', time: '32n' },
    // { name: 'E4', time: '32n' },
    // { name: 'F4', time: '32n' }
    // { name: 'F4', time: '32n' },
    // { name: 'F4', time: '32n' },
    // { name: 'E4', time: '32n' },
    // { name: 'F4', time: '32n' },
    // { name: 'G4', time: '32n' },
    // { name: 'A4', time: '32n' },
    // { name: 'B4', time: '32n' },
    // { name: 'C5', time: '32n' },
    // { name: 'D5', time: '32n' },
    // { name: 'E5', time: '32n' },
    // { name: 'F5', time: '32n' },
    // { name: 'G5', time: '32n' },
    // { name: 'A5', time: '32n' },
    // { name: 'B5', time: '32n' },
    // { name: 'C6', time: '32n' },
    // { name: 'D6', time: '32n' },
    // { name: 'E6', time: '32n' },
    // { name: 'F6', time: '32n' },
    // { name: 'G6', time: '32n' },
    // { name: 'A6', time: '32n' },
    // { name: 'B6', time: '32n' },
    // { name: 'C7', time: '32n' },
    // { name: 'D7', time: '32n' },
    // { name: 'E7', time: '32n' },
    // { name: 'F7', time: '32n' },
    // { name: 'G7', time: '32n' },
    // { name: 'A7', time: '32n' },
    // { name: 'B7', time: '32n' },
    // { name: 'C8', time: '32n' },
    // { name: 'D8', time: '32n' },
    // { name: 'E8', time: '32n' },
    // { name: 'F8', time: '32n' }
  ],
  alleMeineEnten: [
    { name: 'C4', time: '4n' },
    { name: 'D4', time: '4n' },
    { name: 'E4', time: '4n' },
    { name: 'F4', time: '4n' },
    { name: 'G4', time: '2n' },
    { name: 'G4', time: '2n' },
    { name: 'A4', time: '4n' },
    { name: 'A4', time: '4n' },
    { name: 'A4', time: '4n' },
    { name: 'A4', time: '4n' },
    { name: 'G4', time: '1m' },
    { name: 'A4', time: '4n' },
    { name: 'A4', time: '4n' },
    { name: 'A4', time: '4n' },
    { name: 'A4', time: '4n' },
    { name: 'G4', time: '1m' },
    { name: 'F4', time: '4n' },
    { name: 'F4', time: '4n' },
    { name: 'F4', time: '4n' },
    { name: 'F4', time: '4n' },
    { name: 'E4', time: '2n' },
    { name: 'E4', time: '2n' },
    { name: 'G4', time: '4n' },
    { name: 'G4', time: '4n' },
    { name: 'G4', time: '4n' },
    { name: 'G4', time: '4n' },
    { name: 'C4', time: '1m' }
  ],
  chocobo: [
    { name: 'D5', time: '8n' },
    { name: 'B4', time: '8n' },
    { name: 'G4', time: '8n' },
    { name: 'E4', time: '8n' },
    { name: 'D5', time: '8n' },
    { name: 'B4', time: '8n' },
    { name: 'G4', time: '8n' },
    { name: 'B4', time: '4n' },
    { name: 'G4', time: '4n' },
    { name: 'B4', time: '4n' },
    { name: 'A4', time: '8n' },
    { name: 'G4', time: '8n' },
    { name: 'G4', time: '8n' },
    { name: 'A4', time: '8n' },
    { name: 'G4', time: '8n' },
    { name: 'F4', time: '8n' },
    { name: 'G4', time: '4n' },
    { name: 'F4', time: '8n' },
    { name: 'G4', time: '8n' },
    { name: 'G4', time: '8n' },
    { name: 'B4', time: '8n' },
    { name: 'D5', time: '8n' },
    { name: 'E5', time: '8n' },
    { name: 'F5', time: '2n' }
  ],
  testA: [
    { name: 'C#4', time: '4n' },
    { name: '', time: 1 },
    { name: 'C4', time: '4n' },
    { name: 'C4', time: '4n' },
    { name: 'C4', time: '4n' },
    { name: 'C4', time: '4n' },
    { name: 'C4', time: '4n' }
  ]
};

export const CONFIG_NAMES = {
  SYNTHESIZER_SHOW_NOTE_LABELS: 'extras13_synthesizer_showNoteLabels',
  SYNTHESIZER_SHOW_KEYBOARD: 'extras13_synthesizer_showKeyboard',
  SYNTHESIZER_INSTRUMENT: 'extras13_synthesizer_instrument',
  SYNTHESIZER_START_OCTAVE: 'extras13_synthesizer_startOctave',
  SYNTHESIZER_OCTAVE_COUNT: 'extras13_synthesizer_octaveCount',
  SYNTHESIZER_VIEW: 'extras13_synthesizer_view',
  SYNTHESIZER_RECORD_VALUES: 'extras13_synthesizer_recordValues',
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
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE]: 'small',
    [CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_DURATION]: '2n',
    [CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    [CONFIG_NAMES.SYNTHESIZER_SHOW_KEYBOARD]: true,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_DOT]: false,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_TRIPLET]: false
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
      }),
      new Track({
        name: 'Chocobo Test',
        type: 'Synth',
        notes: EXAMPLE_NOTES.chocobo,
        bpm: 120
      }),
      new Track({
        name: 'Test A',
        type: 'Synth',
        notes: EXAMPLE_NOTES.testA,
        bpm: 120
      })
    ],
    [CONFIG_NAMES.SYNTHESIZER_BPM]: 120,

    // old

    [CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_INSTRUMENT]: 'Synth',
    [CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]: 2,
    [CONFIG_NAMES.SYNTHESIZER_VIEW]: 'default',
    [CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES]: EXAMPLE_NOTES.alleMeineEnten,
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE]: 'small',
    [CONFIG_NAMES.SYNTHESIZER_DURATION]: '2n',
    [CONFIG_NAMES.SYNTHESIZER_BEAT_COUNT]: 4,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    [CONFIG_NAMES.SYNTHESIZER_BASE_NOTE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_NOTE_COUNT]: '4n'
  };
}
