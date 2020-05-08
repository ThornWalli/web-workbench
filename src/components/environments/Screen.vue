<template>
  <div
    class="wb-env-screen"
    :class="styleClasses"
    :style="style"
  >
    <div class="screen__wrapper">
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
            <div v-if="hasScanLines && options.screenActive" class="screen__scanlines">
              <div />
            </div>
            <wb-env-atom-cursor v-if="currentCursor && containerLayout" class="screen__cursor" :parent-layout="containerLayout" :cursor="currentCursor" />
          </div>
        </transition>
        <slot :containerLayout="containerLayout" name="container" />
      </div>
      <div v-if="frameActive" class="screen__frame">
        <svg-screen />
        <button
          class="screen__frame__power-button"
          @click="onClickPowerButton"
        >
          <span class="light" />
        </button>
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

import { BOOT_SEQUENCE } from '../../web-workbench/classes/Core';
import { getLayoutFromElement } from '../../web-workbench/utils/layout';
import domEvents from '../../web-workbench/services/domEvents';
import SvgScreen from '@/assets/svg/screen.svg?vue-template';
import WbEnvAtomCursor from '@/components/environments/atoms/Cursor.vue';

export default {
  components: {
    SvgScreen, WbEnvAtomCursor
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
      type: Number,
      default: BOOT_SEQUENCE.SEQUENCE_4
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
          screenActive: true
        };
      }
    }

  },

  data () {
    return {
      screenActive: false,
      turnOptions: {
        name: '',
        duration: 0,
        resolve: null
      },
      animate: false,
      containerLayout: null
    };
  },

  computed: {
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
        'js--screen-active': this.options.screenActive,
        'js--real-look': this.hasRealLook,
        ['js--boot-sequence-' + this.bootSequence]: true
      };
    },
    style () {
      return {
        '--turn-duration': (this.turnOptions.duration / 1000) + 's'
      };
    }
  },
  watch: {
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
    this.subscribtions = [
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
        this.options.screenActive = true;
        $nextTick(() => (this.screenActive = true));
      }).then(() => {
        this.animate = false;
        return true;
      }).catch((err) => {
        throw err;
      });
    },
    turnOff (duration = 250) {
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
        this.options.screenActive = false;
        this.animate = false;
        return true;
      }).catch((err) => {
        throw err;
      });
    },
    onClickPowerButton () {
      if (!this.options.screenActive) {
        this.turnOn();
      } else {
        this.turnOff();
      }
    }
  }
};

