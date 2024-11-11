<template>
  <base-button class="mc-info-button"></base-button>
</template>

<script setup>
import BaseButton from './base/Button.vue';
</script>

<style lang="postcss" scoped>
.mc-info-button {
  width: 34px;
  height: 36px;
  background: url('../assets/graphics/info-button/default.png');
  background-size: contain;

  &[disabled] {
    filter: grayscale(100%);
  }

  &:not([disabled]):active {
    background: url('../assets/graphics/info-button/pressed.png');
    background-size: contain;
  }
}
</style>
