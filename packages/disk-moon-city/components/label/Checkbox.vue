<template>
  <div class="mc-label-checkbox" :class="{ edge, selected: modelValue }">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  edge: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="postcss" scoped>
.mc-label-checkbox {
  position: relative;
  width: 10px;
  height: 18px;
  background: url('../../assets/graphics/label/checkbox/frame/default.png');
  background-size: contain;

  &.edge {
    background-image: url('../../assets/graphics/label/checkbox/frame/edge.png');
  }

  &::after {
    position: absolute;
    inset: 0;
    display: block;
    content: '';
    background: transparent;
    background-size: contain;
  }

  &.selected {
    &::after {
      background-image: url('../../assets/graphics/label/indicator/light/default.png');
    }

    &.edge {
      &::after {
        background-image: url('../../assets/graphics/label/checkbox/light/edge.png');
      }
    }
  }
}
</style>
