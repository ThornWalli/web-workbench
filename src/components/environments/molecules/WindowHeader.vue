<template>
  <header class="wb-env-molecule-window-header" :class="styleClasses">
    <div class="handlers handlers-left">
      <span
        v-if="close"
        class="control close"
        touch-action="none"
        @pointerup="onPointerUpClose"
      >
        <svg-control-close />
      </span>
    </div>
    <div
      class="title-wrapper"
      touch-action="none"
      @pointerdown="onPointerDownTitleWrapper"
    >
      <span class="background">
        <span class="line" /><span class="line" /><span class="dots" />
      </span>
      <span
        v-if="title"
        ref="windowTitleWrapper"
        class="title"
      >
        <span ref="windowTitle">{{ title }}</span>
      </span>
    </div>
    <div class="handlers handlers-right">
      <span
        v-if="overlay"
        class="control overlay-top"
        touch-action="none"
        @pointerup="onPointerUpOverlayTop"
      >
        <svg-control-focus-max />
      </span>
      <span
        v-if="overlay"
        class="control overlay-bottom"
        touch-action="none"
        @pointerup="onPointerUpOverlayBottom"
      >
        <svg-control-focus-min />
      </span>
    </div>
  </header>
</template>

<script>

import { touchEvent } from '@/web-workbench/services/dom';
import SvgControlClose from '@/assets/svg/control/close.svg?component';
import SvgControlFocusMax from '@/assets/svg/control/focus_max.svg?component';
import SvgControlFocusMin from '@/assets/svg/control/focus_min.svg?component';

export default {
  components: {
    SvgControlClose,
    SvgControlFocusMax,
    SvgControlFocusMin
  },
  props: {
    close: {
      type: Boolean,
      default: true
    },
    overlay: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Window Header'
    },
    focused: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    'close', 'click', 'up', 'down'
  ],

  data () {
    return {
    };
  },
  computed: {
    styleClasses () {
      return {
        'js--focused': this.focused
      };
    }
  },
  methods: {
    onPointerUpClose (e) {
      e.preventDefault();
      touchEvent(e);
      this.$emit('close', e);
    },
    onPointerDownTitleWrapper (e) {
      e.preventDefault();
      touchEvent(e);
      this.$emit('click', e);
    },
    onPointerUpOverlayTop (e) {
      e.preventDefault();
      touchEvent(e);
      this.$emit('up', e);
    },
    onPointerUpOverlayBottom (e) {
      e.preventDefault();
      touchEvent(e);
      this.$emit('down', e);
    }
  }
};

</script>

<style lang="postcss" scoped>
.wb-env-molecule-window-header {
  --color__background: var(--color__windowHeader__background, #fff);
  --color__stripes: var(--color__windowHeader__stripes, #05a);
  --color__title: var(--color__windowHeader__title, #05a);
  --color__buttonBackground: var(--color__windowHeader__buttonBackground, #05a);
  --color__buttonPrimary: var(--color__windowHeader__buttonPrimary, #fff);
  --color__buttonSecondary: var(--color__windowHeader__buttonSecondary, #000);

  position: relative;
  display: flex;
  width: 100%;
  height: 20px;
  user-select: none;

  & svg {
    display: block;
  }

  & .title-wrapper {
    position: relative;
    flex: 1;
  }

  & .background {
    position: absolute;

    /* right: 51px;
    left: 26px; */
    right: 0;
    left: 0;
    width: auto;
    height: 20px;
    overflow: hidden;
    background-color: var(--color__background);

    .wb-env-window.js--static & {
      right: 3px;
      left: 3px;
    }

    &::before,
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 3px;
      height: 20px;
      content: "";
      background: var(--color__background);
    }

    &::after {
      right: 0;
      left: auto;
    }

    & .dots {
      opacity: 1;

      &::before {
        top: 4px;
        width: 100%;
        height: 12px;
        border-width: 2px;
      }

      &::after {
        top: 6px;
        left: -2px;
        width: 100%;
        height: 8px;
        border-width: 2px;
      }

      &::before,
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: "";
        border:
          dotted var(--color__background)
          2px;
      }
    }

    & .line {
      position: absolute;
      display: block;
      width: 100%;
      border: solid var(--color__stripes) 2px;

      &:first-child {
        top: 4px;
      }

      &:nth-child(2) {
        top: 12px;
      }
    }
  }

  & .title {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    display: inline-block;
    overflow: hidden;
    color: var(--color__title);

    & > span {
      position: relative;
      display: inline-block;
      padding: 2px;
      padding-bottom: 0;
      padding-left: 3px;
      line-height: 18px;
      white-space: nowrap;
      background-color: var(--color__background);

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: "";
        background-color: var(--color__background);
        opacity: 1;
        mask-image: url("@/assets/img/font-stroke.png");
      }
    }
  }

  & .handlers {
    font-size: 0;

    &::before,
    & > * {
      font-size: 1rem;
    }

    & > span {
      display: inline-block;
    }

    & > .close {
      position: relative;
      width: 20px;
      background: var(--color__buttonBackground);

      & :deep(.svg__primary) {
        fill: var(--color__buttonPrimary);
      }

      & :deep(.svg__secondary) {
        fill: var(--color__buttonSecondary);
      }

      &:active {
        filter: var(--filter__default);
      }
    }

    & > .overlay-bottom {
      position: relative;
      width: 22px;
      margin-right: 2px;
      background: var(--color__buttonBackground);

      & :deep(.svg__primary) {
        fill: var(--color__buttonPrimary);
      }

      & :deep(.svg__secondary) {
        fill: var(--color__buttonSecondary);
      }

      &:active {
        filter: var(--filter__default);
      }
    }

    & > .overlay-top {
      position: relative;
      width: 22px;
      margin-right: 2px;
      background: var(--color__buttonBackground);

      & :deep(.svg__primary) {
        fill: var(--color__buttonPrimary);
      }

      & :deep(.svg__secondary) {
        fill: var(--color__buttonSecondary);
      }

      &:active {
        filter: var(--filter__default);
      }
    }
  }

  & > .handlers-left {
    margin-right: 2px;

    &::before {
      display: inline-block;
      width: 2px;
      height: 20px;
      content: "";
      background: transparent;
    }
  }

  & > .handlers-right {
    margin-left: 2px;

    &::after {
      display: inline-block;
      width: 1px;
      height: 20px;
      content: "";
      background: var(--color__background);
    }
  }

  & > .control {
    box-sizing: content-box;
    display: inline-block;
    width: 20px;
    height: 20px;
    padding: 0;

    .wb-env-window.js--static & {
      display: none;
    }
  }

  &.js--focused {
    & .title {
      & > span {
        &::after {
          opacity: 0;
        }
      }
    }

    & .background {
      & > .dots {
        opacity: 0;
      }
    }
  }
}
</style>
