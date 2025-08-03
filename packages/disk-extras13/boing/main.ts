import { ReplaySubject, Subscription } from 'rxjs';
import Grids from './classes/objects/Grids';
import Ball, {
  MESH_BALL_CONTAINER_NAME,
  MESH_BALL_NAME,
  MESH_SHADOW_NAME
} from './classes/objects/Ball';
import type { Scene } from 'three';
import { Box3, Vector2, Vector3 } from 'three';
import type Renderer from './classes/Renderer';
import domEvents from '@web-workbench/core/services/domEvents';

interface State {
  progressX: number;
  // rotation
  rotateSpeed: Vector3;
  rotateDirection: Vector3;
  // bounce

  velocityX: number;
  velocityY: number;
  gravity: number;
  bounceFactor: number;
}

function getDefaultState(): State {
  return {
    progressX: 0,
    // rotation
    rotateSpeed: new Vector3(0, 0.03, 0),
    rotateDirection: new Vector3(1, -1, 1),
    // bounce
    velocityX: 15 / 1000, // Startgeschwindigkeit in X - Richtung
    velocityY: -0.05, // Startgeschwindigkeit in Y-Richtung
    gravity: -1 / 2 / 1000, // Schwerkraft
    bounceFactor: -1 // Faktor für den Abprall
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SceneOptions {}

export function setupScene(renderer: Renderer, _options: SceneOptions) {
  const state: State = getDefaultState();
  const subscription = new Subscription();

  const scene = renderer.scene;

  if (!scene) {
    throw new Error('Scene is not available');
  }

  const grids = new Grids();
  const ball = new Ball();

  scene.add(grids.obj);
  scene.add(ball.obj);

  fitCameraToObject(renderer.camera, grids.obj, 9 / 10, renderer.controls);

  subscription.add(rotationAnimation({ state, scene, renderer }));

  const groundTrigger$ = new ReplaySubject<{ state: State }>();
  const wallTrigger$ = new ReplaySubject<{ state: State }>();

  subscription.add(
    domEvents.resize.subscribe(() => {
      fitCameraToObject(renderer.camera, grids.obj, 1, renderer.controls);
    })
  );
  subscription.add(
    bounceAnimation({
      state,
      ball,
      renderer,
      trigger: {
        groundTrigger$,
        wallTrigger$
      }
    })
  );

  return {
    subscription,
    groundTrigger$,
    wallTrigger$
  };
}

function rotationAnimation({
  state,
  scene,
  renderer
}: {
  state: State;
  scene: Scene;
  renderer: Renderer;
}) {
  return renderer.animationLoop$.subscribe(() => {
    const ballContainer = scene.getObjectByName(MESH_BALL_CONTAINER_NAME);
    const ball = scene.getObjectByName(MESH_BALL_NAME);

    if (!ballContainer || !ball) return;

    ball.rotation.set(
      ball.rotation.x + state.rotateSpeed.x * state.rotateDirection.x,
      ball.rotation.y + state.rotateSpeed.y * state.rotateDirection.y,
      ball.rotation.z + state.rotateSpeed.z * state.rotateDirection.z
    );
  });
}

function bounceAnimation({
  state,
  ball,
  renderer,
  trigger
}: {
  state: State;
  ball: Ball;
  renderer: Renderer;
  trigger: {
    groundTrigger$: ReplaySubject<{ state: State }>;
    wallTrigger$: ReplaySubject<{ state: State }>;
  };
}) {
  const scene = renderer.scene;
  if (!scene) {
    throw new Error('Scene is not available');
  }
  const ballRadius = ball.scale.x;

  const sizeX = (10 * (3 / 4)) / 2;
  const sizeY = 2;
  const dimension = new Vector2(sizeX, sizeY);

  const bounds = {
    left: -dimension.x / 2 - ballRadius,
    right: dimension.x / 2 + ballRadius,
    top: dimension.y - ballRadius,
    bottom: -dimension.y + ballRadius
  };
  let ballX = dimension.x - ballRadius;
  let ballY = -dimension.y + ballRadius;

  let optionalGroundSound = false;
  return renderer.animationLoop$.subscribe(() => {
    state.velocityY += state.gravity;
    ballY += state.velocityY;

    if (ballY < bounds.bottom) {
      ballY = bounds.bottom;
      state.velocityY *= state.bounceFactor;
      trigger.groundTrigger$.next({ state });
      optionalGroundSound = !optionalGroundSound;
    }

    ballX += state.velocityX;

    state.progressX = (ballX - bounds.left) / (bounds.right - bounds.left);

    if (ballX > bounds.right || ballX < bounds.left) {
      optionalGroundSound = false;
      state.velocityX *= -1;
      state.rotateDirection.y *= -1;
      if (ballX > bounds.right) {
        ballX = bounds.right;
        trigger.wallTrigger$.next({ state });
      } else if (ballX < bounds.left) {
        ballX = bounds.left;
        trigger.wallTrigger$.next({ state });
      }
    }
    ball.obj.position.set(ballX, ballY, 0);
    if (ball.obj.getObjectByName(MESH_SHADOW_NAME)) {
      ball.obj
        .getObjectByName(MESH_SHADOW_NAME)
        .position.set(state.progressX, 0, 0);
    }
  });
}

function fitCameraToObject(camera, object, offset = 1.2, controls = null) {
  const boundingBox = new Box3().setFromObject(object);

  const center = new Vector3();
  boundingBox.getCenter(center);

  const size = new Vector3();
  boundingBox.getSize(size);

  // Berechne die maximale Dimension des Objekts (Breite, Höhe, Tiefe)
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180); // FOV in Radiant umwandeln

  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  // Passe cameraZ an das Seitenverhältnis an, wenn das Objekt breiter als hoch ist
  // und das Kamerablickfeld (FOV) hauptsächlich durch die Höhe des Viewports bestimmt wird.
  const aspect = camera.aspect || 1; // Sicherstellen, dass camera.aspect existiert
  const viewportHeight = size.y;
  const viewportWidth = size.x;

  if (viewportWidth / viewportHeight > aspect) {
    // Objekt ist breiter als der Viewport, basiere die Entfernung auf der Breite
    cameraZ = Math.abs(size.x / 2 / Math.tan(fov / 2) / aspect);
  }

  // Wende den Offset an
  cameraZ *= offset;

  // Setze die Kamera-Position
  camera.position.set(center.x, center.y, center.z + cameraZ);

  // Richte die Kamera auf das Zentrum des Objekts aus
  camera.lookAt(center);

  // Aktualisiere OrbitControls, falls verwendet
  if (controls) {
    controls.target.copy(center);
    controls.update();
  }
}
