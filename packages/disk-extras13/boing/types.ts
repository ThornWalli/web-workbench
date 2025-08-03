import type { Object3D } from 'three';
import type { SceneOptions } from './main';
import type Renderer from './components/Renderer.vue';

export interface Model {
  rendererOptions?: InstanceType<typeof Renderer>['$props'];
  options?: SceneOptions;
  actions: {
    close: () => void;
    openInfo: () => void;
  };
  // Add any additional properties needed for the model
}

export interface BaseObject {
  obj: Object3D;
}
