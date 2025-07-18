use wasm_bindgen::prelude::wasm_bindgen;

use crate::types::RenderPosition;

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct LineOptions {
    pub segment_length: usize,
    pub gap_length: usize,
    pub seed: u64,
}

impl Default for LineOptions {
    fn default() -> Self {
        LineOptions {
            segment_length: 1,
            gap_length: 0,
            seed: 0,
        }
    }
}

#[wasm_bindgen]
impl LineOptions {
    #[wasm_bindgen(constructor)]
    pub fn new(segment_length: usize, gap_length: usize, seed: u64) -> Self {
        LineOptions {
            segment_length,
            gap_length,
            seed,
        }
    }
}

pub fn draw<F>(mut cb: F, start: RenderPosition, end: RenderPosition, options: Option<LineOptions>)
where
    F: FnMut(i32, i32),
{
    let options_unwrapped = options.unwrap_or_default();
    let segment_length = options_unwrapped.segment_length;
    let gap_length = options_unwrapped.gap_length;

    let dx = (end.x - start.x).abs();
    let dy = -(end.y - start.y).abs();
    let sx = if start.x < end.x { 1 } else { -1 };
    let sy = if start.y < end.y { 1 } else { -1 };
    let mut err = dx + dy;

    let effective_segment_length = segment_length.max(0);
    let effective_gap_length = gap_length.max(0);
    let pattern_length = effective_segment_length + effective_gap_length;

    let mut pixels_drawn_in_pattern = 0;

    let mut current: RenderPosition = start.clone();

    loop {
        if effective_segment_length == 0 && effective_gap_length == 0 {
            cb(current.x, current.y);
            break;
        }

        let in_segment = pixels_drawn_in_pattern < effective_segment_length;

        if in_segment {
            cb(current.x, current.y);
        }

        pixels_drawn_in_pattern += 1;

        if pattern_length > 0 && pixels_drawn_in_pattern >= pattern_length {
            pixels_drawn_in_pattern = 0;
        }

        if current.x == end.x && current.y == end.y {
            break;
        }

        let e2 = 2 * err;

        if e2 >= dy {
            err += dy;
            current.x += sx;
        }
        if e2 <= dx {
            err += dx;
            current.y += sy;
        }
    }
}
