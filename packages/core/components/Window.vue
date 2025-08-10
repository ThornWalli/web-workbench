<template>
  <aside
    ref="rootEl"
    :data-id="id"
    class="wb-components-window"
    :class="styleClasses"
    :style="style"
    @pointerdown="onPointerDown">
    <div>
      <div ref="headerEl">
        <wb-fragments-window-header
          v-if="!options.embed"
          v-bind="header"
          @click:header="onClickHeader"
          @up="onClickUp"
          @down="onClickDown"
          @close="onClickClose" />
      </div>
      <wb-components-scroll-content
        ref="scrollContent"
        :options="options"
        class="content"
        embed
        :set-parent-layout="setLayout"
        :parent-layout="layout"
        :parent-layout-size-offset="layoutSizeOffset"
        :root-layout="wrapperLayout"
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
              @refresh="onRefreshComponent"
              @close="onCloseComponent"
              @freeze="onFreeze"
              @unfreeze="onUnfreeze"
              @ready="onComponentReady" />
          </slot>
        </template>
        <template v-if="scaleable" #corner>
          <button
            aria-label="Scale Window"
            tabindex="-1"
            class="helper-scale"
            touch-action="none"
            @pointerdown="onPointerDownHelperScale">
            <svg-scrollbar-scale />
          </button>
        </template>
      </wb-components-scroll-content>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { Subscription, filter, first } from 'rxjs';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import {
  ref,
  computed,
  nextTick,
  watch,
  onMounted,
  onUnmounted,
  provide
} from 'vue';

import domEvents from '../services/domEvents';
import type { NormalizedPointerEvent } from '../services/dom';
import { closestEl, normalizePointerEvent } from '../services/dom';

import SvgScrollbarScale from '../assets/svg/control/scrollbar_scale.svg?component';

import { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '../modules/Windows/utils';
import WbComponentsScrollContent from './ScrollContent.vue';
import WbFragmentsWindowHeader from './fragments/WindowHeader.vue';
import { HEADER_HEIGHT } from '../utils/window';
import { ISymbolWrapper } from '../classes/SymbolWrapper';
import Window from '../classes/Window';
import WindowWrapper from '../classes/WindowWrapper';
import type { Layout } from '../types';
import useCore from '../composables/useCore';
import type {
  TriggerRefresh,
  WindowCloseEventContext,
  WindowEventContext
} from '../types/component';
import type { WindowLayout } from '../types/window';

// const id = useId();

const { core } = useCore();

const WINDOW_BORDER_SIZE = 2;

const scrollContent = ref<InstanceType<
  typeof WbComponentsScrollContent
> | null>(null);
const headerEl = ref<HTMLElement | null>(null);
const rootEl = ref<HTMLElement | null>(null);

const $props = defineProps({
  window: {
    type: Window,
    default: null
  },
  id: {
    type: String,
    default() {
      return null;
    }
  },

  wrapper: {
    type: WindowWrapper,
    default() {
      return null;
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
    type: ISymbolWrapper,
    default() {
      return null;
    }
  }
});

const $emit = defineEmits<{
  (e: 'focus' | 'ready' | 'up' | 'down', value: WindowEventContext): void;
  (e: 'close', value: WindowCloseEventContext): void;
  (e: 'refresh', value: TriggerRefresh): void;
}>();

const rootHeaderHeight = ref(
  $props.window.options.hideRootHeader ||
    $props.window.options.absoluteRootHeader
    ? 0
    : HEADER_HEIGHT
);
const layoutSizeOffset = computed(() =>
  ipoint(
    4,
    $props.window.options.embed
      ? 0
      : rootHeaderHeight.value + WINDOW_BORDER_SIZE
  )
);

const visible = ref(true);

const sizes = ref<{
  start?: IPoint & number;
  move?: IPoint & number;
  offset?: IPoint & number;
}>({
  start: undefined,
  move: undefined,
  offset: undefined
});
const positions = ref<{
  start?: IPoint & number;
  move?: IPoint & number;
  offset?: number;
}>({
  start: undefined,
  move: undefined
});

function resetPositions() {
  positions.value.start = undefined;
  positions.value.move = undefined;
  positions.value.offset = undefined;
}

const focusedSubscriptions = new Subscription();

const moving = ref(false);
const scaling = ref(false);

const firstLayout = ref(true);

const headerHeight = ref(0);

// #region Computed

const contentLayout = computed<WindowLayout>(() => {
  return {
    size: ipoint(() => layout.value.size - ipoint(16, 0)),
    position: layout.value.position
  };
});

const showSidebar = computed(() => {
  if (!options.value.sidebar) {
    return false;
  }
  return (
    core.value?.config.observable[WINDOWS_CONFIG_NAMES.SHOW_STORAGE_SPACE] ||
    false
  );
});

const wrapperLayout = computed(() => {
  if ($props.wrapper) {
    const size = ipoint(
      $props.wrapper.layout.size.x,
      $props.wrapper.layout.size.y
    );
    return {
      ...$props.wrapper.layout,
      size: ipoint(
        () =>
          size +
          ($props.window.options.hideRootHeader ||
          $props.window.options.absoluteRootHeader
            ? HEADER_HEIGHT
            : 0)
      )
    };
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
    focused: options.value.focused,
    fill: options.value.fillHeader || options.value.filled
  };
});

const style = computed(() => {
  return Object.assign(
    {
      '--header-height': headerHeight.value
    },
    layout.value.size.toCSSVars('size'),
    layout.value.position.toCSSVars('position')
  );
});

const styleClasses = computed(() => {
  return {
    moving: moving.value,
    scaling: scaling.value,
    scale: scaleable.value,
    scroll: scrollable.value,
    'scroll-x': options.value.scroll || options.value.scrollX,
    'scroll-y': options.value.scroll || options.value.scrollY,
    freeze: options.value.freeze,
    visible: visible.value,
    embed: options.value.embed,
    focused: options.value.focused,
    borderless: options.value.borderless,
    'style-filled': options.value.filled
  };
});

const wrapperSize = computed(() => {
  return wrapperLayout.value.size;
});

const layout = computed(() => {
  return $props.window.layout;
});

const size = computed(() => {
  return layout.value.size;
});

const options = computed(() => {
  return $props.window.options;
});

const focused = computed(() => {
  return options.value.focused || false;
});

const scaleable = computed(() => {
  return options.value.scale || options.value.scaleX || options.value.scaleY;
});

const scrollable = computed(() => {
  return options.value.scroll || options.value.scrollX || options.value.scrollY;
});

// #endregion

// #region Watchers

watch(
  () => size.value,
  () => {
    if (!scaling.value && positions.value) {
      positions.value.start = layout.value.position;
      positions.value.offset = 0;
      setPosition(layout.value.position, getRootSize());
    }
  }
);

watch(
  () => focused.value,
  value => {
    nextTick(() => {
      $emit('focus', getEventContext());
    });
    if (value) {
      focusedSubscriptions.add(
        domEvents.pointerDown$
          .pipe(
            filter(({ target }) => {
              if (target && rootEl.value) {
                return !closestEl(target, rootEl.value);
              }
              return false;
            }),
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

// #endregion

// #region Initialization

const subscription = new Subscription();

onMounted(() => {
  if (headerEl.value) {
    headerHeight.value = headerEl.value.offsetHeight;
  }
  if ($props.wrapper && firstLayout) {
    firstLayout.value = false;
    refresh({ scroll: true });

    if (!options.value.absoluteRootHeader && options.value.center) {
      window.requestAnimationFrame(() => {
        $props.wrapper.centerWindow($props.id);
      });
    }
  }

  subscription.add(
    $props.window.events
      .pipe(filter(event => event.name === 'refresh'))
      .subscribe(() => {
        refresh({ resize: true });
      })
  );

  if (focused.value) {
    window.setTimeout(() => {
      focusedSubscriptions.add(
        domEvents.pointerDown$
          .pipe(
            filter(({ target }) => {
              if (target && rootEl.value) {
                return (
                  !!(target as HTMLElement).closest(
                    `.wb-components-window[data-id="${$props.id}"]`
                  ) &&
                  !!(target as HTMLElement).closest('.wb-env-fragment-header')
                );
              }
              return false;
            }),
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
  subscription.unsubscribe();
  focusedSubscriptions.unsubscribe();
});

// #endregion

// #region Methods

function setLayout(layout: Partial<Layout>) {
  $props.window.setLayout(layout);
}

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
  $emit('ready', getEventContext());
}

function getRootSize() {
  const _wrapperSize = ipoint(wrapperSize.value.x, wrapperSize.value.y);
  const _layoutSize = ipoint(layout.value.size.x, layout.value.size.y);
  return ipoint(() => _wrapperSize - _layoutSize);
}

function onRefreshScrollContent(options: TriggerRefresh) {
  scrollContent.value?.refresh(options);
}

function onCloseComponent(arg = undefined) {
  close(arg);
}

function onRefreshComponent(options: TriggerRefresh) {
  refresh(options);
}

function refresh(options?: TriggerRefresh) {
  options = Object.assign(
    { scroll: true, resize: true, reset: false },
    options || {}
  );
  scrollContent.value?.refresh(options);
}

function onPointerDown() {
  if (!options.value.freeze) {
    $props.wrapper.setActiveWindow($props.id);
  }
}

function onClickHeader(e: NormalizedPointerEvent) {
  if (!options.value.freeze) {
    resetPositions();
    const start = ipoint(e.x, e.y);
    positions.value.start = start;
    positions.value.offset = ipoint(() => start - layout.value.position);

    const rootSize = getRootSize();
    moving.value = true;
    const subscribe = domEvents.pointerMove$.subscribe(e => {
      setPosition(ipoint(e.x, e.y), rootSize);
    });
    domEvents.pointerUp$.pipe(first()).subscribe(() => {
      subscribe.unsubscribe();
      moving.value = false;
      refresh();
      $props.wrapper.savePosition($props.id, layout.value.position);
    });
  }
}

function setPosition(position: IPoint & number, rootSize: IPoint) {
  position = ipoint(() =>
    Math.min(position, $props.wrapper.layout.position + wrapperSize.value)
  );
  const start = positions.value.start || ipoint(0, 0);
  const move = positions.value.move || ipoint(0, 0);
  const offset = positions.value.offset || ipoint(0, 0);
  positions.value.move = ipoint(() => position - start);
  const current = ipoint(() => Math.round(start + move - offset));

  const newPosition = ipoint(
    Math.max(
      preparedClamp.value.x ? Math.min(current.x, rootSize.x) : current.x,
      0
    ),
    Math.max(
      preparedClamp.value.y
        ? Math.min(current.y, rootSize.y)
        : Math.min(
            current.y,
            rootSize.y + layout.value.size.y - rootHeaderHeight.value
          ),
      0
    )
  );

  $props.window.setLayout({ position: newPosition });
}

const preparedClamp = computed(() => {
  const x = options.value.clampX || options.value.clamp;
  const y = options.value.clampY || options.value.clamp;
  return {
    x: x === undefined ? true : x,
    y: y === undefined ? false : y
  };
});

function getEventContext(): WindowEventContext {
  return {
    id: $props.id,
    scope: $props.window,
    focused: focused.value,
    refresh
  };
}

function onClickUp() {
  $emit('up', getEventContext());
}

function onClickDown() {
  $emit('down', getEventContext());
}

function close(componentData = undefined) {
  nextTick(() => {
    $emit('close', {
      ...getEventContext(),
      componentData
    });
  });
}

function onClickClose() {
  close();
}

function onPointerDownHelperScale(e: PointerEvent) {
  normalizePointerEvent(e);
  const start = ipoint(e.x, e.y);
  sizes.value.start = start;
  sizes.value.offset = ipoint(() => start - layout.value.size);
  const rootSize = wrapperSize.value;
  // eslint-disable-next-line complexity
  const subscibe = domEvents.pointerMove$.subscribe(e => {
    const start = sizes.value.start || ipoint(0, 0);
    const move = ipoint(() => ipoint(e.x, e.y) - start);
    const offset = sizes.value.offset || ipoint(0, 0);
    sizes.value.move = move;
    let current = ipoint(() => Math.round(start + move - offset));

    const { scaleX, scaleY } = options.value;
    if (
      (!scaleX ||
        (scaleX && current.x + layout.value.position.x <= rootSize.x)) &&
      (!scaleY || (scaleY && current.y + layout.value.position.y <= rootSize.y))
    ) {
      if (!scaleX && scaleY) {
        current = ipoint(layout.value.size.x, current.y);
      } else if (scaleX && !scaleY) {
        current = ipoint(current.x, layout.value.size.y);
      }

      // current = ipoint(
      //   Math.min(current.x, rootSize.x - $props.window.layout.position.x),
      //   Math.min(current.y, rootSize.y - $props.window.layout.position.y)
      // );
      current = ipoint(() =>
        Math.min(current, rootSize - $props.window.layout.position!)
      );

      if ($props.window.layout.minSize) {
        current = ipoint(() =>
          Math.max(current, $props.window.layout.minSize!)
        );
      }
      if ($props.window.layout.maxSize) {
        current = ipoint(() =>
          Math.min(current, $props.window.layout.maxSize!)
        );
      }

      $props.window.setLayout({ size: current });
    }
  });
  scaling.value = true;
  domEvents.pointerUp$.pipe(first()).subscribe(() => {
    subscibe.unsubscribe();
    scaling.value = false;
    refresh();
    $props.wrapper.saveSize($props.id, layout.value.size);
  });
}

provide('window', $props.window);
provide('core', core.value);
provide('root-element', rootEl.value);
provide(
  'parentFocused',
  computed(() => options.value.focused)
);
provide('parentLayout', contentLayout);
provide('options', componentOptions);
provide('window:refresh', refresh);

//  window="[object Object]" core="[object Object]" root-element="[object HTMLElement]" parent-focused="true" options="[object Object]" parent-layout="[object Object]">
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

  &.style-filled {
    --color-text: var(
      --color-window-filled-text,
      var(--color-window-text, #fff)
    );
    --color-background: var(
      --color-window-filled-background,
      var(--color-window-background, #05a)
    );
    --color-border: var(
      --color-window-filled-border,
      var(--color-window-border, #fff)
    );
  }

  & button {
    position: relative;
    padding: 0;
    appearance: none;
    outline: none;
    border: none;

    & * {
      pointer-events: none;
    }

    &:focus {
      outline: none;
      filter: invert(1);
    }
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
    width: 100%;
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
        visibility: visible;
        pointer-events: auto;
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
