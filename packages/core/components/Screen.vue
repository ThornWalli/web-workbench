<template>
  <div ref="rootEl" class="wb-env-screen" :class="styleClasses" :style="style">
    <div ref="wrapperEl" class="wrapper" :style="wrapperStyle">
      <div ref="containerEl" class="container">
        <transition
          name="animation-turn"
          @before-enter="beforeEnterTurn"
          @after-enter="afterEnterTurn"
          @after-leave="afterLeaveTurn">
          <div v-show="screenActive" ref="backgroundEl" class="background">
            <div class="content">
              <slot />
            </div>
            <div v-if="hasScanLines && screenActive" class="scanlines">
              <div />
            </div>
            <wb-env-element-cursor
              v-if="currentCursor && backgroundLayout"
              :parent-layout="backgroundLayout || containerLayout"
              :offset="cursorOffset"
              :cursor="currentCursor" />
            <div class="manipulation" :style="manipulationStyle" />
          </div>
        </transition>
        <slot :container-layout="containerLayout" name="container" />
      </div>
      <div v-if="frameActive" class="frame">
        <svg-screen />
        <wb-env-screen-power-button
          :active="screenActive"
          class="power-button"
          :options="modelValue"
          @click="onClickPowerButton" />
        <div class="panel">
          <wb-env-screen-panel
            :model-value="modelValue"
            @update:model-value="$emit('update:model-value', $event)" />

          <button class="cover" @click="onClickPanelCover">
            <span>Push</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import domEvents from '../services/domEvents';
import { getLayoutFromElement } from '../utils/layout';
import SvgScreen from '../assets/svg/screen/flat.svg?component';

import WbEnvElementCursor from './elements/Cursor.vue';
import WbEnvScreenPanel from './screen/Panel.vue';
import WbEnvScreenPowerButton from './screen/PowerButton.vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { Subscription } from 'rxjs';
import type { Layout } from '../types';
import CursorWrapper from '../classes/CursorWrapper';
import { BOOT_SEQUENCE } from '../classes/Core/types';

const $props = defineProps({
  core: {
    type: Object,
    default() {
      return null;
    }
  },
  theme: {
    type: Object,
    default() {
      return null;
    }
  },
  cursor: {
    type: [CursorWrapper, null],
    default: null
  },
  hasScanLines: {
    type: Boolean,
    default: false
  },
  hasRealLook: {
    type: Boolean,
    default: false
  },
  bootSequence: {
    type: [String, Number],
    default: BOOT_SEQUENCE.SEQUENCE_3
  },
  frameActive: {
    type: Boolean,
    default: true
  },

  hasActiveAnimation: {
    type: Boolean,
    default: true
  },

  modelValue: {
    type: Object,
    default() {
      return {
        contrast: 0,
        brightness: 0,
        color: 0,
        sharpness: -1,
        horizontalCentering: 0,
        soundVolume: 1
      };
    }
  }
});

const $emit = defineEmits<{
  (e: 'update:model-value', value: unknown): void;
  (e: 'toggleScreenActive', value: boolean): void;
  (e: 'beforeTurnOn' | 'turnOn' | 'turnOff', duration?: number): void;
}>();

const rootEl = ref<HTMLElement | null>(null);
const wrapperEl = ref<HTMLElement | null>(null);
const containerEl = ref<HTMLElement | null>(null);
const backgroundEl = ref<HTMLElement | null>(null);

const openPanel = ref(false);
const screenActive = ref(false);
const turnOptions = ref<{
  name: string;
  duration: number;
  resolve: ((value?: unknown) => void) | null;
}>({
  name: '',
  duration: 0,
  resolve: null
});
const animate = ref(false);
const wrapperPosition = ref<IPoint & number>();
const containerLayout = ref<Layout>();
const backgroundLayout = ref<Layout>();

const cursorOffset = computed(() => {
  const size = backgroundLayout.value?.size || ipoint(0, 0);
  return ipoint(
    () => size * ipoint($props.modelValue.horizontalCentering - 0.5, 0)
  );
});

const currentCursor = computed(() => {
  if ($props.cursor) {
    return $props.cursor.current;
  }
  return null;
});

const screenBackground = computed(() => {
  return $props.theme.colors.screen.background;
});

const styleClasses = computed(() => {
  return {
    animate: animate.value,
    'active-animation': $props.hasActiveAnimation,
    'frame-active': $props.frameActive,
    'screen-active': screenActive.value,
    'real-look': $props.hasRealLook,
    'open-panel': openPanel.value,
    ['boot-sequence-' + $props.bootSequence]: true
  };
});

const style = computed(() => {
  return {
    '--turn-duration': turnOptions.value.duration + 'ms',
    '--horizontal-centering': $props.modelValue.horizontalCentering - 0.5
  };
});

