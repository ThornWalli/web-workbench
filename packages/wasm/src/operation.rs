use rayon::{iter::ParallelIterator, slice::ParallelSliceMut};

use crate::types::Dimension;

pub fn invert_image(data: &mut [u8], data_dim: Dimension) -> Vec<u8> {
    if data.len() != ((data_dim.x * data_dim.y * 4) as usize) {
        panic!("Invalid data length for RGBA image dimensions.");
    }

    let mut copy_data = data.to_vec();
    copy_data.par_chunks_mut(4).for_each(|pixel| {
        if pixel.len() == 4 {
            pixel[0] = 255 - pixel[0];
            pixel[1] = 255 - pixel[1];
            pixel[2] = 255 - pixel[2];
        }
    });

    copy_data
}

pub fn grayscale_image(data: &mut [u8], data_dim: Dimension) -> Vec<u8> {
    if data.len() != ((data_dim.x * data_dim.y * 4) as usize) {
        panic!("Invalid data length for RGBA image dimensions.");
    }

    let mut copy_data = data.to_vec();
    copy_data.par_chunks_mut(4).for_each(|pixel| {
        if pixel.len() == 4 {
            let r = pixel[0] as f32;
            let g = pixel[1] as f32;
            let b = pixel[2] as f32;

            let gray_f = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            let gray = gray_f.round() as u8;

            pixel[0] = gray;
            pixel[1] = gray;
            pixel[2] = gray;
        }
    });

    copy_data
}

pub fn sepia(data: &mut [u8], data_dim: Dimension) -> Vec<u8> {
    if data.len() != ((data_dim.x * data_dim.y * 4) as usize) {
        panic!("Invalid data length for RGBA image dimensions.");
    }

    let mut copy_data = data.to_vec();
    copy_data.par_chunks_mut(4).for_each(|pixel| {
        let r = pixel[0];
        let g = pixel[1];
        let b = pixel[2];

        if pixel.len() == 4 {
            let r = r as f64;
            let g = g as f64;
            let b = b as f64;

            pixel[0] = (r * 0.393 + g * 0.769 + b * 0.189).round().min(255.0) as u8;
            pixel[1] = (r * 0.349 + g * 0.686 + b * 0.168).round().min(255.0) as u8;
            pixel[2] = (r * 0.272 + g * 0.534 + b * 0.131).round().min(255.0) as u8;
        }
    });

    copy_data
}

pub fn adjust_brightness(data: &mut [u8], data_dim: Dimension, value: f32) -> Vec<u8> {
    if data.len() != ((data_dim.x * data_dim.y * 4) as usize) {
        panic!("Invalid data length for RGBA image dimensions.");
    }

    let value_f64: f64 = (value as f64) * (255 as f64);
    let mut copy_data = data.to_vec();
    copy_data.par_chunks_mut(4).for_each(|pixel| {
        if pixel.len() == 4 {
            let min = 0.0;
            let max = 255.0;
            pixel[0] = ((pixel[0] as f64) + value_f64).clamp(min, max) as u8;
            pixel[1] = ((pixel[1] as f64) + value_f64).clamp(min, max) as u8;
            pixel[2] = ((pixel[2] as f64) + value_f64).clamp(min, max) as u8;
        }
    });

    copy_data.to_vec()
}

pub fn adjust_contrast(data: &mut [u8], data_dim: Dimension, value: f32) -> Vec<u8> {
    if data.len() != ((data_dim.x * data_dim.y * 4) as usize) {
        panic!("Invalid data length for RGBA image dimensions.");
    }

    let value_f64: f64 = (value as f64) * (255 as f64);
    let mut copy_data = data.to_vec();
    copy_data.par_chunks_mut(4).for_each(|pixel| {
        if pixel.len() == 4 {
            let min = 0.0;
            let max = 255.0;
            pixel[0] = ((pixel[0] as f64) + value_f64).clamp(min, max) as u8;
            pixel[1] = ((pixel[1] as f64) + value_f64).clamp(min, max) as u8;
            pixel[2] = ((pixel[2] as f64) + value_f64).clamp(min, max) as u8;
        }
    });

    copy_data.to_vec()
}

pub fn adjust_saturation(data: &mut [u8], data_dim: Dimension, factor: f32) -> Vec<u8> {
    if data.len() != ((data_dim.x * data_dim.y * 4) as usize) {
        panic!("Invalid data length for RGBA image dimensions.");
    }
    let mut copy_data = data.to_vec();
    copy_data.par_chunks_mut(4).for_each(|pixel| {
        if pixel.len() == 4 {
            let r = pixel[0] as f32;
            let g = pixel[1] as f32;
            let b = pixel[2] as f32;

            let gray = 0.299 * r + 0.587 * g + 0.114 * b;
            let min = 0.0;
            let max = 255.0;

            pixel[0] = (gray + (r - gray) * ((1 as f32) + factor)).clamp(min, max) as u8;
            pixel[1] = (gray + (g - gray) * ((1 as f32) + factor)).clamp(min, max) as u8;
            pixel[2] = (gray + (b - gray) * ((1 as f32) + factor)).clamp(min, max) as u8;
        }
    });

    copy_data
}

