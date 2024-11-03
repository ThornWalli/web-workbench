<template>
  <div
    class="mc-label-indicator"
    :class="{ embed, [`color-${color}`]: color, selected: modelValue }">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  embed: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'green',
    validator: value => ['green', 'red'].includes(value)
  },
  edge: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="postcss" scoped>
.mc-label-indicator {
  position: relative;

  &::after {
    display: block;
    width: 6px;
    height: 10px;
    content: '';
    background: url('../../assets/graphics/label/indicator/light_default.png');
    background-size: contain;
  }

  &:not(.embed) {
    width: 14px;
    height: 18px;
    background-image: url('../../assets/graphics/label/indicator/frame.png');
    background-size: contain;

    &::after {
      position: relative;
      top: 4px;
      left: 4px;
    }
  }

  &.selected {
    &.color-green {
      &::after {
        background-image: url('../../assets/graphics/label/indicator/light_green.png');
      }
    }

    &.color-red {
      &::after {
        background-image: url('../../assets/graphics/label/indicator/light_red.png');
      }
    }
  }
}
</style>
