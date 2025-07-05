mod brush;
mod debug;
mod draw;
mod operation;
mod pixel;
mod enums;
mod types;

mod image_operation;

use rand::Rng;
use std::{
    cell::RefCell,
    rc::Rc,
    sync::{Mutex, OnceLock},
};

use wasm_bindgen::prelude::*;

use crate::{
    brush::{BrushTrait, WasmBrush},
    draw::{
        air_brush::AirBurshOptions, ellipse::EllipseOptions, polygon::PolygonOptions,
        rectangle::RectangleOptions,
    },
    enums::{ShapeStyle, SolidType},
    types::{Color, Dimension, Point, RenderPosition},
};

static GLOBAL_BRUSH: OnceLock<Mutex<Box<WasmBrush>>> = OnceLock::new();

#[wasm_bindgen(js_name = "initBrush")]
pub fn init_brush(
    solid_type: SolidType,
    size: usize,
    primary_color: Color,
    secondary_color: Color,
) -> Result<(), JsValue> {
    let brush = WasmBrush::solid(solid_type, size, primary_color, secondary_color);
    if GLOBAL_BRUSH.set(Mutex::new(Box::new(brush))).is_err() {
        return Err(JsValue::from_str(
            "Global brush already initialized. Call 'setBrush' to update it.",
        ));
    }
    Ok(())
}

#[wasm_bindgen(js_name = "setBrushSolid")]
pub fn set_brush_solid(
    solid_type: SolidType,
    size: usize,
    primary_color: Color,
    secondary_color: Color,
) -> Result<(), JsValue> {
    let brush = WasmBrush::solid(solid_type, size, primary_color, secondary_color);
    if let Some(mutex) = GLOBAL_BRUSH.get() {
        let mut global_brush_guard = mutex.lock().map_err(|e| {
            JsValue::from_str(&format!("Failed to lock global painter mutex: {:?}", e))
        })?;
        *global_brush_guard = Box::new(brush);
        Ok(())
    } else {
        Err(JsValue::from_str(
            "Global brush not initialized. Call 'initBrush' first.",
        ))
    }
}

#[wasm_bindgen(js_name = "setBrushDots")]
pub fn set_brush_dots(
    dimension: Dimension,
    primary_color: Color,
    secondary_color: Color,
) -> Result<(), JsValue> {
    let brush = WasmBrush::dots(dimension, primary_color, secondary_color);
    if let Some(mutex) = GLOBAL_BRUSH.get() {
        let mut global_brush_guard = mutex.lock().map_err(|e| {
            JsValue::from_str(&format!("Failed to lock global painter mutex: {:?}", e))
        })?;
        *global_brush_guard = Box::new(brush);
        Ok(())
    } else {
        Err(JsValue::from_str(
            "Global brush not initialized. Call 'initBrush' first.",
        ))
    }
}

#[wasm_bindgen(js_name = "setBrushData")]
pub fn set_brush_data(
    stroke_image_data: Vec<u8>,
    stroke_image_dimension: Dimension,
    primary_color: Color,
    secondary_color: Color,
) -> Result<(), JsValue> {
    let brush: WasmBrush = WasmBrush::from_data(
        stroke_image_data,
        stroke_image_dimension,
        primary_color,
        secondary_color,
    );
    if let Some(mutex) = GLOBAL_BRUSH.get() {
        let mut global_brush_guard = mutex.lock().map_err(|e| {
            JsValue::from_str(&format!("Failed to lock global painter mutex: {:?}", e))
        })?;
        *global_brush_guard = Box::new(brush);
        Ok(())
    } else {
        Err(JsValue::from_str(
            "Global brush not initialized. Call 'initBrush' first.",
        ))
    }
}

