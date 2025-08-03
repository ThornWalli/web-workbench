import { ReplaySubject, Subscription } from 'rxjs';
import Grids from './classes/objects/Grids';
import Ball, {
  MESH_BALL_CONTAINER_NAME,
  MESH_BALL_NAME,
  MESH_SHADOW_NAME
} from './classes/objects/Ball';
import type { Scene } from 'three';
import { Vector2, Vector3 } from 'three';
import type Renderer from './classes/Renderer';
import domEvents from '@web-workbench/core/services/domEvents';
import { fitCameraToObject } from './utils/three';

interface State {
  progressX: number;
  // rotation
  rotateSpeed: Vector3;
  rotateDirection: Vector3;
  // bounce

  velocity: Vector2;
  gravity: number;
  bounceFactor: number;
}

const defaultVelocity = new Vector2(15 / 1000, -0.05);
function getDefaultState(): State {
  return {
    progressX: 0,
    // rotation
    rotateSpeed: new Vector3(0, 0.03, 0),
    rotateDirection: new Vector3(1, -1, 1),
    // bounce
    velocity: defaultVelocity.clone(),
    gravity: -1 / 2 / 1000, // Schwerkraft
    bounceFactor: -1 // Faktor für den Abprall
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SceneOptions {}

export function setupScene(renderer: Renderer, _options: SceneOptions) {
  const state: State = getDefaultState();
  const subscription = new Subscription();
  const fitZoom = 12 / 10;

  const scene = renderer.scene;

  if (!scene) {
    throw new Error('Scene is not available');
  }

  const grids = new Grids();
  const ball = new Ball();

  scene.add(grids.obj);
  scene.add(ball.obj);

  fitCamera(renderer, grids, fitZoom);

  subscription.add(rotationAnimation({ state, scene, renderer }));

  const groundTrigger$ = new ReplaySubject<{ state: State }>();
  const wallTrigger$ = new ReplaySubject<{ state: State }>();

  subscription.add(
    domEvents.resize.subscribe(() => {
      fitCamera(renderer, grids, fitZoom);
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
    state.velocity.y += state.gravity;
    ballY += state.velocity.y;

    if (ballY < bounds.bottom) {
      // Setzt die Ball Y-Geschwindigkeit zurück.
      state.velocity.y = defaultVelocity.y;

      ballY = bounds.bottom;
      state.velocity.y *= state.bounceFactor;
      trigger.groundTrigger$.next({ state });
      optionalGroundSound = !optionalGroundSound;
    }

    ballX += state.velocity.x;

    state.progressX = (ballX - bounds.left) / (bounds.right - bounds.left);

    if (ballX > bounds.right || ballX < bounds.left) {
      optionalGroundSound = false;
      state.velocity.x *= -1;
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
function fitCamera(renderer: Renderer, grids: Grids, fitZoom: number) {
  fitCameraToObject(renderer.camera, grids.obj, fitZoom, renderer.controls);
}
