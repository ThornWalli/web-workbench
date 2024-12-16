<template>
  <div class="mc-city-screen">
    <img :src="src" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import graphics from '../utils/graphics';
import useCore from '../composables/useCore';
const { core } = useCore();

const src = computed(() => {
  return [
    graphics.background.city.size_1,
    graphics.background.city.size_2,
    graphics.background.city.size_3,
    graphics.background.city.size_4
  ][core.currentPlayer.city.getSizeIndex()];
});
</script>

<style lang="postcss" scoped>
.mc-city-screen {
  position: absolute;
  top: 16px;
  left: 8px;
  width: 272px;
  height: 176px;

  & img {
    display: block;
    width: 100%;
  }
}
</style>
