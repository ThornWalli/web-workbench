<template>
  <div class="wb-disks-extras13-web-paint-sidebar">
    <wb-brush-select
      :model-value="app.options.select.brush"
      class="brush-select"
      @update:model-value="app.setSelectOptions('brush', $event)"
      @click="onClickBrush" />
    <wb-tool-select
      :app="app"
      :model-value="app.options.select.tool"
      class="tool-select"
      @update:model-value="app.setSelectOptions('tool', $event)"
      @click="onClickTool" />
    <wb-color-select
      :model-value="app.options.select.color"
      class="color-select"
      @update:model-value="app.setSelectOptions('color', $event)"
      @click="onClickColor" />
  </div>
</template>

<script lang="ts" setup>
import WbBrushSelect from './sidebar/BrushSelect.vue';
import WbToolSelect from './sidebar/ToolSelect.vue';
import WbColorSelect from './sidebar/ColorSelect.vue';
import type { App } from '../lib/App';
import type { BrushSelect, ColorSelect, ToolSelect } from '../types/select';

const $emit = defineEmits<{
  (name: 'click:brush', e: MouseEvent, value: BrushSelect): void;
  (event: 'click:tool', e: MouseEvent, value: ToolSelect): void;
  (event: 'click:color', e: MouseEvent, value: ColorSelect): void;
}>();

defineProps<{
  app: App;
}>();

function onClickBrush(e: MouseEvent, value: BrushSelect) {
  $emit('click:brush', e, value);
}
function onClickTool(e: MouseEvent, value: ToolSelect) {
  $emit('click:tool', e, value);
}
function onClickColor(e: MouseEvent, value: ColorSelect) {
  $emit('click:color', e, value);
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-sidebar {
  --color-background: var(--color-disks-web-paint-sidebar-background, #fff);
  --color-border: var(--color-disks-web-paint-sidebar-border, #fff);

  display: flex;
  flex-direction: column;
  background: var(--color-background);
  border-right: solid var(--color-border) 2px;
  border-left: solid var(--color-border) 2px;

  & .color-select {
    flex: 1;
  }
}
</style>
