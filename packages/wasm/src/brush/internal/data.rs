use crate::{brush::BrushTrait, enums, types};

pub struct DataBrushInternal {
    data: Vec<u8>,
    width: usize,
    height: usize,
}

impl DataBrushInternal {
    pub fn new(data: Vec<u8>, width: usize, height: usize, _brush_mode: enums::BrushMode) -> Self {
        DataBrushInternal {
            data,
            width,
            height,
        }
    }
}

impl BrushTrait for DataBrushInternal {
    fn draw(&self, data: &mut [u8], data_dim: types::Dimension, position: types::Point, _seed: u64) {
        if self.data.is_empty() {
            return;
        }

        let offset_x = (self.width as isize) / 2;
        let offset_y = (self.height as isize) / 2;

        for brush_y in 0..self.height {
            for brush_x in 0..self.width {
                let brush_pixel_idx = (brush_y * self.width + brush_x) * 4;
                if brush_pixel_idx + 3 >= self.data.len() {
                    continue;
                }

                let r = self.data[brush_pixel_idx];
                let g = self.data[brush_pixel_idx + 1];
                let b = self.data[brush_pixel_idx + 2];
                let a = self.data[brush_pixel_idx + 3];

                if a == 0 {
                    continue;
                }

                let target_x = (position.x as isize) + (brush_x as isize) - offset_x;
                let target_y = (position.y as isize) + (brush_y as isize) - offset_y;

                if target_x < 0 || target_y < 0 {
                    continue;
                }
                let target_x = target_x as usize;
                let target_y = target_y as usize;

                if target_x >= data_dim.x || target_y >= data_dim.y {
                    continue;
                }

                let target_pixel_idx = (target_y * data_dim.x + target_x) * 4;
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
