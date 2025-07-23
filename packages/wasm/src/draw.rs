use std::{cell::RefCell, rc::Rc};

use rand::Rng;
use wasm_bindgen::{JsValue, prelude::wasm_bindgen};

use crate::{
    brush::{self, BrushTrait},
    draw::{self},
    enums::{self},
    pixel::{self, set_pixels},
    types,
};

pub mod air_brush;
pub mod bezier;
pub mod ellipse;
pub mod fill;
pub mod line;
pub mod polygon;
pub mod rectangle;

#[wasm_bindgen(js_name = "drawBrush")]
pub fn draw_brush(
    data: &mut [u8],
    data_dimension: types::Dimension,
    position: types::Point,
    seed: u64,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));
    let brush_mutex = brush::GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    brush_ref
        .brush
        .draw(&mut *data_borrow, data_dimension, position, seed);
    Ok(())
}

#[wasm_bindgen(js_name = "drawBezier")]
pub fn draw_curve(
    data: &mut [u8],
    data_dim: types::Dimension,
    start: types::Point,
    start_helper: types::Point,
    end: types::Point,
    end_helper: types::Point,
    options: Option<draw::bezier::BezierOptions>,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));
    let data_dim_for_cb = data_dim;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let mut opts = options.unwrap_or_default();
    if opts.segment_length == 0.0 {
        opts.segment_length = 1.0;
    }

    let seed = opts.seed;

    draw::bezier::draw(
        |x, y| {
            let brush_mutex = brush::GLOBAL_BRUSH
                .get()
                .expect("Brush not initialized in callback.");
            let mut brush_guard = brush_mutex
                .lock()
                .expect("Failed to lock brush in callback.");
            let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;

            brush_ref.brush.draw(
                &mut *data_borrow,
                data_dim_for_cb,
                types::Point {
                    x: x as usize,
                    y: y as usize,
                },
                seed,
            );
        },
        start.x as f64,
        start.y as f64,
        start_helper.x as f64,
        start_helper.y as f64,
        end_helper.x as f64,
        end_helper.y as f64,
        end.x as f64,
        end.y as f64,
        Some(opts),
    );

    Ok(())
}

#[wasm_bindgen(js_name = "drawLine")]
pub fn draw_line(
    data: &mut [u8],
    data_dim: types::Dimension,
    start: types::Point,
    end: types::Point,
    options: Option<draw::line::LineOptions>,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));
    let data_dim_for_cb = data_dim;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let mut opts = options.unwrap_or_default();
    if opts.segment_length == 0 {
        opts.segment_length = 1;
    }

    draw::line::draw(
        |x, y| {
            let brush_mutex = brush::GLOBAL_BRUSH
                .get()
                .expect("Brush not initialized in callback.");
            let mut brush_guard = brush_mutex
                .lock()
                .expect("Failed to lock brush in callback.");
            let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;

            brush_ref.brush.draw(
                &mut *data_borrow,
                data_dim_for_cb,
                types::Point {
                    x: x as usize,
                    y: y as usize,
                },
                opts.seed,
            );
        },
        start.to_render_point(),
        end.to_render_point(),
        Some(opts),
    );
    Ok(())
}

#[wasm_bindgen(js_name = "drawPolygon")]
pub fn draw_polygon(
    data: &mut [u8],
    data_dim: types::Dimension,
    points: Vec<types::Point>,
    opts: draw::polygon::PolygonOptions,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));
    let data_dim_for_cb = data_dim;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let pixel_setter = move |x: i32, y: i32, is_stroke| {
        let brush_mutex = brush::GLOBAL_BRUSH
            .get()
            .expect("Brush not initialized in callback.");
        let mut brush_guard = brush_mutex
            .lock()
            .expect("Failed to lock brush in callback.");
        let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;

        let position = types::Point {
            x: x as usize,
            y: y as usize,
        };

        if is_stroke {
            brush_ref
                .brush
                .draw(&mut *data_borrow, data_dim_for_cb, position, opts.seed);
        } else {
            let target_pixel_idx = ((y as usize) * data_dim_for_cb.x + (x as usize)) * 4;
            if target_pixel_idx + 3 >= data_borrow.len() {
                return;
            }

            pixel::set_pixels(
                &mut *data_borrow,
                data_dim_for_cb,
                position,
                &brush_ref.brush.secondary_color.to_data(),
                types::Dimension { x: 1, y: 1 },
                brush_ref.brush.brush_mode,
            );
        }
    };

    let render_points: Vec<types::RenderPosition> = points
        .into_iter()
        .map(|p: types::Point| types::RenderPosition {
            x: p.x as i32,
            y: p.y as i32,
        })
        .collect();

    draw::polygon::draw(pixel_setter, &render_points, opts);

    Ok(())
}

