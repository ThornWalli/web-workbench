<template>
  <div ref="rootEl" class="wb-components-window-wrapper">
    <slot />
    <template v-if="wrapper && ready">
      <wb-env-window
        v-for="window in sortedWindows"
        :key="window.id"
        v-bind="getWindowProps(window)"
        @ready="onReadyWindow"
        @focused="onFocusedWindow"
        @close="onCloseWindow"
        @up="onUpWindow"
        @down="onDownWindow" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { ipoint } from '@js-basics/vector';
import webWorkbench from '@web-workbench/core';
import domEvents from '../services/domEvents';

import WindowWrapper from '../classes/WindowWrapper';
import WbEnvWindow from './Window.vue';
import type Window from '../classes/Window';
import Core from '../classes/Core';

const $props = defineProps({
  parentLayout: {
    type: Object,
    default() {
      return {
        size: ipoint(window.innerWidth, window.innerHeight)
      };
    }
  },

  core: {
    type: Core,
    default() {
      return webWorkbench;
    }
  },
  wrapper: {
    type: WindowWrapper,
    default() {
      return new WindowWrapper(webWorkbench, [
        {
          options: {
            title: 'Test',
            scrollX: false
          },
          layout: {
            position: ipoint(400, 400),
            size: ipoint(640, 400)
          }
        }
      ]);
    }
  }
});

const subscription = new Subscription();
const ready = ref(false);

const screenModul = $props.core.modules.screen;
const contentLayoutSize = computed(() => {
  return screenModul?.contentLayout.size;
});
const sortedWindows = computed(() => {
  return Array.from($props.wrapper.models.value).sort(
    (a, b) => (a.layout.zIndex || 0) - (b.layout.zIndex || 0)
  );
});

watch(
  () => $props.parentLayout,
  () => {
    refresh();
  },
  { deep: true }
);

watch(
  () => contentLayoutSize.value,
  size => {
    if (size) {
      $props.wrapper.setLayout({
        size
      });
    }
  }
);

watch(
  () => $props.wrapper,
  () => {
    refresh();
  }
);

onMounted(async () => {
  subscription.add(domEvents.resize.subscribe(onRefresh));
  await refresh(true);
  ready.value = true;
});

onUnmounted(() => {
  subscription.unsubscribe();
});

const getWindowProps = (window: Window) => {
  const {
    id,
    layout,
    sidebarComponent,
    sidebarComponentData,
    component,
    componentData,
    symbolWrapper
  } = window;
  return {
    window,
    id,
    wrapper: $props.wrapper,
    layout,
    sidebarComponent,
    sidebarComponentData,
    component,
    componentData,
    symbolWrapper
  };
};
const refresh = (force: boolean = false) => {
  if (force) {
    onRefresh();
    return Promise.resolve();
  }
  return new Promise(resolve => {
    nextTick(() => {
      window.setTimeout(() => {
        onRefresh();
        resolve(undefined);
      }, 500);
    });
  });
};

const rootEl = ref<HTMLElement | null>(null);

const onRefresh = () => {
  if (rootEl.value) {
    const { x, y, width, height } = rootEl.value.getBoundingClientRect();
    $props.wrapper.setLayout({
      position: ipoint(x, y),
      size: ipoint(width, height)
    });
  }
};

const onReadyWindow = (window: Window) => {
  if ($props.wrapper.get(window.id)) {
    $props.wrapper.get(window.id)?.ready();
  }
};
const onFocusedWindow = (window: Window, focused: boolean) => {
  if ($props.wrapper.get(window.id)) {
    if (focused) {
      $props.wrapper.get(window.id)?.focus();
    }
  }
};
const onUpWindow = (window: Window) => {
  $props.wrapper.setWindowUpDown(window.id, false);
};
const onDownWindow = (window: Window) => {
  $props.wrapper.setWindowUpDown(window.id, true);
};
const onCloseWindow = (window: Window, arg: unknown) => {
  if ($props.wrapper.get(window.id)) {
    $props.wrapper.get(window.id)?.close(arg);
  }
};

defineExpose({
  refresh
});
</script>

<style lang="postcss" scoped>
.wb-components-window-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
