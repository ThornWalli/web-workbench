use wasm_bindgen::prelude::*;

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
#[wasm_bindgen]
pub enum SolidType {
    Round,
    Square,
    Dots,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
#[wasm_bindgen]
pub enum ShapeStyle {
    Filled,
    Stroked,
    StrokedFilled,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
#[wasm_bindgen]
pub enum StrokeAlign {
    Inside,
    Center,
    Outside,
}
