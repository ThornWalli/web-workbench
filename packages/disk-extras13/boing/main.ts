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

export enum EMIT_TYPE {
  GROUND = 'ground',
  WALL_LEFT = 'wall_left',
  WALL_RIGHT = 'wall_right'
}

interface State {
  progressX: number;
  directionX?: number;

  // rotation
  rotateSpeed: Vector3;
  rotateDirection: Vector3;
  // bounce

  velocity: Vector2;
  gravity: number;
  bounceFactor: number;
}

const factor = 1000;
const defaultVelocity = new Vector2(12 / factor, -55 / factor);
function getDefaultState(): State {
  return {
    progressX: 1,
    directionX: 1,
    // rotation
    rotateSpeed: new Vector3(0, 0.03, 0),
    rotateDirection: new Vector3(1, -1, 1),
    // bounce
    velocity: defaultVelocity.clone(),
    gravity: -0.5 / factor, // Schwerkraft
    bounceFactor: -1 // Faktor für den Abprall
  };
}

export interface SceneOptions {
  ballRadius?: number;
  ballSegments?: number;
  grids?: boolean;
  fitZoom?: number;
}

export function setupScene(renderer: Renderer, options?: SceneOptions) {
  options = {
    ballRadius: 1,
    ballSegments: 18,
    grids: true,
    fitZoom: 1.2,
    ...options
  };
  const state: State = getDefaultState();
  const subscription = new Subscription();

  const scene = renderer.scene;

  if (!scene) {
    throw new Error('Scene is not available');
  }
  const grids = new Grids();
  scene.add(grids.obj);

  if (!options.grids) {
    grids.obj.visible = false;
  }

  const ball = new Ball({
    radius: options?.ballRadius,
    segments: options?.ballSegments
  });
  scene.add(ball.obj);

  fitCamera(renderer, grids, options.fitZoom);

  subscription.add(rotationAnimation({ state, scene, renderer }));

  const emitter$ = new ReplaySubject<{
    state: State;
    type: EMIT_TYPE;
  }>();

  subscription.add(
    domEvents.resize$.subscribe(() => {
      fitCamera(renderer, grids, options.fitZoom);
    })
  );

  subscription.add(
    bounceAnimation({
      state,
      ball,
      renderer,
      emitter$
    })
  );

  return {
    subscription,
    emitter$
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
  emitter$
}: {
  state: State;
  ball: Ball;
  renderer: Renderer;
  emitter$: ReplaySubject<{ state: State; type: EMIT_TYPE }>;
}) {
  const scene = renderer.scene;
  if (!scene) {
    throw new Error('Scene is not available');
  }
  const ballRadius = ball.radius;

  const sizeX = 10 * (3 / 4);
  const sizeY = 2;
  const dimension = new Vector2(sizeX, sizeY);

  const bounds = {
    left: -dimension.x / 2 + (ballRadius * ball.scale.x) / 2,
    right: dimension.x / 2 - (ballRadius * ball.scale.x) / 2,
    top: dimension.y - ballRadius,
    bottom: -dimension.y + ballRadius * ball.scale.y
  };

  // start position (bottom right)
  state.progressX = 1;
  let ballX = bounds.right;
  let ballY = bounds.bottom;

  let initFrame = true;
  let optionalGroundSound = false;
  let lastProgressX;
  return renderer.animationLoop$.subscribe(() => {
    state.velocity.y += state.gravity;
    ballY += state.velocity.y;

    if (ballY < bounds.bottom) {
      // Setzt die Ball Y-Geschwindigkeit zurück.
      state.velocity.y = defaultVelocity.y;

      ballY = bounds.bottom;
      state.velocity.y *= state.bounceFactor;
      if (!initFrame) {
        emitter$.next({ state, type: EMIT_TYPE.GROUND });
      }
      optionalGroundSound = !optionalGroundSound;
    }

    ballX += state.velocity.x;

    lastProgressX = state.progressX;
    state.progressX = (ballX - bounds.left) / (bounds.right - bounds.left);
    state.directionX = state.progressX > lastProgressX ? 1 : -1;

    if (ballX > bounds.right || ballX < bounds.left) {
      optionalGroundSound = false;
      state.velocity.x *= -1;
      state.rotateDirection.y *= -1;
      if (ballX > bounds.right) {
        ballX = bounds.right;
        if (!initFrame) {
          emitter$.next({ state, type: EMIT_TYPE.WALL_RIGHT });
        }
      } else if (ballX < bounds.left) {
        ballX = bounds.left;
        if (!initFrame) {
          emitter$.next({ state, type: EMIT_TYPE.WALL_LEFT });
        }
      }
    }
    ball.obj.position.set(ballX, ballY, 0);
    if (ball.obj.getObjectByName(MESH_SHADOW_NAME)) {
      ball.obj
        .getObjectByName(MESH_SHADOW_NAME)
        .position.set(state.progressX, 0, 0);
    }

    initFrame = false;
  });
}

function fitCamera(renderer: Renderer, grids: Grids, fitZoom: number) {
  fitCameraToObject(renderer.camera, grids.obj, fitZoom, renderer.controls);
}
