<template>
  <div ref="rootEl" class="wb-disks-workbench13-display-test">
    <canvas ref="canvasEl" @pointerdown="onPointerDown" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import type { Model } from '../types';
import useWindow from '@web-workbench/core/composables/useWindow';
import SvgTest from '../assets/test.svg?url';
import {
  drawComplete,
  drawHorizontalGradient,
  drawHorizontalStrips,
  drawPatternSquares,
  drawSolidColor,
  drawVerticalGradient,
  drawVerticalStrips
} from '../utils';
import { resizeCanvas, urlToCanvas } from '@web-workbench/core/utils/canvas';

enum Tests {
  SOLID_COLOR_1 = 'solid_color_1',
  SOLID_COLOR_2 = 'solid_color_2',
  SOLID_COLOR_3 = 'solid_color_3',
  PATTERN_1 = 'pattern_1',
  PATTERN_2 = 'pattern_2',
  PATTERN_STRIPS_1 = 'pattern_strips_1',
  PATTERN_STRIPS_2 = 'pattern_strips_2',
  PATTERN_STRIPS_3 = 'pattern_strips_3',
  PATTERN_STRIPS_4 = 'pattern_strips_4',

  GRADIENT_1 = 'gradient_1',
  GRADIENT_2 = 'gradient_2',
  GRADIENT_3 = 'gradient_3',
  GRADIENT_4 = 'gradient_4',

  COMPLETE = 'complete',
  TEST = 'test'
}

const availableTests = [
  Tests.SOLID_COLOR_1,
  Tests.SOLID_COLOR_2,
  Tests.SOLID_COLOR_3,
  Tests.PATTERN_1,
  Tests.PATTERN_2,
  Tests.PATTERN_STRIPS_1,
  Tests.PATTERN_STRIPS_2,
  Tests.PATTERN_STRIPS_3,
  Tests.PATTERN_STRIPS_4,
  Tests.GRADIENT_1,
  Tests.GRADIENT_2,
  Tests.GRADIENT_3,
  Tests.GRADIENT_4,
  Tests.COMPLETE,
  Tests.TEST
];

const $props = defineProps<{
  model: Model;
}>();

const testImageCanvas = await urlToCanvas(SvgTest);

const currentTest = ref(availableTests[0]);

const { parentLayout } = useWindow();

const rootEl = ref<HTMLInputElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const canvas = canvasEl.value;
  if (!canvas) return;

  canvas.width = parentLayout.value.size.x;
  canvas.height = parentLayout.value.size.y;

  render();
});

watch(
  () => currentTest.value,
  () => {
    render();
  }
);

function onPointerDown() {
  const values = availableTests;
  if (values.indexOf(currentTest.value) + 1 > values.length - 1) {
    $props.model.actions.close();
  }

  currentTest.value =
    values[(values.indexOf(currentTest.value) + 1) % values.length];
}

// eslint-disable-next-line complexity
function render() {
  const canvas = canvasEl.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (currentTest.value) {
    case Tests.SOLID_COLOR_1:
      drawSolidColor(ctx, '#ff0000');
      break;
    case Tests.SOLID_COLOR_2:
      drawSolidColor(ctx, '#00ff00');
      break;
    case Tests.SOLID_COLOR_3:
      drawSolidColor(ctx, '#0000ff');
      break;
    case Tests.PATTERN_1:
      drawPatternSquares(ctx, '#000000', '#ffffff', 20);
      break;
    case Tests.PATTERN_2:
      drawPatternSquares(ctx, '#ffffff', '#000000', 20);
      break;
    case Tests.PATTERN_STRIPS_1:
      drawVerticalStrips(ctx, '#000000', '#ffffff', 20);
      break;
    case Tests.PATTERN_STRIPS_2:
      drawVerticalStrips(ctx, '#ffffff', '#000000', 20);
      break;
    case Tests.PATTERN_STRIPS_3:
      drawHorizontalStrips(ctx, '#000000', '#ffffff', 20);
      break;
    case Tests.PATTERN_STRIPS_4:
      drawHorizontalStrips(ctx, '#ffffff', '#000000', 20);
      break;
    case Tests.GRADIENT_1:
      drawVerticalGradient(ctx, '#ffffff', '#000000');
      break;
    case Tests.GRADIENT_2:
      drawVerticalGradient(ctx, '#000000', '#ffffff');
      break;
    case Tests.GRADIENT_3:
      drawHorizontalGradient(ctx, '#ffffff', '#000000');
      break;
    case Tests.GRADIENT_4:
      drawHorizontalGradient(ctx, '#000000', '#ffffff');
      break;
    case Tests.COMPLETE:
      drawComplete(ctx);
      break;
    case Tests.TEST:
      // eslint-disable-next-line no-case-declarations
      const resizedCanvas = resizeCanvas(testImageCanvas, 0, canvas.height);

      ctx.drawImage(
        resizedCanvas,
        0,
        0,
        resizedCanvas.width,
        resizedCanvas.height,
        (canvas.width - resizedCanvas.width) / 2,
        (canvas.height - resizedCanvas.height) / 2,
        resizedCanvas.width,
        resizedCanvas.height
      );
      break;
  }
}
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-display-test {
  position: relative;
  width: 100%;
  height: 100%;

  & canvas {
    display: block;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
}
</style>
