<template>
  <div class="mc-graph" :style="dimension.toCSSVars('dimension')">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>

<script setup>
import { ipoint } from '@js-basics/vector';
import {
  COLOR_GRAPH,
  COLOR_VALUE_GRAPH_FILL,
  COLOR_VALUE_GRAPH_STROKE,
  COLOR_VALUE_GRAPH_TEXT
} from '../utils/color';
import { computed, onMounted, ref } from 'vue';
import { fillTextStart } from '../utils/string';
const canvasEl = ref(null);

const dimension = ref(ipoint());
const renderDimension = computed(() => {
  return ipoint(dimension.value.x, dimension.value.y);
});

const $props = defineProps({
  labels: {
    type: Array,
    default() {
      return [1, 2, 3];
      // return [1, 2, 3, 4, 5];
    }
  },
  values: {
    type: Array,
    default() {
      return [
        {
          values: [100, 500, 333],
          style: { fill: '#ff000033', stroke: '#ff0000' }
        },
        {
          values: [3, 1000, 50],
          style: { fill: '#00ff0033', stroke: '#00ff0066' }
        }
      ];
    }
  },

  density: {
    type: Number,
    default: 4
  }
});

const lines = computed(() => {
  if (
    Array.isArray($props.values[0]) ||
    (typeof $props.values[0] === 'object' && 'values' in $props.values[0])
  ) {
    // Meherere Werte
    return $props.values.map((values, index) => {
      if (Array.isArray(values)) {
        return { name: index, values };
      } else {
        return { name: index, values: [], ...values };
      }
    });
  } else return [{ name: 'default', values: $props.values }];
});

onMounted(() => {
  dimension.value = ipoint(
    canvasEl.value.offsetWidth,
    canvasEl.value.offsetHeight
  );
  render(canvasEl.value);
});

const steps = computed(() => {
  return ipoint($props.labels.length, lines.value[0]?.values.length);
});

const maxValue = computed(() => {
  return lines.value
    .map(({ values }) => values)
    .flat()
    .reduce((acc, value) => Math.max(acc, value), 0);
});

const render = async canvas => {
  if (steps.value.x !== steps.value.y) {
    throw new Error('xValues and yValues must have the same length');
  }

  canvas.width = renderDimension.value.x;
  canvas.height = renderDimension.value.y;
  const ctx = canvas.getContext('2d');
  const fontSize = 10;
  await document.fonts.load(`${fontSize}px "BitFontCanvas"`);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `10px "BitFontCanvas"`;
  ctx.fontKerning = 'normal';
  ctx.letterSpacing = '0px';

  const bottomBarDimension = ipoint(ctx.canvas.width, 20);
  const leftBarDimension = ipoint(36, ctx.canvas.height - bottomBarDimension.y);
  const cornerDimension = ipoint(leftBarDimension.x, bottomBarDimension.y);

  const contentDimension = ipoint(
    ctx.canvas.width - cornerDimension.x,
    ctx.canvas.height - cornerDimension.y
  );
  const cellDimension = ipoint(
    Math.round(contentDimension.x / steps.value.x),
    Math.round(contentDimension.y / steps.value.y)
  );

  const offsetBottom = ctx.canvas.height - cornerDimension.y;
  const offsetLeft = cornerDimension.x;

  drawLayout(ctx, {
    fontSize,
    bottomBarDimension,
    leftBarDimension,
    cornerDimension,
    contentDimension,
    cellDimension,
    offsetBottom,
    offsetLeft
  });
  drawLegend(ctx, {
    fontSize,
    bottomBarDimension,
    cellDimension,
    offsetBottom,
    offsetLeft
  });
  lines.value.forEach(line => {
    ctx.globalCompositeOperation = line.composite || 'source-over';
    drawLine(ctx, line, {
      fontSize,
      bottomBarDimension,
      leftBarDimension,
      cornerDimension,
      contentDimension,
      cellDimension,
      offsetBottom,
      offsetLeft
    });
  });
};

