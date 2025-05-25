<template>
  <div class="wb-disks-extras13-synthesizer-debug-timeline">
    <fieldset>
      <legend>Timelines</legend>
      <div>
        <timeline-canvas
          clickable
          :flip-active="false"
          :track="track"
          @refresh="$emit('refresh')" />
        <div class="controls">
          <wb-button
            label="prev"
            :disabled="track.selectedIndex <= -1"
            @click="track.selectPrevNote()" />
          <wb-button
            label="next"
            :disabled="track.selectedIndex >= track.notes.length - 1"
            @click="track.selectNextNote()" />
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import Track from '../../classes/Track';
import TimelineCanvas from '../synthesizer/TimelineCanvas.vue';

import { nextTick, onMounted, ref } from 'vue';

const $emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const track = ref<Track>(
  new Track({
    beatCount: 1,
    notes: [
      // ...Array(10)
      //   .fill({ name: 'C4', time: '32n', delay: 0 })
      //   .map((v, index) => {
      //     return {
      //       ...v,
      //       delay: index * 0.0625
      //     };
      //   }),
      // { name: 'C7', time: '8n', delay: 0 },
      // { name: 'C7', time: '8n', delay: 2 * 0.25 },
      // { name: 'C6', time: '32n', delay: 0 },
      // { name: 'C6', time: '32n', delay: 5 * 0.0625 },
      // { name: 'C5', time: '32n', delay: 0 },
      // { name: 'C5', time: '32n', delay: 8 * 0.0625 },
      // { name: 'C3', time: '32n', delay: 0 },
      // { name: 'C3', time: '32n', delay: 20 * 0.0625 },
      ...Array(100)
        .fill({ name: 'C2', time: '8t', delay: 0 })
        .map((v, index) => {
          return {
            ...v,
            delay: index * 0.25
          };
        }),
      ...Array(100)
        .fill({ name: 'C4', time: '16t', delay: 0 })
        .map((v, index) => {
          return {
            ...v,
            delay: index * 0.125
          };
        }),
      ...Array(100)
        .fill({ name: 'C6', time: '32t', delay: 0 })
        .map((v, index) => {
          return {
            ...v,
            delay: index * 0.0625
          };
        }),

      ...Array(100)
        .fill({ name: 'C2', time: '8t', delay: 0 })
        .map((v, index) => {
          return {
            ...v,
            delay: index * 0.25
          };
        }),
      ...Array(100)
        .fill({ name: 'C4', time: '16t', delay: 0 })
        .map((v, index) => {
          return {
            ...v,
            delay: index * 0.125
          };
        }),
      ...Array(100)
        .fill({ name: 'C6', time: '32t', delay: 0 })
        .map((v, index) => {
          return {
            ...v,
            delay: index * 0.0625
          };
        })
    ]
    // notes: [
    //   { name: 'C7', time: '1m', delay: 0 },
    //   { name: 'D5', time: '8n', delay: 0 },
    //   { name: 'C5', time: '8n', delay: 0.25 },
    //   { name: 'C5', time: '8n', delay: 0.5 },
    //   { name: 'C4', time: '4n', delay: 0 },
    //   { name: 'D4', time: '4n', delay: 0.5 },
    //   { name: 'C4', time: '4n', delay: 1 },
    //   { name: 'D4', time: '4n', delay: 1.5 },
    //   { name: 'D4', time: '4n', delay: 2 },
    //   { name: 'C4', time: '4n', delay: 2 },
    //   { name: 'C4', time: '1m', delay: 8 }
    // ]
  })
);

onMounted(() => {
  // console.log(this.track.getBeats({ selectedIndex: 2 }));
  // console.log(this.track.getVisibleBeats());
  nextTick(() => {
    $emit('refresh');
  });
});

/**
 * 16n: 0.0625
 * 8n: 0.25
 * 4n: 0.5
 * 2n: 1
 * 1n: 2
 * 1m: 2
 */
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-debug-timeline {
  & fieldset {
    margin: calc(var(--default-element-margin) * 2);
  }

  & .controls {
    display: flex;
    gap: var(--default-element-margin);
  }
}
</style>
