<template>
  <div class="wb-env-screen" :class="styleClasses" :style="style">
    <div ref="wrapper" class="wrapper" :style="wrapperStyle">
      <div ref="container" class="container">
        <transition
          name="animation-turn"
          @after-enter="afterEnterTurn"
          @after-leave="afterLeaveTurn">
          <div v-show="screenActive" ref="background" class="background">
            <div class="content">
              <slot />
            </div>
            <div v-if="hasScanLines && screenActive" class="scanlines">
              <div />
            </div>
            <wb-env-atom-cursor
              v-if="currentCursor && containerLayout"
              class="cursor"
              :parent-layout="containerLayout"
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
          :options="model"
          @click="onClickPowerButton" />
        <div class="panel">
          <wb-env-screen-panel :model="model" />

          <button class="cover" @click="onClickPanelCover">
            <span>Push</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipoint } from '@js-basics/vector';
import domEvents from '../services/domEvents';
import { getLayoutFromElement } from '../utils/layout';
import { BOOT_SEQUENCE, CONFIG_NAMES } from '../classes/Core/utils';

import SvgScreen from '../assets/svg/screen.svg?component';

import core from '../index';
import WbEnvAtomCursor from './atoms/Cursor';
import WbEnvScreenPanel from './screen/Panel';
import WbEnvScreenPowerButton from './screen/PowerButton';

