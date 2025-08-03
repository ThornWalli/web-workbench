import type { Object3D } from 'three';
import type { SceneOptions } from './main';

export interface RendererOptions {
  pixelSize: number;
  controls: boolean;
  debugGui: boolean;
}
export interface Model {
  rendererOptions: RendererOptions;
  options: SceneOptions;
  actions: {
    setControls: (controls: boolean) => void;
    setPixelSize: (pixelSize: number) => void;
    setBallRadius: (ballRadius: number) => void;
    close: () => void;
    openInfo: () => void;
  };
  // Add any additional properties needed for the model
}

export interface BaseObject {
  obj: Object3D;
}
