use image::imageops;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{types, utils};

#[wasm_bindgen(js_name = "invert")]
pub fn invert_image(data: &mut [u8], data_dim: types::Dimension) {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");

    imageops::colorops::invert(&mut img);
}

#[wasm_bindgen(js_name = "grayScale")]
pub fn grayscale_image_in_place(data: &mut [u8], data_dim: types::Dimension) {
    let width = data_dim.x as u32;
    let height = data_dim.y as u32;

    let num_pixels = (width * height) as usize;

    for i in 0..num_pixels {
        let pixel_start_index = i * 4;

        if pixel_start_index + 3 < data.len() {
            let r = data[pixel_start_index] as f32;
            let g = data[pixel_start_index + 1] as f32;
            let b = data[pixel_start_index + 2] as f32;

            let gray_value = (0.299 * r + 0.587 * g + 0.114 * b).round() as u8;

            data[pixel_start_index] = gray_value;
            data[pixel_start_index + 1] = gray_value;
            data[pixel_start_index + 2] = gray_value;
        } else {
            break;
        }
    }
}

#[wasm_bindgen(js_name = "sepia")]
pub fn sepia_image(data: &mut [u8]) {
    for i in (0..data.len()).step_by(4) {
        let r = data[i] as f32;
        let g = data[i + 1] as f32;
        let b = data[i + 2] as f32;

        let new_r = (r * 0.393 + g * 0.769 + b * 0.189)
            .round()
            .clamp(0.0, 255.0) as u8;
        let new_g = (r * 0.349 + g * 0.686 + b * 0.168)
            .round()
            .clamp(0.0, 255.0) as u8;
        let new_b = (r * 0.272 + g * 0.534 + b * 0.131)
            .round()
            .clamp(0.0, 255.0) as u8;

        data[i] = new_r;
        data[i + 1] = new_g;
        data[i + 2] = new_b;
    }
}

#[wasm_bindgen(js_name = "adjustBrightness")]
pub fn adjust_brightness_image(data: &mut [u8], data_dim: types::Dimension, value: f32) {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");

    imageops::colorops::brighten_in_place(&mut img, (value * 255.0) as i32);
}

#[wasm_bindgen(js_name = "adjustContrast")]
pub fn adjust_contrast_image(data: &mut [u8], data_dim: types::Dimension, value: f32) {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");

    imageops::colorops::contrast_in_place(&mut img, value * 255.0);
}

#[wasm_bindgen(js_name = "adjustSaturation")]
pub fn adjust_saturation_image(data: &mut [u8], factor: f32) {
    for i in (0..data.len()).step_by(4) {
        let r = data[i] as f32;
        let g = data[i + 1] as f32;
        let b = data[i + 2] as f32;

        let gray = 0.299 * r + 0.587 * g + 0.114 * b;

        data[i] = (gray + (r - gray) * factor).round().clamp(0.0, 255.0) as u8;
        data[i + 1] = (gray + (g - gray) * factor).round().clamp(0.0, 255.0) as u8;
        data[i + 2] = (gray + (b - gray) * factor).round().clamp(0.0, 255.0) as u8;
    }
}

#[wasm_bindgen(js_name = "sharpen")]
pub fn sharpen_image(data: &mut [u8], data_dim: types::Dimension, radius: f32, threshold: i32) {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");

    let sharpened_image = imageops::unsharpen(&mut img, radius, threshold);
    data.copy_from_slice(sharpened_image.as_raw());
}

#[wasm_bindgen(js_name = "blur")]
pub fn blur_image(data: &mut [u8], data_dim: types::Dimension, sigma: f32) {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");

    let blurred_image = imageops::blur(&mut img, sigma);
    data.copy_from_slice(blurred_image.as_raw());
}

#[wasm_bindgen(js_name = "emboss")]
pub fn emboss_image(data: &mut [u8], data_dim: types::Dimension, strength: f32) {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");

    let kernel = [
        -2.0 * strength,
        -strength,
        0.0,
        -strength,
        1.0,
        strength,
        0.0,
        strength,
        2.0 * strength,
    ];

    let mut rgba_convolved = imageops::filter3x3(&mut img, &kernel);

    for pixel in rgba_convolved.pixels_mut() {
        pixel[0] = (pixel[0] as i16 + 128).clamp(0, 255) as u8;
        pixel[1] = (pixel[1] as i16 + 128).clamp(0, 255) as u8;
        pixel[2] = (pixel[2] as i16 + 128).clamp(0, 255) as u8;
    }

    data.copy_from_slice(rgba_convolved.as_raw());
}
