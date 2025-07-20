use serde::Deserialize;
use wasm_bindgen::prelude::wasm_bindgen;

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

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
#[wasm_bindgen]
pub enum BrushMode {
    Normal,
    Replace,
    Multiply,
    Screen,
    Overlay,
    SoftLight,
    HardLight,
    Difference,
    Exclusion,
    ColorBurn,
    LinearBurn,
    ColorDodge,
    LinearDodge,
    VividLight,
    LinearLight,
    PinLight,
    HardMix,
    Substract,
    Divide,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
#[wasm_bindgen]
pub enum ResizeType {
    NearestNeighbor,
    Bilinear,
    Bicubic,
    Lanczos3,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
#[wasm_bindgen]
pub enum ImageOperation {
    Invert,
    Grayscale,
    Sepia,
    AdjustBrightness,
    AdjustContrast,
    AdjustSaturation,
    Sharpen,
    Blur,
    Emboss,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
#[wasm_bindgen]
pub enum RotateType {
    Rotate90Degrees,
    Rotate180Degrees,
    Rotate270Degrees,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
#[wasm_bindgen]
pub enum FlipType {
    Horizontal,
    Vertical,
}

#[wasm_bindgen]
#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy, Deserialize)]
pub enum BlendMode {
    Normal,
    Multiply,
    Screen,
    Overlay,
    Darken,
    Lighten,
    ColorDodge,
    ColorBurn,
    HardLight,
    SoftLight,
    Difference,
    Exclusion,
}