#[wasm_bindgen(js_name = "drawBezier")]
pub fn draw_curve(
    data: &mut [u8],
    data_dim: Dimension,
    start: Point,
    start_helper: Point,
    end: Point,
    end_helper: Point,
    options: Option<draw::bezier::BezierOptions>,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));
    let data_dim_for_cb = data_dim;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let mut opts = options.unwrap_or_default();
    if opts.segment_length == 0.0 {
        opts.segment_length = 1.0;
    }

    draw::bezier::draw(
        |x, y| {
            let brush_mutex = GLOBAL_BRUSH
                .get()
                .expect("Brush not initialized in callback.");
            let mut brush_guard = brush_mutex
                .lock()
                .expect("Failed to lock brush in callback.");
            let brush_ref: &mut WasmBrush = &mut *brush_guard;

            brush_ref.brush.draw(
                &mut *data_borrow,
                data_dim_for_cb,
                Point {
                    x: x as usize,
                    y: y as usize,
                },
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
    data_dim: Dimension,
    start: Point,
    end: Point,
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
            let brush_mutex = GLOBAL_BRUSH
                .get()
                .expect("Brush not initialized in callback.");
            let mut brush_guard = brush_mutex
                .lock()
                .expect("Failed to lock brush in callback.");
            let brush_ref: &mut WasmBrush = &mut *brush_guard;

            brush_ref.brush.draw(
                &mut *data_borrow,
                data_dim_for_cb,
                Point {
                    x: x as usize,
                    y: y as usize,
                },
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
    data_dim: Dimension,
    points: Vec<Point>,
    opts: PolygonOptions,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));
    let data_dim_for_cb = data_dim;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let pixel_setter = move |x: i32, y: i32, is_stroke| {
        let brush_mutex = GLOBAL_BRUSH
            .get()
            .expect("Brush not initialized in callback.");
        let mut brush_guard = brush_mutex
            .lock()
            .expect("Failed to lock brush in callback.");
        let brush_ref: &mut WasmBrush = &mut *brush_guard;

        let position = Point {
            x: x as usize,
            y: y as usize,
        };

        if is_stroke {
            brush_ref
                .brush
                .draw(&mut *data_borrow, data_dim_for_cb, position);
        } else {
            let color_to_use = brush_ref.brush.secondary_color;
            let target_pixel_idx = ((y as usize) * data_dim_for_cb.x + (x as usize)) * 4;
            if target_pixel_idx + 3 >= data_borrow.len() {
                return;
            }

            pixel::set_pixels(
                &mut *data_borrow,
                data_dim_for_cb,
                position,
                &color_to_use.to_data(),
                Dimension { x: 1, y: 1 },
                false,
            );
        }
    };

    let render_points: Vec<RenderPosition> = points
        .into_iter()
        .map(|p: Point| RenderPosition {
            x: p.x as i32,
            y: p.y as i32,
        })
        .collect();

    draw::polygon::draw(pixel_setter, &render_points, opts);

    Ok(())
}

#[wasm_bindgen(js_name = "drawBrush")]
pub fn draw_brush(
    data: &mut [u8],
    data_dimension: Dimension,
    position: Point,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));
    let brush_mutex = GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut WasmBrush = &mut *brush_guard;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    brush_ref
        .brush
        .draw(&mut *data_borrow, data_dimension, position);
    Ok(())
}

