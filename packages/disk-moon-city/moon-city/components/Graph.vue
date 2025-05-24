<template>
  <div class="mc-graph" :style="dimension.toCSSVars('dimension')">
    <canvas ref="canvasEl" />
  </div>
</template>

<script lang="ts" setup>
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import {
  COLOR_GRAPH,
  COLOR_VALUE_GRAPH_FILL,
  COLOR_VALUE_GRAPH_STROKE,
  COLOR_VALUE_GRAPH_TEXT
} from '../utils/color';
import { computed, onMounted, ref } from 'vue';
import { fillTextStart } from '../utils/string';

export interface ILine {
  name?: string;
  values: ILine[] | number[];
  style?: {
    fill?: string;
    stroke?: string;
  };
  composite?: GlobalCompositeOperation;
}

const canvasEl = ref<HTMLCanvasElement>();

const dimension = ref(ipoint(0, 0));
const renderDimension = computed(() => {
  return ipoint(dimension.value.x, dimension.value.y);
});

const $props = defineProps({
  labels: {
    type: Array<string>,
    default() {
      return ['1', '2', '3'];
      // return [1, 2, 3, 4, 5];
    }
  },
  values: {
    type: [Array<ILine>, Array<number>],
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

const lines = computed<ILine[]>(() => {
  const firstValue = $props.values[0];
  const lines: ILine[] = [];
  if (
    Array.isArray(firstValue) ||
    (firstValue && typeof firstValue === 'object' && 'values' in firstValue)
  ) {
    // Meherere Werte
    const test = $props.values.reduce<ILine[]>((result, values, index) => {
      if (Array.isArray(values)) {
        result.push({ name: String(index), values: values as ILine[] });
      } else if (typeof values === 'object') {
        result.push({ name: String(index), ...values });
      }
      return result;
    }, []);
    lines.push(...test);
  } else {
    lines.push({ name: 'default', values: $props.values });
  }

  return lines;
});

onMounted(() => {
  if (!canvasEl.value) {
    throw new Error('canvasEl is undefined');
  }
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
    .map(line => (line?.values || []) as number[])
    .flat()
    .reduce((acc: number, value: number) => Math.max(acc, value), 0);
});

const render = async (canvas: HTMLCanvasElement) => {
  if (steps.value.x !== steps.value.y) {
    throw new Error('xValues and yValues must have the same length');
  }

  canvas.width = renderDimension.value.x;
  canvas.height = renderDimension.value.y;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('ctx is undefined');
  }

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
    cellDimension,
    offsetBottom,
    offsetLeft
  });
  drawLegend(ctx, {
    fontSize,
    bottomBarDimension,
    offsetBottom
  });
  lines.value.forEach(line => {
    ctx.globalCompositeOperation = line.composite || 'source-over';
    drawLine(ctx, line, {
      contentDimension,
      cellDimension,
      offsetBottom,
      offsetLeft
    });
  });
};

const drawLegend = (
  ctx: CanvasRenderingContext2D,
  {
    fontSize,
    bottomBarDimension,
    offsetBottom
  }: {
    fontSize: number;
    bottomBarDimension: IPoint & number;
    offsetBottom: number;
  }
) => {
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
  ctx: CanvasRenderingContext2D,
  line: ILine,
  {
    contentDimension,
    cellDimension,
    offsetBottom,
    offsetLeft
  }: {
    contentDimension: IPoint & number;
    cellDimension: IPoint & number;
    offsetBottom: number;
    offsetLeft: number;
  }
) => {
  const { values, style } = line;
  const path = new Path2D();
  const pathBackground = new Path2D();
  path.moveTo(offsetLeft, offsetBottom);
  pathBackground.moveTo(offsetLeft, offsetBottom);
  for (let i = 0; i < steps.value.x; i++) {
    const x = (i + 1) * cellDimension.x;
    const y =
      ((values as number[])[Number(i)] / maxValue.value) * contentDimension.y;
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
  ctx: CanvasRenderingContext2D,
  {
    fontSize,
    cornerDimension,
    bottomBarDimension,
    leftBarDimension,
    cellDimension,
    offsetBottom,
    offsetLeft
  }: {
    fontSize: number;
    bottomBarDimension: IPoint & number;
    leftBarDimension: IPoint & number;
    cornerDimension: IPoint & number;
    cellDimension: IPoint & number;
    offsetBottom: number;
    offsetLeft: number;
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

const writeText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  {
    color
  }: {
    color?: string;
  } = {}
) => {
  ctx.fillStyle = color || COLOR_VALUE_GRAPH_TEXT[COLOR_GRAPH.LAYOUT_GRID];
  ctx.fillText(text, Math.round(x), Math.round(y));
};

const drawHorizontalLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number
) => {
  ctx.fillStyle = COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.LAYOUT_GRID];
  ctx.fillRect(Math.round(x), Math.round(y), length, 2);
};

const drawVerticalLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number
) => {
  ctx.fillStyle = COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.LAYOUT_GRID];
  ctx.fillRect(Math.round(x), Math.round(y), 2, length);
};

function prepareValue(value: string | number) {
  let preparedValue = String(value);

  if (preparedValue.length > 6) {
    preparedValue = preparedValue.slice(0, -6) + 'B';
  }
  if (preparedValue.length > 3) {
    preparedValue = preparedValue.slice(0, -3) + 'K';
  }

  return fillTextStart(preparedValue, 4, '0');
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
