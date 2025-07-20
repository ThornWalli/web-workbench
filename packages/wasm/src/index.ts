import {
  WasmLayer,
  encodeRgbaToImage,
  grayScale,
  Dimension as Rust_Dimension,
  Dimension,
  mergeLayers,
  BlendMode
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
    const width = 4;
    const height = 4;

    const sharedBuffer = new SharedArrayBuffer(width * height * 4);
    const sharedPixelsView = new Uint8Array(sharedBuffer);
    // Initialisiere den sharedPixelsView mit transparentem Schwarz
    sharedPixelsView.fill(0);

    // Die grayscale-Funktion wird den Puffer ändern, aber du setzt ihn später mit clean:true zurück.
    // Wenn du grayscale als Initialisierung für den *Hintergrund* möchtest,
    // stelle sicher, dass mergeLayers ohne clean:true aufgerufen wird
    // oder dass der grayscale-Effekt NACH der Merging-Operation angewendet wird,
    // falls er auf das Endergebnis angewendet werden soll.
    // Für diesen Test, wo du ein 20% schwarzes Bild erwartest, ist es gut, dass clean:true aktiv ist.
    await grayScale(sharedPixelsView, new Dimension(width, height));

    // === Korrigierte Layer-Erstellung ===

    // Layer 1: Dunkel mit 20% Opazität (Alpha 51)
    const darkAlphaValue = Math.round(255 * 0.2); // Sollte 51 sein

    const darkLayerData = new Uint8Array(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4;
      darkLayerData[idx + 3] = darkAlphaValue; // Setze nur den Alpha-Wert auf 51, RGB bleibt 0 (schwarz)
    }

    // Layer 2 & 3: Leer und Transparent (Alpha 0)
    const transparentLayerData = new Uint8Array(width * height * 4).fill(0); // Füllt alle Bytes mit 0

    const layers: WasmLayer[] = [
      new WasmLayer(darkLayerData, BlendMode.Normal, 1),
      new WasmLayer(transparentLayerData, BlendMode.Normal, 1),
      new WasmLayer(transparentLayerData, BlendMode.Normal, 1) // Kann dieselbe Referenz verwenden, da sie nicht geändert wird
    ];

    // === Ende der Korrektur ===

    mergeLayers(
      sharedPixelsView,
      new Rust_Dimension(width, height),
      layers,
      true // Sollte den sharedPixelsView vor dem Mischen auf transparentes Schwarz zurücksetzen
    );

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