#[wasm_bindgen(js_name = "drawRectangle")]
pub fn draw_rectangle(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
    dimension: types::Dimension,
    opts: draw::rectangle::RectangleOptions,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));

    let brush_mutex = brush::GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;
    let size = brush_ref.brush.dimension.x;
    let brush_mode = brush_ref.brush.brush_mode;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let only_filled = opts.style == enums::ShapeStyle::Filled;

    let pixel_setter = move |x, y, is_stroke| {
        let position = types::Point {
            x: x as usize,
            y: y as usize,
        };
        if is_stroke {
            brush_ref
                .brush
                .draw(&mut *data_borrow, data_dim, position, opts.seed);
        } else {
            let color = if only_filled {
                brush_ref.brush.primary_color.to_data()
            } else {
                brush_ref.brush.secondary_color.to_data()
            };

            pixel::set_pixels(
                &mut *data_borrow,
                data_dim,
                position,
                &color,
                types::Dimension { x: 1, y: 1 },
                brush_mode,
            );
        }
    };

    draw::rectangle::draw(
        pixel_setter,
        data_dim,
        position.to_render_point(),
        dimension.to_viewport_dimension(),
        size,
        opts,
    );
    Ok(())
}

#[wasm_bindgen(js_name = "drawEllipse")]
pub fn draw_ellipse(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
    dimension: types::Dimension,
    opts: draw::ellipse::EllipseOptions,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));

    let brush_mutex = brush::GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;
    let size = brush_ref.brush.dimension.x;
    let brush_mode = brush_ref.brush.brush_mode;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let pixel_setter = move |x, y, is_stroke| {
        let position = types::Point {
            x: x as usize,
            y: y as usize,
        };
        if is_stroke {
            let offset_x = (size as isize) / 2;
            let offset_y = (size as isize) / 2;

            let x = position.x - offset_x as usize;
            let y = position.y - offset_y as usize;
            brush_ref.brush.draw(
                &mut *data_borrow,
                data_dim,
                types::Point { x, y },
                opts.seed,
            );
        } else {
            pixel::set_pixels(
                &mut *data_borrow,
                data_dim,
                position,
                &brush_ref.brush.secondary_color.to_data(),
                types::Dimension { x: 1, y: 1 },
                brush_mode,
            );
        }
    };

    draw::ellipse::draw(
        pixel_setter,
        data_dim,
        position.to_render_point(),
        dimension.to_viewport_dimension(),
        opts,
    );
    Ok(())
}

#[wasm_bindgen(js_name = "drawDots")]
pub fn draw_dots(size: types::Dimension, seed: u64) -> Result<Box<[u8]>, JsValue> {
    let ellipse_opts = draw::ellipse::EllipseOptions {
        style: enums::ShapeStyle::Filled,
        line_options: None,
        interpolate_segments: false,
        seed,
    };

    let brush_mutex = brush::GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;

    let data = &mut vec![0; (size.x * size.y * 4) as usize];
    let data_dim = types::Dimension {
        x: size.x as usize,
        y: size.y as usize,
    };

    draw::ellipse::draw(
        |x, y, _is_stroke| {
            pixel::set_pixels(
                &mut *data,
                data_dim,
                types::Point {
                    x: x as usize,
                    y: y as usize,
                },
                &brush_ref.brush.primary_color.to_data(),
                types::Dimension { x: 1, y: 1 },
                brush_ref.brush.brush_mode,
            );
        },
        size,
        types::RenderPosition { x: 0, y: 0 },
        size.to_viewport_dimension(),
        ellipse_opts,
    );

    let mut rng = rand::rng();

    let avg_size = ((size.x as f64) + (size.y as f64)) / 2.0;
    let threshold = 0.25 / avg_size;
    for i in (0..data.len()).step_by(4) {
        if data[i + 3] > 0 && rng.random::<f64>() < threshold {
        } else {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 0;
        }
    }

    Ok(data.clone().into_boxed_slice())
}

