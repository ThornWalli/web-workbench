import {
  BufferGeometry,
  Euler,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Object3D,
  Vector2,
  Vector3
} from 'three';
import type { BaseObject } from '../../types';

export const MESH_BALL_NAME = 'ball';
export const MESH_BALL_CONTAINER_NAME = 'ballContainer';
export const MESH_ROTATE_CONTAINER_NAME = 'rotateContainer';
export const MESH_SHADOW_ROTATE_CONTAINER_NAME = 'shadowRotateContainer';

export default class Grids implements BaseObject {
  obj: Object3D;

  constructor() {
    const obj = new Object3D();
    const grids = createGrids();
    grids.forEach(grid => obj.add(grid));
    this.obj = obj;
  }
}

function createGrids(position: Vector3 = new Vector3(0, 0, 0)) {
  const size = 10 * (3 / 4);
  const backgroundRationY = 3 / 4;

  const gridConfig = {
    XY: {
      size: new Vector2(size, size * backgroundRationY),
      divisions: [15, 12],
      position: new Vector3(0, 0.75 + (1 / 4) * (1 / 4), -1),
      rotation: new Euler(Math.PI / 2, 0, 0)
    },

    XZ: {
      size: new Vector2(size, size * (1 / 4)),
      divisions: [15, 5],
      position: new Vector3(0, -2, -0.25 * (1 / 4)),
      rotation: new Euler(0, 0, 0)
    }
  };

  const color = 0x9900cc;
  const gridXY = createRectangularGrid(
    gridConfig.XY.size.x,
    gridConfig.XY.size.y,
    gridConfig.XY.divisions[0],
    gridConfig.XY.divisions[1],
    color
  );
  gridXY.name = 'wall';
  gridXY.position.copy(gridConfig.XY.position.add(position));
  gridXY.rotation.copy(gridConfig.XY.rotation);

  const gridXZ = createRectangularGrid(
    gridConfig.XZ.size.x,
    gridConfig.XZ.size.y,
    gridConfig.XZ.divisions[0],
    gridConfig.XZ.divisions[1],
    color
  );
  gridXZ.name = 'ground';
  gridXZ.position.copy(gridConfig.XZ.position.add(position));
  gridXZ.rotation.copy(gridConfig.XZ.rotation);

  return [gridXY, gridXZ];
}

function createRectangularGrid(
  width,
  depth,
  divisionsX,
  divisionsZ,
  lineColor,
  centerLineColor?: number
) {
  const geometry = new BufferGeometry();
  const vertices = [];

  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  for (let i = 0; i <= divisionsZ; i++) {
    const z = (i / divisionsZ) * depth - halfDepth;
    vertices.push(-halfWidth, 0, z, halfWidth, 0, z);
  }
  for (let i = 0; i <= divisionsX; i++) {
    const x = (i / divisionsX) * width - halfWidth;
    vertices.push(x, 0, -halfDepth, x, 0, halfDepth);
  }

  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

  const material = new LineBasicMaterial({
    color: lineColor || 0x444444
  });
  const grid = new LineSegments(geometry, material);
  if (centerLineColor) {
    const centerGeometry = new BufferGeometry();
    const centerVertices = [
      -halfWidth,
      0,
      0,
      halfWidth,
      0,
      0,
      0,
      0,
      -halfDepth,
      0,
      0,
      halfDepth
    ];
    centerGeometry.setAttribute(
      'position',
      new Float32BufferAttribute(centerVertices, 3)
    );
    const centerMaterial = new LineBasicMaterial({
      color: centerLineColor
    });
    const centerLines = new LineSegments(centerGeometry, centerMaterial);
    grid.add(centerLines);
  }

  return grid;
}
