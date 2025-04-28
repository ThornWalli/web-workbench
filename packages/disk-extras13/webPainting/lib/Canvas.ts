import { ipoint } from '@js-basics/vector';
import Color from './Color';
import BitmapData from './BitmapData';
import type App from './App';

class Canvas {
  app: App;
  bitmapData?: BitmapData;
  renderActions: CallableFunction[];
  passiveRenderActions: CallableFunction[];
  stacks: ImageData[] = [];
  renderImageData?: ImageData;

  renderWaitDisplays?: number;
  renderWait?: number;
  animationFrame: number = -1;

  static invertImageData(imageData: ImageData) {
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

  static createImageData(
    width: number,
    height: number,
    data?: number[] | Uint8ClampedArray
  ) {
    let clampedArray;
    if (data) {
      clampedArray = new window.Uint8ClampedArray(data);
    } else {
      clampedArray = new window.Uint8ClampedArray(4 * width * height);
    }
    return new window.ImageData(clampedArray, width, height);
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
  static resizeImageData(imageData: ImageData, scale = 1) {
    const srcData = imageData.data;
    const w1 = imageData.width;
    const h1 = imageData.height;
    const w2 = w1 * scale;
    const h2 = h1 * scale;
    const destData = Array(w2 * h2 * 4);
    // EDIT: added +1 to account for an early rounding problem
    const ratio = ipoint(
      Number((w1 << 16) / w2) + 1,
      Number((h1 << 16) / h2) + 1
    );
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

  static cropImageData(
    imageData: ImageData,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
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

  getActiveContext() {
    return this.app.display?.context;
    // return this.app.displays.value[0].context;
  }

  getDisplayContexts() {
    // return this.app.displays.value.map(display => {
    //   return display.context;
    // });
    return this.app.displays.map(display => {
      return display.context;
    });
  }

  constructor(app: App) {
    this.app = app;

    const size = app.options.size;
    this.bitmapData = new BitmapData(size.width, size.height);

    this.renderActions = [];
    this.passiveRenderActions = [];

    this.clearStack();
  }

  setSize(width: number, height: number) {
    this.bitmapData = new BitmapData(width, height);
    this.clearStack();
    this.render();
    this.app.refresh();
  }

  loadImage(image: HTMLImageElement) {
    const imageData = this.getImageDataFromImage(image);
    this.bitmapData = new BitmapData(imageData.width, imageData.height);
    this.clearStack();
    this.stacks.push(imageData);
    this.render();
    this.app.refresh();
  }

  getImageDataFromImage(image: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    context.drawImage(image, 0, 0);

    const imageData = Canvas.createImageData(image.width, image.height);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i++) {
      imageData.data[Number(i)] = data[i];
    }
    return imageData;
  }

  getColorFromPixel(x: number, y: number, current = false) {
    const imageData = current
      ? this.renderImageData
      : this.stacks[this.stacks.length - 1 || 0];

    if (!imageData) {
      throw new Error('ImageData not found');
    }

    const data = imageData.data;
    const index = y * (imageData.width * 4) + x * 4;
    return new Color(
      data[Number(index)],
      data[index + 1],
      data[index + 2],
      data[index + 3]
    );
  }

  getPixel(x: number, y: number, current = false) {
    const imageData = current
      ? this.renderImageData
      : this.stacks[this.stacks.length - 1 || 0];

    if (!imageData) {
      throw new Error('ImageData not found');
    }

    const data = imageData.data;
    const index = y * (imageData.width * 4) + x * 4;
    return (
      data[Number(index)] + data[index + 1] + data[index + 2] + data[index + 3]
    );
  }

  setPixel(x: number, y: number, color: Color) {
    if (!this.renderImageData) {
      throw new Error('RenderImageData not found');
    }

    color = color || this.app.colorSelect.primaryColor;
    const i = (x + y * this.renderImageData.width) * 4;
    this.renderImageData.data[i + 0] = color.red;
    this.renderImageData.data[i + 1] = color.green;
    this.renderImageData.data[i + 2] = color.blue;
    this.renderImageData.data[i + 3] = color.alpha >= 0 ? color.alpha : 255;
  }

  putImageData(imageData: ImageData, originX: number, originY: number) {
    if (!this.renderImageData) {
      throw new Error('RenderImageData not found');
    }

    let srcIndex, destIndex;
    for (let x = 0; x < imageData.width; x++) {
      for (let y = 0; y < imageData.height; y++) {
        srcIndex = (y * imageData.width + x) * 4;
        destIndex =
          ((originY + y) * this.renderImageData.width + (originX + x)) * 4;
        copyPixel(
          srcIndex,
          imageData.data,
          destIndex,
          this.renderImageData.data
        );
      }
    }
  }

  fillPixels(
    color: Color,
    originX: number,
    originY: number,
    width: number,
    height: number
  ) {
    if (!this.renderImageData) {
      throw new Error('RenderImageData not found');
    }

    for (
      let x = originX;
      x < Math.min(originX + width, this.renderImageData.width);
      x++
    ) {
      for (
        let y = originY;
        y < Math.min(originY + height, this.renderImageData.height);
        y++
      ) {
        this.setPixel(x, y, color);
      }
    }
  }

  addRenderAction(cb: CallableFunction) {
    this.renderActions.push(cb);
  }

  addPassiveRenderAction(cb: CallableFunction) {
    this.passiveRenderActions.push(cb);
  }

  cleanPassiveRenderActions() {
    this.passiveRenderActions = [];
  }

  getTmpStack() {
    return Canvas.createImageData(
      this.stacks[this.stacks.length - 1].width,
      this.stacks[this.stacks.length - 1].height,
      this.stacks[this.stacks.length - 1].data
    );
  }

  render() {
    // window.clearTimeout(this.renderWait);

    window.clearTimeout(this.renderWait);
    this.renderWait = window.setTimeout(
      () => {
        this.renderImageData = this.getTmpStack();

        runActions(this.renderActions);
        runActions(this.passiveRenderActions, true);

        window.cancelAnimationFrame(this.animationFrame);
        this.animationFrame = window.requestAnimationFrame(() => {
          this.renderDisplays(true);
        });
      },
      1000 / 60 / 2
    );

    window.clearTimeout(this.renderWaitDisplays);
    this.renderWaitDisplays = window.setTimeout(() => {
      this.renderDisplays();
    }, 300);
  }

  get size() {
    return ipoint(
      this.renderImageData?.width || 0,
      this.renderImageData?.height || 0
    );
  }

  get width() {
    return this.renderImageData?.width || 0;
  }

  get height() {
    return this.renderImageData?.height || 0;
  }

  clearStack() {
    this.renderImageData = Canvas.createImageData(
      this.bitmapData?.width,
      this.bitmapData?.height
    );
    this.stacks = [this.renderImageData];
    this.render();
  }

  saveStack() {
    if (!this.renderActions) {
      throw new Error('RenderActions not found');
    }

    this.renderImageData = this.getTmpStack();
    runActions(this.renderActions, true);
    this.stacks.push(this.renderImageData);
    this.render();
  }

  revertStack() {
    if (this.stacks.length > 1) {
      this.renderImageData = this.stacks.pop();
      this.render();
    }
  }

  toBlob() {
    return new Promise(resolve => {
      if (!this.renderImageData) {
        throw new Error('RenderImageData not found');
      }
      getCanvasFromImageData(this.renderImageData).toBlob(resolve);
    });
  }

  toBase64() {
    return new Promise(resolve => {
      if (!this.renderImageData) {
        throw new Error('RenderImageData not found');
      }
      resolve(getCanvasFromImageData(this.renderImageData).toDataURL());
    });
  }

  renderDisplays(current: boolean = false) {
    if (!this.renderImageData) {
      throw new Error('RenderImageData not found');
    }
    const renderImageData = this.renderImageData;
    if (current) {
      if (this.app.display && renderImageData) {
        this.app.display.setImageData(renderImageData);
      }
    } else {
      this.app.displays.forEach(display => {
        display.setImageData(renderImageData);
      });
    }
  }
}

function copyPixel(
  srcIndex: number,
  srcData: number[] | Uint8ClampedArray,
  destIndex: number,
  destData: number[] | Uint8ClampedArray
) {
  destData[Number(destIndex)] = srcData[Number(srcIndex)];
  destData[destIndex + 1] = srcData[srcIndex + 1];
  destData[destIndex + 2] = srcData[srcIndex + 2];
  destData[destIndex + 3] = srcData[srcIndex + 3];
}

function getCanvasFromImageData(imageData: ImageData) {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext('2d')?.putImageData(imageData, 0, 0);
  return canvas;
}

function runActions(actions: CallableFunction[], shift = false) {
  if (shift) {
    let action;
    while (actions.length > 0) {
      action = actions.shift();
      if (action) {
        action();
      }
    }
  } else {
    actions.forEach(action => {
      action();
    });
  }
}

export default Canvas;
