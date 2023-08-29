<template>
  <div class="wb-disks-extras13-synthesizer-tracks">
    <navigation v-bind="controlsNavigation"></navigation>
    <div class="tracks">
      <div v-for="(track, index) in tracks" :key="index" class="instrument">
        <div class="sheet">
          <synthesizer-timeline-canvas
            :track="track"
            @refresh="$emit('refresh')"></synthesizer-timeline-canvas>
        </div>
        <navigation v-bind="getControls(track)"></navigation>
      </div>
    </div>
  </div>
</template>

<script>
import { toRef } from 'vue';
import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';
import * as Tone from 'tone';
import TrackPlayer from '../classes/TrackPlayer';
import { getDefaultModel, CONFIG_NAMES } from '../index';
import contextMenu from '../contextMenu';
import useTone from '../composables/useTone';
import Track from '../classes/Track';
import Navigation from './synthesizer/Navigation';
import SynthesizerTimelineCanvas from './synthesizer/TimelineCanvas';

export default {
  components: { Navigation, SynthesizerTimelineCanvas },

  props: {
    ...windowProps,
    model: { type: Object, default: getDefaultModel() }
  },

  emits: [...windowEmits, 'refresh'],
  setup(props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return { ...windowContext, ...useTone() };
  },

  data: function () {
    return {
      toneDestination: null
    };
  },

  computed: {
    tracks: {
      get() {
        return this.model[CONFIG_NAMES.SYNTHESIZER_TRACKS];
      },
      set(value) {
        return (this.model[CONFIG_NAMES.SYNTHESIZER_TRACKS] = value);
      }
    },
    bpm() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_BPM]);
    },
    controlsNavigation() {
      return {
        model: this.model,
        items: [
          [
            {
              text: `Project: ${'test'} | Tracks: ${this.tracks.length}`
            }
          ],
          [
            { spacer: true },
            {
              title: 'Play',
              onClick: () => this.onClickPlay()
            }
            // this.channelPlayer.playing
            //   ? {
            //       selected: true,
            //       title: 'Pause',
            //       disabled:
            //         !this.channelPlayer.currentSequence ||
            //         !this.channelPlayer.playing,
            //       onClick: () => this.onClickPlause()
            //     }
            //   : {
            //       title: 'Play',
            //       disabled: this.channelPlayer.playing,
            //       onClick: () => this.onClickPlay()
            //     },
            // {
            //   title: 'Stop',
            //   disabled: !this.channelPlayer.currentSequence,
            //   onClick: () => this.onClickStop()
            // },
            // {
            //   title: 'Restart',
            //   disabled: this.channelPlayer.noteIndex < 0,
            //   onClick: () => this.onClickRestart()
            // },
            // {
            //   title: 'Reset',
            //   onClick: () => this.onClickReset()
            // }]
          ]
        ]
      };
    }
  },

  // watch: {
  //   bpm: {
  //     handler(bpm) {
  //       console.log(this.tone);
  //       const transport = this.tone.transport;
  //       transport.stop();
  //       transport.bpm.value = 120;
  //       transport.seconds = 0;
  //       transport.bpm.value = bpm;
  //       transport.start();
  //     }
  //   }
  // },

  mounted() {
    // this.model.actions.openDebug();
    // const test = true;
    // if (test) {
    //   this.$nextTick(() => {
    //     console.log(this.tracks);
    //     this.editTrack(this.tracks[1], {
    //       // [CONFIG_NAMES.SYNTHESIZER_SHOW_KEYBOARD]: false
    //     });
    //   });
    // } else {
    //   const data = await import('../midi/lemming-1.json');
    //   this.tracks = data.tracks.map(track => {
    //     return new Track({
    //       name: `Channel ${track.channel}`,
    //       type: 'Synth',
    //       notes: fillWithPauses(track.notes),
    //       beatCount: 2
    //     });
    //   });
    // }
    // console.log(testData, this.tracks);
    //   await this.editTrack(this.instruments[0], {
    //     [CONFIG_NAMES.SYNTHESIZER_SHOW_KEYBOARD]: false
    //   }).ready;
    //   await this.editTrack(this.instruments[1], {
    //     [CONFIG_NAMES.SYNTHESIZER_SHOW_KEYBOARD]: false
    //   }).ready;
    //   window.setTimeout(() => {
    //     this.core.modules.windows.contentWrapper.setWindowPositions(
    //       WINDOW_POSITION.SPLIT_VERTICAL
    //     );
    //   }, 0);
    this.$nextTick(() => {
      this.$emit('refresh');
    });
  },
  unmounted() {
    this.model.actions.closeTracks();
  },

  methods: {
    async onClickPlay() {
      await this.tone.start();
      this.players = this.tracks.map(track => {
        const trackPlayer = new TrackPlayer(track, { autoplay: false });
        trackPlayer.createInstrument('Synth');
        return trackPlayer;
      });
      const transport = Tone.Transport;
      transport.stop();
      transport.seconds = 0;
      transport.start();
      const sequences = this.players.map(player => player.play());
      sequences.map(sequence => sequence.start(0));
    },
    getControls(track) {
      const totalDuration = track.getDuration();

      return {
        items: [
          { text: track.name },
          {
            spacer: true
          },
          { text: ` ${totalDuration}` },
          {
            title: 'Edit',
            onClick: async () => {
              await this.tone.start();
              this.editTrack(new Track(track), {
                toneDestination: this.toneDestination
              });
            }
          },
          {
            title: 'Remove',
            onClick: async () => {
              this.preserveContextMenu(true);
              const message = 'Track really removed?';
              const value = await this.core.executeCommand(
                `openDialog "${message}" -confirm`
              );
              if (value) {
                this.tracks = this.tracks.filter(item => item !== track);
              }
              this.preserveContextMenu(false);
              this.$emit('refresh');
            }
          }
        ]
      };
    },

    editTrack(...args) {
      return this.model.actions.editTrack(...args);
    }
  }
};
</script>
<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-tracks {
  /* position: absolute;
  inset: 0; */
}

.tracks {
  --color-scrollbar-primary: var(--color-dropdown-scrollbar-primary, #fff);
  --color-scrollbar-secondary: var(--color-dropdown-scrollbar-secondary, #05a);

  display: flex;
  flex-direction: column;
  gap: 0;
  padding-right: calc(2 * var(--default-element-margin));
}

.sheet {
  overflow: hidden;
}
</style>
