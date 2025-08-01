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
    pub seed: u64,
}

impl Default for RectangleOptions {
    fn default() -> Self {
        RectangleOptions {
            style: ShapeStyle::Stroked,
            line_options: None,
            stroke_align: StrokeAlign::Center,
            seed: 0,
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
        seed: u64,
    ) -> Self {
        RectangleOptions {
            style,
            stroke_align,
            line_options,
            seed,
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
    let fill_pos_x = position.x;
    let fill_pos_y = position.y;
    let fill_dim_x = dimension.x;
    let fill_dim_y = dimension.y;

    let brush_size_f32 = brush_size as f32;
    let brush_size: i32 = brush_size as i32;
    let half_brush_size = (brush_size_f32 / 2.0).round() as i32;

    if matches!(
        options.style,
        ShapeStyle::Filled | ShapeStyle::StrokedFilled
    ) {
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

    if matches!(
        options.style,
        ShapeStyle::Stroked | ShapeStyle::StrokedFilled
    ) {
        let stroke_align = options.stroke_align;
        let line_options = options.line_options;

        let rect_x1 = position.x as i32;
        let rect_y1 = position.y as i32;
        let rect_x2 = (position.x + dimension.x) as i32;
        let rect_y2 = (position.y + dimension.y) as i32;

        let line_center_offset = match stroke_align {
            StrokeAlign::Inside => [0, -brush_size],
            StrokeAlign::Center => {
              if half_brush_size % 2 == 0 {
                [-half_brush_size, -half_brush_size]
              } else {
                [-half_brush_size, 0]
              }
            },
            StrokeAlign::Outside => [-brush_size, 0],
        };

        let mut line_pixel_cb = |x: i32, y: i32| {
            cb(x, y, true);
        };

        draw_line(
            &mut line_pixel_cb,
            RenderPosition {
                x: rect_x1 + line_center_offset[0],
                y: rect_y1 + line_center_offset[0],
            },
            RenderPosition {
                x: rect_x2 + line_center_offset[1],
                y: rect_y1 + line_center_offset[0],
            },
            line_options,
        );

        draw_line(
            &mut line_pixel_cb,
            RenderPosition {
                x: rect_x1 + line_center_offset[0],
                y: rect_y2 + line_center_offset[1],
            },
            RenderPosition {
                x: rect_x2 + line_center_offset[1],
                y: rect_y2 + line_center_offset[1],
            },
            line_options,
        );

        draw_line(
            &mut line_pixel_cb,
            RenderPosition {
                x: rect_x1 + line_center_offset[0],
                y: rect_y1 + line_center_offset[0],
            },
            RenderPosition {
                x: rect_x1 + line_center_offset[0],
                y: rect_y2 + line_center_offset[1],
            },
            line_options,
        );

        draw_line(
            &mut line_pixel_cb,
            RenderPosition {
                x: rect_x2 + line_center_offset[1],
                y: rect_y1 + line_center_offset[0],
            },
            RenderPosition {
                x: rect_x2 + line_center_offset[1],
                y: rect_y2 + line_center_offset[1],
            },
            line_options,
        );
    }
}
