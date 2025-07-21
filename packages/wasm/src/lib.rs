mod brush;
mod debug;
mod draw;
mod enums;
mod image_operation;
mod pixel;
mod types;
mod utils;
mod layer;

use std::{collections::HashSet, sync::Mutex};
use image::imageops;
use wasm_bindgen::{JsValue, prelude::wasm_bindgen};

#[wasm_bindgen(js_name = "initBrush")]
pub fn init_brush(
    brush_mode: enums::BrushMode,
    solid_type: enums::SolidType,
    size: usize,
    primary_color: types::Color,
    secondary_color: types::Color,
) -> Result<(), JsValue> {
    let brush = brush::WasmBrush::solid(brush_mode, solid_type, size, primary_color, secondary_color);
    if brush::GLOBAL_BRUSH.set(Mutex::new(Box::new(brush))).is_err() {
        return Err(JsValue::from_str(
            "Global brush already initialized. Call 'setBrush' to update it.",
        ));
    }
    Ok(())
}

#[wasm_bindgen(js_name = "setBrushSolid")]
pub fn set_brush_solid(
    brush_mode: enums::BrushMode,
    solid_type: enums::SolidType,
    size: usize,
    primary_color: types::Color,
    secondary_color: types::Color,
) -> Result<(), JsValue> {
    let brush = brush::WasmBrush::solid(brush_mode, solid_type, size, primary_color, secondary_color);
    if let Some(mutex) = brush::GLOBAL_BRUSH.get() {
        let mut global_brush_guard = mutex.lock().map_err(|e| {
            JsValue::from_str(&format!("Failed to lock global painter mutex: {:?}", e))
        })?;
        *global_brush_guard = Box::new(brush);
        Ok(())
    } else {
        Err(JsValue::from_str(
            "Global brush not initialized. Call 'initBrush' first.",
        ))
    }
}

#[wasm_bindgen(js_name = "setBrushDots")]
pub fn set_brush_dots(
    brush_mode: enums::BrushMode,
    dimension: types::Dimension,
    primary_color: types::Color,
    secondary_color: types::Color,
) -> Result<(), JsValue> {
    let brush = brush::WasmBrush::dots(brush_mode, dimension, primary_color, secondary_color);
    if let Some(mutex) = brush::GLOBAL_BRUSH.get() {
        let mut global_brush_guard = mutex.lock().map_err(|e| {
            JsValue::from_str(&format!("Failed to lock global painter mutex: {:?}", e))
        })?;
        *global_brush_guard = Box::new(brush);
        Ok(())
    } else {
        Err(JsValue::from_str(
            "Global brush not initialized. Call 'initBrush' first.",
        ))
    }
}

#[wasm_bindgen(js_name = "setBrushData")]
pub fn set_brush_data(
    brush_mode: enums::BrushMode,
    stroke_image_data: Vec<u8>,
    stroke_image_dimension: types::Dimension,
    primary_color: types::Color,
    secondary_color: types::Color,
) -> Result<(), JsValue> {
    let brush: brush::WasmBrush = brush::WasmBrush::from_data(
        brush_mode,
        stroke_image_data,
        stroke_image_dimension,
        primary_color,
        secondary_color,
    );
    if let Some(mutex) = brush::GLOBAL_BRUSH.get() {
        let mut global_brush_guard = mutex.lock().map_err(|e| {
            JsValue::from_str(&format!("Failed to lock global painter mutex: {:?}", e))
        })?;
        *global_brush_guard = Box::new(brush);
        Ok(())
    } else {
        Err(JsValue::from_str(
            "Global brush not initialized. Call 'initBrush' first.",
        ))
    }
}

#[wasm_bindgen(js_name = "getPixels")]
pub fn get_pixels(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
    dimension: types::Dimension,
) -> Result<Vec<u8>, JsValue> {
    Ok(pixel::get_pixels(data, data_dim, position, dimension))
}

#[wasm_bindgen(js_name = "setPixels")]
pub fn set_pixels(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
    partial_data: &[u8],
    partial_data_dim: types::Dimension,
    brush_mode: enums::BrushMode,
) -> Result<(), JsValue> {
    pixel::set_pixels(
        data,
        data_dim,
        position,
        partial_data,
        partial_data_dim,
        brush_mode,
    );

    Ok(())
}

#[wasm_bindgen(js_name = "resize")]
pub fn resize(
    data: &mut [u8],
    data_dim: types::Dimension,
    target_dim: types::Dimension,
    resize_type: enums::ResizeType,
) -> Result<Vec<u8>, JsValue> {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");

    let filter_type;
    match resize_type {
        enums::ResizeType::NearestNeighbor => {
            filter_type = image::imageops::FilterType::Nearest;
        }
        enums::ResizeType::Bilinear => {
            filter_type = image::imageops::FilterType::Triangle;
        }
        enums::ResizeType::Bicubic => {
            filter_type = image::imageops::FilterType::CatmullRom;
        }
        enums::ResizeType::Lanczos3 => {
            filter_type = image::imageops::FilterType::Lanczos3;
        }
    }

    Ok(image::imageops::resize(
        &mut img,
        target_dim.x as u32,
        target_dim.y as u32,
        filter_type,
    )
    .into_raw())
}

