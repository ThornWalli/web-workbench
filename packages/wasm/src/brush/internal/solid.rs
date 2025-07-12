use crate::{
    brush::BrushTrait,
    draw::{
        self,
        ellipse::{self, EllipseOptions},
        rectangle::{self, RectangleOptions},
    },
    enums::{self},
    pixel::set_pixels,
    types::{self},
};

use rand::{Rng, rng};

pub struct SolidBrushInternal {
    solid_type: enums::SolidType,
    color: types::Color,
    size: usize,
    brush_mode: enums::BrushMode,
}

impl SolidBrushInternal {
    pub fn new(
        solid_type: enums::SolidType,
        size: usize,
        color: types::Color,
        brush_mode: enums::BrushMode,
    ) -> Self {
        SolidBrushInternal {
            solid_type,
            color,
            size,
            brush_mode,
        }
    }
}

impl BrushTrait for SolidBrushInternal {
    fn draw(&self, data: &mut [u8], data_dim: types::Dimension, position: types::Point) {
        let mut cb = |x: i32, y: i32, _is_stroke| {
            if x >= 0 && x < (data_dim.x as i32) && y >= 0 && y < (data_dim.y as i32) {
                let _ = set_pixels(
                    data,
                    data_dim,
                    types::Point {
                        x: x as usize,
                        y: y as usize,
                    },
                    &[self.color.r, self.color.g, self.color.b, self.color.a],
                    types::Dimension { x: 1, y: 1 },
                    self.brush_mode,
                );
            }
        };

        match &self.solid_type {
            enums::SolidType::Round => {
                if CIRCLE_BRUSHES_DATA.len() > self.size {
                    let brush_data = CIRCLE_BRUSHES_DATA[self.size - 1];
                    for i in (0..brush_data.len()).step_by(1) {
                        let x = (i % self.size) + (position.x as usize);
                        let y = i / self.size + (position.y as usize);
                        if brush_data[i] == 1 {
                            cb(x as i32, y as i32, false);
                        }
                    }
                } else {
                    ellipse::draw(
                        cb,
                        data_dim,
                        position.to_render_point(),
                        types::RenderDimension {
                            x: self.size as i32,
                            y: self.size as i32,
                        },
                        0,
                        EllipseOptions {
                            style: enums::ShapeStyle::Filled,
                            line_options: None,
                            interpolate_segments: false,
                        },
                    );
                }
            }
            enums::SolidType::Square => {
                rectangle::draw(
                    cb,
                    data_dim,
                    position.to_render_point(),
                    types::RenderDimension {
                        x: self.size as i32,
                        y: self.size as i32,
                    },
                    self.size,
                    RectangleOptions {
                        style: enums::ShapeStyle::Filled,
                        stroke_align: enums::StrokeAlign::Center,
                        line_options: None,
                    },
                );
            }
            enums::SolidType::Dots => {
                let mut ellipse_data_buffer = vec![0; (self.size * self.size * 4) as usize];

                let ellipse_opts = EllipseOptions {
                    style: enums::ShapeStyle::Filled,
                    line_options: None,
                    interpolate_segments: false,
                };

                draw::ellipse::draw(
                    |x_local, y_local, _is_stroke| {
                        if x_local >= 0
                            && x_local < (self.size as i32)
                            && y_local >= 0
                            && y_local < (self.size as i32)
                        {
                            let target_pixel_idx =
                                ((y_local as usize) * self.size + (x_local as usize)) * 4;
                            if target_pixel_idx + 3 < ellipse_data_buffer.len() {
                                ellipse_data_buffer[target_pixel_idx] = self.color.r;
                                ellipse_data_buffer[target_pixel_idx + 1] = self.color.g;
                                ellipse_data_buffer[target_pixel_idx + 2] = self.color.b;
                                ellipse_data_buffer[target_pixel_idx + 3] = self.color.a;
                            }
                        }
                    },
                    types::Dimension {
                        x: self.size,
                        y: self.size,
                    },
                    types::RenderPosition { x: 0, y: 0 },
                    (types::Dimension {
                        x: self.size,
                        y: self.size,
                    })
                    .to_viewport_dimension(),
                    self.size,
                    ellipse_opts,
                );

                // let mut filled_pixels = 0;
                for i in (0..ellipse_data_buffer.len()).step_by(4) {
                    if ellipse_data_buffer[i + 3] > 0 {
                        // filled_pixels += 1;
                    }
                }

                let mut rng = rng();
                let avg_size = ((self.size as f64) + (self.size as f64)) / 2.0;
                let threshold = 0.25 / avg_size;

                // let mut removed_pixels = 0;
                for i in (0..ellipse_data_buffer.len()).step_by(4) {
                    if ellipse_data_buffer[i + 3] > 0 {
                        if rng.random::<f64>() >= threshold {
                            ellipse_data_buffer[i] = 0;
                            ellipse_data_buffer[i + 1] = 0;
                            ellipse_data_buffer[i + 2] = 0;
                            ellipse_data_buffer[i + 3] = 0;
                            // removed_pixels += 1;
                        }
                    }
                }
                // let mut remaining_pixels = 0;
                // for i in (0..ellipse_data_buffer.len()).step_by(4) {
                //     if ellipse_data_buffer[i + 3] > 0 {
                //         remaining_pixels += 1;
                //     }
                // }

                // let mut copied_pixels = 0;
                for brush_y in 0..self.size {
                    for brush_x in 0..self.size {
                        let brush_pixel_idx = (brush_y * self.size + brush_x) * 4;
                        if brush_pixel_idx + 3 >= ellipse_data_buffer.len() {
                            continue;
                        }

                        // let r = ellipse_data_buffer[brush_pixel_idx];
                        // let g = ellipse_data_buffer[brush_pixel_idx + 1];
                        // let b = ellipse_data_buffer[brush_pixel_idx + 2];
                        let a = ellipse_data_buffer[brush_pixel_idx + 3];

                        if a == 0 {
                            continue;
                        }

                        let target_x = (position.x as isize) + (brush_x as isize);
                        let target_y = (position.y as isize) + (brush_y as isize);

                        if target_x < 0 || target_y < 0 {
                            continue;
                        }
                        let target_x_usize = target_x as usize;
                        let target_y_usize = target_y as usize;

                        if target_x_usize >= data_dim.x || target_y_usize >= data_dim.y {
                            continue;
                        }

                        cb(target_x as i32, target_y as i32, false);
                        // copied_pixels += 1;
                    }
                }
            }
        }
    }
}

pub const CIRCLE_BRUSHES_DATA: &'static [&'static [usize]] = &[
    &[1],
    &[1, 1, 1, 1],
    &[0, 1, 0, 1, 1, 1, 0, 1, 0],
    &[0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
    &[
        0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
    ],
    &[
        0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 0, 0,
    ],
    &[
        0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0,
    ],
];
