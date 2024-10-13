<script setup>
import { Subscription } from 'rxjs';
import * as THREE from 'three';

const scene = inject('scene');

const subscription = new Subscription();
const animationLoopSubject = inject('animationLoopSubject');

const mesh = ref();

onMounted(() => {
  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshNormalMaterial();

  mesh.value = markRaw(new THREE.Mesh(geometry, material));
  scene.value.add(mesh.value);
  subscription.add(
    animationLoopSubject.value.subscribe(time => {
      mesh.value.rotation.y = time / 1000;
    })
  );
});

onUnmounted(() => {
  scene.value.remove(mesh.value);
  subscription.unsubscribe();
});
</script>
