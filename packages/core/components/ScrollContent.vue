<template>
  <div
    class="wb-env-scroll-content"
    :class="styleClasses"
    :style="scrollContentStyle">
    <div ref="scrollWrapperEl" class="wrapper">
      <div class="sidebar-left">
        <slot name="sidebarLeft" />
      </div>
      <div ref="scrollContentEl" class="content" @scroll="onScroll">
        <div ref="scrollInnerEl" class="inner">
          <div>
            <slot>
              <div
                style="
                  width: 680px;
                  height: 100px;
                  margin: 20px;
                  background: red;
                " />
              <div
                style="
                  width: 250px;
                  height: 240px;
                  margin: 20px;
                  background: red;
                " />
              <div
                style="
                  width: 500px;
                  height: 240px;
                  margin: 20px;
                  background: green;
                " />
              <div
                style="
                  width: 800px;
                  height: 240px;
                  margin: 20px;
                  background: yellow;
                " />
              <div
                style="
                  width: 250px;
                  height: 240px;
                  margin: 20px;
                  background: red;
                " />
              <div
                style="
                  width: 500px;
                  height: 3000px;
                  margin: 20px;
                  background: green;
                " />
              <div
                style="
                  width: 800px;
                  height: 240px;
                  margin: 20px;
                  background: yellow;
                " />
            </slot>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="active && $props.options.scrollY"
      class="scrollbar scrollbar-right">
      <button
        class="helper-top"
        touch-action="none"
        @pointerdown="onPointerDownScrollBarArrowTop"
        @pointerup="onPointerUpScrollBarArrow">
        <svg-scrollbar-arrow-top />
      </button>
      <span class="range">
        <span ref="scrollRightHelperEl" class="helper">
          <button
            class="spacer"
            touch-action="none"
            @pointerdown="onPointerDownRightSpacer" />
        </span>
      </span>
      <button
        class="helper-bottom"
        touch-action="none"
        @pointerdown="onPointerDownScrollBarArrowBottom"
        @pointerup="onPointerUpScrollBarArrow">
        <svg-scrollbar-arrow-bottom />
      </button>
    </div>

    <span v-if="showCorner" class="scrollbar-corner">
      <slot name="corner" />
    </span>

    <div
      v-if="active && $props.options.scrollX"
      class="scrollbar scrollbar-bottom">
      <button
        class="helper-left"
        touch-action="none"
        @pointerdown="onPointerDownScrollBarArrowLeft"
        @pointerup="onPointerUpScrollBarArrow">
        <svg-scrollbar-arrow-left />
      </button>
      <span class="range">
        <span ref="scrollBottomHelperEl" class="helper">
          <button
            ref="scrollBottomSpacerEl"
            class="spacer"
            touch-action="none"
            @pointerdown="onPointerDownBottomSpacer" />
        </span>
      </span>
      <button
        class="helper-right"
        touch-action="none"
        @pointerdown="onPointerDownScrollBarArrowRight"
        @pointerup="onPointerUpScrollBarArrow">
        <svg-scrollbar-arrow-right />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IPoint } from '@js-basics/vector';
import { ipoint, calc } from '@js-basics/vector';
import { first } from 'rxjs';
import scrollBar, { normalizePointerEvent } from '../services/dom';
import domEvents from '../services/domEvents';
import SvgScrollbarArrowTop from '../assets/svg/control/scrollbar_arrow_top.svg?component';
import SvgScrollbarArrowBottom from '../assets/svg/control/scrollbar_arrow_bottom.svg?component';
import SvgScrollbarArrowLeft from '../assets/svg/control/scrollbar_arrow_left.svg?component';
import SvgScrollbarArrowRight from '../assets/svg/control/scrollbar_arrow_right.svg?component';
import {
  computed,
  onMounted,
  provide,
  ref,
  useSlots,
  watch,
  nextTick
} from 'vue';
import type { TriggerRefresh } from '../types/component';
import type { WindowLayout, WindowOptions } from '../types/window';
import type { Layout } from '../types';

enum DIRECTIONS {
  LEFT = 0,
  TOP = 1,
  RIGHT = 2,
  BOTTOM = 3
}

const $props = defineProps<{
  debug?: boolean;
  options: {
    clampLeft?: boolean;
    clampBottom?: boolean;
  } & WindowOptions;
  setTriggerReset?: boolean;
  setTriggerRefresh?: TriggerRefresh | null;
  embed?: boolean;
  rootLayout?: Layout;
  parentLayout: Layout;
  setParentLayout: (layout: Partial<WindowLayout>) => void;
  parentLayoutSizeOffset?: IPoint;
}>();

