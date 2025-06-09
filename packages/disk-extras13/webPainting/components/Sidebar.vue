<template>
  <div class="sidebar">
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
