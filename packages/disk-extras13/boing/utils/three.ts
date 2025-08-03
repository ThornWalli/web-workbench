import { Box3, MathUtils, Vector3, type PerspectiveCamera } from 'three';

export function fitCameraToObject(
  camera: PerspectiveCamera,
  object,
  offset = 1.2,
  controls = null
) {
  const boundingBox = new Box3().setFromObject(object);

  const center = new Vector3();
  boundingBox.getCenter(center);

  const size = new Vector3();
  boundingBox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * MathUtils.DEG2RAD;
  const verticalDistance = size.y / (2 * Math.tan(fov / 2));

  const aspect = camera.aspect || 1;
  const horizontalDistance = size.x / aspect / (2 * Math.tan(fov / 2));

  let cameraZ = Math.max(verticalDistance, horizontalDistance);
  cameraZ *= offset;
  camera.position.set(center.x, center.y, center.z + cameraZ);
  camera.lookAt(center);

  if (controls) {
    controls.target.copy(center);
    controls.update();
  }

  const distanceToCenter = camera.position.distanceTo(center);

  camera.near = Math.max(0.1, distanceToCenter - maxDim * 1.5);
  camera.far = distanceToCenter + maxDim * 1.5;

  camera.updateProjectionMatrix();
}
