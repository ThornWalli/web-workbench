<template>
  <div class="wb-disks-extras13-web-basic-main">
    <app :model="model" />
  </div>
</template>

<script lang="ts" setup>
import useWindow from '@web-workbench/core/composables/useWindow';
import contextMenu from '../../contextMenu';
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
.wb-disks-extras13-web-basic-main {
  /* empty */
}
</style>
