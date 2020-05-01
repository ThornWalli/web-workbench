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
  canvasLayout = {
    size: ipoint(),
    naturalSize: ipoint(),
    position: ipoint()
  }

  #cropBounds = new Bounds();
  #imageData = null;
  #tmpImageData = null;

  #el;
  #canvas;
  #context;

  zoomFactor = 1;
  zoomPosition = ipoint(0.5, 0.5);
  zoomBounds = new Bounds();

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

  setElement (element) {
    this.#el = element;
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
    this.maxZoomFactor = 20;
    this.zoomBounds = this.calculateZoomBounds(this.zoomPosition, this.zoomFactor);
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
    return this.zoomBounds.max.x - this.zoomBounds.min.x;
  }

  get height () {
    return this.zoomBounds.max.y - this.zoomBounds.min.y;
  }

  get zoomFactorWidth () {
    return this.#canvas.width / this.zoomFactor;
  }

  // get maxZoomFactor () {
  //   return Math.ceil(this.#imageData.width / 64);
  // }

  setSize (width, height) {
    let size;
    if (typeof width === 'object') {
      size = width;
    } else {
      size = ipoint(width, height);
    }

    this.size = size;

    this.events.next(new Event('change:size', size));

    this.canvasAdjustment();
  }

  canvasAdjustment () {
    this.canvasLayout.size = ipoint(() => Math.min(Math.max(this.app.canvas.size * (this.zoomFactor), 0), this.size));
    this.canvasLayout.naturalSize = this.app.canvas.size;
    this.canvasLayout.position = ipoint(0, 0);
    // this.canvasLayout.position = ipoint(() => (this.size - this.canvasLayout.size) / 2);
  }

  setZoom (factor = 1, position = ipoint()) {
    factor = Math.min(factor, this.maxZoomFactor);
    if (factor >= 0) {
      this.zoomFactor = factor;

      this.canvasAdjustment();
      this.zoomPosition = ipoint(() => position / this.canvasLayout.naturalSize);
      this.zoomBounds = this.calculateZoomBounds(this.zoomPosition, this.zoomFactor);
      this.resetOffset();
      global.requestAnimationFrame(() => {
        this.renderImageData();
        this.events.next(new Event('change:zoomFactor', factor));
      });
    }
  }

  zoom (factor = 1, position = ipoint()) {
    if (this.zoomFactor + factor >= 0) {
      this.setZoom(this.zoomFactor + factor, position);
    }
  }

  renderImageData () {
    this.#tmpImageData = this.#imageData;
    const size = ipoint(() => this.zoomBounds.max - this.zoomBounds.min);
    const position = ipoint(() => ipoint(this.offset) + this.zoomBounds.min);

    this.#tmpImageData = Canvas.cropImageData(this.#tmpImageData, position.x, position.y, size.x, size.y);
    // Zoom
    this.#tmpImageData = Canvas.resizeImageData(this.#tmpImageData, this.zoomFactor);
    this.renderCanvas();

    // this.#context.putImageData(this.#tmpImageData, 0, 0);
  }

  get cursorColor () {
    return this._cursorColor;
  }

  set cursorColor (value) {
    this._cursorColorRGBA = value.toRGBA();
    this._cursorColor = value;
  }

  renderCanvas () {
    if (!this.#tmpImageData) {
      return;
    }

    this.#context.putImageData(this.#tmpImageData, -this.offset.x, -this.offset.y);
    this.renderRaster();
  }

  reset () {
    this.resetZoom();
    this.resetOffset();
    this.renderCanvas();
  }

  resetOffset () {
    this.offset = point(0, 0);
  }

  resetZoom () {
    if (this.#imageData) {
      this.setZoom(1);
    }
  }

  renderRaster () {
    const rasters = [
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
    ];

    if (this.zoomFactor > this.maxZoomFactor - 3) {
      rasters.push(

        {
          size: ipoint(1, 1),
          width: 1,
          color: '#CCCCCC'
        });
    }
    const ctx = this.#context;
    ctx.globalCompositeOperation = 'destination-over';
    rasters.forEach((raster) => {
      const size = ipoint(() => this.canvasLayout.naturalSize / raster.size);
      ctx.lineWidth = raster.width;
      ctx.beginPath();
      for (let x = 0; x < size.x + 1; x++) {
        const x_ = Math.floor(x * raster.size.x * this.zoomFactor) + raster.width / 2;
        ctx.moveTo(x_, 0);
        ctx.lineTo(x_, this.#canvas.height);
        for (let y = 0; y < size.y + 1; y++) {
          const y_ = Math.floor(y * raster.size.y * this.zoomFactor) + raster.width / 2;
          ctx.moveTo(0, y_);
          ctx.lineTo(this.#canvas.width, y_);
        }
      }
      ctx.strokeStyle = raster.color;
      ctx.stroke();
    });
  }

  refresh () {
    const rect = {
      left: this.#canvas.offsetLeft + this.#el.offsetLeft,
      top: this.#canvas.offsetTop + this.#el.offsetTop,
      width: this.#canvas.offsetWidth,
      height: this.#canvas.offsetHeight
    };
    this.#bounds = new Bounds(ipoint(rect.left, rect.top), ipoint(rect.left + rect.width, rect.top + rect.height));
    if (this.#imageData) {
      this.renderImageData();
    }
  }

  setOffset (pffset) {
    this.offset = point(pffset.x, pffset.y);
  }

  calculateZoomBounds (position, factor) {
    factor = factor || 1;
    const sourceSize = this.app.canvas.size;
    position = ipoint(() => Math.floor(position * sourceSize));
    // position = ipoint(() => sourceSize / 2);

    const maxDisplayFactor = ipoint(() => this.size / sourceSize);

    const cropSize = ipoint(() => Math.ceil(Math.min(maxDisplayFactor / factor * sourceSize, sourceSize)));
    const min = ipoint(() => Math.min(Math.max(position - Math.ceil(cropSize / 2), 0), sourceSize - cropSize));
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

    return new Bounds(
      min, max
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
