
use wasm_bindgen::prelude::*;




#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub enum SolidType {
    Round,
    Square,
    Dots,
}


#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub enum ShapeStyle {
    Filled,
    Stroked,
    StrokedFilled
}
#[derive(Clone, Copy)]
#[wasm_bindgen]
pub enum StrokeAlign {
    Inside,
    Center,
    Outside,
}

#[wasm_bindgen]
impl Point {
    #[wasm_bindgen(constructor)]
    pub fn new(x: usize, y: usize) -> Self {
      Point { x, y }
    }

    pub fn to_render_point(&self) -> RenderPosition {
        RenderPosition {
            x: self.x as i32,
            y: self.y as i32,
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Point {
    pub x: usize,
    pub y: usize,
}

#[wasm_bindgen]
impl RenderPosition {
    #[wasm_bindgen(constructor)]
    pub fn new(x: i32, y: i32) -> Self {
      RenderPosition { x, y }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct RenderPosition {
    pub x: i32,
    pub y: i32,
}


#[wasm_bindgen]
impl Dimension {
    #[wasm_bindgen(constructor)]
    pub fn new(x: usize, y: usize) -> Self {
      Dimension { x, y }
    }

    pub fn to_viewport_dimension(&self) -> RenderDimension {
        RenderDimension {
            x: self.x as i32,
            y: self.y as i32,
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Dimension {
    pub x: usize,
    pub y: usize,
}

#[wasm_bindgen]
impl RenderDimension {
    #[wasm_bindgen(constructor)]
    pub fn new(x: i32, y: i32) -> Self {
      RenderDimension { x, y }
    }

    pub fn abs(&self) -> RenderDimension {
        RenderDimension {
            x: self.x.abs(),
            y: self.y.abs(),
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct RenderDimension {
    pub x: i32,
    pub y: i32,
}

// #[wasm_bindgen]
// impl Color {
//     #[wasm_bindgen(constructor)]
//     pub fn new(r: u8, g: u8, b: u8, a: u8) -> Self {
//       Color { r, g, b, a}
//     }
// }

#[wasm_bindgen]
#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8,
}

#[wasm_bindgen]
impl Color {
  #[wasm_bindgen(constructor)]
  pub fn new(r: u8, g: u8, b: u8, a: u8) -> Self {
      Color { r, g, b, a }
  }

  pub fn equals(&self, other: &Color) -> bool {
      self == other
  }
}
