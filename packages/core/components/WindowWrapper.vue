<template>
  <div ref="rootEl" class="wb-components-window-wrapper">
    <slot />
    <template v-if="wrapper && ready">
      <wb-env-window
        v-for="window in sortedWindows"
        :key="window.id"
        v-bind="getWindowProps(window)"
        @ready="onReadyWindow"
        @focus="onFocusWindow"
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
import domEvents from '../services/domEvents';

import WindowWrapper from '../classes/WindowWrapper';
import WbEnvWindow from './Window.vue';
import type Window from '../classes/Window';
import useCore from '../composables/useCore';
import type {
  WindowCloseEventContext,
  WindowEventContext
} from '../types/component';

const { core } = useCore();

const $props = defineProps({
  parentLayout: {
    type: Object,
    default() {
      return {
        size: ipoint(window.innerWidth, window.innerHeight)
      };
    }
  },

  wrapper: {
    type: WindowWrapper,
    default: null
  }
});

const subscription = new Subscription();
const ready = ref(false);

const screenModul = core.value?.modules.screen;
const contentLayoutSize = computed(() => {
  return screenModul?.contentLayout.size;
});
const sortedWindows = computed(() => {
  return Array.from($props.wrapper.models).sort(
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
    componentData
  } = window;
  return {
    window,
    id,
    wrapper: $props.wrapper,
    layout,
    sidebarComponent,
    sidebarComponentData,
    component,
    componentData
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

const onReadyWindow = ({ id }: WindowEventContext) => {
  if ($props.wrapper.get(id)) {
    $props.wrapper.get(id)?.ready();
  }
};
const onFocusWindow = ({ id, focused }: WindowEventContext) => {
  if ($props.wrapper.get(id)) {
    if (focused) {
      $props.wrapper.get(id)?.focus();
    }
  }
};
const onUpWindow = ({ id }: WindowEventContext) => {
  $props.wrapper.setWindowUpDown(id, false);
};
const onDownWindow = ({ id }: WindowEventContext) => {
  $props.wrapper.setWindowUpDown(id, true);
};
const onCloseWindow = ({ id, componentData }: WindowCloseEventContext) => {
  if ($props.wrapper.get(id)) {
    $props.wrapper.get(id)?.close(componentData);
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
