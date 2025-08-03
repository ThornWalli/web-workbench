import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ReplaySubject } from 'rxjs';
import {
  Color,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  type Vector2
} from 'three';

export default class Renderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  renderPixelatedPass: RenderPixelatedPass;
  composer: EffectComposer;
  animationLoop$ = new ReplaySubject(0);
  dimension: Vector2;
  pixelSize: number;

  constructor(
    canvas: HTMLCanvasElement,
    dimension: Vector2,
    options: { pixelSize?: number; controls?: boolean; debugGui?: boolean } = {}
  ) {
    this.initScene();
    this.initCamera(dimension);

    this.dimension = dimension;
    this.pixelSize = options.pixelSize ?? 3;

    const renderer = new WebGLRenderer({
      canvas,
      antialias: false
    });
    renderer.setClearColor(0xaaaaaa);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer = renderer;

    this.initComposer();
    if (options.controls) {
      this.initControls();
    }

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(dimension.x, dimension.y);
    this.composer.setSize(dimension.x, dimension.y);

    renderer.setAnimationLoop(time => {
      this.animationLoop$.next(time);
      this.renderer.render(this.scene, this.camera);
      this.composer.render();
    });

    if (options.debugGui) {
      debugGui(this);
    }
  }
  destroy() {
    this.animationLoop$.complete();
  }

  resize(dimension: Vector2) {
    this.dimension = dimension;

    this.renderer.setSize(dimension.x, dimension.y);
    this.camera.aspect = dimension.x / dimension.y;
    this.camera.updateProjectionMatrix();

    this.controls?.update();
  }

  // #region inits

  initScene(color: Color = new Color(0xaaaaaa)) {
    const scene = new Scene();
    scene.background = color;
    this.scene = scene;
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }

  initComposer() {
    const composer = new EffectComposer(this.renderer);
    const renderPixelatedPass = new RenderPixelatedPass(
      this.pixelSize,
      this.scene,
      this.camera
    );
    renderPixelatedPass.normalEdgeStrength = 0;
    renderPixelatedPass.depthEdgeStrength = 0;
    composer.addPass(renderPixelatedPass);

    this.composer = composer;
    this.renderPixelatedPass = renderPixelatedPass;

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
  }

  initCamera(dimension: Vector2) {
    const camera = new PerspectiveCamera(
      45,
      dimension.x / dimension.y,
      0.01,
      1000
    );

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    this.camera = camera;
  }

  // #endregion
}

function debugGui(context: Renderer) {
  const gui = new GUI();
  const params = {
    pixelSize: context.pixelSize,
    normalEdgeStrength: 0,
    depthEdgeStrength: 0
  };
  gui
    .add(params, 'pixelSize')
    .min(1)
    .max(16)
    .step(1)
    .onChange(() => {
      context.renderPixelatedPass.setPixelSize(params.pixelSize);
    });
  gui
    .add(context.renderPixelatedPass, 'normalEdgeStrength')
    .min(0)
    .max(2)
    .step(0.05);
  gui
    .add(context.renderPixelatedPass, 'depthEdgeStrength')
    .min(0)
    .max(1)
    .step(0.05);
}
