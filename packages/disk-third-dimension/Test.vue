<template>
  <renderer @ready="onReady">
    <ground ref="ground" :map="map" wireframe />
    <!-- <ball ref="ball" :map="map" wireframe></ball> -->
  </renderer>
</template>

<script setup>
import { ref } from 'vue';
import Renderer from './components/Renderer.vue';
// import Ground from './components/Ground.vue';
// import Ball from './components/Ball.vue';
import { loadMap } from './utils/map';

import assetMap from './assets/map-2/depth.png?url';
import assetMapType from './assets/map-1/type.png?url';

const ground = ref();
// const ball = ref();

const map = ref(await loadMap(assetMap, assetMapType));
console.log(map);
const onReady = () => {
  nextTick(() => {
    console.log(ground.value.getYPosition({ x: 1, z: 0 }));
  });
};
</script>

<style lang="postcss" scoped>
div {
  position: relative;
  width: 100%;
  height: 100%;

  & :deep(> *) {
    width: 100%;
    height: 100%;
  }
}
</style>
