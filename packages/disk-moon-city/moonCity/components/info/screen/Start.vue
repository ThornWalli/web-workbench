<template>
  <mc-screen class="mc-stats-screen-missing">
    <mc-text-drawer v-if="lines.length" :lines="lines" />
  </mc-screen>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import McScreen from '../../Screen.vue';
import McTextDrawer from '../../TextDrawer.vue';
import type { ConsoleLine } from '@web-workbench/disk-moon-city/moonCity/observables/roundComplete/types';
import { CONSOLE_ALIGN } from '@web-workbench/disk-moon-city/moonCity/observables/roundComplete/types';
import { COLOR } from '@web-workbench/disk-moon-city/moonCity/utils/color';

const lines = ref<ConsoleLine[]>([
  {
    spacer: true
  },
  {
    color: COLOR.BLUE,
    content: 'Hilfssystem',
    align: CONSOLE_ALIGN.CENTER
  },
  {
    spacer: true
  }
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
