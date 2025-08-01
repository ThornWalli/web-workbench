<template>
  <div
    v-if="info.length"
    class="tool-color-picker font-bit-font"
    :style="style">
    <div class="preview"></div>
    <div class="text">
      <div v-for="line in info" :key="line">{{ line }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type Tool from '../../lib/classes/Tool';
import type ToolPointerEvent from '../../lib/classes/ToolPointerEvent';
import type { NormalizedPointerEvent } from '@web-workbench/core/services/dom';
import type ColorPicker from '../../lib/classes/tool/interaction/ColorPicker';

const $props = defineProps<{
  currentTool?: Tool;
  getToolPointerEvent?: (e: NormalizedPointerEvent) => ToolPointerEvent;
}>();

const currentTool = computed(() => $props.currentTool as ColorPicker);

const style = computed(() => {
  const color = currentTool.value?.result?.color;
  return {
    '--color': color ? color.toHex() : '#000000'
  };
});
const info = computed(() => {
  if (currentTool.value.result) {
    return [
      `Color   : ${currentTool.value.result.color.toHex()}`,
      `Position: ${currentTool.value.result.position.x},${currentTool.value.result.position.y}`
    ];
  }
  return [];
});
</script>

<style lang="postcss" scoped>
.tool-color-picker {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: row;
  gap: 4px;
  padding: 4px;
  color: #fff;
  background: #000;

  & .preview {
    width: 20px;
    height: 20px;
    margin: 2px;
    background: var(--color);
  }

  & .text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
