use image::{RgbaImage};
use std::io::Cursor;

// /// Represents different blending modes for layers.
// #[derive(Debug, Clone, Copy)]
// pub enum LayerBlendMode {
//     Normal,
//     Multiply,
//     Screen,
//     Overlay,
//     Darken,
//     Lighten,
//     ColorDodge,
//     ColorBurn,
//     HardLight,
//     SoftLight,
//     Difference,
//     Exclusion,
// }

#[derive(Debug)]
pub struct Layer {
    pub blend_mode: LayerBlendMode,
    pub data: Vec<u8>, // Assuming RGBA format, so 4 bytes per pixel
}

impl Layer {
    pub fn new(blend_mode: LayerBlendMode, data: Vec<u8>) -> Self {
        Layer { blend_mode, data }
    }
}

pub fn merge_layers(
    data: &mut [u8],
    data_dim: types::Dimension,
    layers: &[Layer],
    width: u32,
    height: u32,
) -> Result<Vec<u8>, String> {
    if layers.is_empty() {
        return Err("No layers to merge".to_string());
    }

    let num_pixels = (width * height) as usize;
    let expected_data_len = num_pixels * 4; // 4 bytes per pixel (RGBA)

    // Initial merged image: completely transparent black
    let mut merged_rgba = RgbaImage::from_pixel(width, height, image::Rgba([0, 0, 0, 0]));

    for (layer_idx, layer) in layers.iter().enumerate() {
        if layer.data.len() != expected_data_len {
            return Err(format!(
                "Layer {} data size ({}) does not match expected dimensions ({}). Expected RGBA format.",
                layer_idx, layer.data.len(), expected_data_len
            ));
        }

        // Iterate over each pixel to apply the blending mode
        for i in 0..num_pixels {
            let base_idx = i * 4; // Index for current pixel in merged_rgba

            let base_r = merged_rgba.get_pixel(i as u32 % width, i as u32 / width)[0] as f32;
            let base_g = merged_rgba.get_pixel(i as u32 % width, i as u32 / width)[1] as f32;
            let base_b = merged_rgba.get_pixel(i as u32 % width, i as u32 / width)[2] as f32;
            let base_a = merged_rgba.get_pixel(i as u32 % width, i as u32 / width)[3] as f32 / 255.0; // Alpha as 0.0-1.0

            let overlay_r = layer.data[base_idx] as f32;
            let overlay_g = layer.data[base_idx + 1] as f32;
            let overlay_b = layer.data[base_idx + 2] as f32;
            let overlay_a = layer.data[base_idx + 3] as f32 / 255.0; // Alpha as 0.0-1.0

            let (mut out_r, mut out_g, mut out_b); // Declare mutable output colors
            let out_a; // Declare output alpha

            match layer.blend_mode {
                LayerBlendMode::Normal => {
                    // Standard Alpha-Blending (Source Over)
                    out_r = overlay_r * overlay_a + base_r * base_a * (1.0 - overlay_a);
                    out_g = overlay_g * overlay_a + base_g * base_a * (1.0 - overlay_a);
                    out_b = overlay_b * overlay_a + base_b * base_a * (1.0 - overlay_a);
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::Multiply => {
                    out_r = (base_r * overlay_r) / 255.0;
                    out_g = (base_g * overlay_g) / 255.0;
                    out_b = (base_b * overlay_b) / 255.0;
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::Screen => {
                    out_r = 255.0 - ((255.0 - base_r) * (255.0 - overlay_r)) / 255.0;
                    out_g = 255.0 - ((255.0 - base_g) * (255.0 - overlay_g)) / 255.0;
                    out_b = 255.0 - ((255.0 - base_b) * (255.0 - overlay_b)) / 255.0;
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::Overlay => {
                    let blend_channel = |b_c: f32, o_c: f32| -> f32 {
                        if b_c < 128.0 {
                            (2.0 * b_c * o_c) / 255.0
                        } else {
                            255.0 - (2.0 * (255.0 - b_c) * (255.0 - o_c)) / 255.0
                        }
                    };
                    out_r = blend_channel(base_r, overlay_r);
                    out_g = blend_channel(base_g, overlay_g);
                    out_b = blend_channel(base_b, overlay_b);
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::Darken => {
                    out_r = base_r.min(overlay_r);
                    out_g = base_g.min(overlay_g);
                    out_b = base_b.min(overlay_b);
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::Lighten => {
                    out_r = base_r.max(overlay_r);
                    out_g = base_g.max(overlay_g);
                    out_b = base_b.max(overlay_b);
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::ColorDodge => {
                    let blend_channel = |b_c: f32, o_c: f32| -> f32 {
                        if o_c == 255.0 { 255.0 } else { (b_c / (255.0 - o_c) * 255.0).min(255.0) }
                    };
                    out_r = blend_channel(base_r, overlay_r);
                    out_g = blend_channel(base_g, overlay_g);
                    out_b = blend_channel(base_b, overlay_b);
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::ColorBurn => {
                    let blend_channel = |b_c: f32, o_c: f32| -> f32 {
                        if o_c == 0.0 { 0.0 } else { (255.0 - ((255.0 - b_c) / o_c) * 255.0).max(0.0) }
                    };
                    out_r = blend_channel(base_r, overlay_r);
                    out_g = blend_channel(base_g, overlay_g);
                    out_b = blend_channel(base_b, overlay_b);
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::HardLight => {
                    let blend_channel = |b_c: f32, o_c: f32| -> f32 {
                        if o_c < 128.0 {
                            (2.0 * b_c * o_c) / 255.0
                        } else {
                            255.0 - (2.0 * (255.0 - b_c) * (255.0 - o_c)) / 255.0
                        }
                    };
                    out_r = blend_channel(base_r, overlay_r);
                    out_g = blend_channel(base_g, overlay_g);
                    out_b = blend_channel(base_b, overlay_b);
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::SoftLight => {
                    let blend_channel = |b_c: f32, o_c: f32| -> f32 {
                        let o_c_norm = o_c / 255.0;
                        let b_c_norm = b_c / 255.0;

                        if o_c_norm < 0.5 {
                            b_c_norm * (o_c_norm * (2.0 * b_c_norm + 1.0) + (1.0 - 2.0 * b_c_norm))
                        } else {
                            b_c_norm + (2.0 * o_c_norm - 1.0) * (b_c_norm - b_c_norm * b_c_norm)
                        }
                    };
                    out_r = blend_channel(base_r, overlay_r) * 255.0;
                    out_g = blend_channel(base_g, overlay_g) * 255.0;
                    out_b = blend_channel(base_b, overlay_b) * 255.0;
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::Difference => {
                    out_r = (base_r - overlay_r).abs();
                    out_g = (base_g - overlay_g).abs();
                    out_b = (base_b - overlay_b).abs();
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
                LayerBlendMode::Exclusion => {
                    out_r = base_r + overlay_r - (2.0 * base_r * overlay_r) / 255.0;
                    out_g = base_g + overlay_g - (2.0 * base_g * overlay_g) / 255.0;
                    out_b = base_b + overlay_b - (2.0 * base_b * overlay_b) / 255.0;
                    out_a = overlay_a + base_a * (1.0 - overlay_a);
                },
            }

            // Apply overlay's alpha to the color blend (final composition)
            // This ensures the blended color is correctly applied with the overlay's transparency
            let final_r = (out_r * overlay_a + base_r * (1.0 - overlay_a)).max(0.0).min(255.0);
            let final_g = (out_g * overlay_a + base_g * (1.0 - overlay_a)).max(0.0).min(255.0);
            let final_b = (out_b * overlay_a + base_b * (1.0 - overlay_a)).max(0.0).min(255.0);
            let final_a = (out_a * 255.0).max(0.0).min(255.0); // Convert alpha back to 0-255 range

            // Update the pixel in the merged image
            merged_rgba.put_pixel(i as u32 % width, i as u32 / width, image::Rgba([
                final_r as u8,
                final_g as u8,
                final_b as u8,
                final_a as u8,
            ]));
        }
    }

    Ok(merged_rgba.to_vec())
    // Convert the RgbaImage to PNG bytes
    // let mut output_buffer = Cursor::new(Vec::new());
    // merged_rgba.write_to(&mut output_buffer, ImageOutputFormat::Png)
    //     .map_err(|e| format!("Failed to encode image to PNG: {}", e))?; // Return String error

    // Ok(output_buffer.into_inner())
}


use wasm_bindgen::prelude::*;
use serde::{Deserialize};

use crate::types;

// Re-export LayerBlendMode and Layer, but add Deserialize for the WASM binding
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, Deserialize)]
#[serde(rename_all = "camelCase")] // Maps "Normal" to "normal", "ColorDodge" to "colorDodge" etc.
pub enum LayerBlendMode {
    Normal,
    Multiply,
    Screen,
    Overlay,
    Darken,
    Lighten,
    ColorDodge,
    ColorBurn,
    HardLight,
    SoftLight,
    Difference,
    Exclusion,
}

// Layer for WASM binding (must be Deserialize to be passed from JS)
#[derive(Debug, Deserialize)]
pub struct WasmLayer {
    pub blend_mode: LayerBlendMode,
    pub data: Vec<u8>, // Serde can directly deserialize Uint8Array from JS to Vec<u8>
}

#[wasm_bindgen(js_name = "mergeLayers")]
pub fn merge_layers_wasm(
    data: &mut [u8],
    data_dim: types::Dimension,
    layers_js: Box<[JsValue]>, // Array of JavaScript objects
    width: u32,
    height: u32,
) -> Result<Vec<u8>, JsValue> {
    // 1. Convert JsValue array to Rust Layer structs
    let mut rust_layers: Vec<Layer> = Vec::with_capacity(layers_js.len());

    for (layer_idx, layer_js_val) in layers_js.iter().enumerate() {
        // Deserialize each JsValue into our WasmLayer struct
        let wasm_layer: WasmLayer = serde_wasm_bindgen::from_value(layer_js_val.clone())
            .map_err(|e| JsValue::from_str(&format!("Failed to deserialize Layer {}: {}", layer_idx, e)))?;

        // Convert WasmLayer to your pure Rust Layer struct
        rust_layers.push(Layer {
            blend_mode: wasm_layer.blend_mode,
            data: wasm_layer.data,
        });
    }

    // 2. Call the pure Rust function with the converted data
    merge_layers(&rust_layers, width, height)
        .map_err(|e| JsValue::from_str(&e)) // Convert Rust String error to JsValue
}

// Make sure your Cargo.toml has:
// [dependencies]
// wasm-bindgen = "0.2"
// image = { version = "0.25", default-features = false, features = ["png"] }
// serde = { version = "1.0", features = ["derive"] }
// serde-wasm-bindgen = "0.6"
