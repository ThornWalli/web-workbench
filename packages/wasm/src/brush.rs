use rand::{Rng, rng};

use crate::{
    draw::{
        self,
        ellipse::{self, EllipseOptions},
        rectangle::{self, RectangleOptions},
    },
    enums::{ShapeStyle, SolidType, StrokeAlign},
    set_pixels,
    types::{self, Color, Dimension, Point, RenderDimension, RenderPosition},
};

pub struct WasmBrush {
    pub(crate) brush: Brush,
}

impl WasmBrush {
    pub fn solid(
        solid_type: SolidType,
        size: usize,
        primary_color: Color,
        secondary_color: types::Color,
    ) -> Self {
        let brush_type = BrushType::Solid(solid_type, size, primary_color);
        WasmBrush {
            brush: Brush::new(
                Dimension { x: size, y: size },
                brush_type,
                primary_color,
                secondary_color,
            ),
        }
    }
    pub fn dots(dimension: Dimension, primary_color: Color, secondary_color: Color) -> Self {
        let brush_type = BrushType::Dots(dimension, primary_color);
        WasmBrush {
            brush: Brush::new(dimension, brush_type, primary_color, secondary_color),
        }
    }
    pub fn from_data(
        image_data: Vec<u8>,
        dimension: Dimension,
        primary_color: Color,
        secondary_color: Color,
    ) -> Self {
        let brush_type = BrushType::Data(dimension, image_data);
        WasmBrush {
            brush: Brush::new(dimension, brush_type, primary_color, secondary_color),
        }
    }
}

pub trait BrushTrait {
    fn draw(&self, data: &mut [u8], data_dim: Dimension, position: Point);
}

pub struct Brush {
    pub brush_type: BrushType,
    pub(crate) dimension: Dimension,
    pub primary_color: Color,
    pub secondary_color: Color,
}

impl Brush {
    pub fn new(
        dimension: Dimension,
        brush_type: BrushType,
        primary_color: Color,
        secondary_color: Color,
    ) -> Self {
        Brush {
            dimension,
            brush_type,
            primary_color,
            secondary_color,
        }
    }
}

pub enum BrushType {
    Solid(SolidType, usize, Color),
    Data(Dimension, Vec<u8>),
    Dots(Dimension, Color),
}

impl BrushTrait for Brush {
    fn draw(&self, data: &mut [u8], data_dim: Dimension, position: Point) {
        match &self.brush_type {
            BrushType::Solid(solid_type, size, color) => {
                let brush_internal = SolidBrushInternal::new(solid_type.clone(), *size, *color);
                brush_internal.draw(data, data_dim, position);
            }
            BrushType::Data(dimension, brush_data) => {
                let brush_internal =
                    DataBrushInternal::new(brush_data.clone(), dimension.x, dimension.y);
                brush_internal.draw(data, data_dim, position);
            }
            BrushType::Dots(dimension, color) => {
                let brush_internal = DotsBrushInternal::new(*color, dimension.x, dimension.y);
                brush_internal.draw(data, data_dim, position);
            }
        }
    }
}

struct DataBrushInternal {
    data: Vec<u8>,
    width: usize,
    height: usize,
}

impl DataBrushInternal {
    fn new(data: Vec<u8>, width: usize, height: usize) -> Self {
        DataBrushInternal {
            data: data,
            width: width,
            height: height,
        }
    }
}

impl BrushTrait for DataBrushInternal {
    fn draw(&self, data: &mut [u8], data_dim: Dimension, position: Point) {
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

struct DotsBrushInternal {
    color: Color,
    width: usize,
    height: usize,
}

impl DotsBrushInternal {
    fn new(color: Color, width: usize, height: usize) -> Self {
        DotsBrushInternal {
            color: color,
            width: width,
            height: height,
        }
    }
}

impl BrushTrait for DotsBrushInternal {
    fn draw(&self, data: &mut [u8], data_dim: Dimension, position: Point) {
        let mut ellipse_data_buffer = vec![0; (self.width * self.height * 4) as usize];

        let ellipse_opts = EllipseOptions {
            style: ShapeStyle::Filled,
            line_options: None,
            interpolate_segments: false,
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
            Dimension {
                x: self.width,
                y: self.height,
            },
            RenderPosition { x: 0, y: 0 },
            (Dimension {
                x: self.width,
                y: self.height,
            })
            .to_viewport_dimension(),
            self.width,
            ellipse_opts,
        );

        // let mut filled_pixels = 0;
        // for i in (0..ellipse_data_buffer.len()).step_by(4) {
        //     if ellipse_data_buffer[i + 3] > 0 {
        //         filled_pixels += 1;
        //     }
        // }

        let mut rng = rng();
        let avg_size = ((self.width as f64) + (self.height as f64)) / 2.0;
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

        let offset_x = (self.width as isize) / 2;
        let offset_y = (self.height as isize) / 2;

        // let mut copied_pixels = 0;
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
                // copied_pixels += 1;
            }
        }
    }
}

struct SolidBrushInternal {
    solid_type: SolidType,
    color: Color,
    size: usize,
}

impl SolidBrushInternal {
    fn new(solid_type: SolidType, size: usize, color: Color) -> Self {
        SolidBrushInternal {
            solid_type: solid_type,
            color: color,
            size: size,
        }
    }
}

impl BrushTrait for SolidBrushInternal {
    fn draw(&self, data: &mut [u8], data_dim: Dimension, position: Point) {
        let mut cb = |x: i32, y: i32, _is_stroke| {
            if x >= 0 && x < (data_dim.x as i32) && y >= 0 && y < (data_dim.y as i32) {
                let _ = set_pixels(
                    data,
                    data_dim,
                    Point {
                        x: x as usize,
                        y: y as usize,
                    },
                    &[self.color.r, self.color.g, self.color.b, self.color.a],
                    Dimension { x: 1, y: 1 },
                    false,
                );
            }
        };

        match &self.solid_type {
            SolidType::Round => {
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
                        RenderDimension {
                            x: self.size as i32,
                            y: self.size as i32,
                        },
                        0,
                        EllipseOptions {
                            style: ShapeStyle::Filled,
                            line_options: None,
                            interpolate_segments: false,
                        },
                    );
                }
            }
            SolidType::Square => {
                rectangle::draw(
                    cb,
                    data_dim,
                    position.to_render_point(),
                    RenderDimension {
                        x: self.size as i32,
                        y: self.size as i32,
                    },
                    self.size,
                    RectangleOptions {
                        style: ShapeStyle::Filled,
                        stroke_align: StrokeAlign::Center,
                        line_options: None,
                    },
                );
            }
            SolidType::Dots => {
                let mut ellipse_data_buffer = vec![0; (self.size * self.size * 4) as usize];

                let ellipse_opts = EllipseOptions {
                    style: ShapeStyle::Filled,
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
                    Dimension {
                        x: self.size,
                        y: self.size,
                    },
                    RenderPosition { x: 0, y: 0 },
                    (Dimension {
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