const manipulationStyle = computed(() => {
  return {
    'backdrop-filter': [
      `contrast(${$props.modelValue.contrast * 2 * 100}%)`,
      `brightness(${$props.modelValue.brightness * 2 * 100}%)`,
      `saturate(${$props.modelValue.color * 2 * 100}%)`,
      `blur(${($props.modelValue.sharpness * 20) / (window.devicePixelRatio || 1)}px)`
    ].join(' ')
  };
});

const wrapperStyle = computed(() => {
  if (wrapperPosition.value) {
    const position = ipoint(() =>
      Math.round(wrapperPosition.value || ipoint(0, 0))
    );
    return {
      '--wrapper-position-x': position.x + 'px',
      '--wrapper-position-y': position.y + 'px'
    };
  }
  return {};
});

// #region watchers

watch(
  () => backgroundEl.value && screenActive.value,
  () => {
    onResize();
  }
);

watch(
  () => screenActive.value,
  value => {
    $emit('toggleScreenActive', value);
  }
);

watch(
  () => $props.frameActive,
  () => {
    onResize();
  }
);

watch(
  () => screenBackground.value,
  color => {
    if (document.querySelector('[name="theme-color"]')) {
      document
        .querySelector('[name="theme-color"]')
        ?.setAttribute('content', color);
    }
  }
);

watch(
  () => $props.bootSequence,
  bootSequence => {
    let color;
    if (typeof bootSequence === 'number' && bootSequence < 4) {
      color = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-boot-sequence-' + bootSequence
      );
    } else {
      color = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-background'
      );
    }
    if (document.querySelector('[name="theme-color"]')) {
      document
        .querySelector('[name="theme-color"]')
        ?.setAttribute('content', color);
    }
    onResize();
  }
);

// #endregion

const subscription = new Subscription();
onMounted(() => {
  subscription.add(domEvents.resize$.subscribe(onResize));
  onResize();
});

onUnmounted(() => {
  subscription.unsubscribe();
});

function beforeEnterTurn() {
  $emit('beforeTurnOn', turnOptions.value.duration);
}

function afterEnterTurn() {
  if (turnOptions.value.resolve) {
    turnOptions.value.resolve();
  }
  onResize();
}
function afterLeaveTurn() {
  if (turnOptions.value.resolve) {
    turnOptions.value.resolve();
  }
}

function onResize() {
  if (wrapperEl.value && containerEl.value) {
    wrapperPosition.value = ipoint(
      () =>
        (ipoint(window.innerWidth, window.innerHeight) -
          getLayoutFromElement(wrapperEl.value as HTMLElement).size) /
        2
    );
    nextTick(() => {
      containerLayout.value = getLayoutFromElement(
        containerEl.value as HTMLElement
      );
      backgroundLayout.value = getLayoutFromElement(
        backgroundEl.value as HTMLElement
      );
    });
  }
}

function turnOn(duration = 4000) {
  if (animate.value) {
    return Promise.resolve(false);
  }
  if (!$props.hasActiveAnimation) {
    duration = 0;
  }
  turnOptions.value.duration = duration;
  animate.value = true;

  return new Promise(resolve => {
    // animate = true;
    turnOptions.value.resolve = resolve;
    nextTick(() => (screenActive.value = true));
  })
    .then(() => {
      animate.value = false;
      $emit('turnOn', duration);
      return true;
    })
    .catch(err => {
      throw err;
    });
}
function turnOff(duration = 550) {
  if (animate.value) {
    return Promise.resolve(false);
  }
  if (!$props.hasActiveAnimation) {
    duration = 0;
  }
  turnOptions.value.duration = duration;
  animate.value = true;

  return new Promise(resolve => {
    turnOptions.value.resolve = resolve;
    nextTick(() => (screenActive.value = false));
  })
    .then(() => {
      animate.value = false;
      $emit('turnOff', duration);
      return true;
    })
    .catch(err => {
      throw err;
    });
}
function togglePanel(value = !openPanel.value) {
  openPanel.value = value;
}
function onClickPanelCover() {
  togglePanel();
}
function onClickPowerButton() {
  if (!screenActive.value) {
    turnOn();
  } else {
    turnOff();
  }
}

defineExpose({
  turnOn,
  turnOff,
  togglePanel
});
</script>

