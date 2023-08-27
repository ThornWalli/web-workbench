<template>
  <div class="wb-disks-extras13-synthesizer-track">
    <div v-if="showKeyboard" class="keyboard">
      <keyboard
        v-bind="keybordData"
        @down="onDownKeyboard"
        @up="onUpKeyboard" />
      <span class="message" :class="{ show: isMaxLength }"
        >Octave length is to large…</span
      >
    </div>
    <div class="panel">
      <navigation v-if="showKeyboard" v-bind="noteNavigation"></navigation>
      <div v-if="showKeyboard" class="test"></div>
      <navigation v-bind="noteDiagramControlNavigation"></navigation>
      <div class="sheet">
        <div>
          <synthesizer-note-sheet
            v-bind="noteSheetData"
            @note:click="onClickNote" />
          <!-- <timer></timer> -->
        </div>
      </div>
      <navigation v-bind="controlsNavigation"></navigation>
    </div>

    <wb-env-molecule-footer
      v-bind="footer"
      :parent-layout="windowsModule.contentWrapper.layout" />
  </div>
</template>

<script>
import { reactive, watch, toRef, markRaw } from 'vue';

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
import NoteDescription from '../classes/NoteDescription';
import NoteSheet from '../classes/NoteSheet';
import { getDefaultModel, CONFIG_NAMES } from '../index';
import TrackPlayer from '../classes/TrackPlayer';
import contextMenu from '../contextMenu';
import {
  getDecibelFromValue,
  getInstruments,
  getNotes,
  INPUT_OPERTATIONS
} from '../utils';
import useTone from '../composables/useTone';
import Navigation from './synthesizer/Navigation';

import Keyboard from './synthesizer/Keyboard';
import SynthesizerNoteSheet from './synthesizer/NoteSheet';

