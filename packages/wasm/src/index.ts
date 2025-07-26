/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StrokeAlign,
  WasmLayer,
  encodeRgbaToImage,
  grayScale,
  Dimension as Rust_Dimension,
  Point as Rust_Point,
  Dimension,
  mergeLayers,
  BlendMode,
  drawRectangle,
  RectangleOptions,
  ShapeStyle,
  LineOptions,
  initBrush,
  BrushMode,
  SolidType,
  Color,
  setBrushData,
  setBrushSolid,
  drawPolygon,
  PolygonOptions
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
    const width = 200;
    const height = 300;

    initBrush(
      BrushMode.Replace,
      SolidType.Round,
      5,
      new Color(255, 0, 0, 255),
      new Color(255, 255, 255, 255)
    );

    const sharedBuffer = new SharedArrayBuffer(width * height * 4);
    const sharedPixelsView = new Uint8Array(sharedBuffer);
    // Initialisiere den sharedPixelsView mit transparentem Schwarz
    sharedPixelsView.fill(0);

    function testRectangle(x: number, y: number, strokeAlign: StrokeAlign) {
      setBrushSolid(
        BrushMode.Replace,
        SolidType.Round,
        6,
        new Color(255, 0, 0, 255),
        new Color(255, 255, 255, 255)
      );

      drawRectangle(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        new Rust_Point(10 + x, 10 + y),
        new Rust_Dimension(80, 80),
        new RectangleOptions(
          ShapeStyle.StrokedFilled,
          strokeAlign,
          new LineOptions(1, 0, BigInt(0)),
          BigInt(0)
        )
      );

      setBrushSolid(
        BrushMode.Normal,
        SolidType.Round,
        6,
        new Color(0, 0, 255, 160),
        new Color(255, 0, 255, 255)
      );

      drawRectangle(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        new Rust_Point(10 + x, 10 + y),
        new Rust_Dimension(80, 80),
        new RectangleOptions(
          ShapeStyle.Filled,
          strokeAlign,
          new LineOptions(1, 0, BigInt(0)),
          BigInt(0)
        )
      );
    }

    // testRectangle(0, 0, StrokeAlign.Outside);
    // testRectangle(0, 100, StrokeAlign.Center);
    // testRectangle(0, 200, StrokeAlign.Inside);

    function testPolygon(x: number, y: number, strokeAlign: StrokeAlign) {
      setBrushSolid(
        BrushMode.Replace,
        SolidType.Round,
        6,
        new Color(255, 0, 0, 255),
        new Color(255, 255, 255, 255)
      );

      drawPolygon(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        [
          new Rust_Point(10 + x, 10 + y),
          new Rust_Point(50 + (10 + x), 10 + y),
          new Rust_Point(50 + (10 + x), 50 + (10 + y)),
          new Rust_Point(10 + x, 50 + (10 + y))
        ],
        new PolygonOptions(
          ShapeStyle.StrokedFilled,
          new LineOptions(1, 0, BigInt(0)),
          BigInt(0)
        )
      );

      setBrushSolid(
        BrushMode.Normal,
        SolidType.Round,
        6,
        new Color(0, 0, 255, 160),
        new Color(255, 0, 255, 255)
      );

      drawPolygon(
        sharedPixelsView,
        new Rust_Dimension(width, height),
        [
          new Rust_Point(10 + x, 10 + y),
          new Rust_Point(50 + (10 + x), 10 + y),
          new Rust_Point(50 + (10 + x), 50 + (10 + y)),
          new Rust_Point(10 + x, 50 + (10 + y))
        ],
        new PolygonOptions(
          ShapeStyle.Filled,
          new LineOptions(1, 0, BigInt(0)),
          BigInt(0)
        )
      );
    }

    testPolygon(0, 0, StrokeAlign.Outside);
    testPolygon(0, 100, StrokeAlign.Center);
    testPolygon(0, 200, StrokeAlign.Inside);

    const invertedPngData = await encodeRgbaToImage(
      sharedPixelsView,
      width,
      height,
      'png'
    );

    const outputImagePath = path.join(__dirname, 'output.png');
    await fsPromises.writeFile(outputImagePath, invertedPngData);
    console.log(`Merged image saved to: ${outputImagePath}`);

    console.log(
      'WASM image processing test with SharedArrayBuffer completed successfully!'
    );
  } catch (error) {
    console.error('An error occurred during WASM image processing:', error);
  }
}

run();