pub fn sharpen(data: &mut [u8], data_dim: Dimension, factor: f64) -> Vec<u8> {
    let kernel = [
        0.0,
        -factor,
        0.0,
        -factor,
        1.0 + 4.0 * factor,
        -factor,
        0.0,
        -factor,
        0.0,
    ];

    let new_data = apply_convolution(data, data_dim, &kernel, Some(1.0), Some(0.0));

    new_data
}

pub fn blur(data: &mut [u8], data_dim: Dimension, radius: f64) -> Vec<u8> {
    let kernel_size = (2.0 * radius + 1.0) as usize;
    let kernel: Vec<f64> = vec![1.0; kernel_size * kernel_size];
    let divisor = (kernel_size * kernel_size) as f64;

    let new_data = apply_convolution(data, data_dim, &kernel, Some(divisor), Some(0.0));

    new_data
}

pub fn emboss(data: &mut [u8], data_dim: Dimension, strength: f64) -> Vec<u8> {
    let kernel = [
        -2.0 * strength,
        -strength,
        0.0,
        -strength,
        1.0 + 4.0 * strength,
        -strength,
        0.0,
        -strength,
        -2.0 * strength,
    ];

    let new_data = apply_convolution(data, data_dim, &kernel, Some(1.0), Some(128.0));

    new_data
}

pub fn apply_convolution(
    data: &[u8],
    data_dim: Dimension,
    kernel: &[f64],
    divisor: Option<f64>,
    offset: Option<f64>,
) -> Vec<u8> {
    let mut new_data = data.to_vec();

    let actual_divisor = divisor.unwrap_or(1.0);
    let actual_offset = offset.unwrap_or(0.0);

    let kernel_size_f64 = (kernel.len() as f64).sqrt();
    let kernel_size = kernel_size_f64 as usize;

    if kernel_size_f64 * kernel_size_f64 != (kernel.len() as f64) {
        panic!("Kernel length must be a perfect square (e.g., 9 for 3x3, 25 for 5x5).");
    }

    let half_kernel = kernel_size / 2;

    for y in 0..data_dim.x {
        for x in 0..data_dim.y {
            let mut r: f64 = 0.0;
            let mut g: f64 = 0.0;
            let mut b: f64 = 0.0;

            for ky in 0..kernel_size {
                for kx in 0..kernel_size {
                    let pixel_x = x + kx - half_kernel;
                    let pixel_y = y + ky - half_kernel;

                    let current_pixel_color = get_pixel(data, data_dim.x, pixel_x, pixel_y);

                    let kernel_value = kernel[(ky * kernel_size + kx) as usize];

                    r += (current_pixel_color.r as f64) * kernel_value;
                    g += (current_pixel_color.g as f64) * kernel_value;
                    b += (current_pixel_color.b as f64) * kernel_value;
                }
            }

            let original_alpha_index =
                ((y as usize) * (data_dim.x as usize) + (x as usize)) * 4 + 3;
            let alpha = data[original_alpha_index];

            let final_r = (r / actual_divisor + actual_offset)
                .round()
                .clamp(0.0, 255.0) as u8;
            let final_g = (g / actual_divisor + actual_offset)
                .round()
                .clamp(0.0, 255.0) as u8;
            let final_b = (b / actual_divisor + actual_offset)
                .round()
                .clamp(0.0, 255.0) as u8;

            set_pixel(
                &mut new_data,
                data_dim.x,
                x,
                y,
                final_r,
                final_g,
                final_b,
                alpha,
            );
        }
    }

    new_data
}

use crate::types::Color;

fn get_pixel(data: &[u8], width: usize, x: usize, y: usize) -> Color {
    if x >= width || y >= data.len() / (width * 4) {
        return Color {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
        };
    }

    let start_index = ((y as usize) * (width as usize) + (x as usize)) * 4;

    if start_index + 3 < data.len() {
        Color {
            r: data[start_index],
            g: data[start_index + 1],
            b: data[start_index + 2],
            a: data[start_index + 3],
        }
    } else {
        Color {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
        }
    }
}

fn set_pixel(data: &mut [u8], width: usize, x: usize, y: usize, r: u8, g: u8, b: u8, a: u8) {
    if x >= width || y >= data.len() / (width * 4) {
        return;
    }

    let start_index = ((y as usize) * (width as usize) + (x as usize)) * 4;

    if start_index + 3 < data.len() {
        data[start_index] = r;
        data[start_index + 1] = g;
        data[start_index + 2] = b;
        data[start_index + 3] = a;
    }
}