export default {
  components: {
    WbEnvMoleculeFooter,
    Navigation,
    Keyboard,
    SynthesizerNoteSheet
  },

  props: {
    ...windowProps,
    model: { type: Object, default: getDefaultModel() },
    toneDestination: { type: Object, default: null }
  },
  emits: [...windowEmits],

  setup(props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    watch(
      model,
      () => {
        windowContext.setContextMenu(contextMenu, {
          model: model.value,
          preserveContextMenu: windowContext.preserveContextMenu
        });
      },
      { immediate: true, deep: true }
    );
    const trackPlayer = reactive(
      new TrackPlayer(model.value[CONFIG_NAMES.SYNTHESIZER_CHANNEL])
    );
    return { ...windowContext, ...useTone(), trackPlayer };
  },

  data() {
    return {
      CONFIG_NAMES,
      currentSequence: null,
      synth: null,
      maxLength: 11,
      playing: false,
      footerModel: {},

      windowsModule: markRaw(this.core.modules.windows)
    };
  },

  computed: {
    noteIndex: {
      get() {
        return this.trackPlayer.noteIndex;
      },
      set(value) {
        this.trackPlayer.noteIndex = value;
      }
    },
    notes: {
      get() {
        return this.track.notes;
      },
      set(value) {
        this.track.notes = value;
      }
    },

    showKeyboard() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_SHOW_KEYBOARD];
    },

    keybordData() {
      return {
        size: this.model[CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE],
        showNoteLabels: this.model[CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS],
        selectedNote: this.notes[this.noteIndex],
        startOctave: this.track.startOctave,
        octaveCount: this.track.octaveCount
      };
    },

    bpm() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_BPM]);
    },

    // Volume
    masterVolume() {
      return this.core.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG]
        .soundVolume;
    },

    decibelValue() {
      return getDecibelFromValue(this.masterVolume);
    },

    isMaxLength() {
      return this.track.octaveCount >= this.maxLength;
    },

    duration() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_DURATION];
    },

    noteSheetData() {
      const noteSheet = new NoteSheet(this.track, {
        noteIndex: this.noteIndex
      });
      return noteSheet.toData();
    },

    noteDiagramControlNavigation() {
      return {
        model: this.model,
        items: [
          {
            disabled: this.model[CONFIG_NAMES.SYNTHESIZER_INPUT_TRIPLET],
            title: 'Dot',
            name: CONFIG_NAMES.SYNTHESIZER_INPUT_DOT
          },
          {
            disabled: this.model[CONFIG_NAMES.SYNTHESIZER_INPUT_DOT],
            title: 'Triplet',
            name: CONFIG_NAMES.SYNTHESIZER_INPUT_TRIPLET
          },
          {
            disabled: !this.trackPlayer?.getCurrentNote()?.isPaused(),
            title: 'Duration',
            onClick: async () => {
              const currentNote = this.trackPlayer?.getCurrentNote();

              this.preserveContextMenu(true);
              const message = 'Set Duration:';
              const value = await this.core.executeCommand(
                `openDialog -title="${message}" -prompt -prompt-type=number -prompt-step=0.01 -prompt-value="${currentNote.duration}" -apply="Save" -abort="Cancel"`
              );
              if (value) {
                console.log(currentNote);
                console.log(value);
                currentNote.duration = Number(value);
              }
              this.preserveContextMenu(false);
              this.window.focus();
            }
          },
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
              this.track.removeNote(this.noteIndex);
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
            disabled: this.noteIndex >= this.track.notes.length - 1,
            onClick: () => {
              this.noteIndex = Math.min(
                this.noteIndex + 1,
                this.notes.length - 1
              );
            }
          }
        ]
      };
    },

    controlsNavigation() {
      return {
        model: this.model,
        items: [
          this.trackPlayer.playing
            ? {
                selected: true,
                title: 'Pause',
                disabled:
                  !this.trackPlayer.currentSequence ||
                  !this.trackPlayer.playing,
                onClick: () => this.onClickPlause()
              }
            : {
                title: 'Play',
                disabled: this.trackPlayer.playing,
                onClick: () => this.onClickPlay()
              },
          {
            title: 'Stop',
            disabled: !this.trackPlayer.currentSequence,
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

    track() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_CHANNEL];
    },

    footer() {
      const track = this.track;
      const totalDuration = track.getDuration();
      console.log(this.model);
      return {
        items: generateMenuItems([
          // {
          //   type: MENU_ITEM_TYPE.TEXT,
          //   text: `BN: ${track.baseNote}; BC: ${track.beatCount}; NC: ${track.noteCount}`
          // },
          {
            type: MENU_ITEM_TYPE.TEXT,
            text: `${this.noteIndex}/${this.notes.length}`
          },
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: `Instrument: ${this.track.type}`,
            items: Object.entries(getInstruments()).map(([value, title]) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title,
              model: track,
              name: 'type',
              value
            }))
          },
          {
            type: MENU_ITEM_TYPE.SEPARATOR
          },
          {
            title: `Octave: ${track.startOctave}-${
              track.startOctave + track.octaveCount - 1
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
                    model: track,
                    name: 'startOctave',
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
                    model: track,
                    name: 'octaveCount',
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
            text: `Dur.: ${totalDuration}`
          },
          {
            type: MENU_ITEM_TYPE.TEXT,
            text: `BPM: ${this.bpm}`
          },
          {
            type: MENU_ITEM_TYPE.TEXT,
            text: `${this.decibelValue.toFixed(2)} db`
          }
        ])
      };
    },
    noteNavigation() {
      return {
        model: this.model,
        items: [
          {
            fill: true,
            title: 'Pause',
            onClick: () => this.addPause()
          },
          ...Object.entries(getNotes(true)).map(([value, title]) => ({
            title: `${title} Note`,
            name: CONFIG_NAMES.SYNTHESIZER_DURATION,
            value
          }))
        ]
      };
    }
  },

  watch: {
    bpm() {
      this.trackPlayer?.stop();
    },
    masterVolume: {
      handler() {
        Tone.Master.volume.value = this.decibelValue;
      },
      immediate: true
    },

    'track.type': {
      handler() {
        this.trackPlayer.createInstrument(this.track.type);
      },
      immediate: true
    }
  },
  unmounted() {
    this.trackPlayer.destroy();
  },

  methods: {
    async setup() {
      if (!this.tone.ready) {
        await this.tone.start();
        this.trackPlayer.createInstrument(this.track.type);
      }
    },
    onClickReset() {
      this.trackPlayer.reset();
    },
    async onClickPlay() {
      await this.setup();
      this.trackPlayer.play(this.noteIndex);
    },

    onClickPlause() {
      this.trackPlayer.pause();
    },

    onClickStop() {
      this.trackPlayer.stop();
    },
    onClickRestart() {
      this.trackPlayer.restart();
    },

    async onClickNote(note) {
      await this.setup();
      if (this.noteIndex === note.index) {
        this.noteIndex = -1;
      } else {
        this.noteIndex = note.index;
        if (note.name) {
          this.trackPlayer.instrument.triggerAttackRelease(
            note.name,
            note.duration
          );
        }
      }
    },

    addPause() {
      this.noteInput();
    },

    noteInput(operation, name, noteIndex) {
      const note = new NoteDescription(
        { name, duration: this.duration },
        {
          dot: this.model[CONFIG_NAMES.SYNTHESIZER_INPUT_DOT],
          triplet: this.model[CONFIG_NAMES.SYNTHESIZER_INPUT_TRIPLET]
        }
      );

      if (noteIndex > -1) {
        switch (operation) {
          case INPUT_OPERTATIONS.ADD:
            return this.track.addNoteTo(noteIndex, note);
          case INPUT_OPERTATIONS.REPLACE:
            return this.track.replaceNote(noteIndex, note);
        }
      }
      return this.track.addNote(note);
    },

    async onDownKeyboard(name) {
      console.log('name', name);
      await this.setup();
      this.noteIndex = this.noteInput(
        this.model[CONFIG_NAMES.SYNTHESIZER_INPUT_OPERATION],
        name,
        this.noteIndex
      );
      this.testTimeout = Tone.now();
      this.trackPlayer.instrument.triggerAttack(name);
    },

    async onUpKeyboard() {
      await this.tone.awaitReady;
      this.trackPlayer.instrument.triggerRelease();
      console.log(new Tone.Time(Tone.now() - this.testTimeout).toNotation());
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-track {
  --color-scrollbar-primary: var(--color-dropdown-scrollbar-primary, #fff);
  --color-scrollbar-secondary: var(--color-dropdown-scrollbar-secondary, #05a);

  display: flex;
  flex-direction: column;
  height: 100%;

  & .test {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    background-color: white;

    &::before {
      display: block;
      flex: 1;
      height: 2px;
      content: '';
      background-color: var(--workbench-color-4-invert);
    }
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

.panel {
  display: flex;
  flex-direction: column;
  height: 100%;

  & .note-sheet {
    margin: 0 calc(var(--default-element-margin) * 2);
  }

  /*
  margin: 0 calc(var(--default-element-margin) * 2); */
}

.debug {
  font-family: var(--font-bit-font);
  font-size: 10px;
  letter-spacing: 0;
}

.sheet {
  position: relative;
  flex: 1;

  /* flex: 0 0 50%; */
  overflow-y: auto;
  scrollbar-color: var(--color-scrollbar-primary)
    var(--color-scrollbar-secondary);

  &::-webkit-scrollbar {
    width: var(--default-element-margin);
  }

  &::-webkit-scrollbar-track {
    background-color: var(--color-scrollbar-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-scrollbar-primary);
  }

  & > div {
    position: absolute;
    inset: 0;
  }
}
</style>
