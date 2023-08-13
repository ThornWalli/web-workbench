import { reactive } from 'vue';
import { filter } from 'rxjs';

export default function synthesizer(core) {
  return async ({ modules }) => {
    const [Synthesizer] = await Promise.all([
      import('./components/Synthesizer').then(module => module.default)
    ]);

    const model = reactive(getDefaultModel(core));
    const window = modules.windows.addWindow(
      {
        title: 'Synthesizer',
        component: Synthesizer,
        componentData: { core, model },
        options: {
          scale: false,
          scrollX: false,
          scrollY: false,
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
      reset: () => {
        model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES] = [];
      },
      close: () => {
        window.close();
      },
      focus: () => {
        window.focus();
      }
    };

    return new Promise(resolve => {
      window.events
        .pipe(filter(({ name }) => name === 'close'))
        .subscribe(() => {
          resolve();
        });
    });
  };
}
export const EXAMPLE_NOTES = {
  alleMeineEnten: [
    { note: 'C4', time: '4n' },
    { note: 'D4', time: '4n' },
    { note: 'E4', time: '4n' },
    { note: 'F4', time: '4n' },
    { note: 'G4', time: '2n' },
    { note: 'G4', time: '2n' },
    { note: 'A4', time: '4n' },
    { note: 'A4', time: '4n' },
    { note: 'A4', time: '4n' },
    { note: 'A4', time: '4n' },
    { note: 'G4', time: '1m' },
    { note: 'A4', time: '4n' },
    { note: 'A4', time: '4n' },
    { note: 'A4', time: '4n' },
    { note: 'A4', time: '4n' },
    { note: 'G4', time: '1m' },
    { note: 'F4', time: '4n' },
    { note: 'F4', time: '4n' },
    { note: 'F4', time: '4n' },
    { note: 'F4', time: '4n' },
    { note: 'E4', time: '2n' },
    { note: 'E4', time: '2n' },
    { note: 'G4', time: '4n' },
    { note: 'G4', time: '4n' },
    { note: 'G4', time: '4n' },
    { note: 'G4', time: '4n' },
    { note: 'C4', time: '1m' }
  ],
  chocobo: [
    { note: 'D5', time: '4n' },
    { note: 'B4', time: '4n' },
    { note: 'G4', time: '4n' },
    { note: 'E4', time: '4n' },
    { note: 'D5', time: '4n' },
    { note: 'B4', time: '4n' },
    { note: 'G4', time: '4n' },
    { note: 'B4', time: '4n' },
    { note: 'G4', time: '4n' },
    { note: 'B4', time: '4n' },
    { note: 'A4', time: '8n' },
    { note: 'G4', time: '8n' },
    { note: 'G4', time: '8n' },
    { note: 'A4', time: '8n' },
    { note: 'G4', time: '8n' },
    { note: 'F4', time: '8n' },
    { note: 'G4', time: '4n' },
    { note: 'F4', time: '8n' },
    { note: 'G4', time: '8n' },
    { note: 'G4', time: '8n' },
    { note: 'B4', time: '8n' },
    { note: 'D5', time: '8n' },
    { note: 'E5', time: '8n' },
    { note: 'F5', time: '2n' }
  ],
  testA: [
    { note: 'C4', time: '2n' },
    { note: null, time: '4n' },
    { note: null, time: '4n' },
    { note: 'C4', time: '4n' },
    { note: 'C4', time: '4n' }
  ]
};
export function getDefaultModel() {
  return {
    [CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_INSTRUMENT]: 'Synth',
    [CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]: 2,
    [CONFIG_NAMES.SYNTHESIZER_VIEW]: 'default',
    [CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES]: EXAMPLE_NOTES.alleMeineEnten,
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE]: 'small',
    [CONFIG_NAMES.SYNTHESIZER_NOTE]: '2n',
    [CONFIG_NAMES.SYNTHESIZER_BEAT_COUNT]: 4,
    [CONFIG_NAMES.SYNTHESIZER_INPUT_TYPE]: 'note',
    [CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION]: INPUT_OPERTATIONS.ADD,
    [CONFIG_NAMES.SYNTHESIZER_BASE_NOTE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_NOTE_COUNT]: '4n',
    [CONFIG_NAMES.SYNTHESIZER_BPM]: 120
  };
}

export const CONFIG_NAMES = {
  SYNTHESIZER_SHOW_NOTE_LABELS: 'extras13_synthesizer_showNoteLabels',
  SYNTHESIZER_INSTRUMENT: 'extras13_synthesizer_instrument',
  SYNTHESIZER_START_OCTAVE: 'extras13_synthesizer_startOctave',
  SYNTHESIZER_OCTAVE_COUNT: 'extras13_synthesizer_octaveCount',
  SYNTHESIZER_VIEW: 'extras13_synthesizer_view',
  SYNTHESIZER_RECORD_VALUES: 'extras13_synthesizer_recordValues',
  SYNTHESIZER_KEYBOARD_SIZE: 'extras13_synthesizer_keyboardSize',
  SYNTHESIZER_NOTE: 'extras13_synthesizer_note',
  SYNTHESIZER_BEAT_COUNT: 'extras13_synthesizer_beat_count',
  SYNTHESIZER_INPUT_TYPE: 'extras13_synthesizer_input_type',
  SYNTHESIZER_BASE_NOTE: 'extras13_synthesizer_base_note',
  SYNTHESIZER_NOTE_COUNT: 'extras13_synthesizer_note_count',
  SYNTHESIZER_INPUT_OPERATION: 'extras13_synthesizer_input_operation',
  SYNTHESIZER_BPM: 'extras13_synthesizer_bpm'
};

export const CONFIG_DEFAULTS = {};
export const INPUT_OPERTATIONS = {
  ADD: 'add',
  REPLACE: 'replace'
};
