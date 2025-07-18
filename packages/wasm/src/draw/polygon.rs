use wasm_bindgen::prelude::wasm_bindgen;

use crate::{
    draw::line::{self, LineOptions},
    enums::ShapeStyle,
    types::RenderPosition,
};

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct PolygonOptions {
    pub style: ShapeStyle,
    pub line_options: Option<LineOptions>,
    pub seed: u64,
}
impl Default for PolygonOptions {
    fn default() -> Self {
        PolygonOptions {
            style: ShapeStyle::Stroked,
            line_options: Some(LineOptions {
                segment_length: 1,
                gap_length: 0,
                seed: 0,
            }),
            seed: 0,
        }
    }
}

#[wasm_bindgen]
impl PolygonOptions {
    #[wasm_bindgen(constructor)]
    pub fn new(style: ShapeStyle, line_options: Option<LineOptions>, seed: u64) -> Self {
        PolygonOptions {
            style,
            line_options,
            seed,
        }
    }
}

pub fn draw<F>(mut pixel_cb: F, points: &[RenderPosition], options: PolygonOptions)
where
    F: FnMut(i32, i32, bool),
{
    if points.len() < 2 {
        return;
    }

    let stroke_only = matches!(options.style, crate::enums::ShapeStyle::Stroked);
    let fill_only = matches!(options.style, crate::enums::ShapeStyle::Filled);
    let stroked_filled = matches!(options.style, crate::enums::ShapeStyle::StrokedFilled);

    if fill_only || stroked_filled {
        let mut min_y = std::i32::MAX;
        let mut max_y = std::i32::MIN;
        for p in points.iter() {
            min_y = min_y.min(p.y);
            max_y = max_y.max(p.y);
        }

        for y in min_y..=max_y {
            let mut intersections = Vec::new();

            for i in 0..points.len() {
                let p1 = points[i];
                let p2 = points[(i + 1) % points.len()];

                if (p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y) {
                    let x_intersect = (p1.x as f64
                        + (y - p1.y) as f64 * (p2.x - p1.x) as f64 / (p2.y - p1.y) as f64)
                        as i32;
                    intersections.push(x_intersect);
                }
            }

            intersections.sort_unstable();

            for i in (0..intersections.len()).step_by(2) {
                if i + 1 < intersections.len() {
                    let start_x = intersections[i];
                    let end_x = intersections[i + 1];

                    for x in start_x..=end_x {
                        pixel_cb(x, y, false);
                    }
                }
            }
        }
    }

    if stroke_only || stroked_filled {
        for i in 0..points.len() {
            let p1 = points[i];
            let p2 = points[(i + 1) % points.len()];

            let mut stroke_line_cb = |x_line: i32, y_line: i32| {
                pixel_cb(x_line, y_line, true);
            };

            line::draw(&mut stroke_line_cb, p1, p2, options.line_options);
        }
    }
}
