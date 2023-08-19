<template>
  <div class="wb-disks-debug-synthesizer">
    <div class="keyboard">
      <keyboard
        v-bind="keybordData"
        @down="onDownKeyboard"
        @up="onUpKeyboard" />
      <span class="message" :class="{ show: isMaxLength }"
        >Octave length is to large…</span
      >
    </div>
    <div class="controls">
      <navigation
        direction="vertical"
        v-bind="noteControlsNavigation"></navigation>
      <div>
        <navigation v-bind="noteNavigation"></navigation>
      </div>
    </div>
    <note-diagram v-bind="noteDiagramData" @note:click="onClickNote" />
    <navigation v-bind="noteDiagramControlNavigation"></navigation>
    <span class="spacer" />
    <navigation v-bind="controlsNavigation"></navigation>

    <wb-env-molecule-footer
      v-bind="footer"
      :parent-layout="windowsModule.contentWrapper.layout" />
  </div>
</template>

<script>
import { watch, toRef, markRaw } from 'vue';

import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';

import * as Tone from 'tone';

import {
  generateMenuItems,
  MENU_ITEM_TYPE
} from '@web-workbench/core/classes/MenuItem';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/utils';

import WbEnvMoleculeFooter from '@web-workbench/core/components/molecules/Footer';
import Deferred from '../Deferred';
import { getDefaultModel, CONFIG_NAMES, INPUT_OPERTATIONS } from '../index';
import contextMenu from '../contextMenu';
import {
  getBeatsFromGroupedNotes,
  getDecibelFromValue,
  getGroupedNotes,
  getInstruments,
  getNotePosition,
  getNotes
} from '../utils';
import Navigation from './synthesizer/Navigation';

