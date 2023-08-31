<template>
  <div class="wb-disks-extras13-synthesizer-track" :class="styleClasses">
    <div>
      <div>
        <div v-if="showKeyboard" class="keyboard">
          <keyboard
            v-bind="keybordData"
            @down="onDownKeyboard"
            @up="onUpKeyboard" />
          <span class="message" :class="{ show: isMaxLength }"
            >Octave length is to large…</span
          >
        </div>
        <navigation v-if="showKeyboard" v-bind="noteNavigation"></navigation>
      </div>
      <div class="panel">
        <div v-if="showKeyboard" class="test"></div>
        <navigation v-bind="noteDiagramControlNavigation"></navigation>
        <div class="sheet">
          <div>
            <synthesizer-timeline-canvas
              clickable
              :track="trackPlayer.track"
              @note:click="onClickNote" />
          </div>
        </div>
      </div>
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

import NoteDescription, {
  Note as NoteDescriptionNote,
  Time as NoteDescriptionTime,
  NOTE_MODIFICATIONS
} from '../classes/NoteDescription';
import { getDefaultModel, getDefaultTrackModel, CONFIG_NAMES } from '../index';

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
import SynthesizerTimelineCanvas from './synthesizer/TimelineCanvas';

export default {
  components: {
    WbEnvMoleculeFooter,
    Navigation,
    Keyboard,
    SynthesizerTimelineCanvas
  },

  props: {
    ...windowProps,
    model: { type: Object, default: getDefaultModel() },
    trackModel: { type: Object, default: getDefaultTrackModel() },
    toneDestination: { type: Object, default: null }
  },
  emits: [...windowEmits],

  setup(props, context) {
    const model = toRef(props, 'model');
    const trackModel = toRef(props, 'trackModel');
    const windowContext = useWindow(props, context);
    watch(
      model,
      () => {
        windowContext.setContextMenu(contextMenu, {
          model: model.value,
          trackModel: trackModel.value,
          preserveContextMenu: windowContext.preserveContextMenu
        });
      },
      { immediate: true, deep: true }
    );

    const track = reactive(trackModel.value[CONFIG_NAMES.SYNTHESIZER_TRACK]);
    const trackPlayer = reactive(new TrackPlayer(track));
    return { ...windowContext, ...useTone(), track, trackPlayer };
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
    selectedNoteIndex() {
      return this.track.selectedIndex;
    },

    styleClasses() {
      return {
        [`keyboard-alignment-${
          this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_ALIGNMENT]
        }`]: true
      };
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
      return this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_KEYBOARD];
    },

    keybordData() {
      return {
        size: this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE],
        showNoteLabels:
          this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS],
        selectedNote: this.notes[this.selectedNoteIndex],
        startOctave:
          this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE],
        octaveCount:
          this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT]
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
      return this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_DURATION];
    },

    noteDiagramControlNavigation() {
      return {
        model: this.trackModel,
        items: [
          [
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
                  disabled:
                    this.trackPlayer.playing || this.track.notes.length === 0,
                  onClick: () => this.onClickPlay()
                },
            {
              title: 'Stop',
              disabled: !this.trackPlayer.currentSequence,
              onClick: () => this.onClickStop()
            },
            {
              title: 'Restart',
              disabled: this.selectedNoteIndex < 0,
              onClick: () => this.onClickRestart()
            },
            {
              title: 'Reset',
              disabled: this.track.notes.length === 0,
              onClick: () => this.onClickReset()
            }
          ],
          [
            {
              disabled: !this.track.getCurrentNote()?.isPaused,
              title: 'Duration',
              onClick: async () => {
                const currentNote = this.track.getCurrentNote();

                this.preserveContextMenu(true);
                const message = 'Set Duration:';
                const value = await this.core.executeCommand(
                  `openDialog -title="${message}" -prompt -prompt-type=number -prompt-step=0.01 -prompt-value="${
                    currentNote.toSeconds() / 2
                  }" -apply="Save" -abort="Cancel"`
                );
                if (value) {
                  currentNote.duration = Number(value * 2);
                  currentNote.time = null;
                }
                this.preserveContextMenu(false);
                this.window.focus();
              }
            },
            {
              disabled: this.selectedNoteIndex === -1,
              title: 'Replace',
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION,
              value: INPUT_OPERTATIONS.REPLACE
            },
            {
              disabled: this.selectedNoteIndex === -1,
              title: 'Add',
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION,
              value: INPUT_OPERTATIONS.ADD
            },
            {
              disabled: this.selectedNoteIndex === -1,
              title: 'Remove',
              onClick: () => {
                this.track.removeNote(this.selectedNoteIndex);
              }
            },
            { spacer: true },
            {
              title: 'Prev',
              disabled: this.selectedNoteIndex < 0,
              onClick: () => {
                this.track.selectPrevNote();
              }
            },
            {
              title: 'Next',
              disabled: this.selectedNoteIndex >= this.track.notes.length - 1,
              onClick: () => {
                this.track.selectNextNote();
              }
            }
          ]
        ]
      };
    },

    footer() {
      const track = this.track;
      const model = this.trackModel;
      const totalDuration = track.getDuration();

      return {
        items: generateMenuItems([
          {
            type: MENU_ITEM_TYPE.TEXT,
            text: `${this.track.selectedIndex}/${this.notes.length}`
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
            title: `Octave: ${
              model[CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE]
            }-${
              model[CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE] +
              model[CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT] -
              1
            }`,
            items: [
              {
                type: MENU_ITEM_TYPE.DEFAULT,
                title: 'Start Octave',
                items: Array(9)
                  .fill({})
                  .map((v, index) => ({
                    type: MENU_ITEM_TYPE.RADIO,
                    title: String(index + 1),
                    model,
                    name: CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE,
                    value: index + 1,
                    action(value) {
                      value = Number(value);
                      if (
                        value +
                          model[CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT] >
                        9
                      ) {
                        debugger;
                        model[CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT] =
                          10 - value;
                      }
                    }
                  }))
              },
              {
                type: MENU_ITEM_TYPE.DEFAULT,
                title: 'Octave Count',
                items: Array(
                  10 - model[CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE]
                )
                  .fill({})
                  .map((v, index) => ({
                    type: MENU_ITEM_TYPE.RADIO,
                    title: String(index + 1),
                    model,
                    name: CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT,
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
    currentNoteTimeName() {
      return this.track.getCurrentNote()?.time.toString();
    },

    noteNavigation() {
      const model = this.trackModel;
      const modificationModel =
        this.selectedNoteIndex > -1
          ? this.track.getCurrentNote()
          : this.trackModel;
      const hasSelectedNote =
        this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION] ===
          INPUT_OPERTATIONS.REPLACE && this.selectedNoteIndex > -1;
      return {
        model,
        items: [
          hasSelectedNote
            ? [
                {
                  fill: true,
                  title: 'Pause',
                  onClick: () => this.addPause()
                },
                ...Object.entries(
                  getNotes(true, modificationModel.time.triplet)
                ).map(([value, title]) => ({
                  title: `${title} Note`,
                  selected: this.currentNoteTimeName === value,
                  action() {
                    modificationModel.time = new NoteDescriptionTime(value);
                  }
                }))
              ]
            : [
                {
                  fill: true,
                  title: 'Pause',
                  onClick: () => this.addPause()
                },
                ...Object.entries(
                  getNotes(
                    true,
                    this.trackModel[
                      CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_TRIPLET
                    ]
                  )
                ).map(([value, title]) => ({
                  title: `${title} Note`,
                  name: CONFIG_NAMES.SYNTHESIZER_TRACK_DURATION,
                  value
                }))
              ],
          hasSelectedNote
            ? [
                {
                  title: 'Dot',
                  name: 'dot',
                  model: modificationModel.time
                },
                {
                  title: 'Triplet',
                  name: 'triplet',
                  model: modificationModel.time
                },
                {
                  fill: true,
                  title: 'Natural',
                  name: 'modification',
                  model: modificationModel.note,
                  value: NOTE_MODIFICATIONS.NATURAL
                },
                {
                  fill: true,
                  title: 'Flat',
                  name: 'modification',
                  model: modificationModel.note,
                  value: NOTE_MODIFICATIONS.FLAT
                },
                {
                  fill: true,
                  title: '2x Flat',
                  name: 'modification',
                  model: modificationModel.note,
                  value: NOTE_MODIFICATIONS.DOUBLE_FLAT
                },
                {
                  fill: true,
                  title: 'Sharp',
                  name: 'modification',
                  model: modificationModel.note,
                  value: NOTE_MODIFICATIONS.SHARP
                },
                {
                  fill: true,
                  title: '2x Sharp',
                  name: 'modification',
                  model: modificationModel.note,
                  value: NOTE_MODIFICATIONS.DOUBLE_SHARP
                }
              ]
            : [
                {
                  title: 'Dot',
                  name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_DOT
                },
                {
                  title: 'Triplet',
                  name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_TRIPLET
                },
                {
                  fill: true,
                  title: 'Natural',
                  name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION,
                  value: NOTE_MODIFICATIONS.NATURAL
                },
                {
                  fill: true,
                  title: 'Flat',
                  name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION,
                  value: NOTE_MODIFICATIONS.FLAT
                },
                {
                  fill: true,
                  title: '2x Flat',
                  name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION,
                  value: NOTE_MODIFICATIONS.DOUBLE_FLAT
                },
                {
                  fill: true,
                  title: 'Sharp',
                  name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION,
                  value: NOTE_MODIFICATIONS.SHARP
                },
                {
                  fill: true,
                  title: '2x Sharp',
                  name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION,
                  value: NOTE_MODIFICATIONS.DOUBLE_SHARP
                }
              ]
        ]
      };
    }
  },

  watch: {
    'trackPlayer.noteIndex'(index) {
      this.track.selectedIndex = index;
      // this.trackconsole.log(index);
    },

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

  mounted() {
    console.log('TRACK', this.track);
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
      this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION] =
        INPUT_OPERTATIONS.ADD;
      this.trackPlayer.reset();
      this.track.selectedIndex = -1;
    },
    async onClickPlay() {
      await this.setup();
      this.trackPlayer.play(this.selectedNoteIndex);
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

    async onClickNote({ note, selected }) {
      await this.setup();

      if (selected && note.name) {
        this.trackPlayer.instrument.triggerAttackRelease(note.name, note.time);
      }
    },

    addPause() {
      this.noteInput();
    },

    noteInput(operation, name) {
      const noteIndex = this.track.selectedIndex;
      if (operation === INPUT_OPERTATIONS.REPLACE) {
        const noteDescription = this.track.getCurrentNote();

        const { name: cleanName } = NoteDescriptionNote.parse(name);
        noteDescription.note.name = cleanName;
        return this.track.replaceNote(noteIndex, noteDescription);
      }

      const modification =
        this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_MODIFICATION];
      const note = new NoteDescriptionNote(name, { modification });
      const time = new NoteDescriptionTime(this.duration);
      time.dot = this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_DOT];
      time.triplet =
        this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_TRIPLET];

      const noteDescription = new NoteDescription({
        note,
        time
      });
      if (noteIndex > -1) {
        switch (operation) {
          case INPUT_OPERTATIONS.ADD:
            return this.track.addNoteTo(noteIndex, noteDescription);
          case INPUT_OPERTATIONS.REPLACE:
            return this.track.replaceNote(noteIndex, noteDescription);
        }
      }
      return this.track.addNote(noteDescription);
    },

    async onDownKeyboard(name) {
      await this.setup();
      this.noteInput(
        this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_OPERATION],
        name
      );
      // this.testTimeout = Tone.now();
      this.trackPlayer.instrument.triggerAttack(name);
    },

    async onUpKeyboard() {
      await this.tone.awaitReady;
      this.trackPlayer.instrument.triggerRelease();
      // console.log(new Tone.Time(Tone.now() - this.testTimeout).toNotation());
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

  & > div {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
  }

  &.keyboard-alignment-bottom {
    & > div {
      flex-direction: column-reverse;
    }
  }

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
  overflow-y: scroll;
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