const parentSize = ref($props.parentLayout.size);

const $emit = defineEmits<{
  (e: 'click'): void;
  (e: 'refresh', value: TriggerRefresh): void;
}>();

const scrollContentEl = ref<HTMLElement | null>(null);
const scrollInnerEl = ref<HTMLElement | null>(null);
const scrollWrapperEl = ref<HTMLElement | null>(null);
const scrollBottomHelperEl = ref<HTMLElement | null>(null);
const scrollRightHelperEl = ref<HTMLElement | null>(null);

const active = ref(true);

const helperStyle = ref({});
const sizes = ref({
  spacer: ipoint(0, 0),
  helper: ipoint(0, 0),
  content: ipoint(0, 0),
  wrapper: ipoint(0, 0),
  inner: ipoint(0, 0)
});

const scroll = ref<{
  startScroll: number;
  current: IPoint & number;
  start: (IPoint & number) | null;
  move: (IPoint & number) | null;
}>({
  startScroll: 0,
  current: ipoint(0, 0),
  start: null,
  move: null
});

const $slots = useSlots();

const showCorner = computed(
  () => $props.options.scrollX || $props.options.scrollY || !!$slots.corner
);

const scrollContentStyle = computed(() => {
  return {
    '--scroll-bar-size': `${Math.max(16 - scrollBar.size, 0)}`,
    ...helperStyle.value
  };
});

const styleClasses = computed(() => {
  return {
    active: active.value,
    'axis-x': $props.options.scrollX,
    'axis-y': $props.options.scrollY,
    embed: $props.embed
  };
});

watch(
  () => $props.setTriggerReset,
  () => {
    refresh();
  }
);

watch(
  () => $props.setTriggerRefresh,
  options => {
    if (options && options.reset) {
      resetTest();
    } else if (options && options.scroll) {
      refresh();
    }
  }
);

onMounted(() => {
  window.requestAnimationFrame(() => {
    setParentSize();
  });
});

// eslint-disable-next-line complexity
function setParentSize() {
  const innerSize = getScrollInnerSize();
  const scrollBarSize = ipoint(
    $props.options.scroll || $props.options.scrollY ? 20 : 0,
    $props.options.scroll || $props.options.scrollX ? 20 : 0
  );
  const parentLayout = $props.parentLayout;

  if (parentLayout) {
    let size = ipoint(
      $props.parentLayout.size.x || innerSize.x,
      $props.parentLayout.size.y || innerSize.y
    );

    debugLog(
      'ScrollContent:ParentLayout:Size',
      $props.parentLayout.size.toString()
    );
    debugLog('ScrollContent:innerSize', innerSize.toString());

    const layoutOffset = ipoint(
      () => scrollBarSize + ($props.parentLayoutSizeOffset as IPoint & number)
    );
    debugLog(
      'ScrollContent:Size:1',
      size.toString(),
      $props.rootLayout?.size.toString()
    );

    if (!$props.options.scrollX && !$props.options.scrollY) {
      size = ipoint(() =>
        Math.max(Math.max(size + layoutOffset, size), innerSize + layoutOffset)
      );
    }
    debugLog(
      'ScrollContent:Size:2',
      size.toString(),
      $props.rootLayout?.size.toString()
    );
    size = ipoint(() =>
      Math.min(size, $props.rootLayout?.size || ipoint(Infinity, Infinity))
    );
    debugLog(
      'ScrollContent:Size:3',
      size.toString(),
      $props.rootLayout?.size.toString()
    );

    $props.setParentLayout({
      size
    });
  }
  parentSize.value = parentLayout.size;
}

function resetTest() {
  $props.setParentLayout({
    size: ipoint(0, 0)
  });
  nextTick(() => {
    setParentSize();
  });
}

function getScrollContentSize() {
  return ipoint(
    scrollContentEl.value?.offsetWidth || 0,
    scrollContentEl.value?.offsetHeight || 0
  );
}

function getScrollInnerSize() {
  return ipoint(
    scrollInnerEl.value?.offsetWidth || 0,
    scrollInnerEl.value?.offsetHeight || 0
  );
}

function onScroll() {
  window.requestAnimationFrame(() => {
    refreshScrollbar();
    updateEl();
  });
  $props.setParentLayout?.({
    scrollOffset: getScrollValue()
  });
  $emit('refresh', {
    scroll: true
  });
}

