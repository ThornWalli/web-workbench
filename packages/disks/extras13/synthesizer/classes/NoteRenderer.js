import { ipoint } from '@js-basics/vector';
import {
  NOTE_COLORS,
  extras,
  noteTimeDefinitions,
  pauseTimeDefinitions
} from '../note.config.js';

const RENDER_OFFSET = 20;
export const SVG_HEIGHT_OFFSET = 3; // Untere Rand der SVG zum Noten Rand

export class FrameDescription {
  constructor(canvas) {
    this.canvas = canvas;
    this.firstPixel = getFirstPixelFromCanvas(this.canvas);
  }
}
function getFirstPixelFromCanvas(canvas) {
  const { data } = canvas
    .getContext('2d')
    .getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 255) {
      const y = Math.floor(i / 4 / canvas.width);
      const x = i / 4 - y * canvas.width;
      return [x, y];
    }
  }
}

export default class NoteRenderer {
  cache = new Map();
  colors = {
    background: '#000000',
    foreground: '#000000',
    tertiary: '#ffffff'
  };

  constructor(svgNode) {
    this.queue = Promise.resolve();
    this.svgNode = svgNode;
    const { width, height } = svgNode.viewBox.baseVal;
    this.dimension = ipoint(width, height);
    this.canvas = new OffscreenCanvas(
      this.dimension.x + RENDER_OFFSET,
      this.dimension.y + RENDER_OFFSET
    );
    this.canvasContext = this.canvas.getContext('2d', {
      willReadFrequently: true
    });
    this.canvasContext.imageSmoothingEnabled = false;
  }

  render(noteDescription, options, offsetHeight = 0) {
    const { colors } = options || {};
    const _colors = {
      background: '#0055aa',
      foreground: '#000000',
      tertiary: '#ffffff',
      ...colors
    };

    const cacheKey = [
      noteDescription.name,
      noteDescription.notation.toString(),
      Object.values(_colors).join('_'),
      offsetHeight
    ].join('_');

    if (this.cache.has(cacheKey)) {
      return Promise.resolve(this.cache.get(cacheKey));
    }

    return (this.queue = this.queue.then(() => {
      const svgNode = this.svgNode;
      const canvas = this.canvasContext.canvas;
      const ctx = this.canvasContext;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const definitions = noteDescription.name
        ? noteTimeDefinitions
        : pauseTimeDefinitions;
      const definition = definitions.find(definition =>
        definition.time.find(duration =>
          duration.test(noteDescription.notation.toString())
        )
      );

      if (definition) {
        drawElements(svgNode, ctx, definition.selectors, _colors, offsetHeight);
      }
      if (noteDescription.notation.dot) {
        drawElements(
          svgNode,
          ctx,
          getExtra('dot', noteDescription),
          _colors,
          offsetHeight
        );
      }
      if (noteDescription.sharp) {
        drawElements(
          svgNode,
          ctx,
          getExtra('sharp', noteDescription),
          _colors,
          offsetHeight
        );
      }
      if (noteDescription.doubleSharp) {
        drawElements(
          svgNode,
          ctx,
          getExtra('doubleSharp', noteDescription),
          _colors,
          offsetHeight
        );
      }

      const { x, y, width, height } = getWidthFromCanvasFilledPixel(ctx);

      let preparedY = 0;
      let preparedHeight = height + SVG_HEIGHT_OFFSET;
      if (definition.offset) {
        if (definition.offset[1] < 0) {
          preparedY = Math.abs(preparedY);
          preparedHeight += Math.abs(preparedY);
        } else {
          preparedHeight += definition.offset[1];
        }
      }

      const preparedCanvas = new OffscreenCanvas(width, preparedHeight);
      const preparedCtx = preparedCanvas.getContext('2d');
      preparedCtx.imageSmoothingEnabled = false;
      preparedCtx.drawImage(
        canvas,
        x,
        y,
        preparedCanvas.width,
        preparedCanvas.height,
        0,
        0,
        preparedCanvas.width,
        preparedCanvas.height
      );

      const frame = new FrameDescription(preparedCanvas);

      this.cache.set(cacheKey, frame);

      return frame;
    }));
  }
}
function getWidthFromCanvasFilledPixel(ctx) {
  const canvas = ctx.canvas;

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < data.length; i += 4) {
    const x = Math.floor(i / 4) % canvas.width;
    const y = Math.floor(i / 4 / canvas.width);

    if (data[i + 3]) {
      if (x < minX) {
        minX = x;
      } else if (x > maxX) {
        maxX = x;
      }

      if (y < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}
function drawElements(svgNode, ctx, elements, colors, offsetHeight = 0) {
  elements.forEach(({ selector, draw, color, offset, autoHeight }) => {
    offset = [...(offset || [0, 0])];

    offset[0] += (ctx.canvas.width - 26) / 2;
    offset[1] += offsetHeight;

    Array.from(svgNode.querySelectorAll(selector)).forEach(node => {
      draw(
        ctx,
        node,
        offset,
        colors[String(color || NOTE_COLORS.PRIMARY)],
        (autoHeight && offsetHeight) || 0
      );
    });
  });
}

function getExtra(name, noteDescription) {
  return extras.find(extra => {
    return (
      extra.name === name &&
      (extra.test?.test(noteDescription.notation.toString()) || !extra.test)
    );
  })?.selectors;
}
