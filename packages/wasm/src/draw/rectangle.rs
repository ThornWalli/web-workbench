use wasm_bindgen::prelude::wasm_bindgen;

use crate::draw::line::LineOptions;
use crate::draw::line::draw as draw_line;
use crate::enums::{ShapeStyle, StrokeAlign};
use crate::types::Dimension;
use crate::types::RenderDimension;
use crate::types::RenderPosition;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct RectangleOptions {
    pub style: ShapeStyle,
    pub line_options: Option<LineOptions>,
    pub stroke_align: StrokeAlign,
}

impl Default for RectangleOptions {
    fn default() -> Self {
        RectangleOptions {
            style: ShapeStyle::Stroked,
            line_options: None,
            stroke_align: StrokeAlign::Center,
        }
    }
}

#[wasm_bindgen]
impl RectangleOptions {
    #[wasm_bindgen(constructor)]
    pub fn new(
        style: ShapeStyle,
        stroke_align: StrokeAlign,
        line_options: Option<LineOptions>,
    ) -> Self {
        RectangleOptions {
            style,
            stroke_align,
            line_options,
        }
    }
}

pub fn draw<F>(
    mut cb: F,
    data_dim: Dimension,
    position: RenderPosition,
    dimension: RenderDimension,
    brush_size: usize, // This is your stroke width
    options: RectangleOptions,
) where
    F: FnMut(i32, i32, bool),
{
    // --- Calculate adjusted fill dimensions ---
    let mut fill_pos_x = position.x;
    let mut fill_pos_y = position.y;
    let mut fill_dim_x = dimension.x;
    let mut fill_dim_y = dimension.y;

    // Only adjust fill if the style involves a stroke that affects the fill area
    if matches!(options.style, ShapeStyle::StrokedFilled) {
        let stroke_half_width = (brush_size as f32 / 2.0).round() as i32;

        match options.stroke_align {
            StrokeAlign::Inside => {
                // Stroke is inside, so fill is smaller
                fill_pos_x += brush_size as i32;
                fill_pos_y += brush_size as i32;
                fill_dim_x = fill_dim_x.saturating_sub(brush_size as i32 * 2);
                fill_dim_y = fill_dim_y.saturating_sub(brush_size as i32 * 2);
            }
            StrokeAlign::Center => {
                // Stroke is half-inside, half-outside. Fill is slightly smaller.
                fill_pos_x += stroke_half_width;
                fill_pos_y += stroke_half_width;
                fill_dim_x = fill_dim_x.saturating_sub(stroke_half_width * 2);
                fill_dim_y = fill_dim_y.saturating_sub(stroke_half_width * 2);
            }
            StrokeAlign::Outside => {
                // Stroke is outside, fill uses the original dimensions.
                // No adjustment needed for fill_pos/dim, as stroke is drawn outwards.
            }
        }
        // Ensure dimensions don't become negative
        fill_dim_x = fill_dim_x.max(0);
        fill_dim_y = fill_dim_y.max(0);
    }

    // --- FILLING LOGIC (uses adjusted dimensions) ---
    if matches!(
        options.style,
        ShapeStyle::Filled | ShapeStyle::StrokedFilled
    ) {
        // Use the adjusted fill dimensions here
        let start_x = fill_pos_x.min(data_dim.x as i32);
        let end_x = (fill_pos_x + fill_dim_x).min(data_dim.x as i32);
        let start_y = fill_pos_y.min(data_dim.y as i32);
        let end_y = (fill_pos_y + fill_dim_y).min(data_dim.y as i32);

        if start_x < end_x && start_y < end_y {
            for y_idx in start_y..end_y {
                for col in start_x..end_x {
                    cb(col as i32, y_idx as i32, false);
                }
            }
        }
    }

    // --- STROKE LOGIC (remains mostly the same, uses original position/dimension for its base) ---
    if matches!(
        options.style,
        ShapeStyle::Stroked | ShapeStyle::StrokedFilled
    ) {
        let stroke_align = options.stroke_align;
        let line_options = options.line_options;

        let rect_x1 = position.x as i32;
        let rect_y1 = position.y as i32;
        let rect_x2 = (position.x + dimension.x) as i32 - 1;
        let rect_y2 = (position.y + dimension.y) as i32 - 1;

        for s in 0..brush_size {
            let current_stroke_offset_x = match stroke_align {
                StrokeAlign::Inside => s as i32,
                StrokeAlign::Center => s as i32 - (brush_size as f32 / 2.0).round() as i32,
                StrokeAlign::Outside => -(s as i32),
            };
            let current_stroke_offset_y = current_stroke_offset_x; // Assuming symmetric stroke

            let mut line_pixel_cb = |x: i32, y: i32| {
                cb(x, y, true);
            };

            // Top line
            draw_line(
                &mut line_pixel_cb,
                RenderPosition {
                    x: rect_x1 + current_stroke_offset_x,
                    y: rect_y1 + current_stroke_offset_y,
                },
                RenderPosition {
                    x: rect_x2 - current_stroke_offset_x,
                    y: rect_y1 + current_stroke_offset_y,
                },
                line_options,
            );

            // Bottom line
            draw_line(
                &mut line_pixel_cb,
                RenderPosition {
                    x: rect_x1 + current_stroke_offset_x,
                    y: rect_y2 - current_stroke_offset_y,
                },
                RenderPosition {
                    x: rect_x2 - current_stroke_offset_x,
                    y: rect_y2 - current_stroke_offset_y,
                },
                line_options,
            );

            // Left line
            draw_line(
                &mut line_pixel_cb,
                RenderPosition {
                    x: rect_x1 + current_stroke_offset_x,
                    y: rect_y1 + current_stroke_offset_y + 1,
                }, // +1 to prevent double-drawing corner pixel
                RenderPosition {
                    x: rect_x1 + current_stroke_offset_x,
                    y: rect_y2 - current_stroke_offset_y - 1,
                }, // -1 to prevent double-drawing corner pixel
                line_options,
            );

            // Right line
            draw_line(
                &mut line_pixel_cb,
                RenderPosition {
                    x: rect_x2 - current_stroke_offset_x,
                    y: rect_y1 + current_stroke_offset_y + 1,
                }, // +1
                RenderPosition {
                    x: rect_x2 - current_stroke_offset_x,
                    y: rect_y2 - current_stroke_offset_y - 1,
                }, // -1
                line_options,
            );
        }
    }
}
