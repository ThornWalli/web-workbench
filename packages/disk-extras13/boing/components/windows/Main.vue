<template>
  <div class="wb-disks-extras13-boing-main">
    <app
      :key="optionsKey"
      :volume="volume"
      :renderer-options="model.rendererOptions"
      :options="model.options" />
  </div>
</template>

<script lang="ts" setup>
import contextMenu from '../../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../../types';
import App from '../App.vue';
import type { ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import { CONFIG_NAMES } from '@web-workbench/core/classes/Core/types';
import type Core from '@web-workbench/core/classes/Core';
import type { WindowLayout } from '@web-workbench/core/types/window';

const $props = defineProps<{
  core: Core;
  model: Model;
}>();

const parentLayout = inject<ComputedRef<WindowLayout>>('parentLayout');

const pixelSize = computed(() => Math.round(parentLayout.value.size.x / 320));
$props.model.actions.setPixelSize(pixelSize.value);

const optionsKey = computed(() => {
  return JSON.stringify({
    renderOptions: $props.model.rendererOptions,
    options: $props.model.options
  });
});

const { setContextMenu, preserveContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();

const volume = computed<number>(() => {
  return (
    $props.core.config?.observable[CONFIG_NAMES.SCREEN_CONFIG].soundVolume || 1
  );
});
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
