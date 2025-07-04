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

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as Tone from 'tone';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/types';
import { CONFIG_NAMES } from '../../types';

import { getDecibelFromValue } from '../utils/note';
import TrackPlayer from '../classes/TrackPlayer';
import contextMenu from '../contextMenu';
import useTone from '../composables/useTone';
import Track from '../classes/Track';

import Navigation from './synthesizer/Navigation.vue';
import type { Item as NavigationItem } from './synthesizer/Navigation.vue';
import SynthesizerTimelineCanvas from './synthesizer/TimelineCanvas.vue';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../types';
import useCore from '@web-workbench/core/composables/useCore';

const $emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const $props = defineProps<{
  model: Model;
}>();

const { core } = useCore();
const { tone } = useTone();

const { preserveContextMenu, setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

watch(
  () => $props.model,
  () => {
    setContextMenu(contextMenu, {
      model: $props.model,
      preserveContextMenu: preserveContextMenu
    });
  },
  { immediate: true, deep: true }
);

const tracksEdit = ref<Record<string, boolean>>({});

const timelineRefreshKey = computed(() => `timeline-${bpm.value}`);
const project = computed(() => $props.model[CONFIG_NAMES.SYNTHESIZER_PROJECT]);
const tracks = computed({
  get: () => project.value.tracks,
  set: tracks => {
    project.value.tracks = tracks;
  }
});
const bpm = computed(() => Number($props.model[CONFIG_NAMES.SYNTHESIZER_BPM]));
const controlsNavigation = computed(() => ({
  model: $props.model,
  items: [
    [
      {
        text: `Project: ${project.value.name} | Tracks: ${tracks.value.length}`
      }
    ]
  ]
}));

const masterVolume = computed(() => {
  return core.value!.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG]
    .soundVolume;
});
// computed: {
//   timelineRefreshKey() {
//     return `timeline-${this.bpm}`;
//   },
//   project() {
//     return this.model[CONFIG_NAMES.SYNTHESIZER_PROJECT];
//   },
//   tracks: {
//     get() {
//       return this.project.tracks;
//     },
//     set(tracks) {
//       this.project.tracks = tracks;
//     }
//   },
//   bpm() {
//     return Number(this.model[CONFIG_NAMES.SYNTHESIZER_BPM]);
//   },
//   controlsNavigation() {
//     return {
//       model: this.model,
//       items: [
//         [
//           {
//             text: `Project: ${this.project.name} | Tracks: ${this.tracks.length}`
//           }
//         ]
//         // [
//         //   { spacer: true },
//         //   {
//         //     title: 'Play',
//         //     onClick: () => this.onClickPlay()
//         //   }
//         //   // this.channelPlayer.playing
//         //   //   ? {
//         //   //       selected: true,
//         //   //       title: 'Pause',
//         //   //       disabled:
//         //   //         !this.channelPlayer.currentSequence ||
//         //   //         !this.channelPlayer.playing,
//         //   //       onClick: () => this.onClickPlause()
//         //   //     }
//         //   //   : {
//         //   //       title: 'Play',
//         //   //       disabled: this.channelPlayer.playing,
//         //   //       onClick: () => this.onClickPlay()
//         //   //     },
//         //   // {
//         //   //   title: 'Stop',
//         //   //   disabled: !this.channelPlayer.currentSequence,
//         //   //   onClick: () => this.onClickStop()
//         //   // },
//         //   // {
//         //   //   title: 'Restart',
//         //   //   disabled: this.channelPlayer.noteIndex < 0,
//         //   //   onClick: () => this.onClickRestart()
//         //   // },
//         //   // {
//         //   //   title: 'Reset',
//         //   //   onClick: () => this.onClickReset()
//         //   // }]
//         // ]
//       ]
//     };
//   },

//   masterVolume() {
//     return this.core.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG]
//       .soundVolume;
//   },

//   decibelValue() {
//     return getDecibelFromValue(this.masterVolume);
//   }
// },

watch(
  () => masterVolume.value,
  newValue => {
    Tone.Master.volume.value = getDecibelFromValue(newValue);
  },
  { immediate: true }
);

watch(
  () => tracks.value,
  () => {
    nextTick(() => {
      $emit('refresh');
    });
  }
);

watch(
  () => bpm.value,
  bpm => {
    const transport = Tone.Transport;
    transport.stop();
    transport.bpm.value = 120;
    transport.seconds = 0;
    transport.bpm.value = bpm;
    transport.start();
  }
);

onMounted(() => {
  // this.model.actions.openDebugMidi();
  // this.model.actions.openDebugTimeline();
  const test = false;
  if (test) {
    nextTick(() => {
      console.log(tracks.value);
      editTrack(tracks.value[0]);
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
  nextTick(() => {
    $emit('refresh');
  });
});

onUnmounted(() => {
  $props.model.actions?.closeTracks();
});
const players = ref<TrackPlayer[]>([]);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onClickPlay() {
  await tone.start();
  players.value = tracks.value.map(track => {
    const trackPlayer = new TrackPlayer(track, { autoplay: false });
    trackPlayer.createInstrument();
    return trackPlayer;
  });
  const transport = Tone.Transport;
  transport.stop();
  transport.seconds = 0;
  transport.start();
  const sequences = players.value.map(player => player.play());
  sequences.map(sequence => sequence.start(0));
}

function getControls(track: Track): {
  items: NavigationItem[][];
} {
  const totalDuration = track.getDuration();

  return {
    items: [
      [
        { text: track.name },
        {
          spacer: true
        },
        { text: ` ${totalDuration}` },
        {
          label: 'Edit',
          action: async () => {
            console.log('Edit track', track);
            await tone.start();
            editTrack(new Track(track));
          }
        },
        {
          label: 'Remove',
          action: async () => {
            preserveContextMenu(true);
            await $props.model.actions!.removeTrack(track);
            preserveContextMenu(false);
            $emit('refresh');
          }
        }
      ]
    ]
  };
}

async function editTrack(track: Track) {
  tracksEdit.value[track.id] = true;
  const { close } = await $props.model.actions!.editTrack(track);
  const newTrack = await close;
  tracks.value = tracks.value.map(track => {
    if (track.id === newTrack.id) {
      return newTrack;
    }
    return track;
  });
  tracksEdit.value[track.id] = false;
  nextTick(() => {
    $emit('refresh');
  });
}
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