import Keyboard from './synthesizer/Keyboard';
import NoteDiagram from './synthesizer/NoteDiagram';
export default {
  components: {
    WbEnvMoleculeFooter,
    Navigation,
    Keyboard,
    NoteDiagram
  },

  props: {
    ...windowProps,
    model: { type: Object, default: getDefaultModel() }
  },
  emits: [...windowEmits],

  setup(props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    watch(
      model,
      () => {
        windowContext.setContextMenu(contextMenu, { model: model.value });
      },
      { immediate: true, deep: true }
    );
    return { ...windowContext };
  },

  data() {
    return {
      ready: new Deferred(),
      CONFIG_NAMES,
      noteIndex: -1,
      currentSequence: null,
      toneReady: null,
      synth: null,
      maxLength: 11,
      playing: false,
      footerModel: {},

      windowsModule: markRaw(this.core.modules.windows)
    };
  },

  computed: {
    footer() {
      const model = this.model;
      return {
        items: generateMenuItems([
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: `Instrument: ${this.instrument}`,
            items: Object.entries(getInstruments()).map(([value, title]) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title,
              model,
              name: CONFIG_NAMES.SYNTHESIZER_INSTRUMENT,
              value
            }))
          },
          {
            type: MENU_ITEM_TYPE.SEPARATOR
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: `BPM: ${this.bpm}`,
            items: [30, 60, 120, 240, 480].map(value => ({
              type: MENU_ITEM_TYPE.RADIO,
              title: String(value),
              model,
              name: CONFIG_NAMES.SYNTHESIZER_BPM,
              value
            }))
          },
          {
            type: MENU_ITEM_TYPE.SEPARATOR
          },
          {
            title: `Octave: ${this.startOctave}-${
              this.startOctave + this.octaveCount - 1
            }`,
            items: [
              {
                type: MENU_ITEM_TYPE.DEFAULT,
                title: 'Start Octave',
                items: Array(10)
                  .fill({})
                  .map((v, index) => ({
                    type: MENU_ITEM_TYPE.RADIO,
                    title: String(index + 1),
                    model,
                    name: CONFIG_NAMES.SYNTHESIZER_START_OCTAVE,
                    value: index + 1
                  }))
              },
              {
                type: MENU_ITEM_TYPE.DEFAULT,
                title: 'Octave Count',
                items: Array(10)
                  .fill({})
                  .map((v, index) => ({
                    type: MENU_ITEM_TYPE.RADIO,
                    title: String(index + 1),
                    model,
                    name: CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT,
                    value: index + 1
                  }))
              }
            ]
          },
          {
            type: MENU_ITEM_TYPE.SPACER
          },
          {
            type: MENU_ITEM_TYPE.TEXT,
            text: `Volume: ${this.decibelValue.toFixed(2)} db`
          }
        ])
      };
    },
    baseNote() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_BASE_NOTE]);
    },
    noteCount() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_NOTE_COUNT];
    },

    noteDiagramControlNavigation() {
      return {
        model: this.model,
        items: [
          {
            disabled: this.noteIndex === -1,
            title: 'Replace',
            name: CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION,
            value: INPUT_OPERTATIONS.REPLACE
          },
          {
            disabled: this.noteIndex === -1,
            title: 'Add',
            name: CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION,
            value: INPUT_OPERTATIONS.ADD
          },
          {
            disabled: this.noteIndex === -1,
            title: 'Remove',
            onClick: () => {
              this.removeNote(this.noteIndex);
            }
          },
          { spacer: true },
          {
            title: 'Prev',
            disabled: this.noteIndex < 0,
            onClick: () => {
              this.noteIndex = Math.max(this.noteIndex - 1, -1);
            }
          },
          {
            title: 'Next',
            disabled: this.noteIndex >= this.recordValues.length - 1,
            onClick: () => {
              this.noteIndex = Math.min(
                this.noteIndex + 1,
                this.recordValues.length - 1
              );
            }
          }
        ]
      };
    },

    noteControlsNavigation() {
      return {
        model: this.model,
        items: [
          {
            title: 'Pause',
            onClick: () => this.addPause()
          }
        ]
      };
    },

    controlsNavigation() {
      return {
        model: this.model,
        items: [
          this.playing
            ? {
                selected: true,
                title: 'Pause',
                disabled: !this.currentSequence || !this.playing,
                onClick: () => this.onClickPlause()
              }
            : {
                title: 'Play',
                disabled: this.playing,
                onClick: () => this.onClickPlay()
              },

          {
            title: 'Stop',
            disabled: !this.currentSequence,
            onClick: () => this.onClickStop()
          },
          {
            title: 'Restart',
            disabled: this.noteIndex < 0,
            onClick: () => this.onClickRestart()
          },
          {
            title: 'Reset',
            onClick: () => this.onClickReset()
          }
        ]
      };
    },

    noteNavigation() {
      return {
        model: this.model,
        items: Object.entries(getNotes(true)).map(([value, title]) => ({
          title: `${title} Note`,
          name: CONFIG_NAMES.SYNTHESIZER_NOTE,
          value
        }))
      };
    },

    noteOptions() {
      return Object.entries(getNotes()).map(([value, title]) => ({
        title,
        value
      }));
    },

    isMaxLength() {
      return (
        this.model[CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT] >= this.maxLength
      );
    },

    startOctave() {
      return this.isMaxLength
        ? 4
        : Number(this.model[CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]);
    },

    octaveCount() {
      return this.isMaxLength
        ? 1
        : Number(this.model[CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]);
    },

    noteDiagramData() {
      return {
        baseNote: this.baseNote,
        noteCount: this.noteCount,
        beatCount: this.beatCount,
        beats: this.visibleBeats,
        startOctave: this.startOctave,
        octaveCount: this.octaveCount
      };
    },

    keybordData() {
      return {
        selectedNote: this.recordValues[this.noteIndex],
        size: this.model[CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE],
        showNoteLabels: this.model[CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS],
        startOctave: this.startOctave,
        octaveCount: this.octaveCount
      };
    },

    view() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_VIEW];
    },

    instrument() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_INSTRUMENT];
    },

    recordValues: {
      get() {
        return this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES];
      },
      set(value) {
        this.clearSequence();
        this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES] = value;
      }
    },

    preparedRecordValues() {
      let t = new Tone.Time('0');
      // const startIndex = this.noteIndex > -1 ? this.noteIndex : 0;
      // console.log('startIndex', startIndex);
      return this.recordValues.map(({ note, time }) => {
        const seconds = t.toSeconds();
        t = new Tone.Time(t + new Tone.Time(time));
        return { time: seconds, note };
      });
    },

    bpm() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_BPM];
    },

    note() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_NOTE];
    },

    beatCount() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_BEAT_COUNT]);
    },

    beats() {
      const notes = this.recordValues.map((note, index) => ({
        ...note,
        index,
        selected: index === this.noteIndex,
        position: getNotePosition(this.startOctave, note)
      }));
      const groupedNotes = getGroupedNotes(this.startOctave, notes);
      return getBeatsFromGroupedNotes(groupedNotes);
    },

    beatIndex() {
      return Math.max(
        this.beats.indexOf(
          this.beats.find(({ groupedNotes }) =>
            groupedNotes.find(({ notes }) =>
              notes.find(({ selected }) => selected)
            )
          )
        ),
        0
      );
    },

    visibleBeats() {
      const index =
        Math.floor(this.beatIndex / this.beatCount) * this.beatCount;
      return this.beats.slice(index, index + this.beatCount);
    },

    // Volume
    masterVolume() {
      return this.core.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG]
        .soundVolume;
    },

    decibelValue() {
      return getDecibelFromValue(this.masterVolume);
    }
  },

  watch: {
    bpm() {
      this.stop();
    },
    masterVolume: {
      handler() {
        Tone.Master.volume.value = this.decibelValue;
      },
      immediate: true
    },

    instrument: {
      handler() {
        if (this.toneReady) {
          this.setInstrument(this.instrument);
        }
      }
    },
    time(time) {
      this.updateClock(time);
    }
  },
  mounted() {
    window.Tone = Tone;
  },
  unmounted() {
    this.synth?.dispose();
    this.clearSequence();
  },

  methods: {
    async setup() {
      if (!this.toneReady) {
        this.toneReady = true;
        await Tone.start();

        this.setInstrument(this.instrument);
        console.log(
          'this.toneReady',
          this.toneReady,
          this.synth.context.transport
        );
        this.ready.resolve();
      }
      return this.ready.promise;
    },

    async play() {
      await this.setup();
      const transport = this.synth.context.transport;

      transport.stop();
      transport.bpm.value = 120;
      transport.seconds =
        this.preparedRecordValues[this.noteIndex + 1]?.time || 0;

      this.setupSequence(this.preparedRecordValues, () => {
        this.clearSequence();
        this.playing = false;
      });

      transport.bpm.value = this.bpm;
      transport.start();

      if (this.recordValues.length - 1 === this.noteIndex) {
        this.noteIndex = -1;
      }

      this.currentSequence.start(0);
      this.playing = true;
    },

    pause() {
      this.synth.context.transport.pause();
      this.playing = false;
    },

    stop() {
      this.clearSequence();
      this.playing = false;
      this.noteIndex = -1;
    },

    reset() {
      this.clearSequence();
      this.stop();
      this.recordValues = [];
    },
    onClickReset() {
      this.reset();
    },

    async onClickPlay() {
      await this.play();
    },

    onClickPlause() {
      this.pause();
    },

    onClickStop() {
      this.stop();
    },
    async onClickRestart() {
      this.stop();
      await this.play();
    },

    setupSequence(notes, complete) {
      if (!this.currentSequence) {
        this.currentSequence?.dispose();
        this.currentSequence = markRaw(
          new Tone.Part((time, { note }) => {
            this.noteIndex++;
            console.log(note, this.noteCount, time);
            this.synth.triggerAttackRelease(note, this.noteCount, time);
            if (this.noteIndex === notes.length - 1 && complete) {
              complete();
            }
          }, notes)
        );
      }
    },
    clearSequence() {
      this.currentSequence?.dispose();
      this.currentSequence = null;
    },

    setInstrument(instrument) {
      this.synth?.dispose();
      // eslint-disable-next-line import/namespace
      const Instrument = Tone[String(instrument)];
      const vol = new Tone.Volume(-100).toDestination();
      this.synth = markRaw(new Instrument().connect(vol).toDestination());
    },

    addPause() {
      this.resolveNote();
    },

    addNote(note = null) {
      this.recordValues = [
        ...this.recordValues.slice(0, this.noteIndex + 1),
        {
          note,
          time: this.note
        },
        ...this.recordValues.slice(this.noteIndex + 1)
      ];
      this.noteIndex = this.noteIndex + 1;
    },

    replaceNote(note) {
      this.recordValues[this.noteIndex] = {
        note,
        time: this.note
      };
    },

    removeNote(index) {
      this.recordValues = this.model[
        CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES
      ].filter((_, i) => i !== index);
      this.noteIndex = index - 1;
    },

    resolveNote(note) {
      if (this.noteIndex > -1) {
        switch (this.model[CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION]) {
          case INPUT_OPERTATIONS.ADD:
            this.addNote(note);
            break;
          case INPUT_OPERTATIONS.REPLACE:
            this.replaceNote(note);
            break;
        }
      } else {
        this.recordValues.push({
          note,
          time: this.note
        });
        this.noteIndex =
          this.noteIndex > -1
            ? this.noteIndex + 1
            : this.recordValues.length - 1;
      }
    },

    async onClickNote(note) {
      await this.setup();
      if (this.noteIndex === note.index) {
        this.noteIndex = -1;
      } else {
        this.noteIndex = note.index;
        this.synth.triggerAttackRelease(note.note, this.note);
      }
    },

    async onDownKeyboard(note) {
      await this.setup();
      this.resolveNote(note);

      this.synth.triggerAttack(note);
    },

    async onUpKeyboard() {
      await this.ready.promise;
      this.synth.triggerRelease();
      // this.synth.triggerAttackRelease(note, this.note);
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

  & > * {
    flex: 1;

    &:nth-child(1) {
      flex: 0;
    }
  }
}

.debug {
  font-family: var(--font-bit-font);
  font-size: 10px;
  letter-spacing: 0;
}
</style>
