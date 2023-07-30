import { ipoint } from '@js-basics/vector';
import Color from './Color';
import BitmapData from './BitmapData';

class Canvas {
  static invertImageData (imageData) {
    let i = 0;
    for (let x = 0; x < imageData.width; x++) {
      for (let y = 0; y < imageData.height; y++) {
        i = (x + y * imageData.width) * 4;
        imageData.data[Number(i)] = 255 - imageData.data[Number(i)];
        imageData.data[i + 1] = 255 - imageData.data[i + 1];
        imageData.data[i + 2] = 255 - imageData.data[i + 2];
      }
    }
  }

  static createImageData (width, height, data) {
    return new window.ImageData(
      new window.Uint8ClampedArray(data || 4 * width * height),
      width,
      height
    );
  }

  /**
     * Resize Data from ImageData.
     * @param  {array} data Data from ImageData
     * @param  {Number} w1
     * @param  {Number} h1
     * @param  {Number} w2
     * @param  {Number} h2
     * @return {array}
     */
  static resizeImageData (imageData, scale = 1) {
    const srcData = imageData.data;
    const w1 = imageData.width;
    const h1 = imageData.height;
    const w2 = w1 * scale;
    const h2 = h1 * scale;
    const destData = Array(w2 * h2 * 4);
    // EDIT: added +1 to account for an early rounding problem
    const ratio = ipoint(parseInt((w1 << 16) / w2) + 1, parseInt((h1 << 16) / h2) + 1);
    // int x_ratio = (int)((w1<<16)/w2) ;
    // int y_ratio = (int)((h1<<16)/h2) ;
    let x2, y2;
    for (let i = 0; i < h2; i++) {
      for (let j = 0; j < w2; j++) {
        x2 = (j * ratio.x) >> 16;
        y2 = (i * ratio.y) >> 16;
        copyPixel((y2 * w1 + x2) * 4, srcData, (i * w2 + j) * 4, destData);
        // result[(i * w2) + j] = pixels[(y2 * w1) + x2];
      }
    }
    return Canvas.createImageData(w2, h2, destData);
  }

