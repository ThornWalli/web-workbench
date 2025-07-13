use image::{self};

use crate::{enums, types, utils};

pub fn get_pixels(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
    dimension: types::Dimension,
) -> Vec<u8> {
    let img = utils::rgba8_vec_to_dynamic_image(data.to_vec(), data_dim);
    let data = utils::dynamic_image_to_rgba8_vec(img.unwrap().crop(
        position.x as u32,
        position.y as u32,
        dimension.x as u32,
        dimension.y as u32,
    ));

    data
}

pub fn set_pixels(
    data: &mut [u8],
    data_dim: types::Dimension,
    position: types::Point,
    partial_data: &[u8],
    partial_data_dim: types::Dimension,
    brush_mode: enums::BrushMode,
) {
    let mut data_buffer = utils::rgba8_slice_to_image_buffer(data, data_dim).unwrap();
    let partial_data_buffer =
        utils::rgba8_vec_to_image_buffer(partial_data.to_vec(), partial_data_dim).unwrap();

    let (partial_width, partial_height) = partial_data_buffer.dimensions();
    let (data_width, data_height) = data_buffer.dimensions();

    match brush_mode {
        enums::BrushMode::Replace => {
            for py in 0..partial_height {
                for px in 0..partial_width {
                    let target_x = position.x as u32 + px;
                    let target_y = position.y as u32 + py;

                    if target_x < data_width && target_y < data_height {
                        let src_pixel = partial_data_buffer.get_pixel(px, py);
                        data_buffer.put_pixel(
                            target_x,
                            target_y,
                            image::Rgba([src_pixel[0], src_pixel[1], src_pixel[2], src_pixel[3]]),
                        );
                    }
                }
            }
        }
        enums::BrushMode::Normal => {
            image::imageops::overlay(
                &mut data_buffer,
                &partial_data_buffer,
                position.x as i64,
                position.y as i64,
            );
        }
        _ => {
            for py in 0..partial_height {
                for px in 0..partial_width {
                    let target_x = position.x as u32 + px;
                    let target_y = position.y as u32 + py;

                    if target_x < data_width && target_y < data_height {
                        let src_pixel = partial_data_buffer.get_pixel(px, py);
                        let dst_pixel = data_buffer.get_pixel(target_x, target_y);

                        let mut new_pixel = [0u8; 4];
                        for i in 0..3 {
                            let src_norm = src_pixel[i] as f32 / 255.0;
                            let dst_norm = dst_pixel[i] as f32 / 255.0;

                            let blended_norm = blend_channel(src_norm, dst_norm, &brush_mode);

                            new_pixel[i] = (blended_norm * 255.0).round() as u8;
                        }

                        new_pixel[3] = src_pixel[3];

                        data_buffer.put_pixel(target_x, target_y, image::Rgba(new_pixel));
                    }
                }
            }
        }
    }
}

fn blend_channel(src: f32, dst: f32, mode: &enums::BrushMode) -> f32 {
    match mode {
        enums::BrushMode::Normal | enums::BrushMode::Replace => src,
        enums::BrushMode::Multiply => src * dst,
        enums::BrushMode::Screen => 1.0 - ((1.0 - src) * (1.0 - dst)),
        enums::BrushMode::Overlay => {
            if dst < 0.5 {
                2.0 * src * dst
            } else {
                1.0 - 2.0 * (1.0 - src) * (1.0 - dst)
            }
        }
        enums::BrushMode::SoftLight => {
            if src < 0.5 {
                dst - (1.0 - 2.0 * src) * dst * (1.0 - dst)
            } else {
                dst + (2.0 * src - 1.0)
                    * (if dst < 0.25 {
                        ((16.0 * dst - 12.0) * dst + 4.0) * dst
                    } else {
                        dst.sqrt()
                    } - dst)
            }
        }
        enums::BrushMode::HardLight => {
            if src < 0.5 {
                2.0 * src * dst
            } else {
                1.0 - 2.0 * (1.0 - src) * (1.0 - dst)
            }
        }
        enums::BrushMode::Difference => (src - dst).abs(),
        enums::BrushMode::Exclusion => src + dst - 2.0 * src * dst,
        enums::BrushMode::ColorBurn => {
            if src == 0.0 {
                0.0
            } else if dst == 1.0 {
                1.0
            } else {
                1.0 - (1.0 - dst).min(src) / src
            }
        }
        enums::BrushMode::LinearBurn => src + dst - 1.0,
        enums::BrushMode::ColorDodge => {
            if src == 1.0 {
                1.0
            } else if dst == 0.0 {
                0.0
            } else {
                (dst / (1.0 - src)).min(1.0)
            }
        }
        enums::BrushMode::LinearDodge => src + dst,
        enums::BrushMode::VividLight => {
            if src < 0.5 {
                if src == 0.0 {
                    0.0
                } else {
                    0.0f32.max(1.0 - (1.0 - dst) / (2.0 * src))
                }
            } else {
                if src == 1.0 {
                    1.0
                } else {
                    1.0f32.min(dst / (2.0 * (1.0 - src)))
                }
            }
        }
        enums::BrushMode::LinearLight => {
            if src < 0.5 {
                0.0f32.max(dst + 2.0 * src - 1.0)
            } else {
                1.0f32.min(dst + 2.0 * (src - 0.5))
            }
        }
        enums::BrushMode::PinLight => {
            if src < 0.5 {
                dst.min(2.0 * src)
            } else {
                dst.max(2.0 * src - 1.0)
            }
        }
        enums::BrushMode::HardMix => {
            let blended = blend_channel(src, dst, &enums::BrushMode::VividLight);
            if blended < 0.5 { 0.0 } else { 1.0 }
        }
        enums::BrushMode::Substract => 0.0f32.max(dst - src),
        enums::BrushMode::Divide => {
            if src == 0.0 {
                0.0
            } else {
                1.0f32.min(dst / src)
            }
        }
    }
}
