<template>
  <div class="wb-disks-workbench13-say-main">
    <app
      :model="model"
      @update:model-value="$emit('update:model-value', $event)" />
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

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const $emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-say-main {
  width: 100%;
  height: 100%;
}
</style>
