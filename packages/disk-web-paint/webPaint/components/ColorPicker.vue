<template>
  <div
    ref="rootEl"
    class="wb-disks-extras13-web-paint-color-picker"
    :class="{ grid }"
    :style="{
      ...offset.toCSSVars('offset'),
      ...outerDimension.toCSSVars('outer-dimension')
    }">
    <canvas
      ref="canvasEl"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerout="onPointerOut" />
  </div>
</template>

<script lang="ts" setup>
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { computed, onMounted, ref, watch } from 'vue';
import type Color from '../lib/classes/Color';
import {
  drawColorWheelCircle,
  drawColorWheelSquare,
  drawColorWheelSquareExtend,
  drawHslaSlider,
  drawRgbaSlider,
  getPixelColorFromCanvas
} from '../utils/colorPicker';

const rootEl = ref<HTMLDivElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);
const defaultType = Type.SQUARE;

const $emit = defineEmits<{
  (e: 'hover' | 'update:model-value', color: Color): void;
}>();

const lineWidth = 4 * window.devicePixelRatio;
let innerDimension = ipoint(0, 0);
const outerDimension = ref<IPoint & number>(ipoint(0, 0));
const offset = ref<IPoint & number>(ipoint(lineWidth, lineWidth));

const $props = defineProps<{
  width: number;
  height?: number;
  modelValue: Color;
  type?: Type | `${Type}`;
  density: IPoint & number;
  grid?: boolean;
}>();

const currentType = computed(() => $props.type || defaultType);

const cellSize = computed(() => $props.density);

const cellDimension = computed(() =>
  ipoint(() => Math.round(innerDimension / cellSize.value))
);

const tmpCanvas = ref<HTMLCanvasElement | null>(null);

watch(
  () => $props.modelValue,
  () => {
    refresh({ background: false });
  }
);
watch(
  () => $props.density,
  () => {
    refrehsLayout();
    refresh();
  }
);

onMounted(() => {
  tmpCanvas.value = document.createElement('canvas');

  refrehsLayout();
  refresh();
});

function refrehsLayout() {
  if (!rootEl.value || !canvasEl.value || !tmpCanvas.value) return;
  outerDimension.value = ipoint(
    $props.width * window.devicePixelRatio,
    ($props.height || $props.width) * window.devicePixelRatio
  );

  if ($props.type !== Type.CIRCLE) {
    // const realWidth =
    //   (outerDimension.value.x - offset.value.x) / window.devicePixelRatio;
    // const realHeight =
    //   (outerDimension.value.y - offset.value.y) / window.devicePixelRatio;
    const realDimension = ipoint(
      () => (outerDimension.value - offset.value) / window.devicePixelRatio
    );
    const newDimension = ipoint(
      () =>
        Math.round(realDimension / cellSize.value) *
        cellSize.value *
        window.devicePixelRatio
    );
    outerDimension.value = newDimension;
  }

  innerDimension = ipoint(() => outerDimension.value - lineWidth * 2);

  canvasEl.value.style.width =
    outerDimension.value.x / window.devicePixelRatio + 'px';
  canvasEl.value.style.height =
    outerDimension.value.y / window.devicePixelRatio + 'px';
  canvasEl.value.width = outerDimension.value.x;
  canvasEl.value.height = outerDimension.value.y;

  if (tmpCanvas.value) {
    tmpCanvas.value.width = innerDimension.x;
    tmpCanvas.value.height = innerDimension.y;
  }
}

const hoverdPosition = ref<IPoint>();

function onPointerDown(e: PointerEvent) {
  if (!canvasEl.value) return;

  const rect = canvasEl.value.getBoundingClientRect();
  const x = e.clientX - rect.left - lineWidth / window.devicePixelRatio;
  const y = e.clientY - rect.top - lineWidth / window.devicePixelRatio;

  const ctx = canvasEl.value.getContext('2d', {
    willReadFrequently: true
  });
  if (!ctx) return;

  const color = getPixelColorFromCanvas(
    x,
    y,
    tmpCanvas.value!.getContext('2d')!,
    tmpCanvas.value!.width,
    tmpCanvas.value!.height
  );

  const size = cellDimension.value;
  selectedPosition.value = ipoint(
    () =>
      Math.floor(
        ipoint(x, y) / (cellDimension.value / window.devicePixelRatio)
      ) * size
  );

  refresh({ background: false });

  $emit('update:model-value', color);
}

function onPointerOut() {
  if (!canvasEl.value) return;

  const ctx = canvasEl.value.getContext('2d');
  if (!ctx) return;

  hoverdPosition.value = undefined;
  refresh({ background: false });
}

function onPointerMove(e: PointerEvent) {
  if (!canvasEl.value) return;

  const rect = canvasEl.value.getBoundingClientRect();
  const x = e.clientX - rect.left - lineWidth / window.devicePixelRatio;
  const y = e.clientY - rect.top - lineWidth / window.devicePixelRatio;

  const ctx = canvasEl.value.getContext('2d');
  if (!ctx) return;

  const color = getPixelColorFromCanvas(
    x,
    y,
    tmpCanvas.value!.getContext('2d')!,
    tmpCanvas.value!.width,
    tmpCanvas.value!.height
  );

  const size = cellDimension.value;
  hoverdPosition.value = ipoint(
    () =>
      Math.floor(
        ipoint(x, y) / (cellDimension.value / window.devicePixelRatio)
      ) * size
  );
  refresh({ background: false });

  $emit('hover', color);
}

function refresh({ background } = { background: true }) {
  const ctx = canvasEl.value!.getContext('2d')!;
  const tmpCtx = tmpCanvas.value!.getContext('2d')!;
  ctx.clearRect(0, 0, outerDimension.value.x, outerDimension.value.y);
  if (background) {
    tmpCtx.clearRect(0, 0, outerDimension.value.x, outerDimension.value.y);
    drawBackground(tmpCtx, tmpCanvas.value!.width, tmpCanvas.value!.height);
  }
  draw(ctx);
}

