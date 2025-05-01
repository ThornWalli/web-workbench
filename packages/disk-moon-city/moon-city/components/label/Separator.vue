<template>
  <div
    class="mc-label-separator"
    :class="{
      ['type-' + type]: true
    }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    validator: value => ['primary', 'secondary'].includes(value),
    default: 'primary'
  }
});
</script>

<style lang="postcss" scoped>
.mc-label-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6px;
  height: 18px;
  background: url('../../assets/graphics/label/separator/primary.png');
  background-size: contain;

  &.type-secondary {
    width: 10px;
    height: 18px;
    background-image: url('../../assets/graphics/label/separator/_secondary.png');
  }
}
</style>
