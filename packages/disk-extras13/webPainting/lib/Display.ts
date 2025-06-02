import { Subject } from 'rxjs';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { markRaw, reactive } from 'vue';
import Event from '@web-workbench/core/classes/Event';
import Canvas from './Canvas';
import Color from './Color';
import Bounds from './Bounds';
import type App from './App';
import { COLOR, COLOR_VALUE } from './types';

export default class Display {
  app: App;
  id = crypto.randomUUID();
  events = new Subject<Event>();
  bounds = new Bounds();
  size: IPoint & number = ipoint(0, 0);

  _cursorColor: Color = new Color(COLOR_VALUE[COLOR.TRANSPARENT]);
  _cursorColorRGBA: string = 'rgba(0, 0, 0, 0)';

  canvasLayout: {
    size: IPoint & number;
    naturalSize: IPoint & number;
    position: IPoint & number;
  } = reactive({
    size: markRaw(ipoint(0, 0)),
    naturalSize: markRaw(ipoint(0, 0)),
    position: markRaw(ipoint(0, 0))
  });

  imageData?: ImageData;
  tmpImageData?: ImageData;

  el?: HTMLElement;
  canvas?: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null = null;

  zoomFactor = 1;
  maxZoomFactor = 20;
  zoomPosition = ipoint(0.5, 0.5);
  zoomBounds = new Bounds();

  offset: IPoint & number = ipoint(0, 0);

  cursorVisible = false;

  constructor(app: App) {
    this.app = app;

    this.cursorColor = new Color(COLOR_VALUE[COLOR.BLACK]);

    this.resetZoom();
  }

  showCursor() {
    this.cursorVisible = true;
  }

  hideCursor() {
    this.cursorVisible = false;
    this.renderImageData();
  }

  setElement(element: HTMLElement) {
    this.el = element;
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    Object.values(this.app.inputs).forEach(input => {
      input.registerDisplay(this);
    });
  }

  destroy() {
    this.events.next(new Event({ name: 'destroy' }));
    Object.values(this.app.inputs).forEach(input => {
      input.unregisterDisplay(this);
    });
  }

  setImageData(imageData: ImageData) {
    this.tmpImageData = this.imageData = imageData;
    this.maxZoomFactor = 20;
    this.zoomBounds = this.calculateZoomBounds(
      this.zoomPosition,
      this.zoomFactor
    );
    this.renderImageData();
  }

  get canvasSize() {
    if (!this.canvas) {
      throw new Error('Canvas not set');
    }
    return ipoint(this.canvas.width, this.canvas.height);
    // return ipoint(this.imageData.width, this.imageData.height);
  }

  get naturalSize() {
    if (!this.canvas) {
      throw new Error('Canvas not set');
    }
    return ipoint(this.canvas.width, this.canvas.height);
    // return ipoint(this.imageData.width, this.imageData.height);
  }

  get naturalWidth() {
    if (!this.imageData) {
      throw new Error('Image data not set');
    }
    return this.imageData.width;
  }

  get naturalHeight() {
    if (!this.imageData) {
      throw new Error('Image data not set');
    }
    return this.imageData.height;
  }

  get width() {
    return this.zoomBounds.max.x - this.zoomBounds.min.x;
  }

  get height() {
    return this.zoomBounds.max.y - this.zoomBounds.min.y;
  }

  get zoomFactorWidth() {
    if (!this.canvas) {
      throw new Error('Canvas not set');
    }
    return this.canvas.width / this.zoomFactor;
  }

  // get maxZoomFactor () {
  //   return Math.ceil(this.imageData.width / 64);
  // }

  setSize(width: number | (IPoint & number), height?: number) {
    let size: IPoint & number;
    if (typeof width === 'object' && 'x' in width) {
      size = width;
    } else {
      size = ipoint(width, height);
    }

    this.size = size;

    this.events.next(new Event({ name: 'change:size', value: size }));

    this.canvasAdjustment();
  }

  canvasAdjustment() {
    if (!this.app.canvas) {
      throw new Error('Canvas not set');
    }
    const canvas = this.app.canvas;
    this.canvasLayout.size = ipoint(() =>
      Math.min(Math.max(canvas.size * this.zoomFactor, 0), this.size)
    );
    this.canvasLayout.naturalSize = this.app.canvas.size;
    this.canvasLayout.position = ipoint(0, 0);
    // this.canvasLayout.position = ipoint(() => (this.size - this.canvasLayout.size) / 2);
  }

  setZoom(factor = 1, position = ipoint(0, 0)) {
    factor = Math.min(factor, this.maxZoomFactor);
    if (factor >= 0) {
      this.zoomFactor = factor;

      this.canvasAdjustment();
      this.zoomPosition = ipoint(
        () => position / this.canvasLayout.naturalSize
      );
      this.zoomBounds = this.calculateZoomBounds(
        this.zoomPosition,
        this.zoomFactor
      );
      this.resetOffset();
      window.requestAnimationFrame(() => {
        this.renderImageData();
        this.events.next(
          new Event({ name: 'change:zoomFactor', value: { factor } })
        );
      });
    }
  }

  zoom(factor = 1, position = ipoint(0, 0)) {
    if (this.zoomFactor + factor >= 0) {
      this.setZoom(this.zoomFactor + factor, position);
    }
  }