#[wasm_bindgen(js_name = "insertImage")]
pub fn insert_image(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
    partial_data: &[u8],
    partial_data_dim: types::Dimension,
) -> Result<(), JsValue> {
    if data.len() != (data_dim.x * data_dim.y * 4) as usize {
        return Err(JsValue::from_str("Invalid length of the data slice."));
    }
    if partial_data.len() != (partial_data_dim.x * partial_data_dim.y * 4) as usize {
        return Err(JsValue::from_str(
            "Invalid length of the partial data slice.",
        ));
    }

    blit_image(data, data_dim, partial_data, partial_data_dim, position)
        .map_err(|e| JsValue::from_str(e))?;

    Ok(())
}

pub fn blit_image(
    target_data: &mut [u8],
    target_dim: types::Dimension,
    source_data: &[u8],
    source_dim: types::Dimension,
    dest_position: types::Point,
) -> Result<(), &'static str> {
    if target_data.len() != (target_dim.x * target_dim.y * 4) as usize {
        return Err("Invalid length of the target data slice.");
    }
    if source_data.len() != (source_dim.x * source_dim.y * 4) as usize {
        return Err("Invalid length of the source data slice.");
    }

    for src_y in 0..source_dim.y {
        for src_x in 0..source_dim.x {
            let target_pixel_x = dest_position.x + src_x;
            let target_pixel_y = dest_position.y + src_y;

            if target_pixel_x >= target_dim.x || target_pixel_y >= target_dim.y {
                continue;
            }

            let source_idx = ((src_y * source_dim.x + src_x) * 4) as usize;
            let target_idx = ((target_pixel_y * target_dim.x + target_pixel_x) * 4) as usize;

            let src_r = source_data[source_idx] as f32;
            let src_g = source_data[source_idx + 1] as f32;
            let src_b = source_data[source_idx + 2] as f32;
            let src_a = source_data[source_idx + 3] as f32;

            let dest_r = target_data[target_idx] as f32;
            let dest_g = target_data[target_idx + 1] as f32;
            let dest_b = target_data[target_idx + 2] as f32;
            let dest_a = target_data[target_idx + 3] as f32;

            if src_a == 0.0 {
                continue;
            } else if src_a == 255.0 {
                target_data[target_idx] = src_r as u8;
                target_data[target_idx + 1] = src_g as u8;
                target_data[target_idx + 2] = src_b as u8;
                target_data[target_idx + 3] = src_a as u8;
            } else {
                let alpha_norm = src_a / 255.0;
                let inv_alpha_norm = 1.0 - alpha_norm;

                let final_r = (src_r * alpha_norm + dest_r * inv_alpha_norm).round() as u8;
                let final_g = (src_g * alpha_norm + dest_g * inv_alpha_norm).round() as u8;
                let final_b = (src_b * alpha_norm + dest_b * inv_alpha_norm).round() as u8;

                let final_a = (src_a * alpha_norm + dest_a * inv_alpha_norm).round() as u8;

                target_data[target_idx] = final_r;
                target_data[target_idx + 1] = final_g;
                target_data[target_idx + 2] = final_b;
                target_data[target_idx + 3] = final_a;
            }
        }
    }

    Ok(())
}

#[wasm_bindgen(js_name = "clear")]
pub fn clear(data: &mut [u8], data_dim: types::Dimension) -> Result<(), JsValue> {
    if data.len() != (data_dim.x * data_dim.y * 4) as usize {
        return Err(JsValue::from_str("Invalid length of the data slice."));
    }

    for pixel in data.chunks_exact_mut(4) {
        pixel[0] = 0; // R
        pixel[1] = 0; // G
        pixel[2] = 0; // B
        pixel[3] = 0; // A
    }

    Ok(())
}

#[wasm_bindgen(js_name = "getColors")]
pub fn get_colors(data: &mut [u8]) -> Result<Vec<String>, JsValue> {
    let mut colors = HashSet::new();
    for i in (0..data.len()).step_by(4) {
        if i + 3 < data.len() {
            let color = types::Color::new(data[i], data[i + 1], data[i + 2], data[i + 3]);
            colors.insert(color.to_hex());
        } else {
            return Err(JsValue::from_str(
                "Invalid data slice length. Expected a multiple of 4.",
            ));
        }
    }
    Ok(colors.into_iter().collect())
}

#[wasm_bindgen(js_name = "flip")]
pub fn flip_image(data: &mut [u8], data_dim: types::Dimension, flip_type: enums::FlipType) -> Vec<u8> {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");
    let flipped_img = match flip_type {
        enums::FlipType::Horizontal => imageops::flip_horizontal(&mut img),
        enums::FlipType::Vertical => imageops::flip_vertical(&mut img),
    };

    flipped_img.to_vec()
}

#[wasm_bindgen(js_name = "rotate")]
pub fn rotate_image(data: &mut [u8], data_dim: types::Dimension, rotate_type: enums::RotateType) -> types::RotateDescription {
    let mut img = utils::rgba8_slice_to_image_buffer(data, data_dim)
        .expect("Invalid data length for RGBA image dimensions.");
    let rotated_img = match rotate_type {
        enums::RotateType::Rotate90Degrees => imageops::rotate90(&mut img),
        enums::RotateType::Rotate180Degrees => imageops::rotate180(&mut img),
        enums::RotateType::Rotate270Degrees => imageops::rotate270(&mut img),
    };

    types::RotateDescription {
        dimension: types::Dimension {
            x: rotated_img.width() as usize,
            y: rotated_img.height() as usize,
        },
        data: rotated_img.to_vec()
    }
}
