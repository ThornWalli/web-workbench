// import type { IPoint } from '@js-basics/vector';

// function calculateZoomBounds(
//   canvas: HTMLCanvasElement | OffscreenCanvas,
//   position: IPoint & number,
//   factor: number
// ) {
//   factor = factor || 1;
//   const sourceSize = this.app.canvas.size;
//   position = ipoint(() => Math.floor(position * sourceSize));
//   // position = ipoint(() => sourceSize / 2);

//   const maxDisplayFactor = ipoint(() => this.size / sourceSize);

//   const cropSize = ipoint(() =>
//     Math.ceil(Math.min((maxDisplayFactor / factor) * sourceSize, sourceSize))
//   );
//   const min = ipoint(() =>
//     Math.min(
//       Math.max(position - Math.ceil(cropSize / 2), 0),
//       sourceSize - cropSize
//     )
//   );
//   const max = ipoint(() => min + cropSize);
//   // this.setOffset(this.zoomBounds.min);
//   // console.log({
//   //   position: position.toString(),
//   //   min: min.toString(),
//   //   max: max.toString(),
//   //   cropSize: cropSize.toString()
//   //   // position: position.toString(),
//   //   // sourceSize: sourceSize.toString(),
//   //   // size: size.toString(),
//   //   // maxDisplayFactor: maxDisplayFactor.toString(),
//   //   // maxDisplayFactor_: ipoint(() => Math.floor(Math.min(maxDisplayFactor / factor * sourceSize, sourceSize))).toString(),
//   //   // test: maxDisplayFactor.x * maxDisplayFactor.y
//   // }
//   // );

//   return new Bounds(min, max);

//   //   const srcSize = this.canvasSize;

//   //   const size = ipoint(() => Math.ceil(srcSize / factor));
//   //   const halfSize = ipoint(() => size / 2);

//   //   position = point(position);

//   //   if (position.x - halfSize.x < 0) {
//   //     position.x = 0;
//   //   } else if (position.x + halfSize.x > srcSize.x) {
//   //     position.x = srcSize.x - size.x;
//   //   } else {
//   //     position.x -= halfSize.x;
//   //   }

//   //   if (position.y - halfSize.y < 0) {
//   //     position.y = 0;
//   //   } else if (position.y + halfSize.y > srcSize.y) {
//   //     position.y = srcSize.y - size.y;
//   //   } else {
//   //     position.y -= halfSize.y;
//   //   }

//   //   const offset = new Bounds();
//   //   offset.min = ipoint(() => Math.ceil(position));
//   //   offset.max = ipoint(() => Math.ceil(position + size));
//   //   return offset;
// }
