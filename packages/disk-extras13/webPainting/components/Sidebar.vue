<template>
  <div class="sidebar">
    <wb-brush-select
      :model-value="app.options.select.brush"
      class="brush-select"
      @update:model-value="app.setBrush($event)" />
    <wb-tool-select
      :model-value="app.options.select.tool"
      class="tool-select"
      @update:model-value="app.setTool($event)" />
    <wb-color-select
      :model-value="app.options.select.color"
      class="color-select"
      @update:model-value="app.setColor($event)" />
    <teleport to="#debugWrapper">
      <pre class="debug">
        <!-- {{ app.options.select.co.valuelor }} -->
        {{ app.options.select.tool }}
        </pre>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import WbBrushSelect from './sidebar/BrushSelect.vue';
import WbToolSelect from './sidebar/ToolSelect.vue';
import WbColorSelect from './sidebar/ColorSelect.vue';
import type { App } from '../lib/App';

defineProps<{
  app: App;
}>();
</script>
