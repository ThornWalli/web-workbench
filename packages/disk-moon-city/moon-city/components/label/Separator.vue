<template>
  <div
    class="mc-label-separator"
    :class="{
      ['type-' + (type || defaultType)]: true
    }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const defaultType = 'primary';

defineProps<{
  type?: 'primary' | 'secondary';
}>();
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
