use crate::types;

pub fn rgba8_slice_to_image_buffer<'a>(
    data_slice: &'a mut [u8],
    dim: types::Dimension,
) -> Option<image::ImageBuffer<image::Rgba<u8>, &'a mut [u8]>> {
    let expected_len = (dim.x * dim.y * 4) as usize;
    if data_slice.len() != expected_len {
        return None;
    }
    image::ImageBuffer::from_raw(dim.x as u32, dim.y as u32, data_slice)
}

pub fn rgba8_vec_to_dynamic_image(
    data: Vec<u8>,
    data_dim: types::Dimension,
) -> Option<image::DynamicImage> {
    if data.len() != (data_dim.x * data_dim.y * 4) as usize {
        return None; // Invalid data length for RGBA image dimensions.
    }
    let img = image::ImageBuffer::from_raw(data_dim.x as u32, data_dim.y as u32, data)?;
    Some(image::DynamicImage::ImageRgba8(img))
}

pub fn dynamic_image_to_rgba8_vec(img: image::DynamicImage) -> Vec<u8> {
    img.to_rgba8().into_raw()
}


pub fn rgba8_vec_to_image_buffer(
    data: Vec<u8>,
    data_dim: types::Dimension,
) -> Option<image::ImageBuffer<image::Rgba<u8>, Vec<u8>>> {
    if data.len() != (data_dim.x * data_dim.y * 4) as usize {
        return None; // Invalid data length for RGBA image dimensions.
    }
    image::ImageBuffer::from_vec(data_dim.x as u32, data_dim.y as u32, data)
}
