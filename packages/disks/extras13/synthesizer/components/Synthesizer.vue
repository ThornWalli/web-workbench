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
      <test-navigation
        direction="vertical"
        v-bind="noteControlsNavigation"></test-navigation>
      <div>
        <test-navigation v-bind="noteNavigation"></test-navigation>
      </div>
    </div>
    <note-diagram v-bind="noteDiagramData" @note:click="onClickNote" />
    <test-navigation v-bind="noteDiagramControlNavigation"></test-navigation>
    <span class="spacer" />
    <test-navigation v-bind="controlsNavigation"></test-navigation>
    <info class="info-footer" v-bind="infoFooter" />
  </div>
</template>

<script>
import { watch, toRef, markRaw } from 'vue';

import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';

import * as Tone from 'tone';

import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/utils';

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
import TestNavigation from './synthesizer/TestNavigation';

import Keyboard from './synthesizer/Keyboard';
import Info from './synthesizer/Info';
import NoteDiagram from './synthesizer/NoteDiagram';
export default {
  components: {
    TestNavigation,
    Keyboard,
    Info,
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
      tone: null,
      toneClock: null,
      synth: null,
      maxLength: 11,
      playing: false
    };
  },

  computed: {
    infoFooter() {
      return {
        items: [
          [
            'Octave',
            `${this.startOctave}-${this.startOctave + this.octaveCount - 1}`
          ],
          ['Instrument', getInstruments()[this.instrument]],
          ['BPM', this.bpm],
          ['Beat', this.beatIndex],
          ['Note', this.noteIndex],
          ['Volume', `${this.decibelValue.toFixed(2)} db`]
        ]
      };
    },
    baseNote() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_BASE_NOTE];
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
    recordValues: {
      handler(value) {
        console.log('recordValues', value);
      },
      deep: true
    },
    masterVolume: {
      handler() {
        Tone.Master.volume.value = this.decibelValue;
      },
      immediate: true
    },
    bpm() {
      this.synth.context.transport.bpm.value = this.bpm;
    },

    instrument: {
      handler() {
        this.synth?.dispose();
        // eslint-disable-next-line import/namespace
        const Instrument = Tone[String(this.instrument)];
        const vol = new Tone.Volume(-100).toDestination();
        this.synth = markRaw(new Instrument().connect(vol).toDestination());
      },
      immediate: true
    },
    time(time) {
      this.updateClock(time);
    }
  },

  unmounted() {
    this.synth?.dispose();
    this.toneClock?.dispose();
    this.currentSequence?.dispose();
  },

  methods: {
    onClickNote(note) {
      if (this.noteIndex === note.index) {
        this.noteIndex = -1;
      } else {
        this.noteIndex = note.index;
        this.synth.triggerAttackRelease(note.note, this.note);
      }
    },

    createSequence(notes) {
      const part = new Tone.Part((time, { note }) => {
        this.noteIndex++;
        this.synth.triggerAttackRelease(note, this.noteCount, time);
        if (this.noteIndex === notes.length - 1) {
          this.stop();
        }
      }, notes);
      console.log('part', part.playbackRate);
      return part;
    },

    async play() {
      const transport = this.synth.context.transport;
      transport.bpm.value = this.bpm;

      if (transport.state !== 'played') {
        await this.setup();

        const sequence = this.createSequence(this.preparedRecordValues);

        this.currentSequence?.dispose();
        this.currentSequence = sequence;

        if (this.recordValues.length - 1 === this.noteIndex) {
          this.noteIndex = -1;
        }
      }
      // const startSeconds =
      //   this.preparedRecordValues[this.noteIndex - 1]?.time || 0;
      this.currentSequence.start(0);

      // if (startSeconds) {
      // console.log('startSeconds', startSeconds);
      // transport.pause();
      // transport.seconds = startSeconds;
      transport.start();
      // }
      this.playing = true;
    },

    pause() {
      this.synth.context.transport.pause();
      this.playing = false;
    },

    stop() {
      this.synth.context.transport.stop();
      this.currentSequence?.dispose();
      this.currentSequence = null;
      this.noteIndex = -1;
      this.playing = false;
    },

    reset() {
      this.stop();
      this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES] = [];
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

    addPause() {
      this.resolveNote();
    },

    async setup() {
      if (!this.tone) {
        this.tone = await Tone.start();
        this.synth.context.transport.start();
        this.ready.resolve();
      }
    },

    addNote(note = null) {
      this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES] = [
        ...this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES].slice(
          0,
          this.noteIndex + 1
        ),
        {
          note,
          time: this.note
        },
        ...this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES].slice(
          this.noteIndex + 1
        )
      ];
      this.noteIndex = this.noteIndex + 1;
    },

    replaceNote(note) {
      this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES][this.noteIndex] = {
        note,
        time: this.note
      };
    },

    removeNote(index) {
      this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES] = this.model[
        CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES
      ].filter((_, i) => i !== index);
      this.noteIndex = index - 1;
    },

    async resolveNote(note) {
      await this.setup();
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
        this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES].push({
          note,
          time: this.note
        });
        this.noteIndex =
          this.noteIndex > -1
            ? this.noteIndex + 1
            : this.model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES].length - 1;
      }
    },

    async onDownKeyboard(note) {
      this.resolveNote(note);
      await this.ready.promise;
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
