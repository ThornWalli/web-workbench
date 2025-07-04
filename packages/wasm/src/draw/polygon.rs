// draw/polygon.rs (Erstellen Sie diese Datei oder passen Sie sie an)

use wasm_bindgen::prelude::wasm_bindgen;

use crate::types::{Color, Dimension, Point, RenderPosition, ShapeStyle};
use crate::draw::line::{self, LineOptions};

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct PolygonOptions {
    pub style: ShapeStyle,
    pub line_options: Option<LineOptions>,
}
impl Default for PolygonOptions {
    fn default() -> Self {
      PolygonOptions {
            style: ShapeStyle::Stroked,
            line_options: Some(LineOptions { segment_length: 1, gap_length: 0 }),
        }
    }
}

#[wasm_bindgen]
impl PolygonOptions {
  #[wasm_bindgen(constructor)]
  pub fn new(
    style: ShapeStyle,
    line_options: Option<LineOptions>) -> Self {
      PolygonOptions {
      style,
      line_options
      }
  }
}

pub fn draw<F>(
    mut pixel_cb: F,
    data_dim: Dimension,
    points: &[RenderPosition],
    options: PolygonOptions,
) where
    F: FnMut(bool, i32, i32),
{
    if points.len() < 2 {
        return;
    }

    let stroke_only = matches!(options.style, crate::types::ShapeStyle::Stroked);
    let fill_only = matches!(options.style, crate::types::ShapeStyle::Filled);
    let stroked_filled = matches!(options.style, crate::types::ShapeStyle::StrokedFilled);


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
                    let x_intersect = (p1.x as f64 + (y - p1.y) as f64 * (p2.x - p1.x) as f64 / (p2.y - p1.y) as f64) as i32;
                    intersections.push(x_intersect);
                }
            }

            intersections.sort_unstable();

            for i in (0..intersections.len()).step_by(2) {
                if i + 1 < intersections.len() {
                    let start_x = intersections[i];
                    let end_x = intersections[i + 1];

                    for x in start_x..=end_x {
                        pixel_cb(false, x, y);
                    }
                }
            }
        }
    }

    if stroke_only || stroked_filled {
        for i in 0..points.len() {
            let p1 = points[i];
            let p2 = points[(i + 1) % points.len()]; // Letzten Punkt mit erstem verbinden

            let mut stroke_line_cb = |x_line: i32, y_line: i32| {
                pixel_cb(true, x_line, y_line);
            };

            line::draw(
                &mut stroke_line_cb,
                p1,
                p2,
                options.line_options,
            );
        }
    }
}

// #[wasm_bindgen(js_name = "drawPolygon")]
// pub fn draw_polygon(
//     mut data: Vec<u8>, // Data als Vec<u8> für Ownership
//     data_dim: Dimension,
//     points: Vec<Point>, // Punkte des Polygons
//     opts: PolygonOptions, // Polygon-spezifische Optionen
// ) -> Result<Box<[u8]>, JsValue> { // Rückgabe Box<[u8]>

//     // Daten in Rc<RefCell> für geteilten mutablen Zugriff
//     let rc_refcell_data = Rc::new(RefCell::new(data));
//     let data_dim_for_cb = data_dim; // data_dim ist Copy

//     // Fangen Sie die Farben für den Callback
//     let fill_color_for_cb = opts.fill_color;

//     // Das Pixel-Callback-Closure für Stroke und Fill
//     let pixel_setter = move |is_stroke: bool, x: i32, y: i32| {
//         // Holen Sie den Pinsel JEDES MAL, wenn der Callback aufgerufen wird
//         let brush_mutex = GLOBAL_BRUSH.get().expect("Brush not initialized in callback.");
//         let mut brush_guard = brush_mutex.lock().expect("Failed to lock brush in callback.");
//         let brush_ref: &mut WasmBrush = &mut *brush_guard;

//         let mut data_borrow = rc_refcell_data.borrow_mut(); // Daten-Slice

//         // Bounds-Check für das Zeichnen von Pixeln
//         if x < 0 || x >= data_dim_for_cb.x as i32 || y < 0 || y >= data_dim_for_cb.y as i32 {
//             return; // Pixel außerhalb des Bildes ignorieren
//         }
//         let target_pixel_idx = (y as usize * data_dim_for_cb.x + x as usize) * 4;
//         if target_pixel_idx + 3 >= data_borrow.len() {
//             return; // Out of bounds Index
//         }


//         if is_stroke {
//             // Hier verwendet der Pinsel seine primäre Farbe für den Stroke
//             brush_ref.draw(
//                 &mut *data_borrow,
//                 data_dim_for_cb,
//                 Point { x: x as usize, y: y as usize },
//             );
//         } else {
//             // Füll-Logik: Verwendet die im Closure gefangene fill_color
//             let color_to_use = fill_color_for_cb;
//             data_borrow[target_pixel_idx] = color_to_use.r;
//             data_borrow[target_pixel_idx + 1] = color_to_use.g;
//             data_borrow[target_pixel_idx + 2] = color_to_use.b;
//             data_borrow[target_pixel_idx + 3] = color_to_use.a;
//         }
//     };

//     // Rufen Sie die Polygon-Zeichenfunktion auf
//     polygon::draw(
//         pixel_setter,
//         data_dim,
//         &points, // Übergeben Sie einen Slice der Punkte
//         opts,
//     );

//     // Daten aus dem Rc<RefCell> holen, um sie zurückzugeben
//     let final_data = Rc::try_unwrap(rc_refcell_data)
//         .ok()
//         .expect("Failed to unwrap Rc<RefCell> for data. Check for multiple strong references.")
//         .into_inner();

//     Ok(final_data.into_boxed_slice())
// }
