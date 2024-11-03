<template>
  <div class="mc-map">
    <mc-map-city
      v-for="(player, index) in players"
      :key="index"
      :index="index"
      :selected="player === core.currentPlayer"
      :destroyed="player.killed" />
  </div>
</template>

<script setup>
import McMapCity from './Map/City.vue';
import useCore from '../composables/useCore.js';
import { computed } from 'vue';

const { core } = useCore();

const players = computed(() => [
  ...core.players,
  ...Array(4 - core.players.length)
    .fill()
    .map(() => ({ killed: true }))
]);
</script>

<style lang="postcss" scoped>
.mc-map {
  position: relative;
  display: flex;
  width: 259px;
  height: 232px;
  background: url('../assets/graphics/background/map.png');
  background-size: contain;

  & .mc-map-city {
    position: absolute;

    &:nth-child(1) {
      top: 10px;
      left: 9px;
    }

    &:nth-child(2) {
      top: 10px;
      left: 179px;
    }

    &:nth-child(3) {
      top: 152px;
      left: 9px;
    }

    &:nth-child(4) {
      top: 152px;
      left: 179px;
    }
  }
}
</style>
