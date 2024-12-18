<template>
  <aside
    ref="rootEl"
    class="wb-components-window"
    :class="styleClasses"
    :style="style"
    @pointerdown="onPointerDown">
    <div>
      <div ref="headerEl">
        <wb-fragments-window-header
          v-if="!options.embed"
          v-bind="header"
          @click="onClickHeader"
          @up="onClickUp"
          @down="onClickDown"
          @close="onClickClose" />
      </div>
      <wb-components-scroll-content
        :options="options"
        class="content"
        embed
        :parent-layout="layout"
        :parent-layout-size-offset="layoutSizeOffset"
        :root-layout="wrapperLayout"
        :set-trigger-refresh="triggerRefresh"
        :set-trigger-reset="triggerResetScrollContent"
        @refresh="onRefreshScrollContent">
        <template #sidebarLeft>
          <component
            :is="sidebarComponent"
            v-if="showSidebar"
            v-bind="sidebarComponentData"
            class="sidebar-left" />
        </template>
        <template #default>
          <slot>
            <component
              :is="component"
              v-bind="componentData"
              :root-element="$el"
              :parent-focused="options.focused"
              :options="componentOptions"
              :parent-layout="contentLayout"
              :set-trigger-refresh="triggerRefresh"
              :window-options="options"
              @refresh="onRefreshComponent"
              @close="onCloseComponent"
              @freeze="onFreeze"
              @unfreeze="onUnfreeze"
              @ready="onComponentReady" />
          </slot>
        </template>
        <template v-if="scaleable" #corner>
          <span
            class="helper-scale"
            touch-action="none"
            @pointerdown="onPointerDownHelperScale">
            <svg-scrollbar-scale />
          </span>
        </template>
      </wb-components-scroll-content>
    </div>
  </aside>
</template>

<script setup>
import { Subscription, filter, first } from 'rxjs';
import { ipoint, calc } from '@js-basics/vector';
import {
  ref,
  computed,
  nextTick,
  watch,
  onMounted,
  onUnmounted,
  provide,
  toRef
} from 'vue';

import webWorkbench from '@web-workbench/core';
import domEvents from '../services/domEvents';
import { closestEl, touchEvent } from '../services/dom';

import SvgScrollbarScale from '../assets/svg/control/scrollbar_scale.svg?component';

import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '../classes/modules/Windows/utils';
import WbComponentsScrollContent from './ScrollContent';
import WbFragmentsWindowHeader from './molecules/WindowHeader';

const HEADER_HEIGHT = 20;
const WINDOW_BORDER_SIZE = 2;

const headerEl = ref(null);
const rootEl = ref(null);

const $props = defineProps({
  window: {
    type: Object,
    default: null
  },
  id: {
    type: String,
    default() {
      return null;
    }
  },

  wrapper: {
    type: Object,
    default() {
      return null;
    }
  },

  layout: {
    type: Object,
    default() {
      return {
        rootSize: ipoint(),
        position: ipoint(),
        size: ipoint(600, 400)
      };
    }
  },

  sidebarComponent: {
    type: Object,
    default() {
      return null;
    }
  },
  sidebarComponentData: {
    type: Object,
    default() {
      return null;
    }
  },

  component: {
    type: Object,
    default() {
      return null;
    }
  },
  componentData: {
    type: Object,
    default() {
      return null;
    }
  },

  symbolWrapper: {
    type: Object,
    default() {
      return null;
    }
  }
});

const $emit = defineEmits([
  'focused',
  'ready',
  'close',
  'up',
  'down',
  'refresh'
]);

const layoutSizeOffset = ipoint(4, HEADER_HEIGHT + WINDOW_BORDER_SIZE);

let visible = ref(true);

const sizes = ref({
  start: null,
  move: null
});
const positions = ref({
  start: null,
  move: null
});

const focusedSubscriptions = new Subscription();

const moving = ref(false);
const scaling = ref(false);

const triggerResetScrollContent = ref(false);
const triggerRefresh = ref(null);
const firstLayout = ref(true);

const headerHeight = ref(0);

const contentLayout = computed(() => {
  return {
    size: calc(() => $props.layout.size - ipoint(16, 0)),
    position: $props.layout.position
  };
});

const showSidebar = computed(() => {
  if (!options.value.sidebar) {
    return false;
  }
  return webWorkbench.config.observable[
    WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE
  ];
});

const wrapperLayout = computed(() => {
  if ($props.wrapper) {
    return $props.wrapper.layout;
  }
  return {
    size: ipoint(window.innerWidth, window.innerHeight)
  };
});

const componentOptions = computed(() => {
  return {
    focused: options.value.focused
  };
});

const header = computed(() => {
  return {
    close: options.value.close,
    overlay: options.value.overlay,
    title: options.value.title,
    focused: options.value.focused
  };
});

