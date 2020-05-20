<template>
  <div
    class="wb-env-screen"
    :class="styleClasses"
    :style="style"
  >
    <div ref="wrapper" class="screen__wrapper" :style="wrapperStyle">
      <div ref="container" class="screen__container">
        <transition
          name="animation-turn"
          @after-enter="afterEnterTurn"
          @after-leave="afterLeaveTurn"
        >
          <div v-show="screenActive" ref="background" class="screen__background">
            <div
              class="screen__content"
            >
              <slot />
            </div>
            <div v-if="hasScanLines && screenActive" class="screen__scanlines">
              <div />
            </div>
            <wb-env-atom-cursor v-if="currentCursor && containerLayout" class="screen__cursor" :parent-layout="containerLayout" :offset="cursorOffset" :cursor="currentCursor" />
            <div class="screen__manipulation" :style="manipulationStyle" />
          </div>
        </transition>
        <slot :containerLayout="containerLayout" name="container" />
      </div>
      <div v-if="frameActive" class="screen__frame">
        <svg-screen />
        <wb-env-screen-power-button :active="screenActive" class="screen__frame__power-button" :options="options" @click="onClickPowerButton" />
        <div class="screen__frame__panel">
          <wb-env-screen-panel :options="options" />

          <button
            class="screen__frame__panel__cover"
            @click="onClickPanelCover"
          >
            <span>Push</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<story
  name="Screen"
  group="Environments"
  knobs="{}">
  <Screen />
</story>

<script>

import { ipoint } from '@js-basics/vector';
import { BOOT_SEQUENCE } from '../../web-workbench/classes/Core/utils';
import { getLayoutFromElement } from '../../web-workbench/utils/layout';
import domEvents from '../../web-workbench/services/domEvents';
import SvgScreen from '@/assets/svg/screen.svg?vue-template';
import WbEnvAtomCursor from '@/components/environments/atoms/Cursor';
import WbEnvScreenPanel from '@/components/environments/screen/Panel';
import WbEnvScreenPowerButton from '@/components/environments/screen/PowerButton';

