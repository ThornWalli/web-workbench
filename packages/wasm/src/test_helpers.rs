
use image::{ImageReader, DynamicImage, GenericImage, ImageFormat, RgbaImage};
use std::io::Cursor;
use wasm_bindgen::prelude::*;


/// **Hilfsfunktion:** Lädt ein Bild von einem Input-Buffer (z.B. SharedArrayBuffer)
/// und gibt es als Vec<u8> der RGBA-Pixeldaten zurück.
/// Diese Funktion sollte einmal aufgerufen werden, um das Bild zu dekodieren,
/// bevor es an eine 'in-place'-Bearbeitungsfunktion übergeben wird.
#[wasm_bindgen(js_name = "decodeImageToRgba")]
pub fn decode_image_to_rgba(
    input_image_data: &[u8], // Das Roh-Bild (PNG, JPEG etc.)
    format_str: &str,
) -> Result<js_sys::Uint8Array, JsValue> {
    let format = match format_str {
        "png" => ImageFormat::Png,
        "jpeg" => ImageFormat::Jpeg,
        "gif" => ImageFormat::Gif,
        "bmp" => ImageFormat::Bmp,
        _ => return Err(JsValue::from_str("Unsupported image format")),
    };

    let cursor = Cursor::new(input_image_data);
    let img = ImageReader::with_format(cursor, format)
        .decode()
        .map_err(|e| JsValue::from_str(&format!("Failed to decode image: {}", e)))?;

    let rgba_data = img.to_rgba8().into_raw(); // In RGBA8 konvertieren
    Ok(js_sys::Uint8Array::from(&rgba_data[..]))
}


/// **Hilfsfunktion:** Kodiert RGBA-Pixeldaten in einen Buffer (z.B. zum Speichern).
/// Diese Funktion sollte aufgerufen werden, nachdem die 'in-place'-Bearbeitung abgeschlossen ist.
#[wasm_bindgen(js_name = "encodeRgbaToImage")]
pub fn encode_rgba_to_image(
    rgba_data: &[u8], // RGBA-Pixeldaten
    width: u32,
    height: u32,
    format_str: &str,
) -> Result<js_sys::Uint8Array, JsValue> {
    let format = match format_str {
        "png" => ImageFormat::Png,
        "jpeg" => ImageFormat::Jpeg,
        "gif" => ImageFormat::Gif,
        "bmp" => ImageFormat::Bmp,
        _ => return Err(JsValue::from_str("Unsupported output format")),
    };

    let img_buffer = RgbaImage::from_raw(width, height, rgba_data.to_vec())
        .ok_or_else(|| JsValue::from_str("Failed to create RgbaImage from raw data"))?;

    let dyn_img = DynamicImage::ImageRgba8(img_buffer);

    let mut output_buffer = Cursor::new(Vec::new());
    dyn_img.write_to(&mut output_buffer, format)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;

    Ok(js_sys::Uint8Array::from(&output_buffer.into_inner()[..]))
}

// ... deine create_test_image_512x512 Funktion, drawRectangleWithBrush Funktion etc. ...
// Diese können nun auf die process_image_data_in_place Funktion aufbauen,
// indem sie erst die Daten dekodieren und dann diese Funktion aufrufen.

/// Beispiel für eine Funktion, die ein 512x512 PNG-Bild erstellt (für Tests)
#[wasm_bindgen]
pub fn create_test_image(width: u32, height: u32) -> Result<js_sys::Uint8Array, JsValue> {

    // Ein neues RGB-Bild erstellen (RGBA für Transparenz ist auch möglich)
    let mut img = DynamicImage::new_rgb8(width, height);

    // Pixel setzen (z.B. ein einfaches Schachbrettmuster)
    for x in 0..width {
        for y in 0..height {
            let color = if (x / 64 + y / 64) % 2 == 0 {
                image::Rgb([255, 0, 0]) // Rot
            } else {
                image::Rgb([0, 0, 255]) // Blau
            };
            img.put_pixel(x, y, image::Rgba([color[0], color[1], color[2], 255]));
        }
    }

    // Bild als PNG in einen Buffer schreiben
    let mut output_buffer = Cursor::new(Vec::new());
    img.write_to(&mut output_buffer, ImageFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;

    Ok(js_sys::Uint8Array::from(&output_buffer.into_inner()[..]))
}

#[wasm_bindgen]
pub fn create_blank_image(width: u32, height: u32) -> Result<js_sys::Uint8Array, JsValue> {

    // Ein neues RGB-Bild erstellen (RGBA für Transparenz ist auch möglich)
    let mut img = DynamicImage::new_rgba8(width, height);
    // Weißes Bild: alle Pixel auf weiß setzen
    for x in 0..width {
        for y in 0..height {
            img.put_pixel(x, y, image::Rgba([255, 255, 255, 255]));
        }
    }
    // Bild als PNG in einen Buffer schreiben
    let mut output_buffer = Cursor::new(Vec::new());
    img.write_to(&mut output_buffer, ImageFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;

    Ok(js_sys::Uint8Array::from(&output_buffer.into_inner()[..]))
}
