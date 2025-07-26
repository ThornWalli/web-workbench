<template>
  <figure
    class="wb-disks-extras13-web-paint-layer-overivew-thumb"
    :class="{ selected, visible: layer.visible }">
    <div>
      <canvas ref="canvasEl" />
      <img ref="imageEl" :src="src" />
    </div>
    <figcaption class="font-bit-font">{{ layer.name }}</figcaption>
  </figure>
</template>

<script lang="ts" setup>
import { imageDataToCanvas } from '@web-workbench/core/utils/canvas';
import { computed, onMounted, ref } from 'vue';
import type { LayerOverviewDescription } from '../types/layer';
import { imageDataFromUint8Array } from '@web-workbench/core/utils/imageData';

const canvasEl = ref<HTMLCanvasElement | null>(null);
const $props = defineProps<{
  layer: LayerOverviewDescription;
}>();

const src = ref<string | null>(null);

const selected = computed(() => {
  return $props.layer.current;
});

onMounted(async () => {
  const { buffer, dimension } = $props.layer.bufferDescription;
  const imageData = imageDataFromUint8Array(buffer, dimension.x, dimension.y);
  const ctx = canvasEl.value.getContext('2d')!;
  const canvas = await imageDataToCanvas(imageData);
  const density = window.devicePixelRatio || 1;
  ctx.canvas.width = canvas.width * density;
  ctx.canvas.height = canvas.height * density;

  ctx.drawImage(canvas, 0, 0, canvas.width * density, canvas.height * density);
  src.value = ctx.canvas.toDataURL('image/png');
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-layer-overivew-thumb {
  --color-border: var(
    --color-disks-web-paint-layer-overivew-thumb-border,
    #fa5
  );

  position: relative;
  display: block;
  width: 100%;
  margin: 0;
  opacity: 0.6;

  &.visible {
    opacity: 1;
  }

  &.selected {
    & div {
      border-color: var(--color-border);
    }
  }

  & figcaption {
    margin-top: var(--default-element-margin);
    line-height: 12px;
  }

  & div {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: url('../assets/grid.png');
    background-color: #fff;
    border: solid 3px transparent;
  }

  & canvas,
  & img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    object-fit: contain;
  }
}
</style>