export default {
  components: {
    SvgScreen,
    WbEnvAtomCursor,
    WbEnvScreenPanel,
    WbEnvScreenPowerButton
  },

  props: {
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
      type: Object,
      default() {
        return null;
      }
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

    model: {
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
  },

  emits: ['toggleScreenActive'],

  data() {
    return {
      openPanel: false,
      screenActive: false,
      turnOptions: {
        name: '',
        duration: 0,
        resolve: null
      },
      animate: false,
      wrapperPosition: null,
      containerLayout: null
    };
  },

  computed: {
    cursorOffset() {
      return ipoint(
        () =>
          this.containerLayout.size *
          ipoint(this.model.horizontalCentering - 0.5, 0)
      );
    },
    currentCursor() {
      if (this.cursor) {
        return this.cursor.current;
      }
      return null;
    },
    screenBackground() {
      return this.theme.colors.screen.background;
    },
    styleClasses() {
      return {
        animate: this.animate,
        'active-animation': this.hasActiveAnimation,
        'frame-active': this.frameActive,
        'screen-active': this.screenActive,
        'real-look': this.hasRealLook,
        'open-panel': this.openPanel,
        ['boot-sequence-' + this.bootSequence]: true
      };
    },
    style() {
      return {
        '--turn-duration': this.turnOptions.duration + 'ms',
        '--horizontal-centering': this.model.horizontalCentering - 0.5
      };
    },
    manipulationStyle() {
      return {
        'backdrop-filter': [
          `contrast(${this.model.contrast * 2 * 100}%)`,
          `brightness(${this.model.brightness * 2 * 100}%)`,
          `saturate(${this.model.color * 2 * 100}%)`,
          `blur(${this.model.sharpness * 50}px)`
        ].join(' ')
      };
    },
    wrapperStyle() {
      if (this.wrapperPosition) {
        const position = ipoint(() => Math.round(this.wrapperPosition));
        return {
          '--wrapper-position-x': position.x + 'px',
          '--wrapper-position-y': position.y + 'px'
        };
      }
      return {};
    }
  },

  watch: {
    model: {
      handler(model) {
        core.config.set(CONFIG_NAMES.SCREEN_CONFIG, model);
      },
      deep: true
    },
    screenActive(value) {
      this.$emit('toggleScreenActive', value);
    },
    frameActive() {
      this.$nextTick(() => {
        this.onResize();
      });
    },
    screenBackground(color) {
      document
        .querySelector('[name="theme-color"]')
        .setAttribute('content', color);
    },
    bootSequence() {
      let color;
      if (this.bootSequence < 4) {
        color = getComputedStyle(document.documentElement).getPropertyValue(
          '--color-boot-sequence-' + this.bootSequence
        );
      } else {
        color = getComputedStyle(document.documentElement).getPropertyValue(
          '--color-background'
        );
      }
      document
        .querySelector('[name="theme-color"]')
        .setAttribute('content', color);
    }
  },
  mounted() {
    this.subscriptions = [domEvents.resize.subscribe(this.onResize.bind(this))];
    this.onResize();
  },
  methods: {
    afterEnterTurn() {
      if (this.turnOptions.resolve) {
        this.turnOptions.resolve();
      }
    },
    afterLeaveTurn() {
      if (this.turnOptions.resolve) {
        this.turnOptions.resolve();
      }
    },

    onResize() {
      this.wrapperPosition = ipoint(
        () =>
          (ipoint(window.innerWidth, window.innerHeight) -
            getLayoutFromElement(this.$refs.wrapper).size) /
          2
      );
      this.$nextTick(() => {
        this.containerLayout = getLayoutFromElement(this.$refs.container);
      });
    },

    turnOn(duration = 4000) {
      if (this.animate) {
        return;
      }
      if (!this.hasActiveAnimation) {
        duration = 0;
      }
      this.turnOptions.duration = duration;
      this.animate = true;
      const $nextTick = this.$nextTick;
      return new Promise(resolve => {
        // this.animate = true;
        this.turnOptions.resolve = resolve;
        $nextTick(() => (this.screenActive = true));
      })
        .then(() => {
          this.animate = false;
          return true;
        })
        .catch(err => {
          throw err;
        });
    },
    turnOff(duration = 550) {
      if (this.animate) {
        return;
      }
      if (!this.hasActiveAnimation) {
        duration = 0;
      }
      this.turnOptions.duration = duration;
      this.animate = true;
      const $nextTick = this.$nextTick;
      return new Promise(resolve => {
        this.turnOptions.resolve = resolve;
        $nextTick(() => (this.screenActive = false));
      })
        .then(() => {
          this.animate = false;
          return true;
        })
        .catch(err => {
          throw err;
        });
    },
    togglePanel(value = !this.openPanel) {
      this.openPanel = value;
    },
    onClickPanelCover() {
      this.togglePanel();
    },
    onClickPowerButton() {
      if (!this.screenActive) {
        this.turnOn();
      } else {
        this.turnOff();
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-screen {
  --color-global-background: var(--color-screen-global-background, #000);
  --color-background: var(--color-screen-background, #000);
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

  & .cursor {
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

    & .cursor {
      display: block;
    }
  }

  & .frame {
    display: none;
  }

  @media screen and (width >= 900px) {
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

        /* margin-top: calc(var(--screen-svg-height) / 2 * -1);
        margin-left: calc(var(--screen-svg-width) / 2 * -1); */
      }

      & .container {
        position: absolute;
        top: calc((var(--screen-svg-height) - 670px) / 2 - 35px);
        left: calc((var(--screen-svg-width) - 830px) / 2);
        width: 830px;
        height: 670px;
        overflow: hidden;
        background: var(--color-global-background);
      }

      & .background {
        position: absolute;
        top: 0;
        left: calc(var(--horizontal-centering) * 100%);
        width: 100%;
        min-width: auto;
        height: 100%;
        min-height: auto;
      }

      & .content {
        position: absolute;
        top: calc((670px - 480px) / 2);
        left: calc((830px - 640px) / 2);
        width: 640px;
        height: 480px;
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
        background: #aaa69d;
        filter: drop-shadow(0 -4px 4px rgb(0 0 0 / 0%));
        border: solid #757066 2px;
        border-bottom: none;
        outline: none;
        transition:
          transform 0.3s ease-out,
          filter 0.1s 0s linear;
        transform: rotateX(0deg);
        transform-origin: center bottom;

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
          transition:
            transform 0.3s ease-in,
            filter 0.1s 0.2s linear;
          transform: rotateX(180deg);

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
            background: linear-gradient(transparent 50%, rgb(0 0 0 / 25%) 50%),
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
    animation-fill-mode: forwards;
    animation-timing-function: linear;
  }

  & .animation-turn-leave-active {
    animation-name: turn-off;
    animation-duration: var(--turn-duration, 550ms);
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
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
    filter: brightness(30);
    opacity: 1;
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
    filter: brightness(30);
    opacity: 0;
    transform: scale(1.3, 0.6) translate3d(0, 100%, 0);
  }

  11% {
    filter: contrast(0) brightness(0);
    opacity: 0;
    transform: scale(1, 1) translate3d(0, 0, 0);
  }

  100% {
    filter: contrast(1) brightness(1) saturate(1);
    opacity: 1;
    transform: scale(1, 1) translate3d(0, 0, 0);
  }
}

@keyframes turn-off {
  0% {
    filter: brightness(1);
    opacity: 1;
    transform: scale(1, 1.3) translate3d(0, 0, 0);
  }

  60% {
    filter: brightness(10);
    transform: scale(1.3, 0.001) translate3d(0, 0, 0);
  }

  100% {
    filter: brightness(50);
    opacity: 1;
    transform: scale(0, 0.001) translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
}
</style>