watch(
  () => $props.modelValue,
  // eslint-disable-next-line complexity
  () => {
    switch (currentType.value) {
      case Type.HSLA_HUE:
        if (tmpCanvas.value) {
          refresh();
        }
        break;
      case Type.HSLA_SATURATION:
        if (tmpCanvas.value) {
          refresh();
        }
        break;
      case Type.HSLA_LIGHTNESS:
        if (tmpCanvas.value) {
          refresh();
        }
        break;
      case Type.SQUARE_EXTEND:
        if (tmpCanvas.value) {
          refresh();
        }
        break;
      case Type.HSLA_ALPHA:
        if (tmpCanvas.value) {
          refresh();
        }
        break;
      case Type.RGBA_ALPHA:
        if (tmpCanvas.value) {
          refresh();
        }
        break;
    }
  }
);

// eslint-disable-next-line complexity
function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  if (!ctx || !canvasEl.value) return;

  const color = $props.modelValue;

  switch (currentType.value) {
    case Type.HSLA_HUE:
      drawHslaSlider(
        'hue',
        ctx,
        0,
        0,
        width,
        height,
        cellDimension.value,
        color
      );
      break;
    case Type.HSLA_SATURATION:
      drawHslaSlider(
        'saturation',
        ctx,
        0,
        0,
        width,
        height,
        cellDimension.value,
        color
      );
      break;
    case Type.HSLA_LIGHTNESS:
      drawHslaSlider(
        'lightness',
        ctx,
        0,
        0,
        width,
        height,
        cellDimension.value,
        color
      );
      break;
    case Type.HSLA_ALPHA:
      drawHslaSlider(
        'alpha',
        ctx,
        0,
        0,
        width,
        height,
        cellDimension.value,
        color
      );
      break;
    case Type.RGBA_RED:
      drawRgbaSlider('red', ctx, 0, 0, width, height, cellDimension.value);
      break;
    case Type.RGBA_GREEN:
      drawRgbaSlider('green', ctx, 0, 0, width, height, cellDimension.value);
      break;
    case Type.RGBA_BLUE:
      drawRgbaSlider('blue', ctx, 0, 0, width, height, cellDimension.value);
      break;
    case Type.RGBA_ALPHA:
      drawRgbaSlider(
        'alpha',
        ctx,
        0,
        0,
        width,
        height,
        cellDimension.value,
        color
      );
      break;
    case Type.CIRCLE:
      drawColorWheelCircle(
        ctx,
        0,
        0,
        Math.min(width, height),
        cellDimension.value
      );
      break;

    case Type.SQUARE_EXTEND:
      drawColorWheelSquareExtend(ctx, 0, 0, width, cellDimension.value, color);
      break;

    default:
      drawColorWheelSquare(ctx, 0, 0, width, cellDimension.value);
      break;
  }
}

const selectedPosition = ref<IPoint>();
const animationFrameId = ref<number | null>(null);

function draw(ctx: CanvasRenderingContext2D) {
  window.cancelAnimationFrame(animationFrameId.value!);

  const density = window.devicePixelRatio;
  // eslint-disable-next-line complexity
  animationFrameId.value = window.requestAnimationFrame(() => {
    if (!ctx || !canvasEl.value || !tmpCanvas.value) return;

    ctx.drawImage(tmpCanvas.value, offset.value.x, offset.value.y);

    const hover = hoverdPosition.value;

    if (
      hover &&
      hover.x >= 0 &&
      hover.y >= 0 &&
      hover.x < innerDimension.x - lineWidth * 2 &&
      hover.y < innerDimension.y - lineWidth * 2
    ) {
      if (
        hover &&
        (!selectedPosition.value ||
          (selectedPosition.value &&
            hover &&
            !hover.equals(selectedPosition.value)))
      ) {
        ctx.globalCompositeOperation = 'difference';
        // ctx.setLineDash([2, 2]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.lineWidth = lineWidth;

        ctx.strokeRect(
          lineWidth / 2 + hover.x,
          lineWidth / 2 + hover.y,
          cellDimension.value.x + lineWidth,
          cellDimension.value.y + lineWidth
        );
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    if (selectedPosition.value) {
      ctx.globalCompositeOperation = 'hard-light';
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.strokeRect(
        lineWidth / 2 + selectedPosition.value.x,
        lineWidth / 2 + selectedPosition.value.y,
        cellDimension.value.x + lineWidth,
        cellDimension.value.y + lineWidth
      );
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.lineWidth = 1;
  });
}
</script>

<script lang="ts">
export enum Type {
  CIRCLE = 'circle',
  SQUARE = 'square',
  SQUARE_EXTEND = 'square_extend',
  HSLA_HUE = 'hsla_hue',
  HSLA_SATURATION = 'hsla_saturation',
  HSLA_LIGHTNESS = 'hsla_lightness',
  HSLA_ALPHA = 'hsla_alpha',
  RGBA_RED = 'rgba_red',
  RGBA_GREEN = 'rgba_green',
  RGBA_BLUE = 'rgba_blue',
  RGBA_ALPHA = 'rgba_alpha',
  ALPHA = 'alpha'
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-color-picker {
  position: relative;
  width: var(--outer-dimension-x, 100%);
  height: var(--outer-dimension-y, 100%);
  background-color: #000;

  &.grid {
    &::before {
      position: absolute;
      inset: calc(var(--offset-y) * 1px / 2);
      content: '';
      background: url('../assets/grid.png');
      background-color: #fff;
    }
  }

  & canvas {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