<style lang="postcss" scoped>
.wb-env-screen {
  --color-global-background: var(--color-screen-global-background, #000);
  --color-background: var(--color-screen-background, #fff);
  --color-boot-sequence-0: var(--color-screen-boot-sequence-0, #000);
  --color-boot-sequence-1: var(--color-screen-boot-sequence-1, #ccc);
  --color-boot-sequence-2: var(--color-screen-boot-sequence-2, #fff);
  --color-boot-sequence-3: var(--color-screen-boot-sequence-3, #05a);
  --z-index: 2147483640;

  #root > & {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  background: var(--color-global-background);
  background: linear-gradient(180deg, #222 0%, #111 100%);

  & .debug {
    position: absolute;
    top: 0;
    left: 0;
    z-index: var(--z-index);
    background: #000;

    & input {
      color: black;
    }
  }

  & .wrapper {
    width: 100%;
    height: 100%;
  }

  & .background {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    min-width: 100%;
    min-height: 100%;
    overflow: hidden;
    background-color: var(--color-background);
    transform-origin: center;
  }

  & :deep(.wb-env-element-cursor) {
    z-index: 900;
    display: none;
  }

  & .manipulation {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 901;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  & .container {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    cursor: none;

    & :deep(*),
    & * {
      cursor: none;
    }
  }

  &.animate {
    & .content {
      pointer-events: none;
    }
  }

  &.boot-sequence-0 {
    & .background {
      background-color: var(--color-boot-sequence-0);
    }
  }

  &.boot-sequence-1 {
    & .background {
      background-color: var(--color-boot-sequence-1);
    }
  }

  &.boot-sequence-2 {
    & .background {
      background-color: var(--color-boot-sequence-2);
    }
  }

  &.boot-sequence-error {
    & .background {
      background-color: var(--color-boot-sequence-error);
    }
  }

  &.boot-sequence-no-disk {
    & .background {
      background-color: var(--color-boot-sequence-no-disk);
    }
  }

  &.boot-sequence-ready {
    & .background {
      background-color: var(--color-background);
    }

    & :deep(.wb-env-element-cursor) {
      display: block;
    }
  }

  & .frame {
    display: none;
  }

  @media screen and (width >= 900px) {
    --outer-position-x: 79px;
    --outer-position-y: 72px;
    --outer-dimension-x: 742px;
    --outer-dimension-y: 596px;
    --inner-position-x: 31px;
    --inner-position-y: 30px;
    --inner-dimension-x: 680px;
    --inner-dimension-y: 536px;
    --screen-svg-width: 900px;
    --screen-svg-height: 816px;
    --wrapper-position-x: calc(50% + var(--screen-svg-width) / 2 * -1);
    --wrapper-position-y: calc(50% + var(--screen-svg-height) / 2 * -1);

    &.frame-active {
      & .wrapper {
        position: relative;
        top: var(--wrapper-position-y);
        left: var(--wrapper-position-x);
        width: var(--screen-svg-width);
        height: var(--screen-svg-height);
      }

      & .container {
        position: absolute;
        top: var(--outer-position-y);
        left: var(--outer-position-x);
        width: var(--outer-dimension-x);
        height: var(--outer-dimension-y);
        overflow: hidden;
        background: var(--color-global-background);
      }

      & .background {
        position: absolute;
        top: var(--inner-position-y);
        left: calc(
          var(--inner-position-x) + var(--horizontal-centering) * 100%
        );

        /* width: 100%; */
        width: var(--inner-dimension-x);
        min-width: auto;

        /* height: 100%; */
        height: var(--inner-dimension-y);
        min-height: auto;
      }

      & .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        /* top: var(--inner-position-y);
        left: var(--inner-position-x);
        width: var(--inner-dimension-x);
        height: var(--inner-dimension-y); */
      }

      & .frame {
        position: relative;
        z-index: var(--z-index);
        display: block;
        pointer-events: none;

        & > svg {
          display: block;
          width: var(--screen-svg-width);
          height: var(--screen-svg-height);
          filter: drop-shadow(0 0 8px rgb(0 0 0 / 30%));

          & > path {
            display: none;
          }
        }
      }

      & .frame > .power-button {
        position: absolute;
        right: 81px;
        bottom: 30px;
      }

      & .panel {
        position: absolute;
        right: 149px;
        bottom: 30px;

        /* z-index: 1000; */
        width: 406px;
        height: 70px;
        pointer-events: auto;

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          content: '';
          background: linear-gradient(
            180deg,
            rgb(0 0 0 / 15%) 0%,
            rgb(0 0 0 / 0%) 100%
          );
        }
      }

      & .panel > .cover {
        position: absolute;
        top: -2px;
        left: -2px;
        box-sizing: content-box;
        width: 100%;
        height: 100%;
        padding: 0;
        appearance: none;
        outline: none;
        background: #aaa69d;
        border: solid #757066 2px;
        border-bottom: none;
        filter: drop-shadow(0 -4px 4px rgb(0 0 0 / 0%));
        transform: rotateX(0deg);
        transform-origin: center bottom;
        transition:
          transform 0.3s ease-out,
          filter 0.1s 0s linear;

        & span {
          position: absolute;
          top: 50%;
          left: 50%;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          font-weight: bold;
          color: #000;
          text-transform: uppercase;
          letter-spacing: calc(1 / 11 * 1em);
          opacity: 0.2;
          transform: translate(-50%, -50%);
        }

        &:active {
          transform: rotateX(10deg) scaleY(0.95);
        }
      }

      &.open-panel {
        & .panel > .cover {
          filter: drop-shadow(0 -4px 4px rgb(0 0 0 / 40%));
          transform: rotateX(180deg);
          transition:
            transform 0.3s ease-in,
            filter 0.1s 0.2s linear;

          & span {
            transform: translate(-50%, -50%) rotateX(180deg);
          }

          &:active {
            transform: rotateX(180deg) rotateX(10deg) scaleY(0.95);
          }
        }
      }
    }
  }
}
</style>

<style lang="postcss">
.wb-env-screen {
  --scan-width: 2px;
  --scan-crt: true;
  --scan-fps: 60;
  --scan-color: rgb(0 0 0 / 15%);
  --scan-opacity: 0.75;

  & .scanlines {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    &::before,
    &::after {
      position: absolute;
      display: block;
      pointer-events: none;
      content: '';
    }

    &::before {
      position: absolute;
      bottom: 100%;
      z-index: calc(var(--z-index) + 1);
      width: 100%;
      height: calc(var(--scan-width) * 1);
      background: var(--scan-color);
      opacity: var(--scan-opacity);
      animation: scanline 6s linear infinite;
    }

    &::after {
      inset: 0;
      z-index: var(--z-index);
      background: linear-gradient(
        to bottom,
        transparent 50%,
        var(--scan-color) 51%
      );
      background-size: 100% calc(var(--scan-width) * 2);
      animation: scanlines 1s steps(var(--scan-fps)) infinite;
    }
  }

  @media screen and (width >= 900px) {
    &.frame-active {
      &.real-look {
        & .container {
          &::before {
            position: absolute;
            inset: 0;
            z-index: 999;
            display: block;
            pointer-events: none;
            content: ' ';
            background:
              linear-gradient(transparent 50%, rgb(0 0 0 / 25%) 50%),
              linear-gradient(
                90deg,
                rgb(255 0 0 / 6%),
                rgb(0 255 0 / 2%),
                rgb(0 0 255 / 6%)
              );
            background-size:
              100% 2px,
              3px 100%;
            opacity: 0.6;
          }

          &::after {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 500;
            width: 100%;
            height: 100%;
            pointer-events: none;
            content: '';
            background-image: radial-gradient(
              rgb(255 255 255 / 15%),
              rgb(0 0 0 / 20%) 180%
            );
            transition: opacity 0.2s ease-in;
          }
        }

        &.boot-sequence-ready.screen-active:not(.animate) {
          & .container::after {
            opacity: 0.2;
          }
        }
      }
    }
  }

  & .animation-turn-enter-active {
    animation-name: turn-on;
    animation-duration: var(--turn-duration, 4s);
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  & .animation-turn-leave-active {
    animation-name: turn-off;
    animation-duration: var(--turn-duration, 550ms);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    animation-fill-mode: forwards;
  }
}

@keyframes scanline {
  0% {
    transform: translate3d(0, 200000%, 0);
  }
}

@keyframes scanlines {
  0% {
    background-position: 0 50%;
  }
}

@keyframes turn-on {
  0% {
    opacity: 1;
    filter: brightness(30);
    transform: scale(1, 0.8) translate3d(0, 0, 0);
  }

  3.5% {
    transform: scale(1, 0.8) translate3d(0, 100%, 0);
  }

  3.6% {
    opacity: 1;
    transform: scale(1, 0.8) translate3d(0, -100%, 0);
  }

  9% {
    opacity: 0;
    filter: brightness(30);
    transform: scale(1.3, 0.6) translate3d(0, 100%, 0);
  }

  11% {
    opacity: 0;
    filter: contrast(0) brightness(0);
    transform: scale(1, 1) translate3d(0, 0, 0);
  }

  100% {
    opacity: 1;
    filter: contrast(1) brightness(1) saturate(1);
    transform: scale(1, 1) translate3d(0, 0, 0);
  }
}

@keyframes turn-off {
  0% {
    opacity: 1;
    filter: brightness(1);
    transform: scale(1, 1.3) translate3d(0, 0, 0);
  }

  60% {
    filter: brightness(10);
    transform: scale(1.3, 0.001) translate3d(0, 0, 0);
  }

  100% {
    opacity: 1;
    filter: brightness(50);
    transform: scale(0, 0.001) translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
}
</style>
