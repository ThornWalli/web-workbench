import { reactive } from 'vue';
import { filter } from 'rxjs';

export default function synthesizer (core) {
  return async ({ modules }) => {
    const [
      Synthesizer
    ] = await Promise.all([
      import('./components/Synthesizer').then(module => module.default)
    ]);

    const model = reactive(getDefaultModel(core));
    const window = modules.windows.addWindow({
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
    }, {
      group: 'extras13Synthesizer',
      full: true
    });

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

    return new Promise((resolve) => {
      window.events.pipe(filter(({ name }) => name === 'close')).subscribe(() => {
        resolve();
      });
    });
  };
}

export function getDefaultModel () {
  return {
    [CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS]: false,
    [CONFIG_NAMES.SYNTHESIZER_MIN_OCTAVE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_MAX_OCTAVE]: 5,
    [CONFIG_NAMES.SYNTHESIZER_INSTRUMENT]: 'Synth',
    [CONFIG_NAMES.SYNTHESIZER_TIME]: '8n', // xxxx
    [CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]: 4,
    [CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]: 2,
    [CONFIG_NAMES.SYNTHESIZER_VIEW]: 'default',
    [CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES]: [
      { note: 'C4', time: '1m' },
      { note: 'C4', time: '4n' },
      { note: 'C4', time: '4n' },
      { note: 'C4', time: '4n' },
      { note: 'C4', time: '4n' }
    ],
    [CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE]: 'small',
    [CONFIG_NAMES.SYNTHESIZER_NOTE]: '4n',
    [CONFIG_NAMES.SYNTHESIZER_BEAT]: 4,
    [CONFIG_NAMES.SYNTHESIZER_BASE_BEAT]: 4

  };
}

export const CONFIG_NAMES = {
  SYNTHESIZER_SHOW_NOTE_LABELS: 'extras13_synthesizer_showNoteLabels',
  SYNTHESIZER_MIN_OCTAVE: 'extras13_synthesizer_minOctave',
  SYNTHESIZER_MAX_OCTAVE: 'extras13_synthesizer_maxOctave',
  SYNTHESIZER_INSTRUMENT: 'extras13_synthesizer_instrument',
  SYNTHESIZER_TIME: 'extras13_synthesizer_time',
  SYNTHESIZER_START_OCTAVE: 'extras13_synthesizer_startOctave',
  SYNTHESIZER_OCTAVE_COUNT: 'extras13_synthesizer_octaveCount',
  SYNTHESIZER_VIEW: 'extras13_synthesizer_view',
  SYNTHESIZER_RECORD_VALUES: 'extras13_synthesizer_recordValues',
  SYNTHESIZER_KEYBOARD_SIZE: 'extras13_synthesizer_keyboardSize',
  SYNTHESIZER_NOTE: 'extras13_synthesizer_note',
  SYNTHESIZER_BEAT: 'extras13_synthesizer_beat',
  SYNTHESIZER_BASE_BEAT: 'extras13_synthesizer_base_beat'
};

export const CONFIG_DEFAULTS = {};
