<template>
  <div ref="rootEl" class="wb-disks-extras13-boing-standalone" @click="onClick">
    <app :renderer-options="{ debugGui: true, controls: true }" />
  </div>
</template>

<script lang="ts" setup>
import useAudioControl from '../composables/useAudioControl';
import { SFX } from '../utils/sounds';
import App from './App.vue';

const { playSfx } = useAudioControl();

function onClick() {
  playSfx(SFX.GROUND_1);
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-boing-standalone {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  & > * {
    flex: 1;
  }

  & .wb-disks-extras13-boing-app {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;

    /* width: 320px;
    height: 240px; */

    /* width: 640px;
    height: 480px; */
    transform: translate(-50%, -50%);
  }
}
</style>
