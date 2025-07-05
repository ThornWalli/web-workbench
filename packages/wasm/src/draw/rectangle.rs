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
    brush_size: usize,
    options: RectangleOptions,
) where
    F: FnMut(i32, i32, bool),
{
    if matches!(
        options.style,
        ShapeStyle::Filled | ShapeStyle::StrokedFilled
    ) {
        let start_x = position.x.min(data_dim.x as i32);
        let end_x = (position.x + dimension.x).min(data_dim.x as i32);
        let start_y = position.y.min(data_dim.y as i32);
        let end_y = (position.y + dimension.y).min(data_dim.y as i32);

        if start_x < end_x && start_y < end_y {
            for y_idx in start_y..end_y {
                for col in start_x..end_x {
                    cb(col as i32, y_idx as i32, false);
                }
            }
        }
    }

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
            let current_stroke_offset_y = current_stroke_offset_x;

            let mut line_pixel_cb = |x: i32, y: i32| {
                cb(x, y, true);
            };

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

            draw_line(
                &mut line_pixel_cb,
                RenderPosition {
                    x: rect_x1 + current_stroke_offset_x,
                    y: rect_y1 + current_stroke_offset_y + 1,
                },
                RenderPosition {
                    x: rect_x1 + current_stroke_offset_x,
                    y: rect_y2 - current_stroke_offset_y - 1,
                },
                line_options,
            );

            draw_line(
                &mut line_pixel_cb,
                RenderPosition {
                    x: rect_x2 - current_stroke_offset_x,
                    y: rect_y1 + current_stroke_offset_y + 1,
                },
                RenderPosition {
                    x: rect_x2 - current_stroke_offset_x,
                    y: rect_y2 - current_stroke_offset_y - 1,
                },
                line_options,
            );
        }
    }
}
