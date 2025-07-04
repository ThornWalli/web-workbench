mod brush;
mod draw;
mod operation;
mod test_helpers;
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
    types::{Color, Dimension, Point, RenderPosition, ShapeStyle, SolidType},
};

// #region Painter

// --- Globale Variable für den Painter ---
// OnceLock stellt sicher, dass es nur einmal initialisiert wird.
// Mutex bietet exklusiven Zugriff für Schreiboperationen.
// Box<dyn Painter + Send + Sync> hält den tatsächlichen Painter.
// Send und Sync sind notwendig, damit der Painter über Threads (Rayon) geteilt werden kann.
static GLOBAL_BRUSH: OnceLock<Mutex<Box<WasmBrush>>> = OnceLock::new();

/// Initialisiert den globalen Painter beim ersten Aufruf.
/// Diese Funktion sollte einmalig vor dem Zeichnen von Strokes aufgerufen werden.
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
        *global_brush_guard = Box::new(brush); // Ersetze den alten Painter durch den neuen
        Ok(())
    } else {
        // Der Painter wurde noch nicht initialisiert.
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
        *global_brush_guard = Box::new(brush); // Ersetze den alten Painter durch den neuen
        Ok(())
    } else {
        // Der Painter wurde noch nicht initialisiert.
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
        *global_brush_guard = Box::new(brush); // Ersetze den alten Painter durch den neuen
        Ok(())
    } else {
        // Der Painter wurde noch nicht initialisiert.
        Err(JsValue::from_str(
            "Global brush not initialized. Call 'initBrush' first.",
        ))
    }
}

// #endregion

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

