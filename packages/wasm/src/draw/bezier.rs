use wasm_bindgen::prelude::wasm_bindgen;

use crate::{
    draw::line::{self, LineOptions}, types::{RenderPosition},
};

#[wasm_bindgen]
pub struct BezierOptions {
    pub segment_length: f64,
    pub gap_length: f64,
    pub interpolate_segments: bool,
}

impl Default for BezierOptions {
    fn default() -> Self {
        BezierOptions {
            segment_length: 1.0,
            gap_length: 0.0,
            interpolate_segments: true,
        }
    }
}

#[wasm_bindgen]
impl BezierOptions {
    #[wasm_bindgen(constructor)]
    pub fn new(segment_length: f64, gap_length: f64, interpolate_segments: bool) -> Self {
        BezierOptions {
            segment_length,
            gap_length,
            interpolate_segments,
        }
    }
}

pub fn draw<F>(
    mut cb: F,
    x1: f64,
    y1: f64,
    x2: f64,
    y2: f64,
    x3: f64,
    y3: f64,
    x4: f64,
    y4: f64,
    options: Option<BezierOptions>,
) where
    F: FnMut(i32, i32),
{
    let options_unwrapped = options.unwrap_or_default();
    let effective_segment_length = options_unwrapped.segment_length;
    let effective_gap_length = options_unwrapped.gap_length;
    let interpolate_segments = options_unwrapped.interpolate_segments;

    if effective_segment_length == 0.0 && effective_gap_length == 0.0 {
        cb(x1.round() as i32, y1.round() as i32);
        return;
    }

    let mut prev_curve_x = x1;
    let mut prev_curve_y = y1;
    let mut current_accumulated_distance = 0.0;
    let mut drawing = true;

    let mut line_start_x = x1;
    let mut line_start_y = y1;

    if effective_segment_length > 0.0 && !interpolate_segments {
        cb(x1.round() as i32, y1.round() as i32);
    }

    const STEP_SIZE: f64 = 0.001;
    let mut u = STEP_SIZE;

    while u <= 1.0 {
        let u_squared = u * u;
        let u_cubed = u_squared * u;
        let one_minus_u = 1.0 - u;
        let one_minus_u_squared = one_minus_u * one_minus_u;
        let one_minus_u_cubed = one_minus_u_squared * one_minus_u;

        let xu = one_minus_u_cubed * x1
            + 3.0 * u * one_minus_u_squared * x2
            + 3.0 * u_squared * one_minus_u * x3
            + u_cubed * x4;
        let yu = one_minus_u_cubed * y1
            + 3.0 * u * one_minus_u_squared * y2
            + 3.0 * u_squared * one_minus_u * y3
            + u_cubed * y4;

        let distance_of_step = ((xu - prev_curve_x).powi(2) + (yu - prev_curve_y).powi(2)).sqrt();

        if distance_of_step < 0.0001 && u < 1.0 {
            prev_curve_x = xu;
            prev_curve_y = yu;
            u += STEP_SIZE;
            continue;
        }

        current_accumulated_distance += distance_of_step;

        if drawing {
            if effective_segment_length == 0.0 {
                drawing = false;
                current_accumulated_distance = 0.0;
                line_start_x = xu;
                line_start_y = yu;
                prev_curve_x = xu;
                prev_curve_y = yu;
                u += STEP_SIZE;
                continue;
            }

            if current_accumulated_distance >= effective_segment_length {
                let overshoot = current_accumulated_distance - effective_segment_length;
                let interpolation_factor = (distance_of_step - overshoot) / distance_of_step;

                let segment_end_point_x = prev_curve_x + (xu - prev_curve_x) * interpolation_factor;
                let segment_end_point_y = prev_curve_y + (yu - prev_curve_y) * interpolation_factor;

                if interpolate_segments {
                    draw_line_in_u_int8_cl_array(
                        line_start_x,
                        line_start_y,
                        segment_end_point_x,
                        segment_end_point_y,
                        &mut cb,
                    );
                } else {
                    cb(
                        segment_end_point_x.round() as i32,
                        segment_end_point_y.round() as i32,
                    );
                }

                drawing = false;
                current_accumulated_distance = overshoot;
                line_start_x = segment_end_point_x;
                line_start_y = segment_end_point_y;
            } else {
                if !interpolate_segments {
                    cb(xu.round() as i32, yu.round() as i32);
                }
            }
        } else {
            if effective_gap_length == 0.0 {
                drawing = true;
                current_accumulated_distance = 0.0;
                line_start_x = xu;
                line_start_y = yu;
                prev_curve_x = xu;
                prev_curve_y = yu;
                u += STEP_SIZE;
                continue;
            }

            if current_accumulated_distance >= effective_gap_length {
                let overshoot = current_accumulated_distance - effective_gap_length;
                drawing = true;
                current_accumulated_distance = overshoot;

                let segment_start_x = prev_curve_x
                    + (xu - prev_curve_x) * ((distance_of_step - overshoot) / distance_of_step);
                let segment_start_y = prev_curve_y
                    + (yu - prev_curve_y) * ((distance_of_step - overshoot) / distance_of_step);
                line_start_x = segment_start_x;
                line_start_y = segment_start_y;

                if !interpolate_segments && effective_segment_length > 0.0 {
                    cb(line_start_x.round() as i32, line_start_y.round() as i32);
                }
            }
        }

        prev_curve_x = xu;
        prev_curve_y = yu;
        u += STEP_SIZE;
    }

    if drawing && effective_segment_length > 0.0 {
        if interpolate_segments {
            draw_line_in_u_int8_cl_array(
                line_start_x,
                line_start_y,
                prev_curve_x,
                prev_curve_y,
                &mut cb,
            );
        }
    }
}

fn draw_line_in_u_int8_cl_array<F>(start_x: f64, start_y: f64, end_x: f64, end_y: f64, cb: F)
where
    F: FnMut(i32, i32),
{
    let start_x_i = start_x.round() as i32;
    let start_y_i = start_y.round() as i32;
    let end_x_i = end_x.round() as i32;
    let end_y_i = end_y.round() as i32;

    line::draw(
        cb,
        RenderPosition {
            x: start_x_i,
            y: start_y_i,
        },
        RenderPosition {
            x: end_x_i,
            y: end_y_i,
        },
        Some(LineOptions {
            segment_length: 1,
            gap_length: 0,
        }),
    );
}
