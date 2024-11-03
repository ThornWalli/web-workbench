<template>
  <base-button
    class="mc-stepper"
    :class="{ shadow, subtract: step < 0, pressed }"
    @click="onPointerDown"
    @pointerup="onPointerLeave"
    @pointerleave="onPointerLeave">
    <span></span>
  </base-button>
</template>

<script setup>
import BaseButton from '../base/Button.vue';
import useAudioControl from '../../composables/useAudioControl';

const $props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: Infinity
  },
  shadow: {
    type: Boolean,
    default: false
  }
});

const { playSfx } = useAudioControl();

const $emit = defineEmits(['update:model-value']);

let timeout;
const pressed = ref(false);
const onPointerDown = (e, duration = 500, newDuration = duration) => {
  pressed.value = true;
  playSfx('button_1_click');

  const value = Math.min(
    $props.max,
    Math.max($props.min, $props.modelValue + $props.step)
  );

  $emit('update:model-value', value);
  if (value !== $props.modelValue) {
    timeout = setTimeout(() => {
      onPointerDown(e, duration, Math.max(newDuration * 0.9, 0.25 * duration));
    }, newDuration);
  }
};
const onPointerLeave = () => {
  clearTimeout(timeout);
  pressed.value = false;
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

  & span {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 14px;
    content: '';
    background: url('../../assets/graphics/stepper/content/plus-default.png');
    background-size: contain;
  }

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    background: url('../../assets/graphics/stepper/frame/default.png');
    background-size: contain;
  }

  &.pressed {
    & span {
      top: 4px;
      left: 4px;
      width: 14px;
      height: 10px;
      background-image: url('../../assets/graphics/stepper/content/plus-pressed.png');
    }

    &::after {
      background-image: url('../../assets/graphics/stepper/frame/pressed.png');
    }
  }

  &.subtract {
    & span {
      background-image: url('../../assets/graphics/stepper/content/minus-default.png');
    }

    &.pressed {
      & span {
        background-image: url('../../assets/graphics/stepper/content/minus-pressed.png');
      }
    }
  }
}
</style>
