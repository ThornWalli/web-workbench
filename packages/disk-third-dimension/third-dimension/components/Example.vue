<script lang="ts" setup>
import type { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { inject, markRaw, onMounted, onUnmounted, ref, type Ref } from 'vue';

const scene = inject<Ref<THREE.Scene>>('scene');

const subscription = new Subscription();
const animationLoopSubject = inject<Ref<Observable<number>>>(
  'animationLoopSubject'
);

const mesh = ref();

onMounted(() => {
  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshNormalMaterial();

  mesh.value = markRaw(new THREE.Mesh(geometry, material));
  scene?.value.add(mesh.value);
  subscription.add(
    animationLoopSubject?.value.subscribe(time => {
      mesh.value.rotation.y = time / 1000;
    })
  );
});

onUnmounted(() => {
  scene?.value.remove(mesh.value);
  subscription.unsubscribe();
});
</script>
