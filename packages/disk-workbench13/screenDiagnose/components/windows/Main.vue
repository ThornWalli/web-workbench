<template>
  <div class="wb-disks-workbench13-screen-diagnose-main">
    <app :model="model" />
  </div>
</template>

<script lang="ts" setup>
import contextMenu from '../../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../../types';
import App from '../App.vue';

const { setContextMenu, preserveContextMenu } = useWindow();

const $props = defineProps<{
  model: Model;
}>();

setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-screen-diagnose-main {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