const style = computed(() => {
  return Object.assign(
    {
      '--header-height': headerHeight.value
    },
    $props.layout.size.toCSSVars('size'),
    $props.layout.position.toCSSVars('position')
  );
});

const styleClasses = computed(() => {
  return {
    moving: moving.value,
    scaling: scaling.value,
    scale: scaleable.value,
    'scroll-x': options.value.scrollX,
    'scroll-y': options.value.scrollY,
    freeze: options.value.freeze,
    visible: visible.value,
    embed: options.value.embed,
    focused: options.value.focused,
    borderless: options.value.borderless
  };
});

const wrapperSize = computed(() => {
  return wrapperLayout.value.size;
});

const size = computed(() => {
  return $props.layout.size;
});

const options = computed(() => {
  return $props.window.options;
});

const focused = computed(() => {
  return options.value.focused;
});

const scaleable = computed(() => {
  return options.value.scaleX || options.value.scaleY;
});

watch(
  () => size.value,
  () => {
    if (!scaling.value) {
      positions.value.start = $props.layout.position;
      positions.value.offset = 0;
      setPosition($props.layout.position, getRootSize());
    }
  }
);

watch(
  () => focused.value,
  value => {
    nextTick(() => {
      $emit('focused', value);
    });
    if (value) {
      focusedSubscriptions.add(
        domEvents
          .get('click')
          .pipe(
            filter(({ target }) => !closestEl(target, rootEl)),
            first()
          )
          .subscribe(() => {
            options.value.focused = false;
          })
      );
    } else {
      focusedSubscriptions.unsubscribe();
    }
  }
);

onMounted(() => {
  if (headerEl.value) {
    headerHeight.value = headerEl.value.offsetHeight;
  }
  if ($props.wrapper && firstLayout) {
    firstLayout.value = false;
    refresh({ scroll: true });

    if (options.value.center) {
      window.requestAnimationFrame(() => {
        $props.wrapper.centerWindow($props.id);
      });
    }
  }
  if (focused.value) {
    window.setTimeout(() => {
      focusedSubscriptions.add(
        domEvents
          .get('click')
          .pipe(
            filter(({ target }) => !closestEl(target, rootEl)),
            first()
          )
          .subscribe(() => {
            options.value.focused = false;
          })
      );
    }, 300);
  }
});

onUnmounted(() => {
  focusedSubscriptions.unsubscribe();
});

function onFreeze() {
  options.value.focused = false;
  options.value.freeze = true;
}

function onUnfreeze() {
  nextTick(() => {
    options.value.freeze = false;
    options.value.focused = true;
  });
}

function onComponentReady() {
  $emit('ready', getInstance());
}

function getRootSize() {
  return calc(() => wrapperSize.value - $props.layout.size);
}

function onRefreshScrollContent(options) {
  triggerRefresh.value = options;
  nextTick(() => (triggerRefresh.value = null));
}

function onCloseComponent(arg) {
  close(arg);
}

function onRefreshComponent(options) {
  refresh(options);
}

function refresh(options) {
  triggerRefresh.value = Object.assign(
    { scroll: true, resize: true, reset: false },
    options
  );
  nextTick(() => (triggerRefresh.value = null));
}

function onPointerDown() {
  if (!options.value.freeze) {
    $props.wrapper.setActiveWindow($props.id);
  }
}

function onClickHeader(e) {
  if (!options.value.freeze) {
    positions.value.start = ipoint(e);
    positions.value.offset = calc(
      () => positions.value.start - $props.layout.position
    );
    const rootSize = getRootSize();
    moving.value = true;
    const subscibe = domEvents.pointerMove.subscribe(e =>
      setPosition(ipoint(e), rootSize)
    );
    domEvents.pointerUp.pipe(first()).subscribe(() => {
      subscibe.unsubscribe();
      moving.value = false;
      refresh();
      $props.wrapper.savePosition($props.id, $props.layout.position);
    });
  }
}

function setPosition(position, rootSize) {
  position = ipoint(() =>
    Math.min(position, $props.wrapper.layout.position + wrapperSize.value)
  );

  positions.value.move = calc(() => position - positions.value.start);
  const current = calc(() =>
    Math.round(
      positions.value.start + positions.value.move - positions.value.offset
    )
  );

  $props.layout.position = ipoint(
    Math.max(
      options.value.clampX ? Math.min(current.x, rootSize.x) : current.x,
      0
    ),
    Math.max(
      options.value.clampY
        ? Math.min(current.y, rootSize.y)
        : Math.min(
            current.y,
            rootSize.y + $props.layout.size.y - HEADER_HEIGHT
          ),
      0
    )
  );
}

const getInstance = () => {
  return {
    id: $props.id,
    refresh
  };
};

function onClickUp() {
  $emit('up', getInstance());
}

function onClickDown() {
  $emit('down', getInstance());
}

function close(arg) {
  nextTick(() => {
    $emit('close', getInstance(), arg);
  });
}