// const turnOn = [
//   {
//     offset: 0,
//     '-webkit-filter': 'brightness(30)',
//     filter: 'brightness(30)',
//     opacity: 1,
//     transform: 'scale(1, 0.8) translate3d(0, 0, 0)'
//   },
//   {
//     offset: 0.035,
//     transform: 'scale(1, 0.8) translate3d(0, 100%, 0)'
//   },
//   {
//     offset: 0.036,
//     opacity: 1,
//     transform: 'scale(1, 0.8) translate3d(0, -100%, 0)'
//   },
//   {
//     offset: 0.09,
//     '-webkit-filter': 'brightness(30)',
//     filter: 'brightness(30)',
//     opacity: 0,
//     transform: 'scale(1.3, 0.6) translate3d(0, 100%, 0)'
//   },
//   {
//     offset: 0.11,
//     '-webkit-filter': 'contrast(0) brightness(0)',
//     filter: 'contrast(0) brightness(0)',
//     opacity: 0,
//     transform: 'scale(1, 1) translate3d(0, 0, 0)'
//   },
//   {
//     offset: 1,
//     '-webkit-filter': 'contrast(1) brightness(1) saturate(1)',
//     filter: 'contrast(1) brightness(1) saturate(1)',
//     opacity: 1,
//     transform: 'scale(1, 1) translate3d(0, 0, 0)'
//   }
// ];
// const turnOff = [
//   {
//     offset: 0,
//     '-webkit-filter': 'brightness(1)',
//     filter: 'brightness(1)',
//     opacity: 1,
//     transform: 'scale(1, 1.3) translate3d(0, 0, 0)'
//   },
//   {
//     offset: 0.6,
//     '-webkit-filter': 'brightness(10)',
//     filter: 'brightness(10)',
//     transform: 'scale(1.3, 0.001) translate3d(0, 0, 0)'
//   },
//   {
//     offset: 1,
//     '-webkit-filter': 'brightness(50)',
//     filter: 'brightness(50)',
//     opacity: 1,
//     transform: 'scale(0, 0.0001) translate3d(0, 0, 0)'
//     // 'animation-timing-function': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)'
//   }
// ];

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

  & .screen__wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  & .screen__background {
    position: relative;
    display: block;
    min-width: 100%;
    min-height: 100%;
    background: var(--color-black);
    background-color: var(--color__screen__background);
    transform-origin: center;
  }

  & .screen__cursor {
    display: none;
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

  &.js--boot-sequence-3 {
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
    --screen-svg-height: 810px;

    &.js--frame-active {
      & .screen__wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        width: var(--screen-svg-width);
        height: var(--screen-svg-height);
        margin-top: calc(var(--screen-svg-width) / 2 * -1);
        margin-left: calc(var(--screen-svg-height) / 2 * -1);
      }

      & .screen__container {
        position: absolute;
        top: calc((var(--screen-svg-height) - 670px) / 2 - 35px);
        left: calc((var(--screen-svg-width) - 830px) / 2);
        width: 830px;
        height: 670px;
        overflow: hidden;
      }

      & .screen__background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        min-width: auto;
        height: 100%;
        min-height: auto;
        overflow: hidden;
      }

      &.js--screen-active {
        & .screen__content,
        & .screen__cursor {
          opacity: 1;
        }
      }

      & .screen__content,
      & .screen__cursor {
        opacity: 0;
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

        & svg {
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
        bottom: 25px;
        z-index: 1000;
        width: 66px;
        height: 70px;
        padding: 0;
        pointer-events: auto;
        background: transparent;
        border: none;
        -webkit-appearance: none;
        outline: none;

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: "";
          background: #000;
          opacity: 0;
          transition: opacity 175ms ease;
          will-change: opacity;
        }

        @nest .wb-core.js--screen-wrapper & {
          display: block;
        }

        &:active {
          &::after {
            opacity: 0.1;
          }
        }

        & .light {
          position: absolute;
          top: 11px;
          left: 24px;
          width: 18px;
          height: 10px;

          /* box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 0 0; */
          background-color: #f00;

          /* background-color: #F00; */
          box-shadow:
            rgba(0, 0, 0, 0.2) 0 -1px 7px 1px,
            inset #441313 0 -1px 9px,
            rgba(255, 0, 0, 0.5) 0 2px 12px;
          transition: background-color 175ms ease, box-shadow 175ms ease;
        }
      }

      &:not(.js--screen-active) {
        & .screen__frame__power-button {
          & .light {
            background: darkred;
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
        }

        & .screen__background {
          background-color: var(--workbenchBackgroundColor_default);

          /* transition: background 350ms ease; */

          &::before {
            opacity: 1;
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

        &.js--boot-sequence-3.js--screen-active:not(.js--animate) {
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
    animation-duration: var(--turn-duration, 0.55s);
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
    -webkit-filter: brightness(30);
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
    -webkit-filter: brightness(30);
    filter: brightness(30);
    opacity: 0;
    transform: scale(1.3, 0.6) translate3d(0, 100%, 0);
  }

  11% {
    -webkit-filter: contrast(0) brightness(0);
    filter: contrast(0) brightness(0);
    opacity: 0;
    transform: scale(1, 1) translate3d(0, 0, 0);
  }

  100% {
    -webkit-filter: contrast(1) brightness(1) saturate(1);
    filter: contrast(1) brightness(1) saturate(1);
    opacity: 1;
    transform: scale(1, 1) translate3d(0, 0, 0);
  }
}

@keyframes turnOff {
  0% {
    -webkit-filter: brightness(1);
    filter: brightness(1);
    opacity: 1;
    transform: scale(1, 1.3) translate3d(0, 0, 0);
  }

  60% {
    -webkit-filter: brightness(10);
    filter: brightness(10);
    transform: scale(1.3, 0.001) translate3d(0, 0, 0);
  }

  100% {
    -webkit-filter: brightness(50);
    filter: brightness(50);
    opacity: 1;
    transform: scale(0, 0.0001) translate3d(0, 0, 0);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
}

</style>
