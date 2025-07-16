<template>
  <mc-screen class="mc-stats-screen-missing">
    <mc-text-drawer v-if="lines.length" :lines="lines" />
  </mc-screen>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import McScreen from '../../Screen.vue';
import McTextDrawer from '../../TextDrawer.vue';
import { CONSOLE_ALIGN } from '../../../observables/roundComplete/types';
import type { ConsoleSubGroupLines } from '../../../observables/roundComplete/types';

const lines = ref<ConsoleSubGroupLines>([
  { spacer: true },
  {
    align: CONSOLE_ALIGN.CENTER,
    class: 'blinking-error',
    color: 'red',
    content: 'Diese Seite ist '
  },
  {
    align: CONSOLE_ALIGN.CENTER,
    class: 'blinking-error',
    color: 'red',
    content: 'noch nicht implementiert.'
  },
  { spacer: true }
]);
</script>

<style lang="postcss" scoped>
:deep(.mc-text:not(.embed)) {
  padding-right: 0;
  padding-left: 0;

  & .mc-text-canvas {
    top: 2px;
    left: 0;
  }
}
</style>
