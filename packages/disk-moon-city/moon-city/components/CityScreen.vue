<template>
  <div class="mc-city-screen">
    <img v-if="src" :src="src" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import graphics from '../utils/graphics';
import useCore from '../composables/useCore';
const { core } = useCore();

const src = computed(() => {
  if (core.currentPlayer) {
    return [
      graphics.background.city.size_1,
      graphics.background.city.size_2,
      graphics.background.city.size_3,
      graphics.background.city.size_4
    ][core.currentPlayer.city.getSizeIndex()];
  }
  return undefined;
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