#[wasm_bindgen(js_name = "drawRectangle")]
pub fn draw_rectangle(
    data: &mut [u8],
    data_dim: Dimension,
    position: Point,
    dimension: Dimension,
    opts: RectangleOptions,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));

    let brush_mutex = GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut WasmBrush = &mut *brush_guard;
    let size = brush_ref.brush.dimension.x;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let pixel_setter = move |x, y, is_stroke| {
        let position = Point {
            x: x as usize,
            y: y as usize,
        };
        if is_stroke {
            brush_ref.brush.draw(&mut *data_borrow, data_dim, position);
        } else {
            pixel::set_pixels(
                &mut *data_borrow,
                data_dim,
                position,
                &brush_ref.brush.secondary_color.to_data(),
                Dimension { x: 1, y: 1 },
                false,
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
    data_dim: Dimension,
    position: Point,
    dimension: Dimension,
    opts: EllipseOptions,
) -> Result<(), JsValue> {
    let rc_refcell_data = Rc::new(RefCell::new(data));

    let brush_mutex = GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut WasmBrush = &mut *brush_guard;
    let size = brush_ref.brush.dimension.x;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let pixel_setter = move |x, y, is_stroke| {
        let position = Point {
            x: x as usize,
            y: y as usize,
        };
        if is_stroke {
            brush_ref.brush.draw(&mut *data_borrow, data_dim, position);
        } else {
            pixel::set_pixels(
                &mut *data_borrow,
                data_dim,
                position,
                &brush_ref.brush.secondary_color.to_data(),
                Dimension { x: 1, y: 1 },
                false,
            );
        }
    };

    draw::ellipse::draw(
        pixel_setter,
        data_dim,
        position.to_render_point(),
        dimension.to_viewport_dimension(),
        size,
        opts,
    );
    Ok(())
}

#[wasm_bindgen(js_name = "drawDots")]
pub fn draw_dots(size: Dimension, color: Color) -> Result<Box<[u8]>, JsValue> {
    let ellipse_opts = EllipseOptions {
        style: ShapeStyle::Filled,
        line_options: None,
        interpolate_segments: false,
    };

    let data = &mut vec![0; (size.x * size.y * 4) as usize];
    let data_dim = Dimension {
        x: size.x as usize,
        y: size.y as usize,
    };

    draw::ellipse::draw(
        |x, y, _is_stroke| {
            pixel::set_pixels(
                &mut *data,
                data_dim,
                Point {
                    x: x as usize,
                    y: y as usize,
                },
                &color.to_data(),
                Dimension { x: 1, y: 1 },
                false,
            );
        },
        size,
        RenderPosition { x: 0, y: 0 },
        size.to_viewport_dimension(),
        size.x,
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
    data_dim: Dimension,
    position: Point,
    color: Color,
) -> Result<(), JsValue> {
    let dim = data_dim.to_viewport_dimension();

    draw::fill::draw(
        move |x, y, color, is_check| {
            let pixel_idx = ((x + y * dim.x) as usize) * 4;

            if pixel_idx + 3 >= data.len() {
                return Color {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0,
                };
            }

            if is_check {
                Color {
                    r: data[pixel_idx],
                    g: data[pixel_idx + 1],
                    b: data[pixel_idx + 2],
                    a: data[pixel_idx + 3],
                }
            } else {
                data[pixel_idx] = color.r;
                data[pixel_idx + 1] = color.g;
                data[pixel_idx + 2] = color.b;
                data[pixel_idx + 3] = 255;

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
    data_dim: Dimension,
    position: Point,
    dimension: Dimension,
    color: Color,
    opts: AirBurshOptions,
) -> Result<(), JsValue> {
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

                    let (out_r, out_g, out_b) = if out_a > 0.0001 {
                        (
                            (src_r * src_a + dest_r * dest_a * (1.0 - src_a)) / out_a,
                            (src_g * src_a + dest_g * dest_a * (1.0 - src_a)) / out_a,
                            (src_b * src_a + dest_b * dest_a * (1.0 - src_a)) / out_a,
                        )
                    } else {
                        (0.0, 0.0, 0.0)
                    };

                    data[target_pixel_idx] = out_r.round() as u8;
                    data[target_pixel_idx + 1] = out_g.round() as u8;
                    data[target_pixel_idx + 2] = out_b.round() as u8;
                    data[target_pixel_idx + 3] = (out_a * 255.0).round() as u8;
                }
            }
        },
        position.to_render_point(),
        dimension,
        color,
        opts,
    );
    Ok(())
}

#[wasm_bindgen(js_name = "getPixels")]
pub fn get_pixels(
    data: &mut [u8],
    data_dim: Dimension,
    position: Point,
    dimension: Dimension,
) -> Result<Vec<u8>, JsValue> {
    Ok(pixel::get_pixels(data, data_dim, position, dimension))
}

#[wasm_bindgen(js_name = "setPixels")]
pub fn set_pixels(
    data: &mut [u8],
    data_dim: Dimension,
    position: Point,
    partial_data: &[u8],
    partial_data_dim: Dimension,
    replace: bool,
) -> Result<(), JsValue> {
    pixel::set_pixels(
        data,
        data_dim,
        position,
        partial_data,
        partial_data_dim,
        replace,
    );

    Ok(())
}
