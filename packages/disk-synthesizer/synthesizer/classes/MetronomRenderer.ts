import { Time as ToneTime } from 'tone';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { getNoteTimes } from '../utils/note';
import Metronom from './Metronom';
import type { Seconds } from 'tone/build/esm/core/type/Units';

export default class MetronomRenderer {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
  metronom: Metronom;
  noteTimes: [string, Seconds][];
  outerMargin = [32, 0, 19, 0];
  beatCount = 2;

  constructor(canvas: OffscreenCanvas, metronom: Metronom, options = {}) {
    this.setOptions(options);

    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context is not available');
    }
    this.ctx = ctx;

    this.noteTimes = getNoteTimes();

    if (metronom instanceof Metronom) {
      this.metronom = metronom;
    } else {
      throw new Error(
        'MetronomRenderer: metronom must be an instance of Metronom'
      );
    }
  }

  setOptions(options: { outerMargin?: [number, number, number, number] }) {
    const { outerMargin } = options || {};
    this.outerMargin = outerMargin || this.outerMargin;
  }

  render(func: CallableFunction) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const position = ipoint(this.outerMargin[0], this.outerMargin[1]);
    const dimension = ipoint(
      this.canvas.width - (this.outerMargin[0] + this.outerMargin[2]),
      this.canvas.height - (this.outerMargin[1] + this.outerMargin[3])
    );

    ctx.fillStyle = '#FFAA5580';
    ctx.fill(this.getPath(position, dimension));
    // ctx.fillRect(position.x, 0, dimension.x, dimension.y);
    ctx.fillRect(
      position.x +
        Math.min(
          Math.max(
            Math.round(
              (dimension.x *
                (this.metronom.value % (2 * this.metronom.beatCount))) /
                2 /
                this.metronom.beatCount
            ),
            0
          ),
          dimension.x
        ),
      position.y,
      dimension.x / this.metronom.steps / this.metronom.beatCount,
      dimension.y
    );

    if (typeof func === 'function') {
      func(ctx, { position, dimension });
    }
  }

  getPath(position: IPoint, dimension: IPoint) {
    const metronom = this.metronom;
    const path = new Path2D();

    const timeSeconds = ToneTime(metronom.time).toSeconds();
    const steps = timeSeconds;

    for (let i = 0; i < this.noteTimes.length; i++) {
      const value = this.noteTimes[Number(i)];
      const lineWidth = 2;

      for (
        let step = 1;
        step <= (2 / value[1] - 1) * this.metronom.beatCount;
        step++
      ) {
        path.rect(
          position.x +
            Math.round((dimension.x * value[1] * step) / 2 - lineWidth / 2) /
              this.metronom.beatCount -
            lineWidth / 2,
          position.y,
          lineWidth,
          38 - 2 / value[1]
        );
      }

      for (
        let step = 0;
        step <= (1 / steps) * 2 * metronom.speed * this.metronom.beatCount;
        step++
      ) {
        path.rect(
          position.x +
            Math.round(
              (dimension.x * steps * step) / metronom.speed / 2 - lineWidth / 2
            ) /
              this.metronom.beatCount -
            lineWidth / 2,
          position.y,
          lineWidth,
          dimension.y
        );
      }
      // path.rect(position.x, position.y, lineWidth, dimension.y);
      // path.rect(
      //   position.x + (dimension.x - lineWidth),
      //   position.y,
      //   lineWidth,
      //   dimension.y
      // );
    }
    return path;
  }
}
