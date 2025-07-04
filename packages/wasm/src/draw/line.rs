use wasm_bindgen::prelude::wasm_bindgen;

use crate::types::{RenderPosition, Point};


#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct LineOptions {
  pub segment_length: usize,
  pub gap_length: usize,
}

impl Default for LineOptions {
  /// Implementiert die Standardwerte für `LineOptions`.
  fn default() -> Self {
      LineOptions {
          segment_length: 1, // Standardwert wie im JavaScript-Code
          gap_length: 0,     // Standardwert wie im JavaScript-Code
      }
  }
}

#[wasm_bindgen]
impl LineOptions {
  #[wasm_bindgen(constructor)]
  pub fn new(segment_length: usize, gap_length: usize) -> Self {
      LineOptions {
          segment_length,
          gap_length
      }
  }
}

/// Zeichnet eine Linie unter Verwendung des Bresenham-Algorithmus,
/// mit Unterstützung für gestrichelte Liniensegmente und Lücken.
///
/// # Argumente
/// * `cb` - Ein Callback, der für jeden gezeichneten Punkt aufgerufen wird (x, y).
/// * `start_x`, `start_y` - Die Startkoordinaten der Linie.
/// * `end_x`, `end_y` - Die Endkoordinaten der Linie.
/// * `options` - Optionale Konfigurationen für Segment- und Lückenlängen.
///
/// Der `cb` Parameter ist eine Closure, die zwei `i32`-Werte akzeptiert.
/// Die Koordinaten werden intern zu `i32` gerundet.
// pub fn draw<F>(
//   mut cb: F,
//   start: Point,
//   end: Point,
//   options: LineOptions,
// ) where
//   F: FnMut(i32, i32),
// {

//   let segment_length = options.segment_length;
//   let gap_length = options.gap_length;

//   let dx = (end.x as i32 - start.x as i32).abs();
//   let dy = (end.y as i32 - start.y as i32).abs();
//   let sx: i32 = if start.x < end.x { 1 } else { -1 };
//   let sy: i32 = if start.y < end.y { 1 } else { -1 };

//   let mut current_x: i32 = start.x as i32;
//   let mut current_y: i32 = start.y as i32;

//   let mut err = dx - dy;

//   // Sicherstellen, dass Segment- und Lückenlängen nicht negativ sind
//   let effective_segment_length = segment_length.max(0);
//   let effective_gap_length = gap_length.max(0);
//   let pattern_length = effective_segment_length + effective_gap_length;

//   let mut pixels_drawn_in_pattern = 0;

//   loop {
//       // Sonderfall: Wenn keine Länge definiert ist (beide 0), nur den Startpunkt zeichnen und beenden
//       if effective_segment_length == 0 && effective_gap_length == 0 {
//           cb(current_x, current_y);
//           break;
//       }

//       // Prüfen, ob der aktuelle Pixel Teil eines Segments ist
//       let in_segment = pixels_drawn_in_pattern < effective_segment_length;

//       if in_segment {
//           cb(current_x, current_y);
//       }

//       pixels_drawn_in_pattern += 1;

//       // Das Muster zurücksetzen, wenn die Musterlänge erreicht ist
//       if pattern_length > 0 && pixels_drawn_in_pattern >= pattern_length {
//           pixels_drawn_in_pattern = 0;
//       }

//       // Schleife beenden, wenn der Endpunkt erreicht ist
//       if current_x == (end.x as i32) && current_y == (end.y as i32) {
//           break;
//       }

//       // Bresenham-Algorithmus: Berechnung des nächsten Punktes
//       let e2 = 2 * err;

//       if e2 > -dy {
//           err -= dy;
//           current_x += sx;
//       }
//       if e2 < dx {
//           err += dx;
//           current_y += sy;
//       }
//   }
// }


pub fn draw<F>(
  mut cb: F,
    start: RenderPosition,
    end: RenderPosition,
  options: Option<LineOptions>,
) where
  F: FnMut(i32, i32),
{
  let options_unwrapped = options.unwrap_or_default();
  let segment_length = options_unwrapped.segment_length;
  let gap_length = options_unwrapped.gap_length;

  let dx = (end.x - start.x).abs();
  let dy = -(end.y - start.y).abs(); // Negativer dy für Bresenham
  let sx = if start.x < end.x { 1 } else { -1 };
  let sy = if start.y < end.y { 1 } else { -1 };
  let mut err = dx + dy; // Initialer Fehlerterm

  let effective_segment_length = segment_length.max(0);
  let effective_gap_length = gap_length.max(0);
  let pattern_length = effective_segment_length + effective_gap_length;

  let mut pixels_drawn_in_pattern = 0;

  let mut current: RenderPosition = start.clone();

  loop {
      if effective_segment_length == 0 && effective_gap_length == 0 {
          // Wenn keine Muster definiert sind, zeichne einfach
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
