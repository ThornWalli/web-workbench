<template>
  <div class="wb-disks-extras13-synthesizer-track" :class="styleClasses">
    <div>
      <div>
        <div v-if="showKeyboard" class="keyboard">
          <keyboard
            :disabled="trackPlayer.playing"
            v-bind="keybordData"
            @down="onDownKeyboard"
            @up="onUpKeyboard" />
          <div
            v-if="hasMidi && !midiControllerListener"
            class="midi-message"
            @click="onClickActivateMidi">
            <div>
              <div>
                <span
                  >Click here, or press <strong>Enter</strong> to activate the
                  Midi Keyboard!</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <navigation v-bind="navigation"></navigation>
      <div class="sheet">
        <metronom
          :model="metronom"
          @render="onRender"
          @ready="onReady"
          @value="track.currentDuration = $event">
          <template #background="{ onRefresh }">
            <timeline-canvas
              v-bind="timelineCanvasData"
              clickable
              @refresh="onRefresh"
              @note:click="onClickNote" />
          </template>
        </metronom>
      </div>
      <div class="panel">
        <!-- <navigation v-bind="navigation"></navigation> -->

        <navigation v-bind="metronomNavigation"></navigation>
      </div>
    </div>
    <!-- <navigation v-bind="{ metronomNavigation, }"></navigation> -->
    <wb-env-molecule-footer
      v-bind="footer"
      :parent-layout="windowsModule.contentWrapper.layout" />
  </div>
</template>

<script>
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/utils';
import { Subscription, filter, debounce, timer } from 'rxjs';
import domEvents from '@web-workbench/core/services/domEvents';

import { reactive, watch, toRef, markRaw } from 'vue';

import WbEnvMoleculeFooter from '@web-workbench/core/components/molecules/Footer';
import useWindow from '@web-workbench/core/composables/useWindow';

import {
  generateMenuItems,
  MENU_ITEM_TYPE
} from '@web-workbench/core/classes/MenuItem';
import MetronomClass from '../classes/Metronom';
import MidiController from '../classes/MidiController';
import useTone from '../composables/useTone';
import NoteDescription from '../classes/NoteDescription';
import { getInstruments, getNoteTimes } from '../utils';
import {
  getDefaultModel,
  getDefaultTrackModel,
  CONFIG_NAMES
} from '../synthesizer';
import contextMenu from '../contextMenu';
import TrackPlayer from '../classes/TrackPlayer';
import TimelineCanvas from './synthesizer/TimelineCanvas';
import Navigation from './synthesizer/Navigation';
import Metronom from './synthesizer/Metronom';
import Keyboard from './synthesizer/Keyboard';