// eslint-disable-next-line complexity
function refresh() {
  sizes.value.content = getScrollContentSize();
  sizes.value.wrapper = ipoint(
    scrollWrapperEl.value?.offsetWidth || 0,
    scrollWrapperEl.value?.offsetHeight || 0
  );
  sizes.value.inner = getScrollInnerSize();

  sizes.value.helper = ipoint(
    scrollBottomHelperEl.value
      ? scrollBottomHelperEl.value?.offsetWidth || 0
      : 0,
    scrollRightHelperEl.value ? scrollRightHelperEl.value?.offsetHeight || 0 : 0
  );

  sizes.value.spacer = ipoint(
    () =>
      Math.min(sizes.value.wrapper / sizes.value.inner, 1) * sizes.value.helper
  );

  const scrollOffset = getScrollValue();
  $props.setParentLayout({
    scrollOffset: scrollOffset
  });
  refreshScrollbar();
  updateEl();
  $emit('refresh', {});
  scrollContentEl.value?.scrollTo(
    $props.options.clampLeft ? 0 : scrollOffset.x,
    $props.options.clampBottom ? sizes.value.inner.y : scrollOffset.y
  );
}

function updateEl() {
  const position = ipoint(
    () => scroll.value.current * (1 - sizes.value.spacer / sizes.value.helper)
  );
  const size = ipoint(() => sizes.value.spacer / sizes.value.helper);
  helperStyle.value = Object.assign(
    position.toCSSVars('helper-position'),
    size.toCSSVars('helper-size')
  );
}

function getScrollValue() {
  return ipoint(
    scrollContentEl.value?.scrollLeft || 0,
    scrollContentEl.value?.scrollTop || 0
  );
}

function refreshScrollbar() {
  const scrollbarSize = ipoint(
    !$props.options.scrollY ? 0 : scrollBar.size,
    !$props.options.scrollX ? 0 : scrollBar.size
  );

  const scrollValues = getScrollValue();
  scroll.value.current = calc(
    () =>
      scrollValues / (sizes.value.inner - sizes.value.content + scrollbarSize)
  );
}

function onPointerDownRightSpacer(e: PointerEvent) {
  normalizePointerEvent(e);
  e.preventDefault();

  scroll.value.start = ipoint(e.x, e.y);
  scroll.value.startScroll = scrollContentEl.value?.scrollTop || 0;

  const subscibe = domEvents.pointerMove.subscribe(e => {
    if (scroll.value && scrollContentEl.value) {
      scroll.value.move = calc(
        () => ipoint(e.x, e.y) - (scroll.value.start || 0)
      );
      scrollContentEl.value.scrollTop =
        scroll.value.startScroll +
        (sizes.value.inner.y * (scroll.value.move?.y || 0)) /
          sizes.value.helper.y;
    }
  });
  domEvents.pointerUp.pipe(first()).subscribe(() => {
    subscibe.unsubscribe();
  });
}

function onPointerDownBottomSpacer(e: PointerEvent) {
  e.preventDefault();
  if (scrollContentEl.value) {
    scroll.value.start = ipoint(e.x, e.y);
    scroll.value.startScroll = scrollContentEl.value.scrollLeft || 0;

    const subscibe = domEvents.pointerMove.subscribe(e => {
      if (scroll.value && scrollContentEl.value) {
        scroll.value.move = calc(
          () => ipoint(e.x, e.y) - (scroll.value.start as IPoint & number)
        );
        scrollContentEl.value.scrollLeft =
          scroll.value.startScroll +
          (sizes.value.inner.x * (scroll.value.move?.x || 0)) /
            sizes.value.helper.x;
      }
    });
    domEvents.pointerUp.pipe(first()).subscribe(() => {
      subscibe.unsubscribe();
    });
  }
}

function onPointerDownScrollBarArrowTop() {
  setScrollByEvent(DIRECTIONS.TOP);
}

function onPointerDownScrollBarArrowBottom() {
  setScrollByEvent(DIRECTIONS.BOTTOM);
}

function onPointerDownScrollBarArrowLeft() {
  setScrollByEvent(DIRECTIONS.LEFT);
}

function onPointerDownScrollBarArrowRight() {
  setScrollByEvent(DIRECTIONS.RIGHT);
}

let scrollInterval: ReturnType<typeof setInterval> | undefined;
function onPointerUpScrollBarArrow() {
  window.clearInterval(scrollInterval);
}