// drawLine
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

    let mut data_borrow = rc_refcell_data.borrow_mut(); // Daten-Slice

    let pixel_setter = move |is_stroke: bool, x: i32, y: i32| {
        let brush_mutex = GLOBAL_BRUSH
            .get()
            .expect("Brush not initialized in callback.");
        let mut brush_guard = brush_mutex
            .lock()
            .expect("Failed to lock brush in callback.");
        let brush_ref: &mut WasmBrush = &mut *brush_guard;

        if is_stroke {
            brush_ref.brush.draw(
                &mut *data_borrow,
                data_dim_for_cb,
                Point {
                    x: x as usize,
                    y: y as usize,
                },
            );
        } else {
            let color_to_use = brush_ref.brush.secondary_color;
            let target_pixel_idx = (y as usize * data_dim_for_cb.x + x as usize) * 4;
            if target_pixel_idx + 3 >= data_borrow.len() {
                return;
            }

            let color = color_to_use;

            data_borrow[target_pixel_idx] = color.r;
            data_borrow[target_pixel_idx + 1] = color.g;
            data_borrow[target_pixel_idx + 2] = color.b;
            data_borrow[target_pixel_idx + 3] = color.a;
        }
    };

    let render_points: Vec<RenderPosition> = points
        .into_iter()
        .map(|p: Point| RenderPosition {
            x: p.x as i32,
            y: p.y as i32,
        })
        .collect();

    draw::polygon::draw(pixel_setter, data_dim, &render_points, opts);

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

    let mut data_borrow = rc_refcell_data.borrow_mut(); // Daten-Slice

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
    let data_dim_for_cb = data_dim;

    let brush_mutex = GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut WasmBrush = &mut *brush_guard;
    let size = brush_ref.brush.dimension.x;

    let mut data_borrow = rc_refcell_data.borrow_mut(); // Daten-Slice

    let pixel_setter = move |is_stroke: bool, x: i32, y: i32| {
        if is_stroke {
            brush_ref.brush.draw(
                &mut *data_borrow,
                data_dim,
                Point {
                    x: x as usize,
                    y: y as usize,
                },
            );
        } else {
            let target_pixel_idx = (x + y * (data_dim_for_cb.x as i32)) as usize * 4;
            let color = brush_ref.brush.secondary_color;
            data_borrow[(target_pixel_idx) as usize] = color.r;
            data_borrow[(target_pixel_idx) as usize + 1] = color.g;
            data_borrow[(target_pixel_idx) as usize + 2] = color.b;
            data_borrow[(target_pixel_idx) as usize + 3] = color.a;
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
    let data_dim_for_cb = data_dim;

    let brush_mutex = GLOBAL_BRUSH
        .get()
        .expect("Brush not initialized in callback.");
    let mut brush_guard = brush_mutex
        .lock()
        .expect("Failed to lock brush in callback.");
    let brush_ref: &mut WasmBrush = &mut *brush_guard;
    let size = brush_ref.brush.dimension.x;

    let mut data_borrow = rc_refcell_data.borrow_mut();

    let pixel_setter = move |is_stroke: bool, x: i32, y: i32| {
        if is_stroke {
            brush_ref.brush.draw(
                &mut *data_borrow,
                data_dim,
                Point {
                    x: x as usize,
                    y: y as usize,
                },
            );
        } else {
            let target_pixel_idx = (x + y * (data_dim_for_cb.x as i32)) as usize * 4;
            let color = brush_ref.brush.secondary_color;
            data_borrow[(target_pixel_idx) as usize] = color.r;
            data_borrow[(target_pixel_idx) as usize + 1] = color.g;
            data_borrow[(target_pixel_idx) as usize + 2] = color.b;
            data_borrow[(target_pixel_idx) as usize + 3] = color.a;
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
    // Sicherstellen, dass der globale Pinsel initialisiert ist

    let ellipse_opts = EllipseOptions {
        style: ShapeStyle::Filled,
        line_options: None,
        interpolate_segments: false,
    };

    let data = &mut vec![0; (size.x * size.y * 4) as usize];

    draw::ellipse::draw(
        |is_stroke, x, y| {
            let target_pixel_idx = (x + y * (size.x as i32)) as usize * 4;
            data[(target_pixel_idx) as usize] = color.r;
            data[(target_pixel_idx) as usize + 1] = color.g;
            data[(target_pixel_idx) as usize + 2] = color.b;
            data[(target_pixel_idx) as usize + 3] = color.a;
        },
        size,
        RenderPosition { x: 0, y: 0 },
        size.to_viewport_dimension(),
        size.x,
        ellipse_opts,
    );
    // let mut data = draw::ellipse(
    //   data_,
    //     size,
    //     Point { x: 0, y: 0 },
    //     size,
    //     ellipse_opts,
    // )?;

    // 2. Iteriere über die Daten und "verpixle" sie
    let mut rng = rand::rng(); // Erstelle einen Thread-lokalen Zufallsgenerator

    // Berechne den Schwellenwert basierend auf der Größe, wie in JS: 0.25 / ((size.x + size.y) / 2)
    let avg_size = (size.x as f64 + size.y as f64) / 2.0;
    let threshold = 0.25 / avg_size;
    for i in (0..data.len()).step_by(4) {
        let x = (i / 4) % size.x as usize; // Berechne die X-Position des Pixels
        let y = (i / 4) / size.x as usize; // Berech

        // Überprüfe, ob der Alpha-Wert > 0 ist (Pixel ist sichtbar) UND
        // ob eine Zufallszahl (0.0 - 1.0) kleiner ist als der berechnete Schwellenwert.
        if data[i + 3] > 0 && rng.random::<f64>() < threshold {
        } else {
            data[i] = 0; // Setze R auf 0
            data[i + 1] = 0; // Setze G auf 0
            data[i + 2] = 0; // Setze B auf 0
            data[i + 3] = 0; // Setze A auf 0 (transparent)
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
            let pixel_idx = (x + y * dim.x) as usize * 4;

            if pixel_idx + 3 >= data.len() {
                // Außerhalb der Grenzen, gib eine Standardfarbe zurück und tu nichts beim Schreiben
                return Color {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0,
                };
            }

            if is_check {
                // Lese den Pixel
                Color {
                    r: data[pixel_idx],
                    g: data[pixel_idx + 1],
                    b: data[pixel_idx + 2],
                    a: data[pixel_idx + 3],
                }
            } else {
                // Schreibe den Pixel
                data[pixel_idx] = color.r;
                data[pixel_idx + 1] = color.g;
                data[pixel_idx + 2] = color.b;
                data[pixel_idx + 3] = 255; // Volle Deckkraft für den Flood Fill
                // Beim Schreiben geben wir die neue Farbe zurück (technisch nicht von fill::draw genutzt)
                color
            }
        },
        // |x, y| {
        //     let target_pixel_idx = (x + y * (data_dim.x as i32)) as usize * 4;
        //     data[(target_pixel_idx) as usize] = color.r;
        //     data[(target_pixel_idx) as usize + 1] = color.g;
        //     data[(target_pixel_idx) as usize + 2] = color.b;
        //     data[(target_pixel_idx) as usize + 3] = 255;
        // },
        // |x, y| {
        //     let idx = (x + y * (data_dim.x as i32)) as usize * 4;
        //     Color {
        //         r: data_snapshot[idx],
        //         g: data_snapshot[idx + 1],
        //         b: data_snapshot[idx + 2],
        //         a: data_snapshot[idx + 3],
        //     }
        // },
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
            let offset_x = dimension.x as isize / 2;
            let offset_y = dimension.y as isize / 2;

            x -= offset_x as i32;
            y -= offset_y as i32;

            if x >= 0 && x < data_dim.x as i32 && y >= 0 && y < data_dim.y as i32 {
                let target_pixel_idx = (y as usize * data_dim.x + x as usize) * 4;
                if target_pixel_idx + 3 < data.len() {
                    // Angenommen, Sie haben diese Bytes-Slices bereits definiert:
                    // let brush_data: &[u8];
                    // let view: &mut [u8];
                    // let i: usize; // Quell-Index
                    // let target_pixel_idx: usize; // Ziel-Index

                    // Holen Sie sich die Quell-Pixelkomponenten
                    let src_r = color.r as f64;
                    let src_g = color.g as f64;
                    let src_b = color.b as f64;
                    let src_a = color.a as f64 / 255.0; // Alpha normalisieren (0.0 - 1.0)

                    // Holen Sie sich die Ziel-Pixelkomponenten
                    let dest_r = data[target_pixel_idx] as f64;
                    let dest_g = data[target_pixel_idx + 1] as f64;
                    let dest_b = data[target_pixel_idx + 2] as f64;
                    let dest_a = data[target_pixel_idx + 3] as f64 / 255.0; // Alpha normalisieren (0.0 - 1.0)

                    // Berechne den neuen Alpha-Wert (outA)
                    let out_a = src_a + dest_a * (1.0 - src_a);

                    // Berechne die neuen Farbwerte, falls out_a nicht null ist, um Division durch Null zu vermeiden
                    let (out_r, out_g, out_b) = if out_a > 0.0001 {
                        // Kleiner Schwellenwert, um Floating-Point-Probleme zu vermeiden
                        (
                            (src_r * src_a + dest_r * dest_a * (1.0 - src_a)) / out_a,
                            (src_g * src_a + dest_g * dest_a * (1.0 - src_a)) / out_a,
                            (src_b * src_a + dest_b * dest_a * (1.0 - src_a)) / out_a,
                        )
                    } else {
                        // Wenn das Ergebnis komplett transparent ist, sind die Farbwerte irrelevant oder 0.
                        (0.0, 0.0, 0.0)
                    };

                    // Speichern Sie die Ergebnisse im Ziel-Array
                    data[target_pixel_idx] = out_r.round() as u8; // Math.round und auf u8 casten
                    data[target_pixel_idx + 1] = out_g.round() as u8;
                    data[target_pixel_idx + 2] = out_b.round() as u8;
                    data[target_pixel_idx + 3] = (out_a * 255.0).round() as u8; // Alpha zurück in 0-255 Bereich

                    //                     data[target_pixel_idx] = color.r;
                    //                     data[target_pixel_idx + 1] = color.g;
                    //                     data[target_pixel_idx + 2] = color.b;

                    // web_sys::console::log_1(&format!(
                    //   "Drawing air brush at ({}, {}) with color: {:?}",
                    //   data[target_pixel_idx + 3],color.a, color
                    // ).into());

                    //                     data[target_pixel_idx + 3] =
                    //                         (data[target_pixel_idx + 3] as u16 + color.a as u16).min(255) as u8;
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

// web_sys::console::log_1(&format!(
//   "Drawing air brush at ({}, {}) with color: {:?}",
//   options.max_alpha_factor, dot_alpha, color
// ).into());

#[wasm_bindgen(js_name = "getPixels")]
pub fn get_pixels(
    data: &mut [u8],
    data_dim: Dimension,
    position: Point,
    dimension: Dimension,
) -> Result<Vec<u8>, JsValue> {
    let mut pixels = Vec::with_capacity((dimension.x * dimension.y * 4) as usize);
    for y in position.y..(position.y + dimension.y) {
        for x in position.x..(position.x + dimension.x) {
            let target_pixel_idx = (y * data_dim.x + x) * 4;
            if target_pixel_idx + 3 < data.len() {
                pixels.push(data[target_pixel_idx]);
                pixels.push(data[target_pixel_idx + 1]);
                pixels.push(data[target_pixel_idx + 2]);
                pixels.push(data[target_pixel_idx + 3]);
            } else {
                // Füge transparente Pixel hinzu, wenn außerhalb der Grenzen
                pixels.extend_from_slice(&[0, 0, 0, 0]);
            }
        }
    }
    Ok(pixels)
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
    let _pixels: Vec<u8> = Vec::with_capacity((partial_data.len() / 4) * 4);
    for i in (0..partial_data.len()).step_by(4) {
        let _x = (i / 4) % partial_data_dim.x;
        let _y = (i / 4) / partial_data_dim.x;
        let x = position.x + _x;
        let y = position.y + _y;

        if x < data_dim.x && y < data_dim.y {
            let target_pixel_idx = (y * data_dim.x + x) * 4;
            if target_pixel_idx + 3 < data.len() {
                if replace {
                    data[target_pixel_idx] = partial_data[i]; // R
                    data[target_pixel_idx + 1] = partial_data[i + 1]; // G
                    data[target_pixel_idx + 2] = partial_data[i + 2]; // B
                    data[target_pixel_idx + 3] = partial_data[i + 3]; // A
                } else {
                    let src_r = partial_data[i];
                    let src_g = partial_data[i + 1];
                    let src_b = partial_data[i + 2];
                    let src_a = partial_data[i + 3] / 255;

                    let dest_r = data[target_pixel_idx];
                    let dest_g = data[target_pixel_idx + 1];
                    let dest_b = data[target_pixel_idx + 2];
                    let dest_a = data[target_pixel_idx + 3] / 255;

                    let out_a = src_a + dest_a * (1 - src_a);
                    data[target_pixel_idx] =
                        (src_r * src_a + dest_r * dest_a * (1 - src_a) / out_a);
                    data[target_pixel_idx + 1] =
                        (src_g * src_a + dest_g * dest_a * (1 - src_a) / out_a);
                    data[target_pixel_idx + 2] =
                        (src_b * src_a + dest_b * dest_a * (1 - src_a) / out_a);
                    data[target_pixel_idx + 3] = (out_a * 255) as u8; // Alpha zurück in 0-255 Bereich
                }
            }
        }
    }

    Ok(())
}
