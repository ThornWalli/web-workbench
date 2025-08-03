<template>
  <div ref="rootEl" class="wb-disks-extras13-boing-app" @click="onClick">
    <renderer ref="rendererEl" v-bind="rendererOptions" />
  </div>
</template>

<script lang="ts" setup>
import Renderer from './Renderer.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { Subscription } from 'rxjs';
import { setupScene, type SceneOptions } from '../main';
import useAudioControl from '../composables/useAudioControl';
import { SFX } from '../utils/sounds';

const rendererEl = ref<InstanceType<typeof Renderer> | null>(null);
const subscription = new Subscription();

const { playSfx } = useAudioControl();
const $props = defineProps<{
  rendererOptions?: InstanceType<typeof Renderer>['$props'];
  options?: SceneOptions;
}>();

onMounted(() => {
  const renderer = rendererEl.value?.renderer;
  const { subscription, wallTrigger$, groundTrigger$ } = setupScene(
    renderer,
    $props.options
  );
  subscription.add(subscription);
  subscription.add(
    groundTrigger$.subscribe(({ state }) => {
      if (state.progressX >= 0.5) {
        playSfx(SFX.GROUND_2);
      } else {
        playSfx(SFX.GROUND_1);
      }
    })
  );
  subscription.add(
    wallTrigger$.subscribe(() => {
      playSfx(SFX.WALL_1);
    })
  );
});

onUnmounted(() => {
  subscription.unsubscribe();
});

function onClick() {
  playSfx(SFX.GROUND_1);
}
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