function setScrollByEvent(direction: DIRECTIONS) {
  window.clearInterval(scrollInterval);
  scrollInterval = setInterval(() => {
    if (scrollContentEl.value) {
      switch (direction) {
        case DIRECTIONS.LEFT:
          scrollContentEl.value.scrollLeft -= 16;
          break;
        case DIRECTIONS.TOP:
          scrollContentEl.value.scrollTop -= 16;
          break;
        case DIRECTIONS.RIGHT:
          scrollContentEl.value.scrollLeft += 16;
          break;
        case DIRECTIONS.BOTTOM:
          scrollContentEl.value.scrollTop += 16;
          break;
      }
    }
  }, 125);
}

function debugLog(...args: unknown[]) {
  if ($props.debug) {
    console.debug('[ScrollContent]', ...args);
  }
}

provide('scrollContent', {
  refresh,
  setParentSize
});
</script>

<style lang="postcss" scoped>
.wb-env-scroll-content {
  --color-scrollbar-corner: var(--color-scroll-content-scrollbar-corner, #fff);
  --color-scrollbar-spacer: var(--color-scroll-content-scrollbar-spacer, #fff);
  --color-scrollbar-background: var(
    --color-scroll-content-scrollbar-background,
    #05a
  );
  --color-scrollbar-helper-background: var(
    --color-scroll-content-scrollbar-helper-background,
    #fff
  );
  --color-scrollbar-helper: var(--color-scroll-content-scrollbar-helper, #05a);
  --color-scrollbar-helper-active: var(
    --color-scroll-content-scrollbar-helper-active,
    #000
  );
  --color-scrollbar-range: var(--color-scroll-content-scrollbar-range, #fff);

  .style-filled & {
    --color-scrollbar-corner: var(
      --color-scroll-content-filled-scrollbar-corner,
      var(--color-scroll-content-scrollbar-corner, #fff)
    );
    --color-scrollbar-spacer: var(
      --color-scroll-content-filled-scrollbar-spacer,
      var(--color-scroll-content-scrollbar-spacer, #fff)
    );
    --color-scrollbar-background: var(
      --color-scroll-content-filled-scrollbar-background,
      var(--color-scroll-content-scrollbar-background, #05a)
    );
    --color-scrollbar-helper-background: var(
      --color-scroll-content-filled-scrollbar-helper-background,
      var(--color-scroll-content-scrollbar-helper-background, #fff)
    );
    --color-scrollbar-helper: var(
      --color-scroll-content-filled-scrollbar-helper,
      var(--color-scroll-content-scrollbar-helper, #05a)
    );
    --color-scrollbar-helper-active: var(
      --color-scroll-content-filled-scrollbar-helper-active,
      var(--color-scroll-content-scrollbar-helper-active, #000)
    );
    --color-scrollbar-range: var(
      --color-scroll-content-filled-scrollbar-range,
      var(--color-scroll-content-scrollbar-range, #fff)
    );
  }

  /* dynamic var */
  --scroll-bar-size: 0;
  --helper-position-x: var(--helper-position-x, 1);
  --helper-position-y: var(--helper-position-y, 1);
  --helper-size-x: var(--helper-size-x, 1);
  --helper-size-y: var(--helper-size-y, 1);

  position: relative;
  overflow: hidden;

  /* border: solid var(--color-border) 0; */

  &:not(.embed) {
    border-width: 0 2px 2px 0;
  }

  /* &.embed {
    &.axis-y {
      border-right-width: 2px;
    }

    &.axis-x {
      border-bottom-width: 2px;
    }
  } */

  #root > & {
    position: absolute;
    top: 0;
    left: 50%;
    width: 640px;
    height: 100%;
    margin-left: -320px;

    @media (height >= 480px) {
      top: 50%;
      height: 480px;
      margin-top: -240px;
    }
  }

  & svg {
    display: block;
  }

  & .inner {
    box-sizing: border-box;
    display: flex;
    min-width: 100%;

    &.active {
      float: left;
    }

    & > div {
      flex: 1;
      min-width: 100%;
      min-height: 100%;
    }
  }

  .wb-env-view > & {
    position: absolute;
    top: 20px;
    bottom: 0;
    width: 100%;
  }

  & .scrollbar-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 14px;
    height: 16px;
    background: var(--color-scrollbar-corner);
  }

  &.axis-x,
  &.axis-y {
    & .scrollbar-corner {
      width: 16px;
    }
  }

  &.active {
    & .content {
      position: relative;
      top: 0;
      left: 0;
      flex: 1;
      overflow: hidden;

      & > .inner {
        position: absolute;
        top: 0;
        left: 0;
        min-width: 100%;
        min-height: 100%;
      }
    }

    .wb-env-view > & {
      bottom: 0;
      overflow: inherit;
    }

    & .wrapper {
      position: absolute;
      inset: 0;
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    &.axis-x.axis-y {
      & .wrapper {
        right: calc(var(--scroll-bar-size) * -1px);
        bottom: calc(var(--scroll-bar-size) * -1px);
      }
    }

    /* &.axis-x,
    &.axis-y {
      & .wrapper {
        right: calc(var(--scroll-bar-size) * -1px);
        bottom: calc(var(--scroll-bar-size) * -1px);
      }
    } */

    &.axis-x {
      & .content {
        overflow-x: scroll;
      }

      & .inner {
        padding-bottom: calc(var(--scroll-bar-size) * 1px);
      }

      & .sidebar-left {
        position: relative;
        height: calc(100% - var(--scroll-bar-size) * 1px - 1px);

        /* height: calc(100% - var(--scroll-bar-size) * 1px - 16px); */
      }
    }

    &.axis-y {
      & .content {
        overflow-y: scroll;
      }

      & .inner {
        padding-right: calc(var(--scroll-bar-size) * 1px);
      }
    }

    & .storage-size-active + .content {
      & .inner {
        padding-left: 12px;
      }
    }

    & .spacer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 14px;
      height: 16px;
      background: var(--color-scrollbar-spacer);
    }

    & .scrollbar {
      background: var(--color-scrollbar-background);
    }

    /* ###################### */

    /* & .helper-top,
    & .helper-left,
    & .helper-bottom,
    & .helper-right {
      & .svg-primary {
        fill: var(--color-scrollbar-helperPrimary);
      }

      &:active {
        & .svg-primary {
          fill: var(--color-scrollbar-helperPrimaryActive);
        }
      }
    } */

    & .scrollbar-right {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      bottom: 16px;
      width: 16px;

      & > * {
        position: absolute;
        left: 0;
        width: 100%;

        & svg {
          display: block;
          margin: 0 auto;
        }
      }

      & .helper-top,
      & .helper-bottom {
        display: block;
        width: 16px;
        background-color: var(--color-scrollbar-helper-background);

        & svg {
          position: relative;
          left: 1px;
          fill: var(--color-scrollbar-helper);
        }
      }

      & .helper-top {
        top: 0;
        padding-bottom: 2px;
      }

      & .range {
        top: 14px;
        bottom: 16px;
        box-sizing: border-box;
        border: solid var(--color-scrollbar-range) 2px;
        border-width: 0 0 0 2px;

        & .helper {
          position: absolute;
          inset: 2px;
        }

        & .spacer {
          position: absolute;
          top: calc(var(--helper-position-y) * 100%);
          left: 0;
          display: block;
          width: 100%;
          height: calc(var(--helper-size-y) * 100%);
          background: var(--color-scrollbar-spacer);

          .wb-env-view.scaling & {
            visibility: hidden;
          }
        }
      }

      & .helper-bottom {
        bottom: 0;
        padding-top: 2px;
        padding-bottom: 2px;
      }
    }

    & .scrollbar-bottom {
      position: absolute;
      right: 16px;
      bottom: 0;
      left: 0;
      height: 16px;

      & > * {
        position: absolute;
        bottom: 0;
      }

      & .helper-left,
      & .helper-right {
        display: inline-block;
        height: 16px;
        background: var(--color-scrollbar-helper-background);

        & svg {
          position: relative;
          top: 1px;
          fill: var(--color-scrollbar-helper);
        }
      }

      & .helper-left {
        left: 0;
        padding: 1px 2px 0 0;
      }

      & .range {
        right: 12px;
        bottom: 0;
        left: 13px;
        box-sizing: border-box;
        height: 100%;
        border: solid var(--color-scrollbar-range) 2px;
        border-width: 2px 1px 0 0;

        & .helper {
          position: absolute;
          inset: 2px;
        }

        & .spacer {
          position: absolute;
          top: 0;
          left: calc(var(--helper-position-x) * 100%);
          display: block;
          width: calc(var(--helper-size-x) * 100%);
          height: 100%;
          background: var(--color-scrollbar-spacer);

          .wb-env-view.scaling & {
            visibility: hidden;
          }
        }
      }

      & .helper-right {
        right: 0;
        padding: 1px 0 0 2px;
      }
    }
  }

  & button {
    position: relative;
    padding: 0;
    appearance: none;
    outline: none;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
