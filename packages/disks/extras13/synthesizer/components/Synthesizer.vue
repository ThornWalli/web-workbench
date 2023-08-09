<template>
  <div class="wb-disks-debug-synthesizer">
    <div class="keyboard">
      <keyboard v-bind="keybordData" @down="onDownKeyboard" @up="onUpKeyboard" />
      <span class="message" :class="{show:isMaxLength}">Octave length is to large…</span>
    </div>
    <div class="controls">
      <wb-form-field-dropdown
        :model="model"
        :label="null"
        :name="CONFIG_NAMES.SYNTHESIZER_NOTE"
        :options="noteOptions"
      />
      <wb-button
        label="Pause"
        @pointerdown="onDownKeyboard('pause')"
        @pointerup="onUpKeyboard('pause')"
      />
    </div>
    <note-diagram
      v-bind="noteDiagramData"
    />
    <span class="spacer" />
    <!-- <div class="settings">
      <fieldset v-if="view === 'record'">
        <legend>Record</legend>
        {{ recordValues.map(({note}) => note).join(' ') }}
      </fieldset>
    </div> -->
    <info
      class="info"
      :note="note"
      :instrument="instrument"
      :decibel="decibelValue"
    />
  </div>
</template>

<script>

import { watch, toRef, markRaw } from 'vue';

import useWindow, { windowProps, windowEmits } from '@web-workbench/core/composables/useWindow';

import { Subscription, Observable } from 'rxjs';
import * as Tone from 'tone';

import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/utils';

import WbButton from '@web-workbench/core/components/atoms/Button';
import WbFormFieldDropdown from '@web-workbench/core/components/atoms/formField/Dropdown';
import { getDefaultModel, CONFIG_NAMES } from '../index';
import contextMenu from '../contextMenu';
import { getDecibelFromValue, getTimes } from '../utils';

import Keyboard from './synthesizer/Keyboard';
import Info from './synthesizer/Info';
import NoteDiagram from './synthesizer/NoteDiagram';

window.Tone = Tone;

export default {
  components: { WbFormFieldDropdown, WbButton, Keyboard, Info, NoteDiagram },

  props: { ...windowProps, model: { type: Object, default: getDefaultModel() } },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    watch(model, () => {
      windowContext.setContextMenu(contextMenu, { model: model.value });
    }, { immediate: true, deep: true });
    return { ...windowContext };
  },

  data () {
    return {
      subscription: new Subscription(),
      tone: null,
      toneClock: null,
      CONFIG_NAMES,
      synth: null,
      started: false,
      maxLength: 11,
      currentNotes: new Map()
    };
  },

  computed: {
    noteOptions () {
      return Object.entries(getTimes()).map(([
        value, title
      ]) => ({
        title,
        value
      }));
    },
    isMaxLength () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT] >= this.maxLength;
    },
    noteDiagramData () {
      return {
        beat: this.beat,
        baseBeat: this.baseBeat,
        notes: this.recordValues,
        ...(this.isMaxLength
          ? {
              startOctave: 4,
              octaveCount: 1
            }
          : {
              startOctave: Number(this.model[CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]),
              octaveCount: Number(this.model[CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT])
            })
      };
    },
    keybordData () {
      return {
        size: this.model[CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE],
        showNoteLabels: this.model[CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS],
        ...(this.isMaxLength
          ? {
              startOctave: 4,
              octaveCount: 1
            }
          : {
              startOctave: Number(this.model[CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]),
              octaveCount: Number(this.model[CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT])
            })
      };
    },

    view () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_VIEW];
    },
    instrument () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_INSTRUMENT];
    },

    recordValues () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES];
    },

    note () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_NOTE];
    },
    beat () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_BEAT];
    },
    baseBeat () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_BASE_BEAT];
    },

    // Volume
    masterVolume () {
      return this.core.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG].soundVolume;
    },
    decibelValue () {
      return getDecibelFromValue(this.masterVolume);
    }
  },

  watch: {
    masterVolume: {
      handler () {
        Tone.Master.volume.value = this.decibelValue;
      },
      immediate: true
    },
    instrument: {
      handler () {
        this.synth?.dispose();
        // eslint-disable-next-line import/namespace
        const Instrument = Tone[String(this.instrument)];
        const vol = new Tone.Volume(-100).toDestination();
        this.synth = markRaw(new Instrument().connect(vol).toDestination());
      },
      immediate: true
    },
    time (time) {
      this.updateClock(time);
    }
  },

  unmounted () {
    this.synth?.dispose();
    this.toneClock?.dispose();
    this.subscription.unsubscribe();
  },

  methods: {

    onUpKeyboard (note) {
      if (this.currentNotes.has(note)) {
        const { instrument } = this.currentNotes.get(note);
        instrument?.triggerRelease();
        // const time = new Tone.Time((Tone.now() - timestamp));
        // const timeNotation = time.toNotation();
        const noteName = note === 'pause' ? null : note;
        // if (/\d+t/.test(timeNotation)) {
        //   const [
        //     , t
        //   ] = timeNotation.match(/(\d+)t/);
        //   this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES].push(...Array(3).fill({ note: noteName, time: `${t}n` }));
        // } else {
        this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES].push({ note: noteName, time: this.note });
        // }

        this.currentNotes.delete(note);
      } else {
        console.log('missing', note);
      }
    },

    async setup () {
      if (!this.started) {
        this.tone = await Tone.start();
        this.started = true;
        const clock = this.setupClock();
        console.log(clock);
        this.subscription.add(clock.subscribe((time) => {
          console.log('time', time);
        }));
      }
    },

    setupClock () {
      // if (this.toneClock) {

      // } else {
      console.log('XXX', 1 / this.beat);
      return new Observable((subscriber) => {
        const frequency = Tone.Time(this.baseBeat / 2 / this.beat);
        console.log({ frequency }, frequency.toNotation());
        this.toneClock = new Tone.Clock((time) => {
          subscriber.next(time);
        }, frequency);
        this.toneClock.start();
      });
      // }
    },
    updateClock (time) {
      if (this.toneClock) {
        console.log('set', time, 'to clock');
        this.toneClock.set({
          frequency: Tone.Time(time)
        });
      }
    },

    async onDownKeyboard (note) {
      await this.setup();

      const pause = note === 'pause';
      this.currentNotes.set(note, {
        instrument: pause ? null : this.synth.triggerAttack(note),
        timestamp: Tone.now()
      });
    }
  }
};

</script>

<style lang="postcss" scoped>
.wb-disks-debug-synthesizer {
  display: flex;
  flex-direction: column;
  height: 100%;

    /* padding: calc(var(--default-element-margin) * 2); */

  & .settings {
    /* display: flex; */
    flex: 1;

    /* flex-direction: row; */

    /* padding: calc(var(--default-element-margin) * 2); */
  }

  & .spacer {
    flex: 1;
  }

  & fieldset {
    flex: 1;
  }

  & .keyboard {
    position: relative;
    padding: calc(var(--default-element-margin) * 2);

    & .message {
      position: absolute;
      top: 50%;
      left: 50%;
      display: none;
      padding: var(--default-element-margin);
      color: red;
      background: white;
      transform: translate(-50%, -50%);

      &.show {
        display: block;
      }
    }
  }

}

.octaves {
  display: flex;
  align-items: center;

  & .wb-env-atom-form-textbox {
      flex: 0;
      width: auto;
      min-width: auto;

      & :deep(.label) {
        min-width: auto;
        white-space: nowrap;
      }

      & :deep(.input) {
        width: 54px;
      }
  }
}

.controls {
  display: flex;
}

</style>
