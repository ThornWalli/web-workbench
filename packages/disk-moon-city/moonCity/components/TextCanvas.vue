<template>
  <canvas
    ref="root"
    :class="{ border }"
    :style="realDimension.toCSSVars('dimension')"
    class="mc-text-canvas" />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { COLOR, COLOR_VALUE } from '../utils/color';
import { ipoint } from '@js-basics/vector';
import { resizeCanvas } from '@web-workbench/core/utils/canvas';
import { fillTextStart } from '../utils/string';

const root = ref<HTMLCanvasElement>();

const $props = defineProps({
  color: {
    type: String,
    default: COLOR.WHITE,
    validate: (color: COLOR) => Object.values(COLOR).includes(color)
  },
  content: {
    type: String,
    default: ''
  },
  offsetLeft: {
    type: Boolean,
    default: false
  },
  density: {
    type: Number,
    default: 4
  },
  border: {
    type: Boolean,
    default: false
  },
  glossy: {
    type: Boolean,
    default: false
  }
});

const dimension = computed(() => {
  return ipoint(($props.content?.length || 0) * 4, 5);
});

const realDimension = computed(() => {
  return ipoint(() => dimension.value * (10 / 5));
});

const renderDimension = computed(() => {
  return ipoint(
    dimension.value.x * $props.density,
    dimension.value.y * $props.density
  );
});

const canvas = ref<HTMLCanvasElement>();

const render = async () => {
  if (!$props.content) {
    return;
  }
  await document.fonts.load('5px "BitFontCanvas"');

  canvas.value = canvas.value || document.createElement('canvas');

  canvas.value.width = dimension.value.x;
  canvas.value.height = dimension.value.y;

  /**
   * @type {CanvasRenderingContext2D}
   */
  const ctx = canvas.value.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.font = `5px "BitFontCanvas"`;
  ctx.fontKerning = 'normal';
  ctx.letterSpacing = '0px';

  const propColor = COLOR_VALUE[$props.color as keyof typeof COLOR_VALUE];
  ctx.fillStyle = propColor;
  ctx.fillText($props.content, $props.offsetLeft ? 2 : 0, 5);

  if ($props.glossy) {
    const matrix = [[true, true], [true]];
    $props.content.split('').forEach((char, index) => {
      matrix.forEach((row, _y) => {
        row.forEach((col, _x) => {
          const x = index * 4 + _x;
          const y = _y;
          const color = Array.from(
            ctx.getImageData(index * 4 + _x, y, 1, 1).data
          ) as [number, number, number, number];

          const brightness = (color[0] + color[1] + color[2]) / 3;
          let _color;
          if (brightness > 128) {
            if (_x > 0 || _y > 0) {
              _color = `rgba(255,255,255,.6)`;
              ctx.globalCompositeOperation = 'hard-light';
            } else {
              _color = `rgba(255,255,255,1)`;
              ctx.globalCompositeOperation = 'hard-light';
            }
          } else {
            _color = `rgba(0,0,0,1)`;
            ctx.globalCompositeOperation = 'soft-light';
          }
          ctx.fillStyle = _color;
          const hex = getHexFromColor(color);
          if (propColor === hex && color[3] > 255 / 4) {
            ctx.fillRect(x, y, 1, 1);
          }
        });
      });
    });
  }

  const resizedCanvas = resizeCanvas(canvas.value, renderDimension.value.x);
  if (root.value) {
    root.value.width = resizedCanvas.width;
    root.value.height = resizedCanvas.height;

    const ctx_ = root.value.getContext('2d');

    if (!ctx_) {
      throw new Error('Failed to get canvas context');
    }

    ctx_.clearRect(0, 0, root.value.width, root.value.height);
    ctx_.drawImage(resizedCanvas, 0, 0);
  } else {
    throw new Error('Failed to get canvas element');
  }
};

const getHexFromColor = ([r, g, b, a]: [number, number, number, number]) => {
  return `#${fillTextStart(r.toString(16), 2, '0')}${fillTextStart(g.toString(16), 2, '0')}${fillTextStart(b.toString(16), 2, '0')}${fillTextStart(a.toString(16), 2, '0')}`;
};

watch(
  () => [root.value, $props.color, $props.content],
  () => {
    render();
  }
);

onMounted(() => {
  render();
});
</script>

<style lang="postcss" scoped>
.mc-text-canvas {
  width: calc(var(--dimension-x) * 1px);
  height: calc(var(--dimension-y) * 1px);

  /* width: 100% !important;
  height: 100% !important; */
  pointer-events: none;
  image-rendering: pixelated;
  background-color: transparent;

  &.border {
    filter: drop-shadow(0 -2px 0 var(--mc-color-shadow))
      drop-shadow(2px 0 0 var(--mc-color-shadow))
      drop-shadow(0 2px 0 var(--mc-color-shadow))
      drop-shadow(-2px 0 0 var(--mc-color-shadow));
  }
}
</style>