  static cropImageData (imageData, x, y, width, height) {
    const srcData = imageData.data;
    const destData = Array(width * height * 4);
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const m = (y * imageData.width + x) * 4 + (j * imageData.width + i) * 4;
        copyPixel(m, srcData, (j * width + i) * 4, destData);
      }
    }
    return Canvas.createImageData(width, height, destData);
  }

  getActiveContext () {
    return this._app.display.context;
    // return this._app.displays.value[0].context;
  }

  getDisplayContexts () {
    return this._app.displays.value.map((display) => {
      return display.context;
    });
  }

  constructor (app) {
    this._app = app;

    const size = app.options.size;
    this._bitmapData = new BitmapData(size.width, size.height);

    this._renderActions = [];
    this._passiveRenderActions = [];

    this.clearStack();
  }

  setSize (width, height) {
    this._bitmapData = new BitmapData(width, height);
    this.clearStack();
    this.render();
    this._app.refresh();
  }

  loadImage (image) {
    const imageData = this.getImageDataFromImage(image);
    this._bitmapData = new BitmapData(
      imageData.width,
      imageData.height
    );
    this.clearStack();
    this._stacks.push(imageData);
    this.render();
    this._app.refresh();
  }

  getImageDataFromImage (image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    const imageData = Canvas.createImageData(image.width, image.height);
    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < data.length; i++) {
      imageData.data[Number(i)] = data[Number(i)];
    }
    return data;
  }

  getColorFromPixel (x, y, current = false) {
    const imageData = current
      ? this._renderImageData
      : this._stacks[this._stacks.length - 1 || 0];
    const data = imageData.data;
    const index = y * (imageData.width * 4) + x * 4;
    return new Color(data[Number(index)], data[index + 1], data[index + 2], data[index + 3]);
  }

  getPixel (x, y, current = false) {
    const imageData = current
      ? this._renderImageData
      : this._stacks[this._stacks.length - 1 || 0];
    const data = imageData.data;
    const index = y * (imageData.width * 4) + x * 4;
    return data[Number(index)] + data[index + 1] + data[index + 2] + data[index + 3];
  }

  setPixel (x, y, color) {
    color = color || this._app.primaryColor;
    const i = (x + y * this._renderImageData.width) * 4;
    this._renderImageData.data[i + 0] = color.red;
    this._renderImageData.data[i + 1] = color.green;
    this._renderImageData.data[i + 2] = color.blue;
    this._renderImageData.data[i + 3] = color.alpha >= 0 ? color.alpha : 255;
  }

  putImageData (imageData, originX, originY) {
    let srcIndex, destIndex;
    for (let x = 0; x < imageData.width; x++) {
      for (let y = 0; y < imageData.height; y++) {
        srcIndex = (y * imageData.width + x) * 4;
        destIndex = ((originY + y) * this._renderImageData.width + (originX + x)) * 4;
        copyPixel(srcIndex, imageData.data, destIndex, this._renderImageData.data);
      }
    }
  }

  fillPixels (color, originX, originY, width, height) {
    for (let x = originX; x < Math.min(originX + width, this._renderImageData.width); x++) {
      for (
        let y = originY;
        y < Math.min(originY + height, this._renderImageData.height);
        y++
      ) {
        this.setPixel(x, y, color);
      }
    }
  }

  addRenderAction (cb) {
    this._renderActions.push(cb);
  }

  addPassiveRenderAction (cb) {
    this._passiveRenderActions.push(cb);
  }

  cleanPassiveRenderActions () {
    this._passiveRenderActions = [];
  }

  getTmpStack () {
    return Canvas.createImageData(
      this._stacks[this._stacks.length - 1].width,
      this._stacks[this._stacks.length - 1].height,
      this._stacks[this._stacks.length - 1].data
    );
  }

  render () {
    this._renderImageData = this.getTmpStack();
    runActions(this._renderActions);
    runActions(this._passiveRenderActions, true);
    window.cancelAnimationFrame(this._renderWait);
    this._renderWait = window.setTimeout(() => {
      renderDisplays.bind(this)(true);
      this._renderWait = null;
    }, 1000 / 30);

    window.clearTimeout(this._renderWaitDisplays);
    this._renderWaitDisplays = window.setTimeout(() => {
      renderDisplays.bind(this)();
    }, 300);
  }

  get size () {
    return ipoint(this._renderImageData.width, this._renderImageData.height);
  }

  get width () {
    return this._renderImageData.width;
  }

  get height () {
    return this._renderImageData.height;
  }

  get stacks () {
    return this._stacks;
  }

  get renderImageData () {
    return this._renderImageData;
  }

  clearStack () {
    this._renderImageData = Canvas.createImageData(
      this._bitmapData.width,
      this._bitmapData.height
    );
    this._stacks = [
      this._renderImageData
    ];
    this.render();
  }

  saveStack () {
    this._renderImageData = this.getTmpStack();
    runActions(this._renderActions, true);
    this._stacks.push(this._renderImageData);
    this.render();
  }

  revertStack () {
    if (this._stacks.length > 1) {
      this._renderImageData = this._stacks.pop();
      this.render();
    }
  }

  toBlob () {
    return new Promise((resolve) => {
      getCanvasFromImageData(this._renderImageData).toBlob(resolve);
    });
  }

  toBase64 () {
    return new Promise((resolve) => {
      resolve(getCanvasFromImageData(this._renderImageData).toDataURL());
    });
  }
}

function copyPixel (srcIndex, srcData, destIndex, destData) {
  destData[Number(destIndex)] = srcData[Number(srcIndex)];
  destData[destIndex + 1] = srcData[srcIndex + 1];
  destData[destIndex + 2] = srcData[srcIndex + 2];
  destData[destIndex + 3] = srcData[srcIndex + 3];
}

function getCanvasFromImageData (imageData) {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext('2d').putImageData(imageData, 0, 0);
  return canvas;
}

function renderDisplays (current) {
  if (current) {
    if (this._app.display) {
      this._app.display.imageData = this._renderImageData;
    }
  } else {
    this._app.displays.value.forEach((display) => {
      display.imageData = this._renderImageData;
    });
  }
}

function runActions (actions, shift) {
  if (shift) {
    let action;
    while (actions.length > 0) {
      action = actions.shift();
      action();
    }
  } else {
    actions.forEach((action) => {
      action();
    });
  }
}

export default Canvas;
