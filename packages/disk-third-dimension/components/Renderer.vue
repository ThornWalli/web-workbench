<template>
  <div ref="rootEl">
    <canvas ref="canvasEl"></canvas>
    <slot v-if="ready"></slot>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ipoint } from '@js-basics/vector';
import domEvents from '@web-workbench/core/services/domEvents';
import { provide, ref, onUnmounted } from 'vue';
import { ReplaySubject, Subscription } from 'rxjs';
// import { RoomEnvironment } from '../classes/RoomEnvironment';

defineOptions({
  inheritAttrs: false
});

const $emit = defineEmits(['ready']);

const rootEl = ref();
const canvasEl = ref();

const dimension = ref();
const renderer = ref();
const scene = ref();
const camera = ref();

let animationLoopSubject = ref();

const setup = () => {
  animationLoopSubject.value = new ReplaySubject(0);
  dimension.value = ipoint(rootEl.value.offsetWidth, rootEl.value.offsetHeight);

  camera.value = createCamera(dimension.value);
  scene.value = markRaw(new THREE.Scene());

  renderer.value = markRaw(
    new THREE.WebGLRenderer({
      canvas: canvasEl.value,
      antialias: true
    })
  );
  const controls = new OrbitControls(camera.value, renderer.value.domElement);

  controls.update();

  subscription.add(
    domEvents.resize.subscribe(() => {
      dimension.value = ipoint(
        rootEl.value.offsetWidth,
        rootEl.value.offsetHeight
      );
      camera.value.aspect = dimension.value.x / dimension.value.y;
      camera.value.updateProjectionMatrix();
      renderer.value.setSize(dimension.value.x, dimension.value.y);
      controls.update();
    })
  );

  renderer.value.setPixelRatio(window.devicePixelRatio);
  renderer.value.setSize(dimension.value.x, dimension.value.y);

  renderer.value.setAnimationLoop((...args) => {
    animationLoopSubject.value.next(...args);
    renderer.value.render(scene.value, camera.value);
  });

  // const environment = new RoomEnvironment();
  // const pmremGenerator = new THREE.PMREMGenerator(renderer.value);

  // scene.value.background = new THREE.Color(0xbbbbbb);
  // scene.value.environment = pmremGenerator.fromScene(environment).texture;
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(-1, 1, -1);
  scene.value.add(directionalLight);
  // rootEl.value.appendChild(renderer.value.domElement);
  // const light = new THREE.AmbientLight(0xffffff); // soft white light.75);
  // light.position.set(1, 1, 1);
  // scene.value.add(light);
  // const hemiLight = new THREE.HemisphereLight(0xff0000, 0xff0000, 2);
  // hemiLight.color.setHSL(0.6, 1, 0.6);
  // hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  // hemiLight.position.set(0, 1, 0);
  // scene.value.add(hemiLight);

  // const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  // scene.value.add(hemiLightHelper);
};
const ready = ref(false);
const subscription = new Subscription();
onMounted(async () => {
  await setup();
  ready.value = true;
  $emit('ready');
});
onUnmounted(() => {
  subscription.unsubscribe();
  animationLoopSubject.value.complete();
});

provide('renderer', renderer);
provide('scene', scene);
provide('animationLoopSubject', animationLoopSubject);

const createCamera = dimension => {
  const camera = new THREE.PerspectiveCamera(
    70,
    dimension.x / dimension.y,
    0.01,
    10
  );
  camera.position.z = 1;
  camera.position.y = 0.5;

  return camera;
};
</script>
