<template>
  <div
    ref="rootEl"
    class="wb-disks-extras13-web-paint"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut">
    <div class="main-content">
      <div
        v-if="ready"
        class="displays"
        :class="`display-${model.app.displays.length}`">
        <display
          v-for="(display, index) in model.app.displays"
          :key="index"
          :core="core"
          :model-value="model.app.currentDisplay?.id"
          :display="display"
          :current-tool="model.app.currentTool"
          :model="model"
          @update:model-value="model.app.setDisplay($event)" />
      </div>
      <layout-footer :core="core" :model="model" />
    </div>
    <layout-sidebar v-if="ready" :app="model.app" @click:tool="onClickTool" />
  </div>
</template>

<script lang="ts" setup>
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import { CONFIG_NAMES } from '../types';
import type { Model } from '../types';
import Display from './Display.vue';
import LayoutSidebar from './layout/Sidebar.vue';
import LayoutFooter from './layout/Footer.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Crosshair } from '@web-workbench/core/classes/Cursor';
import { CURSOR_TYPES } from '@web-workbench/core/classes/Cursor';
import type Core from '@web-workbench/core/classes/Core';
import { getTool } from '../utils/tool';
import domEvents from '@web-workbench/core/services/domEvents';

import type { ToolSelect } from '../types/select';
import useI18n from '../composables/useI18n';
import { isWebAssemblySupported } from '@web-workbench/core/services/dom';

const { t } = useI18n();
const $props = defineProps<{
  core: Core;
  model: Model;
}>();

if (!(await isWebAssemblySupported())) {
  $props.core?.errorObserver.next(
    new Error('WebAssembly is not supported in this environment.')
  );
}

const { setContextMenu, preserveContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();

const ready = ref(false);
onMounted(async () => {
  await $props.model.app.ready;
  ready.value = true;

  $props.core.modules.screen?.cursor.setCurrent(CURSOR_TYPES.CROSSHAIR);

  if (!$props.core.config.get(CONFIG_NAMES.WEB_PAINT_DEBUG)) {
    window.addEventListener('beforeunload', onBeforeUnload);
  }
});

function onBeforeUnload(event: BeforeUnloadEvent) {
  event.preventDefault();
  return t('warning.page_change');
}

onUnmounted(() => {
  $props.core.modules.screen?.cursor.setCurrent(undefined);
  window.removeEventListener('beforeunload', onBeforeUnload);
});

watch(() => $props.model.app.options.select.tool, updateTool, {
  immediate: true
});
watch(() => $props.model.app.options.select.color, updateTool, {});
watch(() => $props.model.app.options.select.brush, updateTool, {});

// #region tool

function updateTool() {
  const tool = $props.model.app.options.select.tool;
  if (tool?.value) {
    $props.model.app.setSelectOptions('tool', tool);
    const ToolClass = getTool(tool.value);
    $props.model.app.setTool(
      new ToolClass({
        app: $props.model.app,
        actions: $props.model.actions,
        domEvents: domEvents,
        options: {}
      })
    );
  }
}

async function onClickTool(e: MouseEvent, value: ToolSelect) {
  const ToolClass = getTool(value.value);
  const tool = new ToolClass({
    app: $props.model.app,
    actions: $props.model.actions,
    domEvents: domEvents,
    options: {}
  });
  await tool.click(e, value);
  tool.destroy();
}

watch(
  () => $props.model.app.options.select.color.primaryColor,
  ({ color }) => {
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
      (e.target as HTMLElement).closest('.wb-disks-extras13-web-paint')
    )
  ) {
    $props.core.modules.screen?.cursor.setCurrent(undefined);
  }
}
// #endregion
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint {
  --color-web-paint-border: var(--workbench-color-1);
  --color-web-paint-border-selected: var(--workbench-color-4);
  --scroll-bar-size: 0;

  position: relative;
  width: 100%;
  height: 100%;

  &,
  & * {
    cursor: none;
  }

  & .main-content {
    position: absolute;
    top: 0;
    right: 50px;
    left: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  & .wb-disks-extras13-web-paint-sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;
  }

  & .displays {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2px;
    height: 100%;
    background-color: var(--workbench-color-1);
    border-right-width: 0;

    & .wb-disks-extras13-web-paint-display {
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
