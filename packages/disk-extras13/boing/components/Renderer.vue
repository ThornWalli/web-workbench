<template>
  <div ref="rootEl" class="wb-disks-extras13-boing-renderer">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>

<script lang="ts" setup>
import domEvents from '@web-workbench/core/services/domEvents';
import { provide, ref, onUnmounted, onMounted } from 'vue';
import { Subscription } from 'rxjs';
import Renderer from '../classes/Renderer';
import { Vector2 } from 'three';

const subscriptions = new Subscription();
const renderer = ref<Renderer>();

defineOptions({
  inheritAttrs: false
});

const $props = defineProps<{
  debugGui?: boolean;
  controls?: boolean;
}>();

const $emit = defineEmits(['ready']);

const rootEl = ref();
const canvasEl = ref();
const dimension = ref<Vector2>();

onMounted(async () => {
  dimension.value = new Vector2(
    rootEl.value.offsetWidth,
    rootEl.value.offsetHeight
  );
  renderer.value = new Renderer(canvasEl.value, dimension.value, {
    controls: $props.controls,
    debugGui: $props.debugGui
  });

  subscriptions.add(
    domEvents.resize.subscribe(() => {
      dimension.value = new Vector2(
        rootEl.value.offsetWidth,
        rootEl.value.offsetHeight
      );
      renderer.value.resize(dimension.value);
    })
  );

  $emit('ready');
});

onUnmounted(() => {
  renderer.value.destroy();
  subscriptions.unsubscribe();
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
