<template>
  <div class="wb-disks-extras13-synthesizer-debug-notes">
    <fieldset>
      <legend>Note Cache</legend>
      <wb-button
        :label="`Clear Cache (${noteRenderer.cache.size} Bitmaps)`"
        @click="noteRenderer.cache.clear()" />
    </fieldset>
    <fieldset>
      <legend>Notes</legend>
      <note-canvas @refresh="$emit('refresh')" />
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import WbButton from '@web-workbench/core/components/atoms/Button.vue';
import NoteCanvas from '../synthesizer/NoteCanvas.vue';

import NoteRenderer from '../../classes/NoteRenderer';

import { onMounted, nextTick } from 'vue';

const $emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const noteRenderer = new NoteRenderer();

onMounted(() => {
  console.log('DEBUG', {
    noteRenderer
  });
  nextTick(() => {
    $emit('refresh');
  });
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-debug-notes {
  /* position: absolute;
  inset: 0; */

  & fieldset {
    margin: calc(var(--default-element-margin) * 2);
  }
}
</style>
