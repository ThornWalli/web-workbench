mod internal;

use crate::{enums, types};
use std::sync::{Mutex, OnceLock};

pub static GLOBAL_BRUSH: OnceLock<Mutex<Box<WasmBrush>>> = OnceLock::new();

pub struct WasmBrush {
    pub(crate) brush: Brush,
}

impl WasmBrush {
    pub fn solid(
        brush_mode: enums::BrushMode,
        solid_type: enums::SolidType,
        size: usize,
        primary_color: types::Color,
        secondary_color: types::Color,
    ) -> Self {
        let brush_type = BrushType::Solid(solid_type, size, primary_color);
        WasmBrush {
            brush: Brush::new(
                brush_type,
                brush_mode,
                types::Dimension { x: size, y: size },
                primary_color,
                secondary_color,
            ),
        }
    }
    pub fn dots(
        brush_mode: enums::BrushMode,
        dimension: types::Dimension,
        primary_color: types::Color,
        secondary_color: types::Color,
    ) -> Self {
        let brush_type = BrushType::Dots(dimension, primary_color);
        WasmBrush {
            brush: Brush::new(
                brush_type,
                brush_mode,
                dimension,
                primary_color,
                secondary_color,
            ),
        }
    }
    pub fn from_data(
        brush_mode: enums::BrushMode,
        image_data: Vec<u8>,
        dimension: types::Dimension,
        primary_color: types::Color,
        secondary_color: types::Color,
    ) -> Self {
        let brush_type = BrushType::Data(dimension, image_data);
        WasmBrush {
            brush: Brush::new(
                brush_type,
                brush_mode,
                dimension,
                primary_color,
                secondary_color,
            ),
        }
    }
}

pub trait BrushTrait {
    fn draw(&self, data: &mut [u8], data_dim: types::Dimension, position: types::Point, seed: u64);
}

pub struct Brush {
    pub brush_type: BrushType,
    pub brush_mode: enums::BrushMode,
    pub(crate) dimension: types::Dimension,
    pub primary_color: types::Color,
    pub secondary_color: types::Color,
}

impl Brush {
    pub fn new(
        brush_type: BrushType,
        brush_mode: enums::BrushMode,
        dimension: types::Dimension,
        primary_color: types::Color,
        secondary_color: types::Color,
    ) -> Self {
        Brush {
            brush_type,
            brush_mode,
            dimension,
            primary_color,
            secondary_color,
        }
    }
}

pub enum BrushType {
    Solid(enums::SolidType, usize, types::Color),
    Data(types::Dimension, Vec<u8>),
    Dots(types::Dimension, types::Color),
}

impl BrushTrait for Brush {
    fn draw(&self, data: &mut [u8], data_dim: types::Dimension, position: types::Point, seed: u64) {
        match &self.brush_type {
            BrushType::Solid(solid_type, size, color) => {
                let brush_internal = internal::solid::SolidBrushInternal::new(
                    solid_type.clone(),
                    *size,
                    *color,
                    self.brush_mode,
                );
                brush_internal.draw(data, data_dim, position, seed);
            }
            BrushType::Data(dimension, brush_data) => {
                let brush_internal = internal::data::DataBrushInternal::new(
                    brush_data.clone(),
                    dimension.x,
                    dimension.y,
                    self.brush_mode,
                );
                brush_internal.draw(data, data_dim, position, 0);
            }
            BrushType::Dots(dimension, color) => {
                let brush_internal = internal::dots::DotsBrushInternal::new(
                    *color,
                    dimension.x,
                    dimension.y,
                    self.brush_mode,
                );
                brush_internal.draw(data, data_dim, position, seed);
            }
        }
    }
}
