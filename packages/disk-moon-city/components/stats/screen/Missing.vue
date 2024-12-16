<template>
  <mc-screen class="mc-stats-screen-missing">
    <mc-text-drawer v-if="lines.length" :lines="lines" />
  </mc-screen>
</template>

<script setup>
import McScreen from '../../Screen.vue';
import McTextDrawer from '../../TextDrawer.vue';

const lines = ref([
  { spacer: true },
  {
    align: 'center',
    class: 'blinking-error',
    color: 'red',
    content: 'Diese Seite ist '
  },
  {
    align: 'center',
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
