<template>
  <base-button
    class="mc-button"
    :class="{ selected: modelValue, [`size-${size}`]: size }"
    :disabled="disabled"
    @click="$emit('update:model-value', !modelValue)">
    <mc-text border glossy :color="color" :content="preparedLabel" />
  </base-button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { COLOR } from '../utils/color';
import BaseButton from './base/Button.vue';
import McText from './Text.vue';
import { SIZE } from '../types';

defineEmits<{
  (e: 'update:model-value', value: boolean): void;
}>();

const $props = defineProps({
  color: {
    type: String,
    default: COLOR.DARK_YELLOW,
    validate: (color: COLOR) => {
      return Object.values(COLOR).includes(color);
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Button'
  },
  shortLabel: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: SIZE) =>
      [SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE].includes(value)
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const preparedLabel = computed(() => {
  return $props.shortLabel || $props.label;
});
</script>

<style lang="postcss" scoped>
.mc-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: contain;
  box-shadow: 2px 2px 0 0 rgb(0 0 0 / 50%);
  transition: filter 0.2s steps(3);

  &[disabled] {
    filter: grayscale(100%);
  }

  &.size-small {
    width: 64px;
    height: 32px;
    background-image: url('../assets/graphics/button/frame/small.png');

    &:not([disabled]) {
      &:active,
      &.selected {
        background-image: url('../assets/graphics/button/frame/small_pressed.png');
      }
    }
  }

  &.size-medium {
    width: 104px;
    height: 32px;
    background-image: url('../assets/graphics/button/frame/medium.png');

    &:not([disabled]) {
      &:active,
      &.selected {
        background-image: url('../assets/graphics/button/frame/medium_pressed.png');
      }
    }
  }

  &.size-large {
    width: 64px;
    height: 50px;
    background-image: url('../assets/graphics/button/frame/large.png');

    &:not([disabled]) {
      &:active,
      &.selected {
        background-image: url('../assets/graphics/button/frame/large_pressed.png');
      }
    }
  }

  &:not([disabled]) {
    &:active,
    &.selected {
      & .mc-text {
        position: relative;
        top: 1px;
        left: 1px;
      }
    }
  }
}
</style>
