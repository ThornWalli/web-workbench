<!-- eslint-disable complexity -->
<script setup>
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import MapDescription from '../classes/MapDescription';

const $props = defineProps({
  size: {
    type: Number,
    default: 0.2
  },
  map: {
    type: MapDescription,
    default: 0.2
  },
  wireframe: {
    type: Boolean,
    default: false
  }
});

const scene = inject('scene');

const subscription = new Subscription();
const animationLoopSubject = inject('animationLoopSubject');

let group;
const mesh = ref();

onMounted(() => {
  group = new THREE.Group();

  const geometry = new THREE.SphereGeometry($props.size / 2, 16, 8);
  const material = new THREE.MeshToonMaterial({
    color: 0xffff00,
    wireframe: $props.wireframe
  });
  mesh.value = markRaw(new THREE.Mesh(geometry, material));
  mesh.value.position.set(0, $props.size / 2, 0);
  mesh.value.castShadow = true;
  mesh.value.receiveShadow = true;
  group.add(mesh.value);

  scene.value.add(group);

  let dX = 0.005;
  mesh.value.position.x += 0 * $props.size;
  subscription.add(
    animationLoopSubject.value.subscribe(() => {
      // mesh.value.rotation.y = time / 1000;
      mesh.value.position.x += dX * $props.size;

      const type = $props.map.getTypeByPosition({
        x: Math.round(mesh.value.position.x * (1 / $props.size)),
        y: Math.round(mesh.value.position.y * (1 / $props.size)),
        z: Math.round(mesh.value.position.z * (1 / $props.size))
      });
      if (type) {
        const position = $props.map.getPointByPosition(mesh.value.position);
        console.log('test2', position.y);
        mesh.value.position.y =
          $props.size / 2 + (position.y * $props.size) / 2;
      }
      if (
        mesh.value.position.x > 4 * $props.size ||
        mesh.value.position.x < 0 * $props.size
      ) {
        dX *= -1;
      }
    })
  );
});

onUnmounted(() => {
  scene.value.remove(group);
  subscription.unsubscribe();
});
</script>
