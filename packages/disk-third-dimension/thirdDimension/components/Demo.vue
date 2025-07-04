<template>
  <div class="wb-disk-third-dimension-demo">
    <renderer>
      <ground :map="map" />
    </renderer>
  </div>
</template>

<script lang="ts" setup>
import useWindow from '@web-workbench/core/composables/useWindow';

import { ref } from 'vue';
import Renderer from './Renderer.vue';
import Ground from './Ground.vue';
import { loadMap } from '../utils/map';

import assetMap from '../assets/map-1/depth.png?url';
import assetMapType from '../assets/map-1/type.png?url';
useWindow();

const map = ref(await loadMap(assetMap, assetMapType));
</script>

<style lang="postcss" scoped>
.wb-disks-debug-tests {
  min-width: 380px;
  height: 100%;
}

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
