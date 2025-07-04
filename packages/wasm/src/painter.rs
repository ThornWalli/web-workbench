
/// Trait, der die Funktionalität eines "Pinsels" definiert:
/// Wie ein einzelner Pixel gefärbt werden soll.
trait Painter {
  /// Wendet die Pinsel-Farbe auf einen spezifischen Pixel im Bild an.
  /// `data`: Der gesamte mutable Bild-Slice.
  /// `data_width`: Die Breite des Gesamtbildes in Pixeln (für Indexberechnung).
  /// `x`, `y`: Die absoluten X/Y-Koordinaten des Pixels auf dem Bild.
  fn paint_pixel(&self, data: &mut [u8], data_width: usize, x: usize, y: usize);
}

/// Eine einfache Implementierung des Painters, der eine feste Farbe aufträgt.
struct SolidColorPainter {
  color: Color,
}

impl SolidColorPainter {
  fn new(color: Color) -> Self {
      SolidColorPainter { color }
  }
}

impl Painter for SolidColorPainter {
  fn paint_pixel(&self, data: &mut [u8], data_width: usize, x: usize, y: usize) {
      let pixel_index = (y * data_width + x) * 4;
      // Sicherheitsprüfung, um Index-Out-of-Bounds zu vermeiden
      if pixel_index + 3 < data.len() {
          data[pixel_index] = self.color.r;
          data[pixel_index + 1] = self.color.g;
          data[pixel_index + 2] = self.color.b;
          data[pixel_index + 3] = self.color.a;
      }
  }
}

// Eine beispielhafte Implementierung für einen Pinsel, der ein Bild/Textur aufträgt.
// Die Pinseldaten werden einmalig von JS nach Rust kopiert.
struct ImagePainter {
  image_data: Vec<u8>, // Kopie der Pinsel-Bilddaten (RGBA8)
  image_dim: Dimension,
}

impl ImagePainter {
  fn new(data: Vec<u8>, dim: Dimension) -> Self {
      ImagePainter { image_data: data, image_dim: dim }
  }
}

impl Painter for ImagePainter {
  fn paint_pixel(&self, data: &mut [u8], data_width: usize, x: usize, y: usize) {
      // Berechne die Texturkoordinaten für den Pinsel (einfache Kachelung)
      let texture_x = x % self.image_dim.x;
      let texture_y = y % self.image_dim.y;
      let texture_pixel_idx = (texture_y * self.image_dim.x + texture_x) * 4;

      if texture_pixel_idx + 3 < self.image_data.len() {
          // Lese die Farbe vom Pinselbild
          let r = self.image_data[texture_pixel_idx];
          let g = self.image_data[texture_pixel_idx + 1];
          let b = self.image_data[texture_pixel_idx + 2];
          let a = self.image_data[texture_pixel_idx + 3];

          // Wende die Farbe auf den Zielpixel an
          let target_pixel_idx = (y * data_width + x) * 4;
          if target_pixel_idx + 3 < data.len() {
              data[target_pixel_idx] = r;
              data[target_pixel_idx + 1] = g;
              data[target_pixel_idx + 2] = b;
              data[target_pixel_idx + 3] = a;
          }
      }
  }
}
