<template>
  <div
    class="mc-label-indicator"
    :class="{
      embed,
      [`color-${color || defaultColor}`]: color || defaultColor,
      selected: modelValue
    }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const defaultColor = 'green';

defineProps<{
  embed?: boolean;
  modelValue: boolean;
  color?: 'green' | 'red';
  edge?: boolean;
}>();
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
