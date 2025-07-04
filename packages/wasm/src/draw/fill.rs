use std::collections::{HashSet, VecDeque};

use crate::types::{Color, RenderDimension, RenderPosition};

pub fn draw<F>(mut cb: F, data_dim: RenderDimension, position: RenderPosition, color: Color)
where
    F: FnMut(i32, i32, Color, bool) -> Color,
{
    if position.x < 0 || position.x >= data_dim.x || position.y < 0 || position.y >= data_dim.y {
        eprintln!("Warnung: Startpunkt außerhalb der Bildgrenzen.");
        return;
    }

    let target_color = cb(position.x, position.y, color, true);

    if color.equals(&target_color) {
        return;
    }

    let mut queue: VecDeque<(i32, i32)> = VecDeque::new();
    queue.push_back((position.x, position.y));

    let mut visited: HashSet<(i32, i32)> = HashSet::new();
    visited.insert((position.x, position.y));

    let directions = [(0, 1), (0, -1), (1, 0), (-1, 0)];

    while let Some((x, y)) = queue.pop_front() {
        cb(x, y, color, false);

        for &(dx, dy) in &directions {
            let next_x = x + dx;
            let next_y = y + dy;

            if next_x < 0 || next_x >= data_dim.x || next_y < 0 || next_y >= data_dim.y {
                continue;
            }

            if !visited.contains(&(next_x, next_y)) {
                let current_color = cb(next_x, next_y, color, true);

                if current_color.equals(&target_color) {
                    visited.insert((next_x, next_y));
                    queue.push_back((next_x, next_y));
                }
            }
        }
    }
}