  renderImageData() {
    this.tmpImageData = this.imageData;
    const size = ipoint(() => this.zoomBounds.max - this.zoomBounds.min);
    const position = ipoint(() => ipoint(this.offset) + this.zoomBounds.min);

    if (!this.tmpImageData) {
      throw new Error('Image data not set');
    }

    this.tmpImageData = Canvas.cropImageData(
      this.tmpImageData,
      position.x,
      position.y,
      size.x,
      size.y
    );
    // Zoom
    this.tmpImageData = Canvas.resizeImageData(
      this.tmpImageData,
      this.zoomFactor
    );
    this.renderCanvas();

    // this.context.putImageData(this.tmpImageData, 0, 0);
  }

  get cursorColor() {
    return this._cursorColor;
  }

  set cursorColor(value: Color) {
    this._cursorColorRGBA = value.toRGBA();
    this._cursorColor = value;
  }

  renderCanvas() {
    if (!this.tmpImageData) {
      return;
    }

    this.context?.putImageData(
      this.tmpImageData,
      -this.offset.x,
      -this.offset.y
    );
    this.renderRaster();
  }

  reset() {
    this.resetZoom();
    this.resetOffset();
    this.renderCanvas();
  }

  resetOffset() {
    this.offset = ipoint(0, 0);
  }

  resetZoom() {
    if (this.imageData) {
      this.setZoom(1);
    }
  }

  renderRaster() {
    const rasters = [];
    // {
    //   size: ipoint(10, 10),
    //   width: 1,
    //   color: '#CCCCCC'
    // }
    // {
    //   size: ipoint(1, 1),
    //   width: 1,
    //   color: '#CCCCCC'
    // }

    if (this.zoomFactor > this.maxZoomFactor - 3) {
      rasters.push({
        size: ipoint(1, 1),
        width: 1,
        color: '#CCCCCC'
      });
    }
    const canvas = this.canvas;
    const ctx = this.context;
    if (!canvas || !ctx) {
      throw new Error('Canvas or context not set');
    }

    ctx.globalCompositeOperation = 'destination-over';
    rasters.forEach(raster => {
      const size = ipoint(() => this.canvasLayout.naturalSize / raster.size);
      ctx.lineWidth = raster.width;
      ctx.beginPath();
      for (let x = 0; x < size.x + 1; x++) {
        const x_ =
          Math.floor(x * raster.size.x * this.zoomFactor) + raster.width / 2;
        ctx.moveTo(x_, 0);
        ctx.lineTo(x_, canvas.height);
        for (let y = 0; y < size.y + 1; y++) {
          const y_ =
            Math.floor(y * raster.size.y * this.zoomFactor) + raster.width / 2;
          ctx.moveTo(0, y_);
          ctx.lineTo(canvas.width, y_);
        }
      }
      ctx.strokeStyle = raster.color;
      ctx.stroke();
    });
  }

  refresh() {
    if (this.el && this.canvas) {
      const rect = {
        left: this.canvas.offsetLeft + this.el.offsetLeft,
        top: this.canvas.offsetTop + this.el.offsetTop,
        width: this.canvas.offsetWidth,
        height: this.canvas.offsetHeight
      };
      this.bounds = new Bounds(
        ipoint(rect.left, rect.top),
        ipoint(rect.left + rect.width, rect.top + rect.height)
      );
      if (this.imageData) {
        this.renderImageData();
      }
    }
  }

  setOffset(offset: IPoint & number) {
    this.offset = offset;
  }

  calculateZoomBounds(position: IPoint & number, factor: number) {
    if (!this.app.canvas) {
      throw new Error('Canvas not set');
    }
    factor = factor || 1;
    const sourceSize = this.app.canvas.size;
    position = ipoint(() => Math.floor(position * sourceSize));
    // position = ipoint(() => sourceSize / 2);

    const maxDisplayFactor = ipoint(() => this.size / sourceSize);

    const cropSize = ipoint(() =>
      Math.ceil(Math.min((maxDisplayFactor / factor) * sourceSize, sourceSize))
    );
    const min = ipoint(() =>
      Math.min(
        Math.max(position - Math.ceil(cropSize / 2), 0),
        sourceSize - cropSize
      )
    );
    const max = ipoint(() => min + cropSize);
    // this.setOffset(this.zoomBounds.min);
    // console.log({
    //   position: position.toString(),
    //   min: min.toString(),
    //   max: max.toString(),
    //   cropSize: cropSize.toString()
    //   // position: position.toString(),
    //   // sourceSize: sourceSize.toString(),
    //   // size: size.toString(),
    //   // maxDisplayFactor: maxDisplayFactor.toString(),
    //   // maxDisplayFactor_: ipoint(() => Math.floor(Math.min(maxDisplayFactor / factor * sourceSize, sourceSize))).toString(),
    //   // test: maxDisplayFactor.x * maxDisplayFactor.y
    // }
    // );

    return new Bounds(min, max);

    //   const srcSize = this.canvasSize;

    //   const size = ipoint(() => Math.ceil(srcSize / factor));
    //   const halfSize = ipoint(() => size / 2);

    //   position = point(position);

    //   if (position.x - halfSize.x < 0) {
    //     position.x = 0;
    //   } else if (position.x + halfSize.x > srcSize.x) {
    //     position.x = srcSize.x - size.x;
    //   } else {
    //     position.x -= halfSize.x;
    //   }

    //   if (position.y - halfSize.y < 0) {
    //     position.y = 0;
    //   } else if (position.y + halfSize.y > srcSize.y) {
    //     position.y = srcSize.y - size.y;
    //   } else {
    //     position.y -= halfSize.y;
    //   }

    //   const offset = new Bounds();
    //   offset.min = ipoint(() => Math.ceil(position));
    //   offset.max = ipoint(() => Math.ceil(position + size));
    //   return offset;
  }
}
