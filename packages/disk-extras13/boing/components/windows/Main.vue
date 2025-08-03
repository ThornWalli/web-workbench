<template>
  <div class="wb-disks-extras13-boing-main">
    <app :model="model" />
  </div>
</template>

<script lang="ts" setup>
import contextMenu from '../../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../../types';
import App from '../App.vue';

const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu, preserveContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-boing-main {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  & > * {
    flex: 1;
  }
}
</style>