#[wasm_bindgen(js_name = "drawFill")]
pub fn draw_fill(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
) -> Result<(), JsValue> {
    let dim = data_dim.to_viewport_dimension();

    let brush_mutex = brush::GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;
    let color = brush_ref.brush.primary_color;

    draw::fill::draw(
        move |x, y, color, is_check| {
            let pixel_idx = ((x + y * dim.x) as usize) * 4;

            if pixel_idx + 3 >= data.len() {
                return types::Color {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0,
                };
            }

            if is_check {
                types::Color {
                    r: data[pixel_idx],
                    g: data[pixel_idx + 1],
                    b: data[pixel_idx + 2],
                    a: data[pixel_idx + 3],
                }
            } else {
                set_pixels(
                    data,
                    data_dim,
                    types::Point {
                        x: x as usize,
                        y: y as usize,
                    },
                    &brush_ref.brush.primary_color.to_data(),
                    types::Dimension { x: 1, y: 1 },
                    brush_ref.brush.brush_mode,
                );
                // data[pixel_idx] = color.r;
                // data[pixel_idx + 1] = color.g;
                // data[pixel_idx + 2] = color.b;
                // data[pixel_idx + 3] = color.a;

                color
            }
        },
        data_dim.to_viewport_dimension(),
        position.to_render_point(),
        color,
    );

    Ok(())
}

#[wasm_bindgen(js_name = "drawAirBrush")]
pub fn draw_air_brush(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
    dimension: types::Dimension,
    opts: draw::air_brush::AirBurshOptions,
) -> Result<(), JsValue> {
    let brush_mutex = brush::GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut brush::WasmBrush = &mut *brush_guard;

    draw::air_brush::draw(
        |mut x, mut y, color| {
            let offset_x = (dimension.x as isize) / 2;
            let offset_y = (dimension.y as isize) / 2;

            x -= offset_x as i32;
            y -= offset_y as i32;

            if x >= 0 && x < (data_dim.x as i32) && y >= 0 && y < (data_dim.y as i32) {
                let target_pixel_idx = ((y as usize) * data_dim.x + (x as usize)) * 4;
                if target_pixel_idx + 3 < data.len() {
                    let src_r = color.r as f64;
                    let src_g = color.g as f64;
                    let src_b = color.b as f64;
                    let src_a = (color.a as f64) / 255.0;

                    let dest_r = data[target_pixel_idx] as f64;
                    let dest_g = data[target_pixel_idx + 1] as f64;
                    let dest_b = data[target_pixel_idx + 2] as f64;
                    let dest_a = (data[target_pixel_idx + 3] as f64) / 255.0;

                    let out_a = src_a + dest_a * (1.0 - src_a);

                    let (_out_r, _out_g, _out_b) = if out_a > 0.0001 {
                        (
                            (src_r * src_a + dest_r * dest_a * (1.0 - src_a)) / out_a,
                            (src_g * src_a + dest_g * dest_a * (1.0 - src_a)) / out_a,
                            (src_b * src_a + dest_b * dest_a * (1.0 - src_a)) / out_a,
                        )
                    } else {
                        (0.0, 0.0, 0.0)
                    };

                    set_pixels(
                        data,
                        data_dim,
                        types::Point {
                            x: x as usize,
                            y: y as usize,
                        },
                        &types::Color {
                            r: _out_r.round() as u8,
                            g: _out_g.round() as u8,
                            b: _out_b.round() as u8,
                            a: (out_a * 255.0).round() as u8,
                        }
                        .to_data(),
                        types::Dimension { x: 1, y: 1 },
                        brush_ref.brush.brush_mode,
                    );
                    // data[target_pixel_idx] = out_r.round() as u8;
                    // data[target_pixel_idx + 1] = out_g.round() as u8;
                    // data[target_pixel_idx + 2] = out_b.round() as u8;
                    // data[target_pixel_idx + 3] = (out_a * 255.0).round() as u8;
                }
            }
        },
        position.to_render_point(),
        dimension,
        brush_ref.brush.primary_color,
        opts,
    );
    Ok(())
}
