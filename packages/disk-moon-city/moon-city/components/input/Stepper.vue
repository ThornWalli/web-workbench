<template>
  <base-button
    :disabled="disabled"
    class="mc-stepper"
    :class="{ shadow, subtract: step < 0, pressed }"
    @pointerdown="onPointerDown"
    @pointerleave="onPointerLeave"
    @pointerup="onPointerLeave">
    <span />
  </base-button>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';

import BaseButton from '../base/Button.vue';
import useAudioControl from '../../composables/useAudioControl';
import { SFX } from '../../utils/sounds';

const $props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  },
  minMax: {
    type: Number,
    default: undefined
  },
  shadow: {
    type: Boolean,
    default: false
  }
});

const { playSfx } = useAudioControl();

const $emit = defineEmits<{
  (e: 'update:model-value', value: number): void;
}>();

let timeout: number | undefined;
const pressed = ref(false);
const onPointerDown = (e: Event, duration = 500, newDuration = duration) => {
  pressed.value = true;
  const isMathMax = $props.step > 0;

  let value = $props.modelValue;
  if ($props.minMax) {
    value = Math[isMathMax ? 'min' : 'max'](value, $props.minMax);
  }

  $emit('update:model-value', value);

  if (value !== $props.modelValue) {
    timeout = window.setTimeout(() => {
      onPointerDown(e, duration, Math.max(newDuration * 0.9, 0.25 * duration));
    }, newDuration);
  }

  nextTick(() => {
    playSfx(SFX.BUTTON_1_CLICK);
  });
};
const onPointerLeave = (e: Event) => {
  e.preventDefault();
  pressed.value = false;
  window.clearTimeout(timeout);
};
</script>

<style lang="postcss" scoped>
.mc-stepper {
  position: relative;
  display: block;
  width: 22px;
  height: 18px;

  &.shadow {
    box-shadow: 2px 2px 0 rgb(0 0 0 / 60%);
  }

  &[disabled] {
    filter: grayscale(100%);
  }

  & span {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 14px;
    content: '';
    background: url('../../assets/graphics/stepper/content/plus/default.png');
    background-size: contain;
  }

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    background: url('../../assets/graphics/stepper/frame/default.png');
    background-size: contain;
  }

  &:not([disabled]).pressed {
    & span {
      top: 4px;
      left: 4px;
      width: 14px;
      height: 10px;
      background-image: url('../../assets/graphics/stepper/content/plus/pressed.png');
    }

    &::after {
      background-image: url('../../assets/graphics/stepper/frame/pressed.png');
    }
  }

  &.subtract {
    & span {
      background-image: url('../../assets/graphics/stepper/content/minus/default.png');
    }

    &:not([disabled]).pressed {
      & span {
        background-image: url('../../assets/graphics/stepper/content/minus/pressed.png');
      }
    }
  }
}
</style>