export default {
  components: {
    SvgScreen,
    WbEnvAtomCursor,
    WbEnvScreenPanel,
    WbEnvScreenPowerButton
  },

  props: {
    theme: {
      type: Object,
      default () {
        return null;
      }
    },
    cursor: {
      type: Object,
      default () {
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
      type: [
        String, Number
      ],
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

    options: {
      type: Object,
      default () {
        return {
          contrast: 0,
          brightness: 0,
          color: 0,
          sharpness: -1,
          horizontalCentering: 0,
          soundVolumne: 1
        };
      }
    }

  },

  data () {
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
    cursorOffset () {
      return ipoint(() => this.containerLayout.size * ipoint(this.options.horizontalCentering - 0.5, 0));
    },
    currentCursor () {
      if (this.cursor) {
        return this.cursor.current;
      }
      return null;
    },
    screenBackground () {
      return this.theme.colors.screen.background;
    },
    styleClasses () {
      return {
        'js--animate': this.animate,
        'js--active-animation': this.hasActiveAnimation,
        'js--frame-active': this.frameActive,
        'js--screen-active': this.screenActive,
        'js--real-look': this.hasRealLook,
        'js--open-panel': this.openPanel,
        ['js--boot-sequence-' + this.bootSequence]: true
      };
    },
    style () {
      return {
        '--turn-duration': (this.turnOptions.duration) + 'ms',
        '--horizontal-centering': this.options.horizontalCentering - 0.5
      };
    },
    manipulationStyle () {
      return {
        'backdrop-filter': [
          `contrast(${(this.options.contrast * 2) * 100}%)`,
          `brightness(${(this.options.brightness * 2) * 100}%)`,
          `saturate(${(this.options.color * 2) * 100}%)`,
          `blur(${this.options.sharpness * 50}px)`
        ].join(' ')
      };
    },
    wrapperStyle () {
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
    screenActive (value) {
      this.$emit('toggleScreenActive', value);
    },
    frameActive () {
      this.onResize();
    },
    screenBackground (color) {
      document.querySelector('[name="theme-color"]')
        .setAttribute('content', color);
    },
    bootSequence () {
      let color;
      if (this.bootSequence < 4) {
        color = getComputedStyle(document.documentElement).getPropertyValue('--color__boot__sequence_' + this.bootSequence);
      } else {
        color = getComputedStyle(document.documentElement).getPropertyValue('--color__screen__background');
      }
      document.querySelector('[name="theme-color"]')
        .setAttribute('content', color);
    }
  },
  mounted () {
    this.subscriptions = [
      domEvents.resize.subscribe(this.onResize.bind(this))
    ];
    this.onResize();
  },
  methods: {

    afterEnterTurn () {
      if (this.turnOptions.resolve) { this.turnOptions.resolve(); }
    },
    afterLeaveTurn () {
      if (this.turnOptions.resolve) { this.turnOptions.resolve(); }
    },

    onResize () {
      this.$nextTick(() => {
        this.wrapperPosition = ipoint(() => (ipoint(global.innerWidth, global.innerHeight) - getLayoutFromElement(this.$refs.wrapper).size) / 2);
        this.containerLayout = getLayoutFromElement(this.$refs.container);
      });
    },

    turnOn (duration = 4000) {
      if (this.animate) {
        return;
      }
      if (!this.hasActiveAnimation) {
        duration = 0;
      }
      this.turnOptions.duration = duration;
      this.animate = true;
      const $nextTick = this.$nextTick;
      return new Promise((resolve) => {
      // this.animate = true;
        this.turnOptions.resolve = resolve;
        $nextTick(() => (this.screenActive = true));
      }).then(() => {
        this.animate = false;
        return true;
      }).catch((err) => {
        throw err;
      });
    },
    turnOff (duration = 550) {
      if (this.animate) {
        return;
      }
      if (!this.hasActiveAnimation) {
        duration = 0;
      }
      this.turnOptions.duration = duration;
      this.animate = true;
      const $nextTick = this.$nextTick;
      return new Promise((resolve) => {
        this.turnOptions.resolve = resolve;
        $nextTick(() => (this.screenActive = false));
      }).then(() => {
        this.animate = false;
        return true;
      }).catch((err) => {
        throw err;
      });
    },
    togglePanel (value = !this.openPanel) {
      this.openPanel = value;
    },
    onClickPanelCover () {
      this.togglePanel();
    },
    onClickPowerButton () {
      if (!this.screenActive) {
        this.turnOn();
      } else {
        this.turnOff();
      }
    }
  }
};

</script>

<style lang="postcss">
:root {
  --color__screen__globalBackground: #000;
  --color__screen__background: #000;
  --color__boot__sequence_0: #000;
  --color__boot__sequence_1: #ccc;
  --color__boot__sequence_2: #fff;
  --color__boot__sequence_3: #05a;
}

.wb-env-screen {
  /* --z-index: 2147483648; */

  --z-index: 2147483640;

  @nest #root > & {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  background: var(--color__screen__globalBackground);
  background: linear-gradient(180deg, #222 0%, #111 100%);

  /*
  background:
    radial-gradient(black 15%, transparent 16%) 0 0,
    radial-gradient(black 15%, transparent 16%) 8px 8px,
    radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px,
    radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px;
  background-color: #282828;
  background-size: 16px 16px; */

  /* background-color: #eee;
  background-image:
    linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black),
    linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black);
  background-position: 0 0, 30px 30px;
  background-size: 60px 60px; */
  & .screen__debug {
    position: absolute;
    top: 0;
    left: 0;
    z-index: var(--z-index);
    background: #000;

    & input {
      color: black;
    }
  }

  & .screen__wrapper {
    width: 100%;
    height: 100%;
  }

  & .screen__background {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    min-width: 100%;
    min-height: 100%;
    background: var(--color-black);
    background-color: var(--color__screen__background);
    transform-origin: center;
  }

  & .screen__cursor {
    z-index: 900;
    display: none;
  }

  & .screen__manipulation {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 901;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  & .screen__container {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    cursor: none;

    & * {
      cursor: none;
    }

  }

  &.js--animate {
    & .screen__content {
      pointer-events: none;
    }
  }

  &.js--boot-sequence-0 {
    & .screen__background {
      background-color: var(--color__boot__sequence_0);
    }
  }

  &.js--boot-sequence-1 {
    & .screen__background {
      background-color: var(--color__boot__sequence_1);
    }
  }

  &.js--boot-sequence-2 {
    & .screen__background {
      background-color: var(--color__boot__sequence_2);
    }
  }

  &.js--boot-sequence-error {
    & .screen__background {
      background-color: var(--color__boot__sequence_error);
    }
  }

  &.js--boot-sequence-no_disk {
    & .screen__background {
      background-color: var(--color__boot__sequence_no_disk);
    }
  }

  &.js--boot-sequence-ready {
    & .screen__background {
      background-color: var(--color__screen__background);
    }

    & .screen__cursor {
      display: block;
    }
  }

  & .screen__frame {
    display: none;
  }

  @media screen and (min-width: 900px) {
    --screen-svg-width: 900px;
    --screen-svg-height: 816px;
    --wrapper-position-x: calc(50% + var(--screen-svg-width) / 2 * -1);
    --wrapper-position-y: calc(50% + var(--screen-svg-height) / 2 * -1);

    &.js--frame-active {
      & .screen__wrapper {
        position: relative;
        top: var(--wrapper-position-y);
        left: var(--wrapper-position-x);
        width: var(--screen-svg-width);
        height: var(--screen-svg-height);

        /* margin-top: calc(var(--screen-svg-height) / 2 * -1);
        margin-left: calc(var(--screen-svg-width) / 2 * -1); */
      }

      & .screen__container {
        position: absolute;
        top: calc((var(--screen-svg-height) - 670px) / 2 - 35px);
        left: calc((var(--screen-svg-width) - 830px) / 2);
        width: 830px;
        height: 670px;
        overflow: hidden;
        background: var(--color__screen__globalBackground);
      }

      & .screen__background {
        position: absolute;
        top: 0;
        left: calc(var(--horizontal-centering) * 100%);
        width: 100%;
        min-width: auto;
        height: 100%;
        min-height: auto;
        overflow: hidden;
      }

      & .screen__content {
        position: absolute;
        top: calc((670px - 480px) / 2);
        left: calc((830px - 640px) / 2);
        width: 640px;
        height: 480px;
      }

      & .screen__frame {
        position: relative;
        z-index: var(--z-index);
        display: block;
        pointer-events: none;

        & > svg {
          display: block;
          width: var(--screen-svg-width);
          height: var(--screen-svg-height);
          filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.3));

          & > path {
            display: none;
          }

        }
      }

      & .screen__frame__power-button {
        position: absolute;
        right: 81px;
        bottom: 30px;
      }

      & .screen__frame__panel {
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
          content: "";
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%);
        }
      }

      & .screen__frame__panel__cover {
        position: absolute;
        top: -2px;
        left: -2px;
        box-sizing: content-box;
        width: 100%;
        height: 100%;
        padding: 0;
        background: #aaa69d;
        filter: drop-shadow(0 -4px 4px rgba(0, 0, 0, 0));
        border: solid #757066 2px;
        border-bottom: none;
        outline: none;
        transition: transform 0.3s ease-out, filter 0.1s 0s linear;
        transform: rotateX(0deg);
        transform-origin: center bottom;
        -webkit-appearance: none;

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

      &.js--open-panel {
        & .screen__frame__panel__cover {
          filter: drop-shadow(0 -4px 4px rgba(0, 0, 0, 0.4));
          transition: transform 0.3s ease-in, filter 0.1s 0.2s linear;
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
  --scan-color: rgba(0, 0, 0, 0.15);
  --scan-opacity: 0.75;

  & .screen__scanlines {
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
      content: "";
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
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: var(--z-index);
      background:
        linear-gradient(
          to bottom,
          transparent 50%,
          var(--scan-color) 51%
        );
      background-size: 100% calc(var(--scan-width) * 2);
      animation: scanlines 1s steps(var(--scan-fps)) infinite;
    }
  }

  @media screen and (min-width: 900px) {
    &.js--frame-active {
      &.js--real-look {
        & .screen__container {
          &::before {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 999;
            display: block;
            pointer-events: none;
            content: " ";
            background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
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
            content: "";
            background-image:
              radial-gradient(
                rgba(255, 255, 255, 0.15),
                rgba(0, 0, 0, 0.2) 180%
              );
            transition: opacity 0.2s ease-in;
          }
        }

        &.js--boot-sequence-ready.js--screen-active:not(.js--animate) {
          & .screen__container::after {
            opacity: 0.2;
          }
        }
      }
    }
  }

  & .animation-turn-enter-active {
    animation-name: turnOn;
    animation-duration: var(--turn-duration, 4s);
    animation-fill-mode: forwards;
    animation-timing-function: linear;
  }

  & .animation-turn-leave-active {
    animation-name: turnOff;
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

@keyframes turnOn {
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

@keyframes turnOff {
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
