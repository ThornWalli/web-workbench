<template>
  <div class="wb-disks-extras13-synthesizer-project">
    <navigation v-bind="controlsNavigation" />
    <div class="tracks">
      <div v-if="tracks.length < 1" class="no-tracks">No tracks available…</div>
      <div v-for="track in tracks" :key="track.id" class="track">
        <navigation v-bind="getControls(track)" />
        <div class="sheet">
          <synthesizer-timeline-canvas
            :key="timelineRefreshKey"
            :track="track"
            :static="tracksEdit[track.id]"
            @refresh="$emit('refresh')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRef, watch } from 'vue';

import * as Tone from 'tone';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/utils';
import { getDecibelFromValue } from '../utils';
import TrackPlayer from '../classes/TrackPlayer';
import { CONFIG_NAMES } from '../synthesizer';
import contextMenu from '../contextMenu';
import useTone from '../composables/useTone';
import Track from '../classes/Track';

import Navigation from './synthesizer/Navigation';
import SynthesizerTimelineCanvas from './synthesizer/TimelineCanvas';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: { Navigation, SynthesizerTimelineCanvas },

  props: { model: { type: Object, required: true } },

  emits: ['refresh'],

  async setup(props) {
    const model = toRef(props, 'model');
    const windowContext = useWindow();
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

    // windowContext.setContextMenu(contextMenu, { model: model.value });
    return { ...windowContext, ...(await useTone()) };
  },

  data: function () {
    return {
      toneDestination: null,
      tracksEdit: {}
    };
  },

  computed: {
    timelineRefreshKey() {
      return `timeline-${this.bpm}`;
    },
    project() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_PROJECT];
    },
    tracks: {
      get() {
        return this.project.tracks;
      },
      set(tracks) {
        this.project.tracks = tracks;
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
              text: `Project: ${this.project.name} | Tracks: ${this.tracks.length}`
            }
          ]
          // [
          //   { spacer: true },
          //   {
          //     title: 'Play',
          //     onClick: () => this.onClickPlay()
          //   }
          //   // this.channelPlayer.playing
          //   //   ? {
          //   //       selected: true,
          //   //       title: 'Pause',
          //   //       disabled:
          //   //         !this.channelPlayer.currentSequence ||
          //   //         !this.channelPlayer.playing,
          //   //       onClick: () => this.onClickPlause()
          //   //     }
          //   //   : {
          //   //       title: 'Play',
          //   //       disabled: this.channelPlayer.playing,
          //   //       onClick: () => this.onClickPlay()
          //   //     },
          //   // {
          //   //   title: 'Stop',
          //   //   disabled: !this.channelPlayer.currentSequence,
          //   //   onClick: () => this.onClickStop()
          //   // },
          //   // {
          //   //   title: 'Restart',
          //   //   disabled: this.channelPlayer.noteIndex < 0,
          //   //   onClick: () => this.onClickRestart()
          //   // },
          //   // {
          //   //   title: 'Reset',
          //   //   onClick: () => this.onClickReset()
          //   // }]
          // ]
        ]
      };
    },

    masterVolume() {
      return this.core.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG]
        .soundVolume;
    },

    decibelValue() {
      return getDecibelFromValue(this.masterVolume);
    }
  },

  watch: {
    masterVolume: {
      handler() {
        Tone.Master.volume.value = this.decibelValue;
      },
      immediate: true
    },
    tracks() {
      this.$nextTick(() => {
        this.$emit('refresh');
      });
    },
    bpm: {
      handler(bpm) {
        const transport = this.tone.transport;
        transport.stop();
        transport.bpm.value = 120;
        transport.seconds = 0;
        transport.bpm.value = bpm;
        transport.start();
      }
    }
  },

  mounted() {
    // this.model.actions.openDebugMidi();
    // this.model.actions.openDebugTimeline();
    const test = true;
    if (test) {
      this.$nextTick(() => {
        console.log(this.tracks);
        this.editTrack(this.tracks[0], {
          // [CONFIG_NAMES.SYNTHESIZER_TRACK_SHOW_KEYBOARD]: false
        });
      });
    } else {
      // const data = await import('../midi/lemming-1.json');
      // this.tracks = data.tracks.map(track => {
      //   return new Track({
      //     name: `Channel ${track.channel}`,
      //     type: 'Synth',
      //     notes: fillWithPauses(track.notes),
      //     beatCount: 2
      //   });
      // });
    }
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
            label: 'Edit',
            onClick: async () => {
              await this.tone.start();
              this.editTrack(new Track(track), {
                toneDestination: this.toneDestination
              });
            }
          },
          {
            label: 'Remove',
            onClick: async () => {
              this.preserveContextMenu(true);
              await this.model.actions.removeTrack(track);
              this.preserveContextMenu(false);
              this.$emit('refresh');
            }
          }
        ]
      };
    },

    async editTrack(track) {
      this.tracksEdit[track.id] = true;
      const { close } = this.model.actions.editTrack(track);
      const newTrack = await close;
      this.tracks = this.tracks.map(track => {
        if (track.id === newTrack.id) {
          return newTrack;
        }
        return track;
      });
      this.tracksEdit[track.id] = false;
      this.$nextTick(() => {
        this.$emit('refresh');
      });
    }
  }
};
</script>
<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-project {
  /* position: absolute;
  inset: 0; */
}

.no-tracks {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: calc(8 * var(--default-element-margin)) 0;
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
