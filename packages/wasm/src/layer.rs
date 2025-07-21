use crate::{
    enums,
    types::{self},
};
use serde::Deserialize;
use wasm_bindgen::prelude::*;

#[derive(Debug)]
pub struct Layer {
    pub data: Vec<u8>,
    pub blend_mode: enums::BlendMode,
    pub opacity: f32,
}

pub fn merge_layers(
    data: &mut [u8],
    data_dim: types::Dimension,
    layers: &[Layer],
    clean: bool,
) -> Result<(), String> {
    if layers.is_empty() {
        return Err("No layers to merge".to_string());
    }

    let num_pixels = data_dim.x * data_dim.y;
    let expected_data_len = num_pixels * 4;

    if clean {
        let mut_slice: &mut [u8] = data;
        mut_slice.fill(0);
    }

    for (layer_idx, layer) in layers.iter().enumerate() {
        if layer.data.len() != expected_data_len {
            return Err(format!(
                "Layer {} data size ({}) does not match expected dimensions ({}). Expected RGBA format.",
                layer_idx,
                layer.data.len(),
                expected_data_len
            ));
        }

        let layer_opacity = layer.opacity.max(0.0).min(1.0);

        for i in 0..num_pixels {
            let base_idx = i * 4;

            let pixel = get_pixel(data, data_dim, i % data_dim.x, i / data_dim.x).unwrap();
            let base_r = pixel.r as f32;
            let base_g = pixel.g as f32;
            let base_b = pixel.b as f32;
            let base_a = pixel.a as f32 / 255.0;

            let overlay_r = layer.data[base_idx] as f32;
            let overlay_g = layer.data[base_idx + 1] as f32;
            let overlay_b = layer.data[base_idx + 2] as f32;
            let overlay_a = layer.data[base_idx + 3] as f32 / 255.0;

            let effective_overlay_alpha = overlay_a * layer_opacity;

            let (out_r, out_g, out_b);
            let out_a;

            match layer.blend_mode {
                enums::BlendMode::Normal => {
                    out_r = overlay_r * effective_overlay_alpha
                        + base_r * (1.0 - effective_overlay_alpha);
                    out_g = overlay_g * effective_overlay_alpha
                        + base_g * (1.0 - effective_overlay_alpha);
                    out_b = overlay_b * effective_overlay_alpha
                        + base_b * (1.0 - effective_overlay_alpha);

                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::Multiply => {
                    out_r = (base_r * overlay_r) / 255.0;
                    out_g = (base_g * overlay_g) / 255.0;
                    out_b = (base_b * overlay_b) / 255.0;
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::Screen => {
                    out_r = 255.0 - ((255.0 - base_r) * (255.0 - overlay_r)) / 255.0;
                    out_g = 255.0 - ((255.0 - base_g) * (255.0 - overlay_g)) / 255.0;
                    out_b = 255.0 - ((255.0 - base_b) * (255.0 - overlay_b)) / 255.0;
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::Overlay => {
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
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::Darken => {
                    out_r = base_r.min(overlay_r);
                    out_g = base_g.min(overlay_g);
                    out_b = base_b.min(overlay_b);
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::Lighten => {
                    out_r = base_r.max(overlay_r);
                    out_g = base_g.max(overlay_g);
                    out_b = base_b.max(overlay_b);
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::ColorDodge => {
                    let blend_channel = |b_c: f32, o_c: f32| -> f32 {
                        if o_c == 255.0 {
                            255.0
                        } else {
                            (b_c / (255.0 - o_c) * 255.0).min(255.0)
                        }
                    };
                    out_r = blend_channel(base_r, overlay_r);
                    out_g = blend_channel(base_g, overlay_g);
                    out_b = blend_channel(base_b, overlay_b);
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::ColorBurn => {
                    let blend_channel = |b_c: f32, o_c: f32| -> f32 {
                        if o_c == 0.0 {
                            0.0
                        } else {
                            (255.0 - ((255.0 - b_c) / o_c) * 255.0).max(0.0)
                        }
                    };
                    out_r = blend_channel(base_r, overlay_r);
                    out_g = blend_channel(base_g, overlay_g);
                    out_b = blend_channel(base_b, overlay_b);
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::HardLight => {
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
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::SoftLight => {
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
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::Difference => {
                    out_r = (base_r - overlay_r).abs();
                    out_g = (base_g - overlay_g).abs();
                    out_b = (base_b - overlay_b).abs();
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
                enums::BlendMode::Exclusion => {
                    out_r = base_r + overlay_r - (2.0 * base_r * overlay_r) / 255.0;
                    out_g = base_g + overlay_g - (2.0 * base_g * overlay_g) / 255.0;
                    out_b = base_b + overlay_b - (2.0 * base_b * overlay_b) / 255.0;
                    out_a = effective_overlay_alpha + base_a * (1.0 - effective_overlay_alpha);
                }
            }

            let final_r = out_r.max(0.0).min(255.0);
            let final_g = out_g.max(0.0).min(255.0);
            let final_b = out_b.max(0.0).min(255.0);
            let final_a = out_a.max(0.0).min(1.0) * 255.0;

            put_pixel(
                data,
                data_dim,
                i % data_dim.x,
                i / data_dim.x,
                types::Color {
                    r: final_r as u8,
                    g: final_g as u8,
                    b: final_b as u8,
                    a: final_a as u8,
                },
            );
        }
    }

    Ok(())
}

fn get_pixel(
    data: &mut [u8],
    data_dim: types::Dimension,
    x: usize,
    y: usize,
) -> Option<types::Color> {
    if x < data_dim.x && y < data_dim.y {
        let index = (y * data_dim.x + x) * 4;
        if index + 3 < data.len() {
            Some(types::Color {
                r: data[index],
                g: data[index + 1],
                b: data[index + 2],
                a: data[index + 3],
            })
        } else {
            None
        }
    } else {
        None
    }
}

fn put_pixel(
    data: &mut [u8],
    data_dim: types::Dimension,
    x: usize,
    y: usize,
    color: types::Color,
) -> Option<()> {
    if x < data_dim.x && y < data_dim.y {
        let index = (y * data_dim.x + x) * 4;
        if index + 3 < data.len() {
            data[index] = color.r;
            data[index + 1] = color.g;
            data[index + 2] = color.b;
            data[index + 3] = color.a;
            Some(())
        } else {
            None
        }
    } else {
        None
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Deserialize)]
pub struct WasmLayer {
    #[wasm_bindgen(skip)]
    pub data: Vec<u8>,
    pub blend_mode: enums::BlendMode,
    pub opacity: f32,
}

#[wasm_bindgen]
impl WasmLayer {
    #[wasm_bindgen(constructor)]
    pub fn new(data: Vec<u8>, blend_mode: enums::BlendMode, opacity: f32) -> Self {
        WasmLayer {
            data,
            blend_mode,
            opacity,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn data(&self) -> Box<[u8]> {
        self.data.clone().into_boxed_slice()
    }
}

#[wasm_bindgen(js_name = "mergeLayers")]
pub fn merge_layers_wasm(
    data: &mut [u8],
    data_dim: types::Dimension,
    layers: Box<[WasmLayer]>,
    clean: bool,
) -> Result<(), JsValue> {
    let mut prepared_layers: Vec<Layer> = Vec::with_capacity(layers.len());

    for (_layer_idx, layer_js_val) in layers.iter().enumerate() {
        let wasm_layer: WasmLayer = layer_js_val.clone();

        prepared_layers.push(Layer {
            data: wasm_layer.data,
            blend_mode: wasm_layer.blend_mode,
            opacity: wasm_layer.opacity,
        });
    }
    merge_layers(data, data_dim, &prepared_layers, clean).map_err(|e| JsValue::from_str(&e))?;

    Ok(())
}
