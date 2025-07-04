pub fn get_line_points(
  x0: i32,
  y0: i32,
  x1: i32,
  y1: i32,
  density: f64, // density kann auch f64 sein, wenn Sie Nachkommastellen brauchen
) -> Vec<(i32, i32)> {
  let mut current_x = x0;
  let mut current_y = y0;

  let dx = (x1 - current_x).abs();
  let sx = if current_x < x1 { 1 } else { -1 };
  let dy = (y1 - current_y).abs();
  let sy = if current_y < y1 { 1 } else { -1 };
  let mut err = if dx > dy { dx as f64 } else { -dy as f64 } / 2.0;

  let mut points = Vec::new();
  let mut i = 0.0; // Verwenden Sie f64 für i, da es mit 1/density verrechnet wird

  loop {
      if density == 0.0 || i >= 1.0 {
          points.push((current_x, current_y));
          i = 0.0;
      } else {
          i += 1.0 / density;
      }

      if current_x == x1 && current_y == y1 {
          break;
      }

      let e2 = err;
      if e2 > -(dx as f64) {
          err -= dy as f64;
          current_x += sx;
      }
      if e2 < (dy as f64) {
          err += dx as f64;
          current_y += sy;
      }
  }
  points
}

// Eine Struktur für die optionalen Parameter, hier nur `gap_length`.
// Wir brauchen `Default`, um den Standardwert zu setzen, wenn keine Optionen übergeben werden.
pub struct BasicLineOptions {
    pub gap_length: usize, // Da density in get_line_points ein f64 ist
}

impl Default for BasicLineOptions {
    fn default() -> Self {
        BasicLineOptions {
            gap_length: 0.0, // Standardwert für gapLength
        }
    }
}

pub fn basic_line<F>(
    mut cb: F, // Der Callback, `mut` weil er mehrmals aufgerufen wird
    x0: usize,
    y0: usize,
    x1: usize,
    y1: usize,
    options: Option<BasicLineOptions>, // `Option` für optionale Parameter
) where
    F: FnMut(i32, i32), // Der Callback akzeptiert zwei i32 und kann seinen Zustand ändern
{
    // Die Optionen entpacken oder die Standardwerte verwenden
    let actual_options = options.unwrap_or_default();
    let gap_length = actual_options.gap_length;

    // `get_line_points` aufrufen und über die zurückgegebenen Punkte iterieren
    get_line_points(x0, y0, x1, y1, gap_length)
        .into_iter() // `into_iter()` konsumiert den Vektor und gibt die Elemente by value
        .for_each(|point| {
            // Für jeden Punkt den Callback aufrufen
            cb(point.0, point.1); // point.0 ist x, point.1 ist y
        });
}
