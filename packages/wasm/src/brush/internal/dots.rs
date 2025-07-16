use crate::{brush::BrushTrait, draw, enums, types};
use rand::{Rng, SeedableRng, rngs::StdRng};

pub struct DotsBrushInternal {
    color: types::Color,
    width: usize,
    height: usize,
}

impl DotsBrushInternal {
    pub fn new(
        color: types::Color,
        width: usize,
        height: usize,
        _brush_mode: enums::BrushMode,
    ) -> Self {
        DotsBrushInternal {
            color,
            width,
            height,
        }
    }
}

impl BrushTrait for DotsBrushInternal {
    fn draw(&self, data: &mut [u8], data_dim: types::Dimension, position: types::Point, seed: u64) {
        let mut ellipse_data_buffer = vec![0; (self.width * self.height * 4) as usize];

        let ellipse_opts = draw::ellipse::EllipseOptions {
            style: enums::ShapeStyle::Filled,
            line_options: None,
            interpolate_segments: false,
            seed,
        };

        draw::ellipse::draw(
            |x_local, y_local, _is_stroke| {
                if x_local >= 0
                    && x_local < (self.width as i32)
                    && y_local >= 0
                    && y_local < (self.height as i32)
                {
                    let target_pixel_idx =
                        ((y_local as usize) * self.width + (x_local as usize)) * 4;
                    if target_pixel_idx + 3 < ellipse_data_buffer.len() {
                        ellipse_data_buffer[target_pixel_idx] = self.color.r;
                        ellipse_data_buffer[target_pixel_idx + 1] = self.color.g;
                        ellipse_data_buffer[target_pixel_idx + 2] = self.color.b;
                        ellipse_data_buffer[target_pixel_idx + 3] = self.color.a;
                    }
                }
            },
            types::Dimension {
                x: self.width,
                y: self.height,
            },
            types::RenderPosition { x: 0, y: 0 },
            (types::Dimension {
                x: self.width,
                y: self.height,
            })
            .to_viewport_dimension(),
            ellipse_opts,
        );

        let mut rng: StdRng = StdRng::seed_from_u64(seed);
        let avg_size = ((self.width as f64) + (self.height as f64)) / 2.0;
        let threshold = 0.25 / avg_size;

        for i in (0..ellipse_data_buffer.len()).step_by(4) {
            if ellipse_data_buffer[i + 3] > 0 {
                if rng.random::<f64>() >= threshold {
                    ellipse_data_buffer[i] = 0;
                    ellipse_data_buffer[i + 1] = 0;
                    ellipse_data_buffer[i + 2] = 0;
                    ellipse_data_buffer[i + 3] = 0;
                }
            }
        }

        let offset_x = (self.width as isize) / 2;
        let offset_y = (self.height as isize) / 2;

        for brush_y in 0..self.height {
            for brush_x in 0..self.width {
                let brush_pixel_idx = (brush_y * self.width + brush_x) * 4;
                if brush_pixel_idx + 3 >= ellipse_data_buffer.len() {
                    continue;
                }

                let r = ellipse_data_buffer[brush_pixel_idx];
                let g = ellipse_data_buffer[brush_pixel_idx + 1];
                let b = ellipse_data_buffer[brush_pixel_idx + 2];
                let a = ellipse_data_buffer[brush_pixel_idx + 3];

                if a == 0 {
                    continue;
                }

                let target_x = (position.x as isize) + (brush_x as isize) - offset_x;
                let target_y = (position.y as isize) + (brush_y as isize) - offset_y;

                if target_x < 0 || target_y < 0 {
                    continue;
                }
                let target_x_usize = target_x as usize;
                let target_y_usize = target_y as usize;

                if target_x_usize >= data_dim.x || target_y_usize >= data_dim.y {
                    continue;
                }

                let target_pixel_idx = (target_y_usize * data_dim.x + target_x_usize) * 4;
                if target_pixel_idx + 3 >= data.len() {
                    continue;
                }

                data[target_pixel_idx] = r;
                data[target_pixel_idx + 1] = g;
                data[target_pixel_idx + 2] = b;
                data[target_pixel_idx + 3] = a;
            }
        }
    }
}
