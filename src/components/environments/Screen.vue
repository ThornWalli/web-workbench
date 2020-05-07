<template>
  <div
    class="wb-env-screen"
    :class="styleClasses"
  >
    <div class="screen__wrapper">
      <div class="screen__container">
        <div ref="background" class="screen__background">
          <div
            class="screen__content"
          >
            <slot />
          </div>
          <div v-if="hasRealLook && options.screenActive" class="screen__scanlines">
            <div />
          </div>
        </div>
      </div>
      <div v-if="frameActive" class="screen__frame">
        <span><svg-screen /></span>
        <span
          class="screen__frame__power-button"
          @click="onClickPowerButton"
        ><span class="light" />
        </span>
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
import SvgScreen from '@/assets/svg/screen.svg?vue-template';

export default {
  components: { SvgScreen },

  props: {
    theme: {
      type: Object,
      default () {
        return null;
      }
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
      animate: false
    };
  },

  computed: {
    screenActive () {
      return this.options.screenActive;
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
    }
  },
  watch: {

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
  methods: {

    turnOn (duration = 4000) {
      if (this.animate) {
        return;
      }
      this.animate = true;
      return new Promise((resolve) => {
        this.options.screenActive = true;
        if (!this.hasActiveAnimation) {
          return resolve();
        }
        const animation = this.$refs.background.animate(turnOn, {
          duration,
          easing: 'linear',
          fill: 'forwards',
          endDelay: 200
        });
        animation.addEventListener('finish', () => {
          animation.cancel();
          this.animate = false;
          resolve();
        });
      });
    },
    turnOut (duration = 550) {
      if (this.animate) {
        return;
      }
      this.animate = true;
      return new Promise((resolve) => {
        if (!this.hasActiveAnimation) {
          this.options.screenActive = false;
          return resolve();
        }
        const animation = this.$refs.background.animate(turnOut, {
          duration,
          easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
          fill: 'forwards'
        });
        animation.addEventListener('finish', () => {
          animation.cancel();
          this.options.screenActive = false;
          this.animate = false;
          resolve();
        });
      });
    },
    onClickPowerButton () {
      if (!this.options.screenActive) {
        this.turnOn();
      } else {
        this.turnOut();
      }
    }
  }
};

const turnOn = [
  {
    offset: 0,
    '-webkit-filter': 'brightness(30)',
    filter: 'brightness(30)',
    opacity: 1,
    transform: 'scale(1, 0.8) translate3d(0, 0, 0)'
  },
  {
    offset: 0.035,
    transform: 'scale(1, 0.8) translate3d(0, 100%, 0)'
  },
  {
    offset: 0.036,
    opacity: 1,
    transform: 'scale(1, 0.8) translate3d(0, -100%, 0)'
  },
  {
    offset: 0.09,
    '-webkit-filter': 'brightness(30)',
    filter: 'brightness(30)',
    opacity: 0,
    transform: 'scale(1.3, 0.6) translate3d(0, 100%, 0)'
  },
  {
    offset: 0.11,
    '-webkit-filter': 'contrast(0) brightness(0)',
    filter: 'contrast(0) brightness(0)',
    opacity: 0,
    transform: 'scale(1, 1) translate3d(0, 0, 0)'
  },
  {
    offset: 1,
    '-webkit-filter': 'contrast(1) brightness(1) saturate(1)',
    filter: 'contrast(1) brightness(1) saturate(1)',
    opacity: 1,
    transform: 'scale(1, 1) translate3d(0, 0, 0)'
  }
];

const turnOut = [
  {
    offset: 0,
    '-webkit-filter': 'brightness(1)',
    filter: 'brightness(1)',
    opacity: 1,
    transform: 'scale(1, 1.3) translate3d(0, 0, 0)'
  },
  {
    offset: 0.6,
    '-webkit-filter': 'brightness(10)',
    filter: 'brightness(10)',
    transform: 'scale(1.3, 0.001) translate3d(0, 0, 0)'
  },
  {
    offset: 1,
    '-webkit-filter': 'brightness(50)',
    filter: 'brightness(50)',
    opacity: 1,
    transform: 'scale(0, 0.0001) translate3d(0, 0, 0)'
    // 'animation-timing-function': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)'
  }
];

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

  & .screen__container {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
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
  }

  & .screen__frame {
    display: none;
  }

  @media screen and (min-width: 890px) {
    &.js--frame-active {
      & .screen__wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        width: 890px;
        height: 802px;
        margin-top: calc(-802px / 2);
        margin-left: calc(-890px / 2);
      }

      & .screen__container {
        position: absolute;
        top: 50px;
        left: 10%;
        width: 80%;
        height: 80%;
        overflow: hidden;

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
        & .screen__content {
          opacity: 1;
        }
      }

      & .screen__content {
        position: absolute;
        top: calc(128px - 50px);
        left: calc(125px - 89px);

        /* display: flex;
    flex-direction: column; */
        width: 640px;
        height: 480px;
        opacity: 0;
      }

      & .screen__frame {
        position: relative;
        z-index: var(--z-index);
        display: block;
        pointer-events: none;

        & svg {
          display: block;
          width: 890px;
          height: 802px;
          filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.2));

          & > path {
            display: none;
          }
        }
      }

      & .screen__frame__power-button {
        position: absolute;
        right: 80px;
        bottom: 22px;
        z-index: 1000;
        width: 67px;
        height: 67px;
        pointer-events: auto;

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
          top: 8px;
          left: 24px;
          width: 19px;
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
    display: none;
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

  @media screen and (min-width: 890px) {
    &.js--frame-active {
      &.js--real-look {
        & .screen__container {
          &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            content: "";
            background-image:
              radial-gradient(
                rgba(255, 255, 255, 0.15),
                rgba(0, 0, 0, 0.2) 180%
              );
            opacity: 0;
            transition: opacity 0.2s linear;
          }
        }

        &:not(.js--boot-sequence-3),
        &:not(.js--screen-active),
        &.js--animate {
          & .screen__container::after {
            opacity: 1;
          }
        }
      }
    }
  }

  & .screen__wrapper {
    & .screen__scanlines {
      display: block;
    }
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

</style>
