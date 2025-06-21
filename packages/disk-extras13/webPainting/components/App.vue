<template>
  <div
    ref="rootEl"
    class="wb-disks-extras13-web-painting"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut">
    <div
      v-if="ready"
      class="displays"
      :class="`display-${model.app.displays.length}`">
      <display
        v-for="(display, index) in model.app.displays"
        :key="index"
        :model-value="model.app.currentDisplay?.id"
        :display="display"
        :current-tool="currentTool"
        :app="model.app"
        @update:model-value="model.app.setDisplay($event)" />
    </div>
    <sidebar v-if="ready" :app="model.app" @click:tool="onClickTool" />
    <div id="debugWrapper" class="debug">
      <pre>{{
        [
          `STACK-MS: ${model.app.state.stackMaxSize}`,
          `STACK: ${model.app.state.stackCount}`,
          `STACK-I: ${model.app.state.stackIndex}`,
          `T: ${model.app.options.select.tool?.value}`,
          `B: ${model.app.options.select.brush?.type}/${model.app.options.select.brush?.size}`
        ].join('\n')
      }}</pre>
      <!-- <pre>
        {{ model.app.options.select }}
      </pre> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../types';
import Display from './Display.vue';
import Sidebar from './Sidebar.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Crosshair } from '@web-workbench/core/classes/Cursor';
import { CURSOR_TYPES } from '@web-workbench/core/classes/Cursor';
import type Core from '@web-workbench/core/classes/Core';
import { getTool } from '../utils/tool';
import domEvents from '@web-workbench/core/services/domEvents';
import type { ToolSelect } from '../types/select';

const $props = defineProps<{
  core: Core;
  model: Model;
}>();

const { setContextMenu, preserveContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();

const ready = ref(false);
onMounted(async () => {
  await $props.model.app.ready;
  ready.value = true;

  $props.core.modules.screen?.cursor.setCurrent(CURSOR_TYPES.CROSSHAIR);

  $props.model.actions?.openDebugColorPickers();
  // const value = await $props.model.actions?.openColorPicker(new Color(0, 0, 0));
  // console.log('Color Picker Value:', value);
});

onUnmounted(() => {
  $props.core.modules.screen?.cursor.setCurrent(undefined);
});

const currentTool = ref();
watch(() => $props.model.app.options.select.tool, updateTool, {
  immediate: true
});
watch(() => $props.model.app.options.select.color, updateTool, {});
watch(() => $props.model.app.options.select.brush, updateTool, {});

// #region tool

function updateTool() {
  const tool = $props.model.app.options.select.tool;
  if (tool?.value) {
    currentTool.value?.destroy();
    $props.model.app.setSelectOptions('tool', tool);
    const ToolClass = getTool(tool.value);
    currentTool.value = new ToolClass({
      app: $props.model.app,
      domEvents: domEvents
    });
  }
}

function onClickTool(e: MouseEvent, value: ToolSelect) {
  const ToolClass = getTool(value.value);
  const tool = new ToolClass({
    app: $props.model.app,
    domEvents: domEvents
  });
  tool.click(e, value);
}

watch(
  () => $props.model.app.options.select.color.primaryColor,
  color => {
    if ($props.core.modules.screen?.cursor.current) {
      const cursor = $props.core.modules.screen.cursor.current as Crosshair;
      cursor.options.color = color.toHex();
      console.log('Cursor color updated to:', cursor.options.color);
    }
  }
);

function onMouseOver() {
  $props.core.modules.screen?.cursor.setCurrent(CURSOR_TYPES.CROSSHAIR);
}

function onMouseOut(e: MouseEvent) {
  if (
    !(
      e.target &&
      (e.target as HTMLElement).closest('.wb-disks-extras13-web-painting')
    )
  ) {
    $props.core.modules.screen?.cursor.setCurrent(undefined);
  }
}

// #endregion
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting {
  --color-web-painting-border: var(--workbench-color-1);
  --color-web-painting-border-selected: var(--workbench-color-4);
  --scroll-bar-size: 0;

  position: relative;
  display: block;
  width: 100%;
  height: 100%;

  &,
  & * {
    cursor: none;
  }

  & .wb-disks-extras13-web-painting-sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;
  }

  & .debug {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: lime;
    background-color: black;

    & :deep(pre) {
      padding: 5px 10px;
      margin: 0;
      font-family: var(--font-bit-font);
      font-size: 8px;
      line-height: 12px;
    }
  }

  & .displays {
    position: absolute;
    top: 0;
    right: 50px;
    left: 0;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2px;
    height: 100%;
    background-color: var(--workbench-color-1);
    border-right-width: 0;

    & .wb-disks-extras13-web-painting-display {
      width: 100%;
      height: 100%;
    }

    &.display-2 {
      grid-template-columns: repeat(1, 1fr);
    }

    &.display-3 {
      grid-template-columns: repeat(2, 1fr);

      & :nth-child(3) {
        grid-column: 1 / 3;
      }
    }

    &.display-4 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
