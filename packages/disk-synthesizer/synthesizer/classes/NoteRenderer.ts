import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import {
  NOTE_COLORS,
  extras,
  noteTimeDefinitions,
  pauseTimeDefinitions
} from '../note.config.js';
import SvgNote from '../assets/svg/note_canvas.svg?raw';
import type NoteDescription from './NoteDescription.js';
import type { NoteConfigDefinition, NoteTestDefinition } from '../types.js';

const RENDER_OFFSET = 100;
export const SVG_HEIGHT_OFFSET = 3; // Untere Rand der SVG zum Noten Rand

export class FrameDescription {
  canvas: OffscreenCanvas;
  firstPixel?: IPoint & number;
  constructor(canvas: OffscreenCanvas) {
    this.canvas = canvas;
    this.firstPixel = getFirstPixelFromCanvas(this.canvas);
  }
}
function getFirstPixelFromCanvas(canvas: OffscreenCanvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context is not available');
  }
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 255) {
      const y = Math.floor(i / 4 / canvas.width);
      const x = i / 4 - y * canvas.width;
      return ipoint(x, y);
    }
  }
}

const globalCache = new Map();
export default class NoteRenderer {
  queue: Promise<FrameDescription | undefined>;
  canvas: OffscreenCanvas;
  canvasContext: OffscreenCanvasRenderingContext2D;
  svgNode: SVGSVGElement;
  dimension: IPoint & number;
  localCache: boolean = false;
  _cache = new Map();
  colors = {
    background: '#000000',
    foreground: '#000000'
  };

  constructor(
    options: {
      localCache?: boolean;
    } = { localCache: false }
  ) {
    const { localCache } = options || {};
    this.localCache = localCache !== undefined ? localCache : false;

    this.queue = Promise.resolve(undefined);

    const parser = new DOMParser();
    const svgNode = parser
      .parseFromString(SvgNote, 'image/svg+xml')
      .querySelector('svg');
    if (!svgNode) {
      throw new Error('SVG node is not available');
    }
    this.svgNode = svgNode;

    const { width, height } = this.svgNode.viewBox.baseVal;
    this.dimension = ipoint(width, height);
    this.canvas = new OffscreenCanvas(
      this.dimension.x + RENDER_OFFSET,
      this.dimension.y + RENDER_OFFSET
    );
    const ctx = this.canvas.getContext('2d', {
      willReadFrequently: true
    });
    if (!ctx) {
      throw new Error('Canvas context is not available');
    }
    this.canvasContext = ctx;
    this.canvasContext.imageSmoothingEnabled = false;
  }

  get cache() {
    return this.localCache ? this._cache : globalCache;
  }

  render(
    noteDescription: NoteDescription,
    options: {
      colors?: {
        background?: string;
        foreground?: string;
      };
    },
    offsetHeight = 0
  ) {
    const { colors } = options || {};
    const _colors = {
      background: '#0055aa',
      foreground: '#000000',
      ...colors
    };

    const cacheKey = [
      noteDescription.getName(),
      noteDescription.getTime(),
      Object.values(_colors).join('_'),
      offsetHeight
    ].join('_');

    if (this.cache.has(cacheKey)) {
      return Promise.resolve(this.cache.get(cacheKey));
    }

    // eslint-disable-next-line complexity
    return (this.queue = this.queue.then(() => {
      const svgNode = this.svgNode;
      const canvas = this.canvasContext.canvas;
      const ctx = this.canvasContext;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const definitions = noteDescription.isPause
        ? pauseTimeDefinitions
        : noteTimeDefinitions;
      const definition = definitions.find(definition =>
        definition.time.find(
          duration =>
            noteDescription.time &&
            duration.test(noteDescription.time.toString())
        )
      );

      if (definition) {
        drawElements(svgNode, ctx, definition.selectors, _colors, offsetHeight);
      }
      if (noteDescription.time?.dot) {
        drawElements(
          svgNode,
          ctx,
          getExtra('dot', noteDescription),
          _colors,
          offsetHeight
        );
      }
      if (noteDescription.note?.flat) {
        drawElements(
          svgNode,
          ctx,
          getExtra('flat', noteDescription),
          _colors,
          offsetHeight
        );
      }
      if (noteDescription.note?.doubleFlat) {
        drawElements(
          svgNode,
          ctx,
          getExtra('doubleFlat', noteDescription),
          _colors,
          offsetHeight
        );
      }
      if (noteDescription.note?.sharp) {
        drawElements(
          svgNode,
          ctx,
          getExtra('sharp', noteDescription),
          _colors,
          offsetHeight
        );
      }
      if (noteDescription.note?.doubleSharp) {
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
      if (definition && definition.offset) {
        if (definition.offset[1] < 0) {
          preparedY = Math.abs(preparedY);
          preparedHeight += Math.abs(preparedY);
        } else {
          preparedHeight += definition.offset[1];
        }
      }

      const preparedCanvas = new OffscreenCanvas(width, preparedHeight);
      const preparedCtx = preparedCanvas.getContext('2d');
      if (!preparedCtx) {
        throw new Error('Canvas context is not available');
      }
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
function getWidthFromCanvasFilledPixel(ctx: OffscreenCanvasRenderingContext2D) {
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
function drawElements(
  svgNode: SVGElement,
  ctx: OffscreenCanvasRenderingContext2D,
  elements: NoteConfigDefinition['selectors'] | NoteTestDefinition['selectors'],
  colors: { [key: string]: string },
  offsetHeight = 0
) {
  elements.forEach(
    ({
      selector,
      draw,
      color,
      offset,
      autoHeight
    }: {
      selector: string;
      draw: CallableFunction;
      color?: string;
      offset?: number[];
      autoHeight?: boolean;
    }) => {
      offset = [...(offset || [0, 0])];

      offset[0] += (ctx.canvas.width - 26) / 2;
      offset[1] += offsetHeight;

      Array.from(svgNode.querySelectorAll(selector)).forEach(node => {
        draw(
          ctx,
          node,
          offset,
          colors[color || NOTE_COLORS.PRIMARY],
          (autoHeight && offsetHeight) || 0
        );
      });
    }
  );
}

function getExtra(name: string, noteDescription: NoteDescription) {
  return (
    extras.find(extra => {
      return (
        extra.name === name &&
        noteDescription.time &&
        (extra.test?.test(noteDescription.time.toString()) || !extra.test)
      );
    })?.selectors || []
  );
}
