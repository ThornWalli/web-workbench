/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LineOptions,
  create_test_image,
  decodeImageToRgba,
  drawBrush,
  drawLine,
  drawRectangle,
  encodeRgbaToImage,
  grayScale,
  initBrush,
  ShapeStyle,
  RectangleOptions,
  StrokeAlign,
  Color as Rust_Color,
  drawEllipse,
  EllipseOptions,
  Dimension as Rust_Dimension,
  Point as Rust_Point,
  drawPolygon,
  PolygonOptions,
  drawDots,
  setBrushData,
  setBrushDots,
  drawAirBrush,
  AirBurshOptions,
  create_blank_image,
  setBrushSolid,
  SolidType,
  drawFill,
  Dimension,
  getPixels,
  Point,
  setPixels,
  BrushMode
} from '../pkg/wasm.js';

import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), '../.output');

if (!existsSync(__dirname)) {
  await fsPromises.mkdir(__dirname, { recursive: true });
}

async function run() {
  console.log('Starting WASM image processing test with SharedArrayBuffer...');

  try {
    const width = 256;
    const height = 256;
    // const testPngData = await create_test_image(width, height);
    const testPngData = await create_blank_image(width, height);
    const originalTestImagePath = path.join(
      __dirname,
      'test_image_original.png'
    );
    await fsPromises.writeFile(originalTestImagePath, testPngData);

    const rgbaPixelsUint8Array = await decodeImageToRgba(testPngData, 'png');

    const sharedBuffer = new SharedArrayBuffer(rgbaPixelsUint8Array.byteLength);
    const sharedPixelsView = new Uint8Array(sharedBuffer);
    sharedPixelsView.set(rgbaPixelsUint8Array);

    await grayScale(sharedPixelsView, new Dimension(width, height));

    await initBrush(
      BrushMode.Normal,
      SolidType.Square,
      8,
      new Rust_Color(255, 0, 0, 255), // Primary color
      new Rust_Color(0, 0, 255, 255) // Primary color
    );

    await drawBrush(
      sharedPixelsView,
      new Rust_Dimension(width, height),
      new Rust_Point(width - 4, 40)
    );

    await setBrushSolid(
      BrushMode.Normal,
      SolidType.Round,
      8,
      new Rust_Color(255, 0, 0, 255), // Primary color
      new Rust_Color(0, 0, 255, 255) // Primary color
    );

    await drawBrush(
      sharedPixelsView,
      new Rust_Dimension(width, height),
      new Rust_Point(width - 4, 20)
    );

    setPixels(
      sharedPixelsView,
      new Dimension(width, height),
      new Rust_Point(width - 4, 60),
      new Uint8Array(
        Array(8 * 8)
          .fill([255, 0, 0, 255])
          .flat()
      ),
      new Dimension(8, 8),
      BrushMode.Normal
    );

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        await setPixels(
          sharedPixelsView,
          new Dimension(width, height),
          new Rust_Point(width - 4 + x, 80 + y),
          new Uint8Array(
            Array(1 * 1)
              .fill([255, 255, 0, 255])
              .flat()
          ),
          new Dimension(1, 1),
          BrushMode.Normal
        );
      }
    }

    // await initBrush(
    //   SolidType.Round,
    //   1,
    //   new Rust_Color(255, 0, 0, 255), // Primary color
    //   new Rust_Color(0, 0, 255, 255) // Primary color
    // );

    // let size = 11;
    // await setBrushData(
    //   new Uint8Array(
    //     Array(size * size)
    //       .fill([255, 0, 0, 255])
    //       .flat()
    //   ),
    //   new Rust_Dimension(size, size),
    //   new Rust_Color(255, 0, 0, 255), // Primary color
    //   new Rust_Color(0, 255, 0, 255) // Secondary color
    // );

    // await setBrushDots(
    //   new Rust_Dimension(size, size),
    //   new Rust_Color(255, 0, 0, 255), // Primary color
    //   new Rust_Color(0, 255, 0, 255) // Secondary color
    // );

    // await drawBrush(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(40, 40)
    // );

    // for (let i = 0; i < 10; i++) {
    //   await drawBrush(
    //     sharedPixelsView,
    //     new Rust_Dimension(width, height),
    //     new Rust_Point(40, 40)
    //   );
    // }

    // size = 6;
    // await setBrushData(
    //   new Uint8Array(
    //     Array(size * size)
    //       .fill([255, 0, 0, 255])
    //       .flat()
    //   ),
    //   new Rust_Dimension(size, size),
    //   new Rust_Color(255, 0, 0, 255), // Primary color
    //   new Rust_Color(0, 255, 0, 255) // Secondary color
    // );
    // await setBrushSolid(
    //   SolidType.Round,
    //   size,
    //   new Rust_Color(255, 0, 0, 255), // Primary colorr,
    //   new Rust_Color(255, 0, 0, 60) // Primary colorr
    // );

    // await drawRectangle(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(40, 40),
    //   new Rust_Dimension(50, 50),
    //   new RectangleOptions(
    //     ShapeStyle.Filled,
    //     StrokeAlign.Outside,
    //     new LineOptions(1, 0)
    //   )
    // );
    // await drawBrush(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(40, 40)
    // );
    // await setBrushSolid(
    //   SolidType.Square,
    //   size,
    //   new Rust_Color(255, 0, 0, 255), // Primary colorr,
    //   new Rust_Color(255, 0, 0, 60) // Primary colorr
    // );
    // await drawBrush(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(40, 80)
    // );
    // await setBrushSolid(
    //   SolidType.Dots,
    //   20,
    //   new Rust_Color(255, 0, 0, 255), // Primary colorr,
    //   new Rust_Color(255, 0, 0, 60) // Primary colorr
    // );

    // for (let i = 0; i < 10; i++) {
    //   await drawBrush(
    //     sharedPixelsView,
    //     new Rust_Dimension(width, height),
    //     new Rust_Point(40, 150)
    //   );
    // }

    // await setBrushSolid(
    //   SolidType.Square,
    //   1,
    //   new Rust_Color(0, 0, 0, 255), // Primary colorr,
    //   new Rust_Color(0, 0, 0, 60) // Primary colorr
    // );
    // await drawRectangle(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(100, 40),
    //   new Rust_Dimension(50, 50),
    //   new RectangleOptions(
    //     ShapeStyle.Stroked,
    //     StrokeAlign.Outside,
    //     new LineOptions(1, 0)
    //   )
    // );
    // drawFill(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(100, 40),
    //   new Rust_Color(255, 0, 0, 255)
    // );
    // drawFill(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(110, 50),
    //   new Rust_Color(0, 255, 255, 255)
    // );

    // for (let i = 0; i < 100; i++) {
    //   await drawAirBrush(
    //     sharedPixelsView,
    //     new Rust_Dimension(width, height),
    //     new Rust_Point(150, 100),
    //     new Rust_Dimension(100, 100),
    //     new Rust_Color(255, 0, 0, 255),
    //     new AirBurshOptions(true, 100, 0.4)
    //   );
    // }
    // for (let i = 0; i < 100; i++) {
    //   await drawAirBrush(
    //     sharedPixelsView,
    //     new Rust_Dimension(width, height),
    //     new Rust_Point(50, 100),
    //     new Rust_Dimension(100, 100),
    //     new Rust_Color(255, 0, 0, 255),
    //     new AirBurshOptions(true, 100, 1)
    //   );
    // }

    // #region test

    async function drawRectangles(x: number, y: number, offset: number = 50) {
      let offset_y = 0;
      await drawRectangle(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        new Rust_Point(x, y),
        new Rust_Dimension(60, 30),
        new RectangleOptions(
          ShapeStyle.StrokedFilled,
          StrokeAlign.Outside,
          new LineOptions(1, 0)
        )
      );
      offset_y += offset;
      await drawRectangle(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        new Rust_Point(x, y + offset_y),
        new Rust_Dimension(60, 30),
        new RectangleOptions(
          ShapeStyle.Stroked,
          StrokeAlign.Outside,
          new LineOptions(1, 0)
        )
      );
      offset_y += offset;
      await drawRectangle(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        new Rust_Point(x, y + offset_y),
        new Rust_Dimension(60, 30),
        new RectangleOptions(
          ShapeStyle.Filled,
          StrokeAlign.Outside,
          new LineOptions(1, 0)
        )
      );
    }

    async function drawEllipses(x: number, y: number, offset: number = 50) {
      let offset_y = 0;

      await drawEllipse(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        new Rust_Point(x, y),
        new Rust_Dimension(60, 30),
        new EllipseOptions(
          ShapeStyle.StrokedFilled,
          new LineOptions(1, 0),
          true
        )
      );

      offset_y += offset;
      await drawEllipse(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        new Rust_Point(x, y + offset_y),
        new Rust_Dimension(60, 30),
        new EllipseOptions(ShapeStyle.Stroked, new LineOptions(1, 0), true)
      );

      offset_y += offset;
      await drawEllipse(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        new Rust_Point(x, y + offset_y),
        new Rust_Dimension(60, 30),
        new EllipseOptions(ShapeStyle.Filled, new LineOptions(1, 0), true)
      );
    }

    async function drawPolygons(x: number, y: number, offset: number = 50) {
      let offset_y = 0;
      await drawPolygon(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        [
          new Rust_Point(x, y),
          new Rust_Point(x + 24, y + 10),
          new Rust_Point(x + 70, y),
          new Rust_Point(x + 70, y + 40),
          new Rust_Point(x + 30, y + 30),
          new Rust_Point(x, y + 40)
        ],
        new PolygonOptions(ShapeStyle.StrokedFilled, new LineOptions(1, 0))
      );
      offset_y += offset;
      await drawPolygon(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        [
          new Rust_Point(x, y + offset_y),
          new Rust_Point(x + 24, y + 10 + offset_y),
          new Rust_Point(x + 70, y + offset_y),
          new Rust_Point(x + 70, y + 40 + offset_y),
          new Rust_Point(x + 30, y + 30 + offset_y),
          new Rust_Point(x, y + 40 + offset_y)
        ],
        new PolygonOptions(ShapeStyle.Stroked, new LineOptions(1, 0))
      );
      offset_y += offset;
      await drawPolygon(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        [
          new Rust_Point(x, y + offset_y),
          new Rust_Point(x + 24, y + 10 + offset_y),
          new Rust_Point(x + 70, y + offset_y),
          new Rust_Point(x + 70, y + 40 + offset_y),
          new Rust_Point(x + 30, y + 30 + offset_y),
          new Rust_Point(x, y + 40 + offset_y)
        ],
        new PolygonOptions(ShapeStyle.Filled, new LineOptions(1, 0))
      );
    }

    // for (let x = 0; x < 10; x++) {
    //   for (let y = 0; y < 10; y++) {
    //     await drawBrush(
    //       sharedPixelsView,
    //       new Rust_Dimension(width, height),
    //       new Rust_Point(240 + x, 240 + y)
    //     );
    //   }
    // }

    // await drawLine(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(10, 160),
    //   new Rust_Point(80, 200),
    //   new LineOptions(1, 0)
    // );

    // await drawCurve(
    //   sharedPixelsView,
    //   new Rust_Dimension(width, height),
    //   new Rust_Point(110, 160),
    //   new Rust_Point(140, 200),
    //   new Rust_Point(180, 200),
    //   new Rust_Point(160, 180),
    //   new CurveOptions(1, 0, false)
    // );

    // #endregion

    // await drawRectangles(10, 10, 50);

    // await drawEllipses(90, 10, 50);

    // await drawPolygons(170, 10);

    // console.log(
    //   getPixels(
    //     sharedPixelsView,
    //     new Dimension(width, height),
    //     new Point(50, 50),
    //     new Dimension(100, 100)
    //   )
    // );

    // setPixels(
    //   sharedPixelsView,
    //   new Dimension(width, height),
    //   new Point(20, 50),
    //   new Uint8Array(
    //     Array(50 * 100)
    //       .fill([255, 0, 0, 255])
    //       .flat()
    //   ),
    //   new Dimension(50, 100),
    //   true
    // );

    const invertedPngData = await encodeRgbaToImage(
      sharedPixelsView,
      width,
      height,
      'png'
    );

    const outputImagePath = path.join(__dirname, 'output.png');
    await fsPromises.writeFile(outputImagePath, invertedPngData);
    console.log(
      `Inverted image (from SharedArrayBuffer) saved to: ${outputImagePath}`
    );

    console.log(
      'WASM image processing test with SharedArrayBuffer completed successfully!'
    );
  } catch (error) {
    console.error('An error occurred during WASM image processing:', error);
  }
}

run();
//
