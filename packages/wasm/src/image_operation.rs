use crate::{operation, types::Dimension};
use wasm_bindgen::{JsValue, prelude::wasm_bindgen};

#[wasm_bindgen(js_name = "invert")]
pub fn invert(data: &mut [u8], data_dim: Dimension) -> Result<Vec<u8>, JsValue> {
    Ok(operation::invert_image(data, data_dim))
}

#[wasm_bindgen(js_name = "grayScale")]
pub fn grayscale(data: &mut [u8], data_dim: Dimension) -> Result<Vec<u8>, JsValue> {
    Ok(operation::grayscale_image(data, data_dim))
}

#[wasm_bindgen(js_name = "sepia")]
pub fn sepia(data: &mut [u8], data_dim: Dimension) -> Result<Vec<u8>, JsValue> {
    Ok(operation::sepia(data, data_dim))
}

#[wasm_bindgen(js_name = "adjustBrightness")]
pub fn adjust_brightness(
    data: &mut [u8],
    data_dim: Dimension,
    value: f32,
) -> Result<Vec<u8>, JsValue> {
    Ok(operation::adjust_brightness(data, data_dim, value))
}

#[wasm_bindgen(js_name = "adjustContrast")]
pub fn adjust_contrast(
    data: &mut [u8],
    data_dim: Dimension,
    value: f32,
) -> Result<Vec<u8>, JsValue> {
    Ok(operation::adjust_contrast(data, data_dim, value))
}

#[wasm_bindgen(js_name = "adjustSaturation")]
pub fn adjust_saturation(
    data: &mut [u8],
    data_dim: Dimension,
    value: f32,
) -> Result<Vec<u8>, JsValue> {
    Ok(operation::adjust_saturation(data, data_dim, value))
}

#[wasm_bindgen(js_name = "sharpen")]
pub fn sharpen(data: &mut [u8], data_dim: Dimension, value: f64) -> Result<Vec<u8>, JsValue> {
    Ok(operation::sharpen(data, data_dim, value))
}

#[wasm_bindgen(js_name = "blur")]
pub fn blur(data: &mut [u8], data_dim: Dimension, radius: f64) -> Result<Vec<u8>, JsValue> {
    Ok(operation::blur(data, data_dim, radius))
}

#[wasm_bindgen(js_name = "emboss")]
pub fn emboss(data: &mut [u8], data_dim: Dimension, strength: f64) -> Result<Vec<u8>, JsValue> {
    Ok(operation::emboss(data, data_dim, strength))
}
