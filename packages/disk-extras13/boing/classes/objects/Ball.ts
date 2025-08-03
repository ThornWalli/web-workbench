import {
  CanvasTexture,
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  Object3D,
  RepeatWrapping,
  SphereGeometry,
  Vector3
} from 'three';
import type { BaseObject } from '../../types';

export const MESH_BALL_NAME = 'ball';
export const MESH_SHADOW_NAME = 'shadow';
export const MESH_BALL_CONTAINER_NAME = 'ballContainer';
export const MESH_ROTATE_CONTAINER_NAME = 'rotateContainer';
export const MESH_SHADOW_ROTATE_CONTAINER_NAME = 'shadowRotateContainer';

export default class Ball implements BaseObject {
  obj: Object3D;
  radius: number;
  segments: number;
  scale: Vector3;

  constructor(
    options: {
      radius: number;
      segments: number;
      scale: Vector3;
    } = {
      radius: 1,
      segments: 18,
      scale: new Vector3(1, 1, 1)
    }
  ) {
    this.radius = options.radius;
    this.segments = options.segments;
    this.scale = options.scale;

    const container = new Object3D();
    container.add(createShadowMesh(this.radius, this.segments, this.scale));
    container.add(createMesh(this.radius, this.segments, this.scale));
    this.obj = container;
  }
}

function createTexture(segments: number) {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 64;
  textureCanvas.height = 32;
  const context = textureCanvas.getContext('2d');
  context.fillStyle = '#ff0000';
  context.fillRect(0, 0, 32, 16);
  context.fillStyle = '#ffffff';
  context.fillRect(32, 0, 32, 16);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 16, 32, 16);
  context.fillStyle = '#ff0000';
  context.fillRect(32, 16, 32, 16);

  const texture = new CanvasTexture(textureCanvas);
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;

  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(segments / 2, segments / 4);

  return texture;
}

function createShadowMesh(radius: number, segments: number, scale: Vector3) {
  const mesh = new Mesh(
    new CircleGeometry(radius, segments),
    new MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.3,
      transparent: true
    })
  );
  mesh.name = MESH_SHADOW_NAME;
  mesh.scale.copy(scale);
  const rotateContainer = new Object3D();
  rotateContainer.name = MESH_SHADOW_ROTATE_CONTAINER_NAME;
  mesh.rotateZ(-Math.PI / 8);
  rotateContainer.position.set(0.125, 0, -1);

  rotateContainer.add(mesh);
  return rotateContainer;
}

function createMesh(radius: number, segments: number, scale: Vector3) {
  const texture = createTexture(segments);

  const ballRadius = radius ?? 1;
  const geometry = new SphereGeometry(
    ballRadius,
    segments,
    segments / 2,
    0,
    Math.PI * 2,
    0,
    Math.PI
  );

  const material = new MeshBasicMaterial({ map: texture });
  const ball = new Mesh(geometry, material);
  ball.name = MESH_BALL_NAME;
  const container = new Object3D();
  container.name = MESH_BALL_CONTAINER_NAME;

  const rotateContainer = new Object3D();
  rotateContainer.name = MESH_ROTATE_CONTAINER_NAME;
  rotateContainer.rotateZ(-Math.PI / 8);

  ball.scale.copy(scale);

  rotateContainer.add(ball);
  container.add(rotateContainer);

  return container;
}
