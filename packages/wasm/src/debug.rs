use image::{DynamicImage, GenericImage, ImageFormat, ImageReader, RgbaImage};
use std::io::Cursor;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "decodeImageToRgba")]
pub fn decode_image_to_rgba(
    input_image_data: &[u8],
    format_str: &str,
) -> Result<js_sys::Uint8Array, JsValue> {
    let format = match format_str {
        "png" => ImageFormat::Png,
        "jpeg" => ImageFormat::Jpeg,
        "gif" => ImageFormat::Gif,
        "bmp" => ImageFormat::Bmp,
        _ => {
            return Err(JsValue::from_str("Unsupported image format"));
        }
    };

    let cursor = Cursor::new(input_image_data);
    let img = ImageReader::with_format(cursor, format)
        .decode()
        .map_err(|e| JsValue::from_str(&format!("Failed to decode image: {}", e)))?;

    let rgba_data = img.to_rgba8().into_raw();
    Ok(js_sys::Uint8Array::from(&rgba_data[..]))
}

#[wasm_bindgen(js_name = "encodeRgbaToImage")]
pub fn encode_rgba_to_image(
    rgba_data: &[u8],
    width: u32,
    height: u32,
    format_str: &str,
) -> Result<js_sys::Uint8Array, JsValue> {
    let format = match format_str {
        "png" => ImageFormat::Png,
        "jpeg" => ImageFormat::Jpeg,
        "gif" => ImageFormat::Gif,
        "bmp" => ImageFormat::Bmp,
        _ => {
            return Err(JsValue::from_str("Unsupported output format"));
        }
    };

    let img_buffer = RgbaImage::from_raw(width, height, rgba_data.to_vec())
        .ok_or_else(|| JsValue::from_str("Failed to create RgbaImage from raw data"))?;

    let dyn_img = DynamicImage::ImageRgba8(img_buffer);

    let mut output_buffer = Cursor::new(Vec::new());
    dyn_img
        .write_to(&mut output_buffer, format)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;

    Ok(js_sys::Uint8Array::from(&output_buffer.into_inner()[..]))
}

#[wasm_bindgen]
pub fn create_test_image(width: u32, height: u32) -> Result<js_sys::Uint8Array, JsValue> {
    let mut img = DynamicImage::new_rgb8(width, height);

    for x in 0..width {
        for y in 0..height {
            let color = if (x / 64 + y / 64) % 2 == 0 {
                image::Rgb([255, 0, 0])
            } else {
                image::Rgb([0, 0, 255])
            };
            img.put_pixel(x, y, image::Rgba([color[0], color[1], color[2], 255]));
        }
    }

    let mut output_buffer = Cursor::new(Vec::new());
    img.write_to(&mut output_buffer, ImageFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;

    Ok(js_sys::Uint8Array::from(&output_buffer.into_inner()[..]))
}

#[wasm_bindgen]
pub fn create_blank_image(width: u32, height: u32) -> Result<js_sys::Uint8Array, JsValue> {
    let mut img = DynamicImage::new_rgba8(width, height);
    for x in 0..width {
        for y in 0..height {
            img.put_pixel(x, y, image::Rgba([255, 255, 255, 255]));
        }
    }

    let mut output_buffer = Cursor::new(Vec::new());
    img.write_to(&mut output_buffer, ImageFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;

    Ok(js_sys::Uint8Array::from(&output_buffer.into_inner()[..]))
}