export default {
  components: {
    TimelineCanvas,
    Navigation,
    Metronom,
    Keyboard,
    WbEnvMoleculeFooter
  },
  props: {
    model: { type: Object, default: getDefaultModel() },
    trackModel: { type: Object, default: getDefaultTrackModel() },
    toneDestination: { type: Object, default: null }
  },

  emits: ['refresh'],

  async setup(props) {
    const model = toRef(props, 'model');
    const trackModel = toRef(props, 'trackModel');
    const windowContext = useWindow();
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
    console.log('track', track);

    const metronom = reactive(new MetronomClass(track));
    const trackPlayer = reactive(new TrackPlayer(track));
    console.log('trackPlayer', trackPlayer);

    const tone = await useTone();
    const midiController = new MidiController();
    await midiController.start();
    const hasMidi = midiController.hasInputs;

    return {
      ...windowContext,
      ...tone,
      metronom,
      track,
      trackPlayer,
      midiController,
      hasMidi
    };
  },

  data() {
    return {
      windowsModule: markRaw(this.core.modules.windows),
      duration: 0,
      // model: {
      //   input: 'note',
      //   inputType: ''
      // },
      subscriptions: new Subscription(),
      midiControllerListener: null,
      openNotes: new Map(),
      footerModel: {}
    };
  },

  computed: {
    styleClasses() {
      return {
        [`keyboard-align-${
          this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_ALIGN]
        }`]: true
      };
    },
    showKeyboard() {
      return this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_KEYBOARD];
    },
    inputNote() {
      return this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_NOTE];
    },
    bpm() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_BPM]);
    },
    trackPlayerIndex() {
      return Object.values(this.trackPlayer.sequenceNoteIndex).flat();
    },
    selectedNotes() {
      return this.track.notes.filter(note =>
        Object.values(this.trackPlayer.sequenceNoteIndex)
          .flat()
          .includes(note.index)
      );
    },
    timelineCanvasData() {
      return {
        track: this.track,
        duration: this.metronom.getDuration()
      };
    },
    keybordData() {
      return {
        size: this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_KEYBOARD_SIZE],
        showNoteLabels:
          this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_NOTE_LABELS],
        startOctave:
          this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_START_OCTAVE],
        octaveCount:
          this.trackModel[CONFIG_NAMES.SYNTHESIZER_TRACK_OCTAVE_COUNT],
        selectedNotes: this.selectedNotes
      };
    },
    metronomNavigation() {
      return {
        model: this.metronom,
        items: [
          [
            {
              icon: 'skipPrev',
              label: 'Prev Beat',
              hideLabel: true,
              disabled: this.metronom.value === 0,
              action: () => {
                this.metronom.reset();
              }
            },
            {
              icon: 'doublePrev',
              label: 'Prev Beat',
              hideLabel: true,
              disabled: Math.floor(this.metronom.currentBeat / 2) === 0,
              action: () => {
                this.metronom.prevBeat();
              }
            },
            {
              icon: 'prev',
              label: 'Prev',
              hideLabel: true,
              disabled: this.metronom.value === 0,
              action: () => {
                this.metronom.prev();
              }
            },
            {
              icon: 'reset',
              iconAlign: 'right',
              label: 'Next',
              disabled:
                this.metronom.value / 2 -
                  Math.floor(this.metronom.currentBeat) ===
                0,
              hideLabel: true,
              action: () => {
                this.metronom.setBeat(this.metronom.currentBeat);
              }
            },
            {
              icon: 'next',
              iconAlign: 'right',
              label: 'Next',
              hideLabel: true,
              action: () => {
                this.metronom.next();
              }
            },
            {
              icon: 'doubleNext',
              label: 'Next Beat',
              hideLabel: true,
              action: () => {
                this.metronom.nextBeat();
              }
            },
            { spacer: true },
            {
              text: `Duration: ${this.metronom.value.toFixed(2)}`
            },
            {
              text: `Beat: ${this.metronom.currentBeat}-${
                this.metronom.currentBeat + this.metronom.beatCount
              }`
            }
          ],
          [
            ...getNoteTimes().map(([title]) => ({
              label: `1/${title.replace(/(\d+)[nm]/, '$1')} n`,
              name: 'time',
              value: title
            })),
            { spacer: true }
          ]
        ]
      };
    },

    navigation() {
      return {
        model: this.trackModel,
        items: [
          [
            { text: 'Input:' },
            {
              label: 'Note',
              value: 'note',
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT
            },
            {
              label: 'Pause',
              value: 'pause',
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT,
              disabled: true
            },
            { spacer: true },
            {
              label: 'Remove Note',
              action: () => {
                this.track.removeNote(this.track.selectedIndex);
              }
            },
            {
              label: 'Clean Range',
              action: () => {
                this.track.removeNotesByDurationRange(
                  this.metronom.getDuration(),
                  this.metronom.timeDuration
                );
              }
            },
            {
              label: 'Clean Beat',
              action: () => {
                this.track.removeNotesFromBeat(this.track.getBeatIndex());
              }
            },
            {
              label: 'Reset',
              action: () => {
                this.reset();
              }
            }
          ],
          [
            { text: 'Note:&nbsp;' },
            {
              label: 'Auto',
              value: '',
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_NOTE
            },
            ...getNoteTimes().map(([title]) => ({
              label: `1/${title.replace(/(\d+)[nm]/, '$1')} n`,
              name: CONFIG_NAMES.SYNTHESIZER_TRACK_INPUT_NOTE,
              value: title
            })),
            { spacer: true },
            this.trackPlayer.playing
              ? {
                  selected: true,
                  label: 'Pause',
                  icon: 'pause',
                  disabled:
                    !this.trackPlayer.currentSequence ||
                    !this.trackPlayer.playing,
                  onClick: () => this.onClickPlause()
                }
              : {
                  label: 'Play',
                  icon: 'play',
                  disabled:
                    this.trackPlayer.playing || this.track.notes.length === 0,
                  onClick: () => this.onClickPlay()
                },
            {
              label: 'Stop',
              icon: 'stop',
              disabled: !this.trackPlayer.currentSequence,
              onClick: () => this.onClickStop()
            },
            {
              label: 'Restart',
              disabled: this.track.selectedIndex > -1,
              onClick: () => this.onClickRestart()
            }
            // [
            //   // {
            //   //   label: 'Prev Note',
            //   //   action: () => {
            //   //     this.track.selectPrevNote();
            //   //   }
            //   // },
            //   // {
            //   //   label: 'Next Note',
            //   //   action: () => {
            //   //     this.track.selectNextNote();
            //   //   }
            //   // },
            // ]

            // {
            //   fill: true,
            //   label: this.isPlaying ? 'Pause' : 'Start',
            //   action: async () => {
            //     if (this.isPlaying) {
            //       this.$emit('pause');
            //     } else {
            //       await this.tone.start();
            //       this.$emit('start');
            //     }
            //   }
            // },
            // this.notes.map(([value, title]) => ({
            //   label: `${title} Note`,
            //   name: 'time',
            //   value
            // })),
            // [1, 1.2, 2, 4, 8, 16, 32].map(value => ({
            //   label: `${value} X`,
            //   name: 'speed',
            //   value
            // }))
          ]
        ]
      };
    },

    footer() {
      const track = this.track;
      const model = this.trackModel;
      const totalDuration = track.getDuration().toFixed(2);
      return {
        items: generateMenuItems([
          ...[
            {
              options: {
                disabled: !this.hasMidi
              },
              title: `MIDI (${
                this.midiController.input
                  ? this.midiController.input.name
                  : 'OFF'
              })`,
              action: async () => {
                if (!this.midiControllerListener) {
                  // listen to first input
                  await this.registerMidiListener();
                }
              },
              items:
                this.midiController.ready && this.midiControllerListener
                  ? [
                      {
                        title: 'Inputs',
                        items: this.midiController.inputs.map(
                          (input, index) => ({
                            title: input.name,
                            model: this.midiController,
                            name: 'activeInput',
                            type: MENU_ITEM_TYPE.RADIO,
                            value: input.id,
                            action: async () => {
                              await this.registerMidiListener(
                                this.midiController.listen(index)
                              );
                            }
                          })
                        )
                      },
                      {
                        title: 'Input Channel',
                        items: Array(16)
                          .fill(null)
                          .map((v, index) => ({
                            title: String(index + 1),
                            value: index + 1,
                            type: MENU_ITEM_TYPE.RADIO,
                            model: this.midiController,
                            name: 'inputChannel',
                            action: async () => {
                              await this.registerMidiListener(
                                this.midiController.listen(
                                  this.midiController.input
                                )
                              );
                            }
                          }))
                      },
                      {
                        title: 'Outputs',
                        items: this.midiController.outputs.map(output => ({
                          title: output.name,
                          model: this.midiController,
                          name: 'activeOutput',
                          type: MENU_ITEM_TYPE.RADIO,
                          value: output.id,
                          action() {
                            // midiController.listen(output);
                          }
                        }))
                      },
                      { type: MENU_ITEM_TYPE.SEPARATOR },
                      {
                        title: 'Disconnect',
                        action: () => {
                          this.midiControllerListener?.unsubscribe();
                          this.midiControllerListener = null;
                          this.midiController.unlisten();
                        }
                      }
                    ]
                  : []
            },
            {
              type: MENU_ITEM_TYPE.SEPARATOR
            }
          ],
          {
            type: MENU_ITEM_TYPE.DEFAULT,
            title: `Instr.: ${this.track.type}`,
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
            text: `BPM: ${this.bpm}`
          },
          {
            type: MENU_ITEM_TYPE.TEXT,
            text: `Dur.: ${totalDuration}`
          }
          // {
          //   type: MENU_ITEM_TYPE.TEXT,
          //   text: `${this.decibelValue.toFixed(2)} db`
          // }
        ])
      };
    }
  },

  watch: {
    'track.beatCount'(value) {
      this.metronom.beatCount = value;
    }

    // 'track.type': {
    //   handler() {
    //     this.trackPlayer.createInstrument();
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    console.log('TRACK', this.track);
    this.subscriptions.add(
      domEvents.keydown
        .pipe(
          debounce(() => timer(100)),
          filter(e => e.key === 'Enter')
        )
        .subscribe(() => {
          this.onClickActivateMidi();
        })
    );
    // try {
    //   await this.midiController.start();
    //   const observable = this.midiController.listen();
    //   this.subscriptions.add(
    //     observable
    //       .pipe(filter(({ type }) => type === 'noteOn'))
    //       .subscribe(this.onNoteOn.bind(this)),
    //     observable
    //       .pipe(filter(({ type }) => type === 'noteOff'))
    //       .subscribe(this.onNoteOff.bind(this))
    //   );
    // } catch (error) {
    //   console.warn(error);
    // }

    this.subscriptions.add(
      domEvents.keydown.pipe(debounce(() => timer(100))).subscribe(e => {
        switch (e.code) {
          case 'ArrowLeft':
            this.metronom.prev();
            break;
          case 'ArrowRight':
            this.metronom.next();
            break;
          case 'ArrowUp':
            this.metronom.prevBeat();
            break;
          case 'ArrowDown':
            this.metronom.nextBeat();
            break;
          default:
            if (/Digit(\d+)/.test(e.code)) {
              const number = e.code.replace(/Digit(\d+)/, '$1');

              const time = getNoteTimes()[number - 1];
              if (time) {
                this.metronom.time = time[0];
              }
            }
            break;
        }
        console.log(e);
      })
    );

    this.$nextTick(() => {
      this.$emit('refresh');
    });
  },

  unmounted() {
    this.subscriptions.unsubscribe();
    this.midiController.destroy();
  },

  methods: {
    async registerMidiListener(input) {
      try {
        await this.midiController.start();
        const observable = this.midiController.listen(
          // eslint-disable-next-line security/detect-object-injection
          (input > -1 && this.midiController.inputs[input]) ||
            this.midiController.inputs[0]
        );
        this.midiControllerListener?.unsubscribe();
        this.midiControllerListener = new Subscription();
        this.midiControllerListener.add(
          observable
            .pipe(filter(({ type }) => type === 'noteOn'))
            .subscribe(this.onNoteOn.bind(this)),
          observable
            .pipe(filter(({ type }) => type === 'noteOff'))
            .subscribe(this.onNoteOff.bind(this)),

          observable
            .pipe(filter(({ type }) => type === 'volume'))
            .subscribe(({ value }) => {
              console.log('Volume: ', value);
              this.core.config.set(CORE_CONFIG_NAMES.SCREEN_CONFIG, {
                ...this.core.config.get(CORE_CONFIG_NAMES.SCREEN_CONFIG),
                soundVolume: value
              });
            })
        );
      } catch (error) {
        console.warn(error);
      }
    },
    async setup() {
      if (!this.tone.ready) {
        await this.tone.start();
        this.trackPlayer.createInstrument();
      }
    },

    onReady({ render }) {
      this._render = render;
    },
    onRender(ctx, { position, dimension }) {
      if (this.inputNote === 'auto') {
        const openNotes = Array.from(this.openNotes.values());
        for (let i = 0; i < openNotes.length; i++) {
          const openNote = openNotes[Number(i)];
          const duration =
            (this.metronom.now() - openNote) / 1000 / (this.metronom.speed * 2);
          const w = (duration * dimension.x) / this.track.beatCount;
          ctx.fillRect(position.x, position.y, w, dimension.y);
        }
      }
    },

    async onNoteOn({ value }) {
      await this.setup();
      const name = value.identifier;
      console.log('value.identifier', name, this.metronom.getDuration());
      this.startNote(name);
      this.trackPlayer.triggerAttack(name);
    },
    async onNoteOff({ value }) {
      this.endNote(value.identifier);
      await this.tone.ready;
      this.trackPlayer.triggerRelease();
    },

    startNote(name) {
      if (!this.animationLoop) {
        this.animationLoop = animationLoop(() => {
          this._render && this._render();
        });
      }
      this.openNotes.set(name, this.metronom.now());
    },
    endNote(name) {
      const timeList = [1, 2, 4, 8, 16, 32]
        .map(v => {
          return [`${v}n`, `${v}t`, `${v}n.`];
        })
        .flat()
        .map(v => [v, new (this.tone.getTone().Time)(v).toSeconds()])
        .sort((a, b) => b[1] - a[1]);

      const duration = Math.max(
        (this.metronom.now() - this.openNotes.get(name)) / 1000,
        timeList[timeList.length - 1][1]
      );
      this.openNotes.delete(name);

      const { Time } = this.tone.getTone();
      let time;
      if (this.inputNote) {
        time = new Time(this.inputNote);
      } else {
        time = new Time(
          timeList
            .map(([, v]) => v)
            .find(v => {
              const offset = v * 0.2;

              return v - offset <= duration && duration <= v + offset;
            })
        );
      }

      const delay = this.metronom.getDuration();
      console.log({
        delay,
        name,
        time: time.toNotation()
      });
      this.track.addNote(
        new NoteDescription({
          delay,
          name,
          time: time.toNotation()
        })
      );

      if (this.openNotes.size < 1) {
        this.animationLoop?.stop();
        this.animationLoop = null;
      }
    },

    async onClickNote({ note, selected }) {
      await this.setup();
      if (selected && note.getName()) {
        this.trackPlayer.triggerAttackRelease(note);
      }
    },

    async onClickPlay() {
      await this.setup();
      this.trackPlayer.play();
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

    async onDownKeyboard(name) {
      await this.setup();
      this.startNote(name);
      this.trackPlayer.triggerAttack(name);
    },

    async onUpKeyboard(name) {
      await this.tone.awaitReady;
      this.endNote(name);
      this.trackPlayer.triggerRelease();
      // console.log(new Tone.Time(Tone.now() - this.testTimeout).toNotation());
    },

    reset() {
      this.track.reset();
    },

    onClickActivateMidi() {
      this.registerMidiListener();
    }
  }
};

function animationLoop(cb) {
  let lastTime = 0;
  let total = 0;
  let stopped = false;
  const loop = time => {
    const delta = time - lastTime;
    lastTime = time;
    total += delta;
    cb(time, total);
    if (!stopped) {
      requestAnimationFrame(loop);
    }
  };
  requestAnimationFrame(loop);
  return {
    stop: () => (stopped = true)
  };
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-track {
  --color-scrollbar-primary: var(--color-dropdown-scrollbar-primary, #fff);
  --color-scrollbar-secondary: var(--color-dropdown-scrollbar-secondary, #05a);

  display: flex;
  flex-direction: column;
  height: 100%;

  & > div:first-child {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
  }

  &.keyboard-align-bottom {
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

.midi-message {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  & > div {
    width: min(300px, 80%);
    padding: 2px;
    color: black;
    text-align: center;
    border: solid white 2px;

    & > div {
      padding: calc(2 * var(--default-element-margin));
      text-align: center;
      background: #fff;
    }
  }
}

.panel {
  display: flex;
  flex-direction: column;

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

  /* & .spacer {
    flex: 1;
  } */
}
</style>
