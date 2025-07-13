use wasm_bindgen::prelude::wasm_bindgen;

use crate::{
    draw::line::{LineOptions, draw as draw_line},
    enums::ShapeStyle,
    types::{Dimension, Point, RenderDimension, RenderPosition},
};

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct EllipseOptions {
    pub style: ShapeStyle,
    pub line_options: Option<LineOptions>,
    pub interpolate_segments: bool,
}

impl Default for EllipseOptions {
    fn default() -> Self {
        EllipseOptions {
            style: ShapeStyle::Filled,
            interpolate_segments: true,
            line_options: None,
        }
    }
}

#[wasm_bindgen]
impl EllipseOptions {
    #[wasm_bindgen(constructor)]
    pub fn new(
        style: ShapeStyle,
        line_options: Option<LineOptions>,
        interpolate_segments: bool,
    ) -> Self {
        EllipseOptions {
            style,
            line_options,
            interpolate_segments,
        }
    }
}

pub fn draw<F>(
    mut cb: F,
    data_dim: Dimension,
    position: RenderPosition,
    mut dimension: RenderDimension,
    stroke_size: usize,
    options: EllipseOptions,
) where
    F: FnMut(i32, i32, bool),
{
    let data_len = data_dim.x * data_dim.y * 4;

    dimension = dimension.abs();

    let center = RenderPosition {
        x: position.x + (dimension.x as i32) / 2,
        y: position.y + (dimension.y as i32) / 2,
    };
    dimension = RenderDimension {
        x: dimension.x / 2,
        y: dimension.y / 2,
    };

    if dimension.x == 0 || dimension.y == 0 {
        return;
    }

    if matches!(
        options.style,
        ShapeStyle::Filled | ShapeStyle::StrokedFilled
    ) {
        let a2_fill = (dimension.x as i64) * (dimension.x as i64);
        let b2_fill = (dimension.y as i64) * (dimension.y as i64);
        let fa2_fill = 4 * a2_fill;
        let fb2_fill = 4 * b2_fill;
        let mut x_fill: i32;
        let mut y_fill: i32;
        let mut sigma_fill: i64;

        x_fill = 0;
        y_fill = dimension.y;
        sigma_fill = 2 * b2_fill + a2_fill * (1 - 2 * (dimension.y as i64));

        while b2_fill * (x_fill as i64) <= a2_fill * (y_fill as i64) {
            let current_y_pos = center.y + y_fill;
            let current_y_neg = center.y - y_fill;

            for current_x in (center.x - x_fill)..=(center.x + x_fill) {
                let idx_pos = (current_y_pos as usize * data_dim.x + current_x as usize) * 4;
                if current_x >= 0
                    && current_x < data_dim.x as i32
                    && current_y_pos >= 0
                    && current_y_pos < data_dim.y as i32
                    && idx_pos + 3 < data_len
                {
                    cb(current_x, current_y_pos, false);
                }

                if y_fill != 0 {
                    let idx_neg = (current_y_neg as usize * data_dim.x + current_x as usize) * 4;
                    if current_x >= 0
                        && current_x < data_dim.x as i32
                        && current_y_neg >= 0
                        && current_y_neg < data_dim.y as i32
                        && idx_neg + 3 < data_len
                    {
                        cb(current_x, current_y_neg, false);
                    }
                }
            }

            if sigma_fill >= 0 {
                sigma_fill += fa2_fill * (1 - (y_fill as i64));
                y_fill -= 1;
            }
            sigma_fill += b2_fill * (4 * (x_fill as i64) + 6);
            x_fill += 1;
        }

        x_fill = dimension.x;
        y_fill = 0;
        sigma_fill = 2 * a2_fill + b2_fill * (1 - 2 * (dimension.x as i64));

        while a2_fill * (y_fill as i64) <= b2_fill * (x_fill as i64) {
            let current_y_pos = center.y + y_fill;
            let current_y_neg = center.y - y_fill;

            for current_x in (center.x - x_fill)..(center.x + x_fill) + 1 {
                let idx_pos = (current_y_pos as usize * data_dim.x + current_x as usize) * 4;
                if current_x >= 0
                    && current_x < data_dim.x as i32
                    && current_y_pos >= 0
                    && current_y_pos < data_dim.y as i32
                    && idx_pos + 3 < data_len
                {
                    cb(current_x, current_y_pos, false);
                }

                if y_fill != 0 {
                    let idx_neg = (current_y_neg as usize * data_dim.x + current_x as usize) * 4;
                    if current_x >= 0
                        && current_x < data_dim.x as i32
                        && current_y_neg >= 0
                        && current_y_neg < data_dim.y as i32
                        && idx_neg + 3 < data_len
                    {
                        cb(current_x, current_y_neg, false);
                    }
                }
            }

            if sigma_fill >= 0 {
                sigma_fill += fb2_fill * (1 - (x_fill as i64));
                x_fill -= 1;
            }
            sigma_fill += a2_fill * (4 * (y_fill as i64) + 6);
            y_fill += 1;
        }
    }

    if (matches!(
        options.style,
        ShapeStyle::Stroked | ShapeStyle::StrokedFilled
    )) && stroke_size > 0
    {
        let effective_segment_length = options
            .line_options
            .as_ref()
            .map_or(1, |o| o.segment_length)
            .max(0);
        let effective_gap_length = options
            .line_options
            .as_ref()
            .map_or(0, |o| o.gap_length)
            .max(0);

        let a2 = (dimension.x as i64) * (dimension.x as i64);
        let b2 = (dimension.y as i64) * (dimension.y as i64);
        let fa2 = 4 * a2;
        let fb2 = 4 * b2;
        let mut x: i32;
        let mut y: i32;
        let mut sigma: i64;

        let mut raw_ellipse_points: Vec<Point> = Vec::new();

        let mut add_point = |px: i32, py: i32| {
            if px >= 0 && px < data_dim.x as i32 && py >= 0 && py < data_dim.y as i32 {
                raw_ellipse_points.push(Point {
                    x: px as usize,
                    y: py as usize,
                });
            }
        };

        if effective_segment_length == 0 && effective_gap_length == 0 {
            x = 0;
            y = dimension.y;
            sigma = 2 * b2 + a2 * (1 - 2 * (dimension.y as i64));
            while b2 * (x as i64) <= a2 * (y as i64) {
                for _i in 0..stroke_size {
                    cb(center.x + x, center.y + y, true);
                    if x != 0 {
                        cb(center.x - x, center.y + y, true);
                    }
                    if y != 0 {
                        cb(center.x + x, center.y - y, true);
                    }
                    if x != 0 && y != 0 {
                        cb(center.x - x, center.y - y, true);
                    }
                }
                if sigma >= 0 {
                    sigma += fa2 * (1 - (y as i64));
                    y -= 1;
                }
                sigma += b2 * (4 * (x as i64) + 6);
                x += 1;
            }
            x = dimension.x;
            y = 0;
            sigma = 2 * a2 + b2 * (1 - 2 * (dimension.x as i64));
            while a2 * (y as i64) <= b2 * (x as i64) {
                for _i in 0..stroke_size {
                    cb(center.x + x, center.y + y, true);
                    if x != 0 {
                        cb(center.x - x, center.y + y, true);
                    }
                    if y != 0 {
                        cb(center.x + x, center.y - y, true);
                    }
                    if x != 0 && y != 0 {
                        cb(center.x - x, center.y - y, true);
                    }
                }
                if sigma >= 0 {
                    sigma += fb2 * (1 - (x as i64));
                    x -= 1;
                }
                sigma += a2 * (4 * (y as i64) + 6);
                y += 1;
            }
        } else {
            x = 0;
            y = dimension.y;
            sigma = 2 * b2 + a2 * (1 - 2 * (dimension.y as i64));
            while b2 * (x as i64) <= a2 * (y as i64) {
                add_point(center.x + x, center.y + y);
                if y != 0 {
                    add_point(center.x + x, center.y - y);
                }
                if x != 0 {
                    add_point(center.x - x, center.y + y);
                }
                if x != 0 && y != 0 {
                    add_point(center.x - x, center.y - y);
                }
                if sigma >= 0 {
                    sigma += fa2 * (1 - (y as i64));
                    y -= 1;
                }
                sigma += b2 * (4 * (x as i64) + 6);
                x += 1;
            }
            x = dimension.x;
            y = 0;
            sigma = 2 * a2 + b2 * (1 - 2 * (dimension.x as i64));
            while a2 * (y as i64) <= b2 * (x as i64) {
                add_point(center.x + x, center.y + y);
                if y != 0 {
                    add_point(center.x + x, center.y - y);
                }
                if x != 0 {
                    add_point(center.x - x, center.y + y);
                }
                if x != 0 && y != 0 {
                    add_point(center.x - x, center.y - y);
                }
                if sigma >= 0 {
                    sigma += fb2 * (1 - (x as i64));
                    x -= 1;
                }
                sigma += a2 * (4 * (y as i64) + 6);
                y += 1;
            }

            let mut unique_points_map: std::collections::HashMap<String, Point> =
                std::collections::HashMap::new();
            for p in raw_ellipse_points.drain(..) {
                let key = format!("{},{}", p.x, p.y);
                unique_points_map.entry(key).or_insert(p);
            }

            let mut final_points: Vec<Point> = unique_points_map.into_values().collect();

            final_points.sort_by(|a, b| {
                let angle_a = (a.y as f64 - center.y as f64).atan2(a.x as f64 - center.x as f64);
                let angle_b = (b.y as f64 - center.y as f64).atan2(b.x as f64 - center.x as f64);
                angle_a
                    .partial_cmp(&angle_b)
                    .unwrap_or(std::cmp::Ordering::Equal)
            });

            if final_points.is_empty() {
                return;
            }

            final_points.push(final_points[0]);

            let mut current_accumulated_distance = 0.0;
            let mut drawing = true;

            let mut line_start_x = final_points[0].x as i32;
            let mut line_start_y = final_points[0].y as i32;

            if effective_segment_length > 0 && !options.interpolate_segments {
                for _i in 0..stroke_size {
                    cb(line_start_x, line_start_y, true);
                }
            }

            for i in 1..final_points.len() {
                let current_x = final_points[i].x as i32;
                let current_y = final_points[i].y as i32;

                let prev_x_in_loop = final_points[i - 1].x as i32;
                let prev_y_in_loop = final_points[i - 1].y as i32;

                let step_length = (((current_x - prev_x_in_loop).pow(2)
                    + (current_y - prev_y_in_loop).pow(2))
                    as f64)
                    .sqrt();

                if step_length < 0.0001 {
                    continue;
                }

                current_accumulated_distance += step_length;

                if drawing {
                    if effective_segment_length == 0 {
                        drawing = false;
                        current_accumulated_distance = 0.0;
                        line_start_x = current_x;
                        line_start_y = current_y;
                        continue;
                    }

                    if current_accumulated_distance >= (effective_segment_length as f64) {
                        let overshoot =
                            current_accumulated_distance - (effective_segment_length as f64);
                        let interpolation_factor = (step_length - overshoot) / step_length;

                        let segment_end_point_x = (prev_x_in_loop as f64
                            + (current_x as f64 - prev_x_in_loop as f64) * interpolation_factor)
                            .round() as i32;
                        let segment_end_point_y = (prev_y_in_loop as f64
                            + (current_y as f64 - prev_y_in_loop as f64) * interpolation_factor)
                            .round() as i32;

                        if options.interpolate_segments {
                            for s in 0..stroke_size {
                                draw_line(
                                    |x, y| {
                                        cb(x, y, true);
                                    },
                                    RenderPosition {
                                        x: line_start_x + s as i32,
                                        y: line_start_y + s as i32,
                                    },
                                    RenderPosition {
                                        x: segment_end_point_x + s as i32,
                                        y: segment_end_point_y + s as i32,
                                    },
                                    options.line_options.clone(),
                                );
                            }
                        } else {
                            for _s in 0..stroke_size {
                                cb(segment_end_point_x, segment_end_point_y, true);
                            }
                        }

                        drawing = false;
                        current_accumulated_distance = overshoot;
                        line_start_x = segment_end_point_x;
                        line_start_y = segment_end_point_y;
                    } else {
                        if !options.interpolate_segments {
                            for _s in 0..stroke_size {
                                cb(current_x, current_y, true);
                            }
                        }
                    }
                } else {
                    if effective_gap_length == 0 {
                        drawing = true;
                        current_accumulated_distance = 0.0;
                        line_start_x = current_x;
                        line_start_y = current_y;
                        continue;
                    }

                    if current_accumulated_distance >= (effective_gap_length as f64) {
                        let overshoot =
                            current_accumulated_distance - (effective_gap_length as f64);
                        drawing = true;
                        current_accumulated_distance = overshoot;

                        let segment_start_x = (prev_x_in_loop as f64
                            + (current_x as f64 - prev_x_in_loop as f64)
                                * (step_length - overshoot)
                                / step_length)
                            .round() as i32;
                        let segment_start_y = (prev_y_in_loop as f64
                            + (current_y as f64 - prev_y_in_loop as f64)
                                * (step_length - overshoot)
                                / step_length)
                            .round() as i32;
                        line_start_x = segment_start_x;
                        line_start_y = segment_start_y;

                        if !options.interpolate_segments && effective_segment_length > 0 {
                            for _s in 0..stroke_size {
                                cb(line_start_x, line_start_y, true);
                            }
                        }
                    }
                }
            }

            if drawing && effective_segment_length > 0 && current_accumulated_distance > 0.001 {
                if options.interpolate_segments {
                    let first_point_x = final_points[0].x as i32;
                    let first_point_y = final_points[0].y as i32;
                    for s in 0..stroke_size {
                        draw_line(
                            |x, y| {
                                cb(x, y, true);
                            },
                            RenderPosition {
                                x: line_start_x + s as i32,
                                y: line_start_y + s as i32,
                            },
                            RenderPosition {
                                x: first_point_x + s as i32,
                                y: first_point_y + s as i32,
                            },
                            options.line_options.clone(),
                        );
                    }
                }
            }
        }
    }
}
