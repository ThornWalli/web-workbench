<template>
  <canvas
    ref="root"
    :class="{ border }"
    :style="realDimension.toCSSVars('dimension')"
    class="mc-text-canvas" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { COLOR, COLOR_VALUE } from '../utils/color';
import { ipoint } from '@js-basics/vector';
import { getResizedCanvas } from '@web-workbench/core/utils/canvas';
import { fillTextStart } from '../utils/string';

const root = ref(null);

const $props = defineProps({
  color: {
    type: String,
    default: COLOR.WHITE,
    validate: color => Object.values(COLOR).includes(color)
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

const canvas = ref(null);

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

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.font = `5px "BitFontCanvas"`;
  ctx.fontKerning = 'normal';
  ctx.letterSpacing = '0px';

  ctx.fillStyle = COLOR_VALUE[$props.color];
  ctx.fillText($props.content, $props.offsetLeft ? 2 : 0, 5);

  if ($props.glossy) {
    const matrix = [[true, true], [true]];
    $props.content.split('').forEach((char, index) => {
      matrix.forEach((row, _y) => {
        row.forEach((col, _x) => {
          const x = index * 4 + _x;
          const y = _y;
          const color = ctx.getImageData(index * 4 + _x, y, 1, 1).data;

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
          if (COLOR_VALUE[$props.color] === hex && color[3] > 255 / 4) {
            ctx.fillRect(x, y, 1, 1);
          }
        });
      });
    });
  }

  const resizedCanvas = getResizedCanvas(canvas.value, renderDimension.value.x);

  const ctx_ = root.value.getContext('2d');
  root.value.width = resizedCanvas.width;
  root.value.height = resizedCanvas.height;

  ctx_.clearRect(0, 0, root.value.width, root.value.height);
  ctx_.drawImage(resizedCanvas, 0, 0);
};

const getHexFromColor = color => {
  return `#${fillTextStart(color[0].toString(16), 2, '0')}${fillTextStart(color[1].toString(16), 2, '0')}${fillTextStart(color[2].toString(16), 2, '0')}`;
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
