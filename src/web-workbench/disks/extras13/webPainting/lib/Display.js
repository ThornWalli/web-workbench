import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import { ipoint, point } from '@js-basics/vector';
import Canvas from './Canvas';
import Color from './Color';
import Bounds from './Bounds';
import Event from '@/web-workbench/classes/Event';

export default class Display {
  #id = uuidv4();
  events = new Subject();
  #bounds = new Bounds();
  size = ipoint();
  #cropBounds = new Bounds();
  #imageData = null;
  #tmpImageData = null;

  #canvas;
  #context;

  zoomFactor = 0;
  #zoomPosition = ipoint();
  #zoomBounds = new Bounds();

  offset = point();

  cursorVisible = false;

  constructor (app) {
    this.app = app;

    this.cursorColor = new Color(Color.COLOR_BLACK);

    this.resetZoom();
  }

  showCursor () {
    this.cursorVisible = true;
  }

  hideCursor () {
    this.cursorVisible = false;
    this.renderImageData();
  }

  setCanvas (canvas) {
    this.#canvas = canvas;
    this.#context = canvas.getContext('2d');

    Object.values(this.app.inputs).forEach((input) => {
      input.registerDisplay(this);
    });
  }

  destroy () {
    this.events.next(new Event('destroy'));
    Object.values(this.app.inputs).forEach((input) => {
      input.unregisterDisplay(this);
    });
  }

  get canvas () {
    return this.#canvas;
  }

  get id () {
    return this.#id;
  }

  get bounds () {
    return this.#bounds;
  }

  get imageData () {
    return this.#imageData;
  }

  set imageData (imageData) {
    this.#tmpImageData = this.#imageData = imageData;
    this.#zoomBounds = this.calculateZoomBounds(this.#zoomPosition, this.zoomFactor);
    this.renderImageData();
  }

  get canvasSize () {
    return ipoint(this.#canvas.width, this.#canvas.height);
    // return ipoint(this.#imageData.width, this.#imageData.height);
  }

  get naturalSize () {
    return ipoint(this.#canvas.width, this.#canvas.height);
    // return ipoint(this.#imageData.width, this.#imageData.height);
  }

  get naturalWidth () {
    return this.#imageData.width;
  }

  get naturalHeight () {
    return this.#imageData.height;
  }

  get width () {
    return this.#zoomBounds.max.x - this.#zoomBounds.min.x;
  }

  get height () {
    return this.#zoomBounds.max.y - this.#zoomBounds.min.y;
  }

  get zoomBounds () {
    return this.#zoomBounds;
  }

  get zoomFactorWidth () {
    return this.#canvas.width / this.zoomFactor;
  }

  get maxZoomFactor () {
    return Math.ceil(this.#imageData.width / 64);
  }

  set setZoomFactor (zoomFactor) {
    this.zoomFactor = zoomFactor;
    this.events.next(new Event('change:zoomFactor', zoomFactor));
  }

  zoom (factor = 1, position = ipoint()) {
    if (this.zoomFactor + factor >= 0) {
      this.setZoom(this.zoomFactor + factor, position);
    }
  }

  setZoom (factor = 1, position = ipoint()) {
    factor = Math.min(factor, this.maxZoomFactor);
    if (factor >= 0) {
      console.log('factor', factor);
      this.zoomFactor = factor;
      this.#zoomPosition = position;
      this.#zoomBounds = this.calculateZoomBounds(position, this.zoomFactor);

      this.resetOffset();
      this.renderImageData();
    }
  }

  renderImageData () {
    this.#tmpImageData = this.#imageData;
    if (this.zoomFactor > 0) {
      const size = ipoint(() => this.#zoomBounds.max - this.#zoomBounds.min);
      const position = ipoint(() => this.offset + this.#zoomBounds.min);

      this.#tmpImageData = Canvas.cropImageData(this.#tmpImageData, position.x, position.y, size.x, size.y);
      // Zoom
      this.#tmpImageData = Canvas.resizeImageData(this.#tmpImageData, this.zoomFactor);
      this.#context.putImageData(this.#tmpImageData, 0, 0);
    } else {
      this.#context.putImageData(this.#tmpImageData, -this.offset.x, -this.offset.y);
    }

    this.renderCursor();
  }

  get cursorColor () {
    return this._cursorColor;
  }

  set cursorColor (value) {
    this._cursorColorRGBA = value.toRGBA();
    this._cursorColor = value;
  }

  renderCursor () {
    if (!this.#tmpImageData) {
      return;
    }
    if (this.cursorVisible && this.cursorEvent) {
      if (this.zoomFactor > 0) {
        this.#context.putImageData(this.#tmpImageData, 0, 0);
      } else {
        this.#context.putImageData(this.#tmpImageData, -this.offset.x, -this.offset.y);
      }

      this.renderRaster();

      const position = this.cursorEvent.origin;

      // Invert in Canvas
      const ctx = this.#context;
      ctx.globalCompositeOperation = 'difference';

      ctx.fillStyle = this.cursorColor.toRGBA();
      ctx.fillRect(position.x - 11, position.y - 1, 8, 2);
      ctx.fillRect(position.x + 3, position.y - 1, 8, 2);
      ctx.fillRect(position.x - 1, position.y - 11, 2, 8);
      ctx.fillRect(position.x - 1, position.y + 3, 2, 8);

      if (this.app) {
        ctx.fillStyle = this.app.primaryColor.toRGBA();
      }
      const scale = Math.min(this.app.brush.data.length, 2);
      ctx.fillRect(position.x - 1, position.y - 1, scale, scale);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  setCursorEvent (event) {
    this.cursorEvent = event;
    this.renderCursor();
  }

  renderRaster () {
    const zoomFactor = this.zoomFactor - (this.zoomFactor % 2);
    if (zoomFactor > 2) {
      const ctx = this.#context;
      ctx.lineWidth = zoomFactor / this.maxZoomFactor;

      const raster = [
        zoomFactor, this.zoomFactor
      ];

      const size = ipoint(() => Math.ceil(this.canvasSize / ipoint(raster[0], raster[1])));

      ctx.beginPath();
      for (let x = 0; x < size.x; x++) {
        const x_ = Math.floor(x * raster[0]) - 1 / 2;
        ctx.moveTo(x_, 0);
        ctx.lineTo(x_, this.#canvas.height);
        for (let y = 0; y < size.y; y++) {
          const y_ = Math.floor(y * raster[1]) - 1 / 2;
          ctx.moveTo(0, y_);
          ctx.lineTo(this.#canvas.width, y_);
        }
      }
      ctx.stroke();
    }
  }

  refresh () {
    const rect = {
      left: this.#canvas.offsetLeft,
      top: this.#canvas.offsetTop,
      width: this.#canvas.offsetWidth,
      height: this.#canvas.offsetHeight
    };
    this.#bounds = new Bounds(ipoint(rect.left, rect.top), ipoint(rect.left + rect.width, rect.top + rect.height));
    if (this.#imageData) {
      this.renderImageData();
    }
  }

  resetOffset () {
    this.offset = point(0, 0);
  }

  resetZoom () {
    if (this.#imageData) {
      this.zoom(1);
    }
  }

  calculateZoomBounds (position, factor) {
    factor = factor || 1;

    return new Bounds(
      position,
      ipoint(() => position + this.app.canvas.size * (factor + 1))
    );

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
