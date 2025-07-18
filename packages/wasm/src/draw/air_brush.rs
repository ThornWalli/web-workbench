use rand::{rngs::StdRng, Rng, SeedableRng};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::types::{Color, Dimension, RenderPosition};

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct AirBurshOptions {
    pub is_round: bool,
    pub num_dots: u32,
    pub max_alpha_factor: f64,
    pub seed: u64,
}

impl Default for AirBurshOptions {
    fn default() -> Self {
        AirBurshOptions {
            is_round: false,
            num_dots: 10,
            max_alpha_factor: 1.0,
            seed: 0,
        }
    }
}

#[wasm_bindgen]
impl AirBurshOptions {
    #[wasm_bindgen(constructor)]
    pub fn new(is_round: bool, num_dots: u32, max_alpha_factor: f64, seed: u64) -> Self {
        AirBurshOptions {
            is_round,
            num_dots,
            max_alpha_factor,
            seed
        }
    }
}

pub fn draw<F>(
    mut cb: F,
    position: RenderPosition,
    dimension: Dimension,
    color: Color,
    options: AirBurshOptions,
) where
    F: FnMut(i32, i32, Color),
{
    let max_alpha_factor = options.max_alpha_factor / 1 as f64;
    let mut brush_width = dimension.x;
    let mut brush_height = dimension.y;

    brush_width = brush_width.max(1);
    brush_height = brush_height.max(1);

    let len = (brush_width * brush_height * 4) as usize;

    let brush_r = color.r;
    let brush_g = color.g;
    let brush_b = color.b;
    let brush_a = color.a;

    if options.is_round && brush_width == 1 && brush_height == 1 {
        cb(
            position.x,
            position.y,
            Color {
                r: brush_r,
                g: brush_g,
                b: brush_b,
                a: (brush_a as f64 * max_alpha_factor).round() as u8,
            },
        );
    }

    let center_x = brush_width as f64 / 2.0;
    let center_y = brush_height as f64 / 2.0;

    let effective_radius = (brush_width.min(brush_height)) as f64 / 2.0;

    let mut rng: StdRng = StdRng::seed_from_u64(options.seed);

    for _i in 0..options.num_dots {
        let dot_x: f64;
        let dot_y: f64;
        let dot_alpha: u8;

        if options.is_round {
            let angle = rng.random::<f64>() * 2.0 * std::f64::consts::PI;
            let dist = rng.random::<f64>() * effective_radius;

            dot_x = center_x + dist * angle.cos();
            dot_y = center_y + dist * angle.sin();

            let distance_to_center =
                ((dot_x - center_x).powi(2) + (dot_y - center_y).powi(2)).sqrt();

            let clamped_distance_to_center = distance_to_center.min(effective_radius);
            let alpha_multiplier = 1.0 - clamped_distance_to_center / effective_radius;

            dot_alpha = (brush_a as f64 * alpha_multiplier * max_alpha_factor).round() as u8;

            if dot_x < 0.0
                || dot_x >= brush_width as f64
                || dot_y < 0.0
                || dot_y >= brush_height as f64
            {
                continue;
            }

            let dot_x_int = dot_x.round() as usize;
            let dot_y_int = dot_y.round() as usize;

            if dot_x_int >= brush_width || dot_y_int >= brush_height {
                continue;
            }

            let index = (dot_y_int * brush_width + dot_x_int) * 4;
            if index + 3 < len {
                cb(
                    position.x + dot_x_int as i32,
                    position.y + dot_y_int as i32,
                    Color {
                        r: brush_r,
                        g: brush_g,
                        b: brush_b,
                        a: dot_alpha,
                    },
                );
            }
        } else {
            dot_x = (rng.random::<f64>() * brush_width as f64).floor();
            dot_y = (rng.random::<f64>() * brush_height as f64).floor();

            dot_alpha = (brush_a as f64 * max_alpha_factor).round() as u8;

            let dot_x_int = dot_x as usize;
            let dot_y_int = dot_y as usize;

            if dot_x_int >= brush_width || dot_y_int >= brush_height {
                continue;
            }

            let index = (dot_y_int * brush_width + dot_x_int) * 4;
            if index + 3 < len {
                cb(
                    position.x + dot_x_int as i32,
                    position.y + dot_y_int as i32,
                    Color {
                        r: brush_r,
                        g: brush_g,
                        b: brush_b,
                        a: dot_alpha,
                    },
                );
            }
        }
    }
}
