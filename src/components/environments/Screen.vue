<template>
  <div
    class="wb-env-screen"
    :class="styleClasses"
  >
    <div class="screen__wrapper">
      <span class="screen__background" />
      <div
        v-if="options.screenActive"
        class="screen__content"
      >
        <slot />
      </div>
      <span v-if="hasScanline && options.screenActive" class="screen__scanlines" />
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
    hasScanline: {
      type: Boolean,
      default: false
    },
    bootSequence: {
      type: Number,
      default: BOOT_SEQUENCE.SEQUENCE_5
    },
    frameActive: {
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
  computed: {
    screenBackground () {
      return this.theme.colors.screen.background;
    },
    styleClasses () {
      return {
        'js--frame-active': this.frameActive,
        'js--screen-active': this.options.screenActive,
        'js--scanlines': this.hasScanline,
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
    onClickPowerButton () {
      this.options.screenActive = !this.options.screenActive;
    }
  }
};

</script>

<style lang="postcss">
:root {
  --color__screen__globalBackground: #000;
  --color__screen__background: #000;
  --color__boot__sequence_0: #000;
  --color__boot__sequence_1: #000;
  --color__boot__sequence_2: #ccc;
  --color__boot__sequence_3: #fff;
  --color__boot__sequence_4: #05a;
}

.wb-env-screen {
  /* --z-index: 2147483648; */

  --z-index: 2147483640;

  @nest #root > & {
    position: absolute;
    top: 0;
    left: 0%;
    width: 100%;
    height: 100%;
  }

  background: var(--color__screen__globalBackground);

  & .screen__wrapper {
    width: 100%;
    height: 100%;
  }

  & .screen__background {
    position: relative;
    display: block;
    min-width: 100%;
    min-height: 100%;
    background: var(--color-black);
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
      background-color: var(--color__boot__sequence_3);
    }
  }

  &.js--boot-sequence-4 {
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

      & .screen__background {
        position: absolute;
        top: 50px;
        left: 10%;
        width: 80%;
        min-width: auto;
        height: 80%;
        min-height: auto;

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: "";
          background:
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(255, 255, 255, 0) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.15) 100%
            );
          opacity: 0;
          transition: opacity 350ms ease;
        }
      }

      & .screen__content {
        position: absolute;
        top: 128px;
        left: 125px;

        /* display: flex;
    flex-direction: column; */
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
          width: 890px;
          height: 802px;

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
          transition: background 350ms ease;

          &::before {
            opacity: 1;
          }
        }
      }

      --scan-width: 2px;
      --scan-crt: true;
      --scan-fps: 60;
      --scan-color: rgba(0, 0, 0, 0.15);
      --scan-opacity: 0.75;

      & .screen__scanlines {
        position: absolute;
        top: 50px;
        left: 10%;
        z-index: 3;
        display: none;
        width: 80%;
        height: 80%;
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

      &.js--scanlines {
        & .screen__wrapper {
          & .screen__scanlines {
            display: block;
          }
        }
      }
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