const drawLegend = (ctx, { fontSize, bottomBarDimension, offsetBottom }) => {
  const offsetLeft = 4;
  writeText(
    ctx,
    'S',
    offsetLeft,
    offsetBottom + fontSize + (bottomBarDimension.y - fontSize) / 2 + 2,
    { color: COLOR_VALUE_GRAPH_TEXT[COLOR_GRAPH.GRAY] }
  );
  writeText(
    ctx,
    'P',
    offsetLeft + 10,
    offsetBottom + fontSize + (bottomBarDimension.y - fontSize) / 2 + 2,
    { color: COLOR_VALUE_GRAPH_TEXT[COLOR_GRAPH.YELLOW] }
  );
  writeText(
    ctx,
    'N',
    offsetLeft + 20,
    offsetBottom + fontSize + (bottomBarDimension.y - fontSize) / 2 + 2,
    { color: COLOR_VALUE_GRAPH_TEXT[COLOR_GRAPH.RED] }
  );
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawLine = (
  ctx,
  line,
  { contentDimension, cellDimension, offsetBottom, offsetLeft }
) => {
  const { values, style } = line;
  const path = new Path2D();
  const pathBackground = new Path2D();
  path.moveTo(offsetLeft, offsetBottom);
  pathBackground.moveTo(offsetLeft, offsetBottom);
  for (let i = 0; i < steps.value.x; i++) {
    const x = (i + 1) * cellDimension.x;
    const y = (values[Number(i)] / maxValue.value) * contentDimension.y;
    path.lineTo(offsetLeft + x, offsetBottom - y);
    pathBackground.lineTo(offsetLeft + x, offsetBottom - y);
  }
  pathBackground.lineTo(
    offsetLeft + cellDimension.x * steps.value.x,
    offsetBottom
  );
  pathBackground.closePath();
  ctx.fillStyle = style?.fill || COLOR_VALUE_GRAPH_FILL[COLOR_GRAPH.RED];
  ctx.fill(pathBackground);
  ctx.lineWidth = 2;
  ctx.strokeStyle = style?.stroke || COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.RED];
  ctx.stroke(path);
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawLayout = (
  ctx,
  {
    fontSize,
    cornerDimension,
    bottomBarDimension,
    leftBarDimension,
    cellDimension,
    offsetBottom,
    offsetLeft
  }
) => {
  ctx.fillStyle = '#440000'; //COLOR_VALUE[COLOR.DARK_RED];

  // vertical
  drawVerticalLine(ctx, cornerDimension.x, 0, ctx.canvas.height);

  // horizontal
  drawHorizontalLine(
    ctx,
    0,
    ctx.canvas.height - cornerDimension.y,
    ctx.canvas.width
  );

  for (let y = 0; y < steps.value.y; y++) {
    drawHorizontalLine(
      ctx,
      leftBarDimension.x - 6,
      offsetBottom - y * cellDimension.y,
      ctx.canvas.width
    );
    const text = prepareValue(
      Math.round((maxValue.value / steps.value.x) * (steps.value.y - y))
    );
    writeText(
      ctx,
      text,
      (cornerDimension.x - ctx.measureText(text).width) / 2,
      fontSize + y * cellDimension.y + (cellDimension.y - fontSize) / 2
    );
  }
  let startX = offsetLeft;
  for (let x = 0; x < steps.value.x; x++) {
    drawVerticalLine(
      ctx,
      x * cellDimension.x + cornerDimension.x,
      offsetBottom + 2,
      6
    );

    const text = prepareValue($props.labels[Number(x)]);
    writeText(
      ctx,
      text,
      startX + (cellDimension.x - ctx.measureText(text).width + 4) / 2,
      offsetBottom + (bottomBarDimension.y + fontSize) / 2 + 2
    );

    startX += cellDimension.x;
  }
};

const writeText = (ctx, text, x, y, { color } = {}) => {
  ctx.fillStyle = color || COLOR_VALUE_GRAPH_TEXT[COLOR_GRAPH.LAYOUT_GRID];
  ctx.fillText(text, Math.round(x), Math.round(y));
};

const drawHorizontalLine = (ctx, x, y, length) => {
  ctx.fillStyle = COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.LAYOUT_GRID];
  ctx.fillRect(Math.round(x), Math.round(y), length, 2);
};

const drawVerticalLine = (ctx, x, y, length) => {
  ctx.fillStyle = COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.LAYOUT_GRID];
  ctx.fillRect(Math.round(x), Math.round(y), 2, length);
};

function prepareValue(value) {
  value = String(value);

  if (value.length > 6) {
    value = value.slice(0, -6) + 'B';
  }
  if (value.length > 3) {
    value = value.slice(0, -3) + 'K';
  }

  return fillTextStart(value, 4, '0');
}
</script>

<style lang="postcss" scoped>
.mc-graph {
  width: 314px;
  height: 146px;

  & canvas {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
}
</style>
