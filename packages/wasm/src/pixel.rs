use crate::types::{Dimension, Point};

pub fn get_pixels(
    data: &mut [u8],
    data_dim: Dimension,
    position: Point,
    dimension: Dimension,
) -> Vec<u8> {
    let mut pixels = Vec::with_capacity((dimension.x * dimension.y * 4) as usize);
    for y in position.y..position.y + dimension.y {
        for x in position.x..position.x + dimension.x {
            let target_pixel_idx = (y * data_dim.x + x) * 4;
            if target_pixel_idx + 3 < data.len() {
                pixels.push(data[target_pixel_idx]);
                pixels.push(data[target_pixel_idx + 1]);
                pixels.push(data[target_pixel_idx + 2]);
                pixels.push(data[target_pixel_idx + 3]);
            } else {
                pixels.extend_from_slice(&[0, 0, 0, 0]);
            }
        }
    }
    pixels
}

pub fn set_pixels(
    data: &mut [u8],
    data_dim: Dimension,
    position: Point,
    partial_data: &[u8],
    partial_data_dim: Dimension,
    replace: bool,
) {
    let _pixels: Vec<u8> = Vec::with_capacity((partial_data.len() / 4) * 4);
    for i in (0..partial_data.len()).step_by(4) {
        let _x = (i / 4) % partial_data_dim.x;
        let _y = i / 4 / partial_data_dim.x;
        let x = position.x + _x;
        let y = position.y + _y;

        if x < data_dim.x && y < data_dim.y {
            let target_pixel_idx = (y * data_dim.x + x) * 4;
            if target_pixel_idx + 3 < data.len() {
                if replace {
                    data[target_pixel_idx] = partial_data[i];
                    data[target_pixel_idx + 1] = partial_data[i + 1];
                    data[target_pixel_idx + 2] = partial_data[i + 2];
                    data[target_pixel_idx + 3] = partial_data[i + 3];
                } else {
                    let src_r = partial_data[i] as f32;
                    let src_g = partial_data[i + 1] as f32;
                    let src_b = partial_data[i + 2] as f32;
                    let src_a = partial_data[i + 3] as f32 / 255.0;

                    let dest_r = data[target_pixel_idx] as f32;
                    let dest_g = data[target_pixel_idx + 1] as f32;
                    let dest_b = data[target_pixel_idx + 2] as f32;
                    let dest_a = data[target_pixel_idx + 3] as f32 / 255.0;

                    let out_a = src_a + dest_a * (1. - src_a);
                    data[target_pixel_idx] =
                        (src_r * src_a + (dest_r * dest_a * (1.0 - src_a)) / out_a) as u8;
                    data[target_pixel_idx + 1] =
                        (src_g * src_a + (dest_g * dest_a * (1.0 - src_a)) / out_a) as u8;
                    data[target_pixel_idx + 2] =
                        (src_b * src_a + (dest_b * dest_a * (1.0 - src_a)) / out_a) as u8;
                    data[target_pixel_idx + 3] = (out_a * 255.0) as u8;
                }
            }
        }
    }
}