function onClickClose() {
  close();
}

function onPointerDownHelperScale(e) {
  touchEvent(e);
  sizes.value.start = ipoint(e);
  sizes.value.offset = ipoint(() => sizes.value.start - $props.layout.size);
  const rootSize = wrapperSize.value;
  const subscibe = domEvents.pointerMove.subscribe(e => {
    sizes.value.move = calc(
      () => ipoint(e.clientX, e.clientY) - sizes.value.start
    );
    const current = calc(() =>
      Math.round(sizes.value.start + sizes.value.move - sizes.value.offset)
    );

    const { scaleX, scaleY } = options.value;
    if (
      (!scaleX ||
        (scaleX && current.x + $props.layout.position.x <= rootSize.x)) &&
      (!scaleY ||
        (scaleY && current.y + $props.layout.position.y <= rootSize.y))
    ) {
      if (!scaleX && scaleY) {
        $props.layout.size = ipoint($props.layout.size.x, current.y);
      } else if (scaleX && !scaleY) {
        $props.layout.size = ipoint(current.x, $props.layout.size.y);
      } else {
        $props.layout.size = current;
      }
    }
  });
  scaling.value = true;
  domEvents.pointerUp.pipe(first()).subscribe(() => {
    subscibe.unsubscribe();
    scaling.value = false;
    refresh();
    $props.wrapper.saveSize($props.id, $props.layout.size);
  });
}

provide('window', toRef($props, 'window'));
provide('window:refresh', refresh);
</script>

<style lang="postcss">
body > #root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<style lang="postcss" scoped>
.wb-components-window {
  --header-height: 20;
  --color-text: var(--color-window-text, #fff);
  --color-background: var(--color-window-background, #05a);
  --color-border: var(--color-window-border, #fff);
  --color-border-scaling: var(--color-window-border-scaling, #fa5);
  --color-helper-scale-background: var(
    --color-window-helper-scale-background,
    #fff
  );
  --color-helper-scale-icon: var(--color-window-helper-scale-icon, #05a);
  --color-helper-scale-icon-active: var(
    --color-window-helper-scale-icon-active,
    #000
  );
  --min-width: 120px;
  --scroll-bar-size: 20;

  &.scroll-x {
    --min-width: 200px;
  }

  position: absolute;
  top: 0;
  top: calc(var(--position-y) * 1px);
  left: 0;
  left: calc(var(--position-x) * 1px);
  width: calc(var(--size-x) * 1px);
  min-width: calc(10px + var(--min-width));
  height: calc(var(--size-y) * 1px);
  min-height: calc(var(--header-height) * 1px + var(--scroll-bar-size) * 1px);
  opacity: 0;

  --border-width: 2px;

  & > div {
    width: calc(var(--size-x) * 1px);
    min-width: calc(10px + var(--min-width));
    height: calc(var(--size-y) * 1px);
    min-height: calc(var(--header-height) * 1px + var(--scroll-bar-size) * 1px);
    color: var(--color-text);
    background: var(--color-background);
    border: solid var(--color-border) 2px;
    border-top-width: 0;
  }

  &.borderless {
    & > div {
      border: none;
    }
  }

  &.freeze {
    & > * {
      pointer-events: none;
    }
  }

  &.visible {
    opacity: 1;
  }

  & .content {
    width: calc(100%);
    min-width: var(--min-width);
    min-height: calc(100% - var(--header-height) * 1px);
    line-height: 18px;
  }

  & .sidebar-left {
    border-right: solid var(--color-border) 2px;
  }

  & .helper-scale {
    position: absolute;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: none;
    width: 12px;
    height: 14px;
    margin-top: auto;
    margin-left: auto;
    pointer-events: none;
    user-select: none;
    background-color: var(--color-helper-scale-background);

    & > * {
      display: block;
      visibility: hidden;
    }

    & svg {
      display: block;

      & :deep(.svg-primary) {
        fill: var(--color-helper-scale-icon);
      }
    }
  }

  &.scroll-y {
    & > div > .inner {
      height: 100%;
    }
  }

  &.scaling {
    & .helper-scale {
      & :deep(.svg-primary) {
        fill: var(--color-helper-scale-icon-active);
      }
    }
  }

  &.moving,
  &.scaling {
    & > div {
      background: transparent;
      border-color: var(--color-border-scaling);
      border-width: 2px;

      & *,
      & ::after,
      & ::before {
        opacity: 0;
      }
    }
  }

  &.scale {
    & .helper-scale {
      & > * {
        pointer-events: auto;
        visibility: visible;
      }
    }
  }

  &.scale,
  &.scroll-x.scroll-y {
    & .helper-scale {
      display: block;
    }
  }
}

@keyframes text-blinking {
  0% {
    color: transparent;
  }

  19% {
    color: transparent;
  }

  20% {
    color: currentColor;
  }

  100% {
    color: currentColor;
  }
}
</style>
