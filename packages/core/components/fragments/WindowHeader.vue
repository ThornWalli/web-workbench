<template>
  <header class="wb-env-fragment-window-header" :class="styleClasses">
    <div class="handlers handlers-left" :class="{ 'has-close': close }">
      <button
        v-if="close"
        aria-label="Close Window"
        class="control close"
        touch-action="none"
        @click="onClickClose">
        <svg-control-close />
      </button>
    </div>
    <button
      tabindex="-1"
      class="title-wrapper"
      @pointerdown="onPointerDownTitleWrapper">
      <span class="background">
        <span class="line" /><span class="line" /><span class="dots" />
      </span>
      <span v-if="title" ref="windowTitleWrapper" class="title">
        <span ref="windowTitle">{{ title }}</span>
      </span>
    </button>
    <div class="handlers handlers-right">
      <button
        v-if="overlay"
        aria-label="Move Window Up"
        class="control overlay-top"
        touch-action="none"
        @click="onClickOverlayTop"
        @pointerup="onPointerupOverlayTop">
        <svg-control-focus-max />
      </button>
      <button
        v-if="overlay"
        aria-label="Move Window Down"
        class="control overlay-bottom"
        touch-action="none"
        @click="onClickOverlayBottom"
        @pointerup="onPointerupOverlayBottom">
        <svg-control-focus-min />
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import type { NormalizedPointerEvent } from '@web-workbench/core/services/dom';
import { normalizePointerEvent } from '@web-workbench/core/services/dom';
import SvgControlClose from '../../assets/svg/control/close.svg?component';
import SvgControlFocusMax from '../../assets/svg/control/focus_max.svg?component';
import SvgControlFocusMin from '../../assets/svg/control/focus_min.svg?component';
import { computed } from 'vue';

const $props = defineProps<{
  close?: boolean;
  overlay?: boolean;
  title?: string;
  focused?: boolean;
}>();

const $emit = defineEmits<{
  (e: 'close' | 'up' | 'down', value: Event): void;
  (e: 'click:header', value: NormalizedPointerEvent): void;
}>();

const styleClasses = computed(() => {
  return {
    focused: $props.focused
  };
});

function onClickClose(e: Event) {
  e.preventDefault();

  $emit('close', e);
}

function onPointerDownTitleWrapper(e: Event) {
  e.preventDefault();

  $emit('click:header', normalizePointerEvent(e));
}
function onClickOverlayTop(e: Event) {
  e.preventDefault();

  $emit('up', e);
}
function onClickOverlayBottom(e: Event) {
  e.preventDefault();

  $emit('down', e);
}

function onPointerupOverlayTop(e: PointerEvent) {
  if (e.target instanceof HTMLButtonElement) {
    e.target.blur();
  }
}
function onPointerupOverlayBottom(e: PointerEvent) {
  if (e.target instanceof HTMLButtonElement) {
    e.target.blur();
  }
}
</script>

<style lang="postcss" scoped>
.wb-env-fragment-window-header {
  --outline-offset-x: 4px;
  --outline-offset-y: 4px;
  --color-background: var(--color-window-header-background, #fff);
  --color-stripes: var(--color-window-header-stripes, #05a);
  --color-title: var(--color-window-header-title, #05a);
  --color-button-background: var(--color-window-header-button-background, #05a);
  --color-button-primary: var(--color-window-header-button-primary, #fff);
  --color-button-secondary: var(--color-window-header-button-secondary, #000);

  position: relative;
  display: flex;
  width: 100%;
  height: 20px;
  user-select: none;

  .style-filled & {
    --color-background: var(
      --color-window-header-filled-background,
      var(--color-window-header-background, #fff)
    );
    --color-stripes: var(
      --color-window-header-filled-stripes,
      var(--color-window-header-stripes, #05a)
    );
    --color-title: var(
      --color-window-header-filled-title,
      var(--color-window-header-title, #05a)
    );
    --color-button-background: var(
      --color-window-header-filled-button-background,
      var(--color-window-header-button-background, #05a)
    );
    --color-button-primary: var(
      --color-window-header-filled-button-primary,
      var(--color-window-header-button-primary, #fff)
    );
    --color-button-secondary: var(
      --color-window-header-filled-button-secondary,
      var(--color-window-header-button-secondary, #000)
    );

    background: var(--color-background);

    & .background {
      display: none;
    }
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

  & svg {
    display: block;
  }

  & .title-wrapper {
    position: relative;
    display: block;
    flex: 1;
    text-align: left;
    touch-action: none;
    background-color: var(--color-background);
  }

  & .background {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: auto;
    height: 20px;
    overflow: hidden;
    background-color: var(--color-background);

    .wb-env-window.static & {
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
      content: '';
      background: var(--color-background);
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
        content: '';
        border: dotted var(--color-background) 2px;
      }
    }

    & .line {
      position: absolute;
      display: block;
      width: 100%;
      pointer-events: none;
      border: solid var(--color-stripes) 2px;

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
    color: var(--color-title);

    & > span {
      position: relative;
      display: inline-block;
      padding: 2px;
      padding-bottom: 0;
      padding-left: 3px;
      line-height: 18px;
      white-space: nowrap;
      background-color: var(--color-background);

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        background-color: var(--color-background);
        opacity: 1;
        mask-image: url('../../assets/img/font-stroke.png');
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
      background: var(--color-button-background);

      & :deep(.svg-primary) {
        fill: var(--color-button-primary);
      }

      & :deep(.svg-secondary) {
        fill: var(--color-button-secondary);
      }

      &:active {
        filter: var(--filter-default);
      }
    }

    & > .overlay-bottom {
      position: relative;
      width: 22px;
      margin-right: 2px;
      background: var(--color-button-background);

      & :deep(.svg-primary) {
        fill: var(--color-button-primary);
      }

      & :deep(.svg-secondary) {
        fill: var(--color-button-secondary);
      }

      &:active {
        filter: var(--filter-default);
      }
    }

    & > .overlay-top {
      position: relative;
      width: 22px;
      margin-right: 2px;
      background: var(--color-button-background);

      & :deep(.svg-primary) {
        fill: var(--color-button-primary);
      }

      & :deep(.svg-secondary) {
        fill: var(--color-button-secondary);
      }

      &:active {
        filter: var(--filter-default);
      }
    }
  }

  & > .handlers-left {
    margin-right: 2px;

    &.has-close {
      &::before {
        display: inline-block;
        width: 2px;
        height: 20px;
        content: '';
        background: transparent;
      }
    }
  }

  & > .handlers-right {
    margin-left: 2px;

    &::after {
      display: inline-block;
      width: 1px;
      height: 20px;
      content: '';
      background: var(--color-background);
    }
  }

  & > .control {
    box-sizing: content-box;
    display: inline-block;
    width: 20px;
    height: 20px;
    padding: 0;

    .wb-env-window.static & {
      display: none;
    }
  }

  &.focused {
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
