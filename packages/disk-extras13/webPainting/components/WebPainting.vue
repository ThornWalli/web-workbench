<template>
  <div
    ref="rootEl"
    class="wb-disks-extras13-web-painting"
    :class="styleClasses"
    :style="style">
    <div ref="displaysEl" class="displays">
      <wb-display
        v-for="display in model.app.displays"
        :key="display.id"
        :model="display" />
    </div>
    <div class="sidebar">
      <wb-brush-select v-model="brushSelect" class="brush-select" />
      <wb-tool-select v-model="toolSelect" class="tool-select" />
      <wb-color-select v-model="colorSelect" class="color-select" />
    </div>
    <wb-debug v-if="debug" :model-value="model.app" class="debug" />
  </div>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { ipoint } from '@js-basics/vector';
import scrollBar from '@web-workbench/core/services/dom';
import { getLayoutFromElement } from '@web-workbench/core/utils/layout';
import { CURSOR_TYPES } from '@web-workbench/core/classes/Cursor';

import Bounds from '../lib/Bounds';
import contextMenu from '../contextMenu';

import WbDebug from './webPainting/Debug.vue';
import WbColorSelect from './webPainting/ColorSelect.vue';
import WbToolSelect from './webPainting/ToolSelect.vue';
import WbBrushSelect from './webPainting/BrushSelect.vue';
import WbDisplay from './webPainting/Display.vue';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../types';
import useCore from '@web-workbench/core/composables/useCore';

const { core } = useCore();
const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu, preserveContextMenu, parentFocused } = useWindow();
setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();

const displaysEl = ref<HTMLElement | null>(null);
const rootEl = ref<HTMLElement | null>(null);

const subscription = new Subscription();
const debug = ref(false);
const ready = ref(false);
const cursor = ref(null);

// #region Computed

const colorSelect = computed({
  get() {
    return $props.model.app.colorSelect;
  },
  set(value) {
    $props.model.app.setColorSelect(value);
  }
});
const brushSelect = computed({
  get() {
    return $props.model.app.brushSelect;
  },
  set(value) {
    $props.model.app.setBrushSelect(value);
  }
});
const toolSelect = computed({
  get() {
    return $props.model.app.toolSelect;
  },
  set(value) {
    $props.model.app.setToolSelect(value);
  }
});

const brushSelectIndex = computed(() => {
  return brushSelect.value.index;
});
const brushSelectSize = computed(() => {
  return brushSelect.value.size;
});
const toolSelectIndex = computed(() => {
  return toolSelect.value.index;
});
const displaySplit = computed(() => {
  return $props.model.app.displaySplit;
});
const style = computed(() => {
  return {
    '--scroll-bar-size': `${scrollBar.size}`,
    '--cursor': `url(${cursor.value})`
  };
});
const styleClasses = computed(() => {
  return {
    ready: ready.value,
    [`display-${$props.model.app.displays.length}`]: true
  };
});

// #endregion

// #region Watchers

watch(
  () => parentFocused.value,
  focused => {
    setCursor(focused);
  }
);
watch(
  () => toolSelectIndex.value,
  () => {
    $props.model.app.setTool(toolSelect.value);
    renderCursor();
  }
);
watch(
  () => brushSelectIndex.value,
  () => {
    $props.model.app.setBrush(brushSelect.value);
    renderCursor();
  }
);
watch(
  () => brushSelectSize.value,
  value => {
    $props.model.app.setBrushSize(value);
    renderCursor();
  }
);
watch(
  () => colorSelect.value.primaryColor,
  () => {
    renderCursor();
  }
);
watch(
  () => displaySplit.value,
  () => {
    createDisplays();
  }
);

// #endregion

// #region Initialization

onMounted(() => {
  const parentElement = rootEl.value?.parentElement;
  if (parentElement && displaysEl.value) {
    $props.model.app.setDisplaysElement(displaysEl.value);

    $props.model.app.refresh();
    createDisplays();

    renderCursor();

    nextTick(() => {
      const layout = getLayoutFromElement(parentElement);
      $props.model.app.updateGlobalBounds(
        new Bounds(
          layout.position,
          ipoint(() => layout.position + layout.size)
        )
      );
      setCursor(parentFocused.value);
      ready.value = true;
    });
  }
});

onUnmounted(() => {
  core.value?.modules.screen?.cursor.setCurrent(undefined);
  subscription.unsubscribe();
});

// #endregion

// #region Methods

function setCursor(active: boolean) {
  core.value?.modules.screen?.cursor.setCurrent(
    active ? CURSOR_TYPES.CROSSHAIR : undefined
  );
}
function renderCursor() {
  const currentCursor = core.value?.modules.screen?.cursor.current;
  if (currentCursor) {
    currentCursor.options.color = colorSelect.value.primaryColor.toRGBA();
    currentCursor.options.size = Math.min(brushSelectSize.value, 2);
  }
}
function createDisplays() {
  $props.model.app.clearDisplays();
  for (let i = 0; i <= $props.model.app.displaySplit; i++) {
    $props.model.app.addDisplay();
  }
  nextTick(() => {
    $props.model.app.refreshDisplayPositions();
    $props.model.app.refreshDisplays();
  });
}

// #endregion
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting {
  --color-web-painting-border: #fff;
  --scroll-bar-size: 0;

  position: relative;
  display: block;
  width: 100%;
  height: 100%;

  &,
  & * {
    cursor: none;
  }

  &.display-2 {
    & div:nth-child(1) {
      border-right-width: 1px;
    }

    & div:nth-child(2) {
      border-left-width: 1px;
    }
  }

  & .displays {
    position: absolute;
    top: 0;
    left: 0;
    clear: fix;
    width: calc(100% - 50px);
    height: 100%;
    border-right-width: 0;

    & > div {
      float: left;
      border: solid var(--color-web-painting-border) 0;
    }
  }

  &.display-3 {
    & .displays {
      & div:nth-child(1) {
        border-bottom-width: 1px;
      }

      & div:nth-child(2) {
        border-right-width: 1px;

        &,
        & + div {
          border-top-width: 1px;
        }

        & + div {
          border-left-width: 1px;
        }
      }
    }
  }

  &.display-4 {
    & .displays {
      /* div:nth-child(1) {
            border-bottom-width: 1px;
          } */
      & div:nth-child(1) {
        border-right-width: 1px;

        &,
        & + div {
          border-bottom-width: 1px;
        }

        & + div {
          border-left-width: 1px;
        }
      }

      & div:nth-child(3) {
        border-right-width: 1px;

        &,
        & + div {
          border-top-width: 1px;
        }

        & + div {
          border-left-width: 1px;
        }
      }
    }
  }

  & .sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;
  }

  & .color-select {
    position: absolute;
    top: 258px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;

    & > ul {
      width: calc(100% + var(--scroll-bar-size) * 1px);
      height: 100%;
      overflow-y: scroll;
    }
  }
}
</style>
