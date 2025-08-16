<template>
  <div ref="rootEl" class="wb-disks-extras13-boing-renderer">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { provide, ref, onUnmounted, onMounted, nextTick } from 'vue';
import Renderer from '../classes/Renderer';
import { Vector2 } from 'three';
import type { RendererOptions } from '../types';

const renderer = ref<Renderer>();

defineOptions({
  inheritAttrs: false
});

const $props = defineProps<{
  options?: RendererOptions;
}>();

const $emit = defineEmits(['ready']);

const rootEl = ref();
const canvasEl = ref();

const defaultRendererOptions: RendererOptions = {
  pixelSize: 3,
  controls: true,
  debugGui: true
};

onMounted(async () => {
  const dimension = new Vector2(
    rootEl.value.offsetWidth,
    rootEl.value.offsetHeight
  );
  const { pixelSize, controls, debugGui } =
    $props.options || defaultRendererOptions;

  renderer.value = new Renderer(canvasEl.value, dimension, {
    pixelSize: pixelSize,
    controls: controls,
    debugGui: debugGui
  });

  nextTick(() => {
    $emit('ready');
  });
});

onUnmounted(() => {
  renderer.value.destroy();
});

provide('renderer', renderer);

defineExpose({
  renderer: renderer
});
</script>

<style lang="postcss" scoped>
canvas {
  image-rendering: optimizeSpeed; /* Für ältere Browser */
  image-rendering: crisp-edges; /* Für moderne Browser */
  image-rendering: pixelated;
}
</style>
