<template>
  <div ref="rootEl" class="wb-disks-extras13-boing-app">
    <renderer ref="rendererEl" :options="rendererOptions" />
  </div>
</template>

<script lang="ts" setup>
import Renderer from './Renderer.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { filter, Subscription } from 'rxjs';
import { EMIT_TYPE, setupScene, type SceneOptions } from '../main';
import useAudioControl from '../composables/useAudioControl';
import { SFX } from '../utils/sounds';
import type { RendererOptions } from '../types';

const rendererEl = ref<InstanceType<typeof Renderer> | null>(null);
const subscription = new Subscription();

const { playSfx, setGlobalVolume } = useAudioControl();
const $props = defineProps<{
  rendererOptions?: RendererOptions;
  options?: SceneOptions;
  volume?: number;
}>();

watch(
  () => $props.volume,
  volume => {
    setGlobalVolume(volume || 1);
  }
);

onMounted(() => {
  const renderer = rendererEl.value?.renderer;
  const { subscription, emitter$ } = setupScene(renderer, $props.options);
  subscription.add(subscription);
  subscription.add(
    emitter$
      .pipe(filter(({ type }) => type === EMIT_TYPE.GROUND))
      .subscribe(({ state }) => {
        if (state.directionX > 0) {
          playSfx(SFX.GROUND_1);
        } else {
          playSfx(SFX.GROUND_2);
        }
      })
  );
  subscription.add(
    emitter$
      .pipe(
        filter(
          ({ type }) =>
            type === EMIT_TYPE.WALL_LEFT || type === EMIT_TYPE.WALL_RIGHT
        )
      )
      .subscribe(() => {
        playSfx(SFX.WALL_1);
      })
  );
});

onUnmounted(() => {
  subscription.unsubscribe();
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-boing-app {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  & > * {
    flex: 1;
  }

  & .wb-disks-extras13-boing-renderer {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
  }
}
</style>
