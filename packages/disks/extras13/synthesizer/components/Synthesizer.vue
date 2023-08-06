<template>
  <div class="wb-disks-debug-synthesizer">
    <div class="keyboard">
      <keyboard v-bind="keybordData" @note="onNote" />
      <span class="message" :class="{show:isMaxLength}">Octave length is to large…</span>
    </div>
    <div class="controls">
      <wb-form-field-dropdown :name="CONFIG_NAMES.SYNTHESIZER_TIME" :model="model" :label="null" :options="timesOptions" />
      <wb-button label="Pause" @click="onClickPause" />
    </div>
    <note-diagram v-bind="noteDiagramData" />
    <span class="spacer" />
    <!-- <div class="settings">
      <fieldset v-if="view === 'record'">
        <legend>Record</legend>
        {{ recordValues.map(({note}) => note).join(' ') }}
      </fieldset>
    </div> -->
    <info
      class="info"
      :instrument="instrument"
      :time="model[CONFIG_NAMES.SYNTHESIZER_TIME]"
      :decibel="decibelValue"
    />
  </div>
</template>

<script>

import { watch, toRef, markRaw } from 'vue';

import useWindow, { windowProps, windowEmits } from '@web-workbench/core/composables/useWindow';

import * as Tone from 'tone';

import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/utils';

import WbFormFieldDropdown from '@web-workbench/core/components/atoms/formField/Dropdown';
import WbButton from '@web-workbench/core/components/atoms/Button';
import { getDefaultModel, CONFIG_NAMES } from '../index';
import contextMenu from '../contextMenu';
import { getDecibelFromValue, getTimes } from '../utils';

import Keyboard from './synthesizer/Keyboard';
import Info from './synthesizer/Info';
import NoteDiagram from './synthesizer/NoteDiagram';

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
      CONFIG_NAMES,
      synth: null,
      started: false,
      maxLength: 11,
      timesOptions: Object.entries(getTimes()).map(([
        value, title
      ]) => ({ value, title }))
    };
  },

  computed: {
    isMaxLength () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT] >= this.maxLength;
    },
    noteDiagramData () {
      return {
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
    time () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_TIME];
    },

    recordValues () {
      return this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES];
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
    }
  },

  unmounted () {
    this.synth?.dispose();
  },

  methods: {
    onClickPause () {
      const time = this.time;
      this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES].push({ note: null, time });
    },
    async onNote (note) {
      if (!this.started) {
        await Tone.start();
        this.started = true;
      }
      const time = this.time;
      this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES].push({ note, time });
      this.synth.triggerAttackRelease(note, time);
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
