<template>
  <div class="mc-view-start">
    <teleport to="#layout_screen">
      <mc-frame-start v-if="!core.started" @complete="onCompleteStart" />
    </teleport>

    <teleport to="#layout_content_1">
      <div class="mc-view-start-content-1" />
    </teleport>
    <teleport to="#layout_content_2">
      <div class="mc-view-start-content-2" />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import useCore from '../../composables/useCore';
import McFrameStart from '../frame/Start.vue';
const { core } = useCore();

const $emit = defineEmits<{
  (e: 'complete', payload: { players: string[] }): void;
}>();
const onCompleteStart = ({ players }: { players: string[] }) =>
  $emit('complete', { players });
</script>

<style lang="postcss" scoped>
.mc-view-start {
  & .content-1,
  & .content-2 {
    display: flex;
    width: 100%;
    height: 100%;
  }
}

.mc-view-start-content-1 {
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/overview-content-1-1.png');
  background-size: contain;
}

.mc-view-start-content-2 {
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/overview-content-2.png');
  background-size: contain;
}
</style>
