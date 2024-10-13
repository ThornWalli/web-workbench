<!-- eslint-disable complexity -->
<script setup>
import { ref } from 'vue';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { IVector, ivector } from '@js-basics/vector';
import MapDescription from '../classes/MapDescription';

const $props = defineProps({
  map: {
    type: MapDescription,
    required: true
  },
  size: {
    type: IVector,
    default: () => ivector(0.2, 0.1, 0.2)
  },
  wireframe: {
    type: Boolean,
    default: false
  }
});

const scene = inject('scene');

const subscription = new Subscription();

const group = ref();

const getYPosition = ({ x, z }) => {
  const matrix = $props.map.depthMatrix;
  const power = Math.sqrt(matrix.length);
  const index = Math.floor(z) * power + Math.floor(x);
  return matrix[Number(index)] * $props.size.y;
};

defineExpose({
  getYPosition
});

onMounted(() => {
  const map = $props.map;
  const size = $props.size;

  group.value = markRaw(new THREE.Group());
  map.points.forEach(pointDescription => {
    const scaledPoint = ivector(() => pointDescription.point * size);
    // debugger;
    const geometry = new THREE.BufferGeometry().setFromPoints(
      pointDescription.points.map(point => {
        return new THREE.Vector3(
          point.x * size.x,
          point.y * size.z,
          point.z * size.y
        );
      })
    );
    const material = new THREE.MeshToonMaterial({
      color: map.getType(pointDescription.point).color,
      side: THREE.DoubleSide,
      wireframe: $props.wireframe
    });
    geometry.computeVertexNormals();
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(scaledPoint.x, scaledPoint.y, scaledPoint.z);
    plane.rotateX(-Math.PI / 2);

    plane.castShadow = true;
    plane.receiveShadow = true;
    group.value.add(plane);
  });

  group.value.position.set(
    (map.power * size.x) / -2,
    0,
    (map.power * size.z) / -2
  );
  scene.value.add(group.value);

  addDirectionCones(group.value, { dimension: map.dimension, size });

  // createTestPlane(scene.value, { size });

  // points.push(new THREE.Vector3(-0.2, 0.2, 0));

  // const geometry = new THREE.PlaneGeometry(1, 1);
  // mesh.value = markRaw(new THREE.Mesh(geometry, material));
  // scene.value.add(mesh.value);
  // const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  // const material = new THREE.MeshNormalMaterial();

  // mesh.value = markRaw(new THREE.Mesh(geometry, material));
  // scene.value.add(mesh.value);
  // subscription.add(
  //   animationLoopSubject.value.subscribe(time => {
  //     mesh.value.rotation.y = time / 1000;
  //   })
  // );
});

onUnmounted(() => {
  scene.value.remove(group.value);
  subscription.unsubscribe();
});

// const createTestPlane = (scene, { size }) => {
//   const geometry = new THREE.PlaneGeometry(size.x, size.z);
//   const material = new THREE.MeshBasicMaterial({
//     color: 0xffff00,
//     side: THREE.DoubleSide
//   });
//   const plane = new THREE.Mesh(geometry, material);
//   plane.rotateX(Math.PI / 2);
//   scene.add(plane);
// };

const addDirectionCones = (group, { dimension, size }) => {
  const geometry = new THREE.ConeGeometry(0.05, 0.1, 32);
  const materiald = new THREE.MeshToonMaterial({ color: 0xff0000 });
  const cone = new THREE.Mesh(geometry, materiald);
  cone.rotateZ(-Math.PI / 2);
  cone.position.set(
    dimension.x * size.x + size.x,
    0,
    (dimension.z * size.z) / 2
  );

  group.add(cone);
};
</script>

<!-- const addDirectionCones = (group, { dimension, size }) => {
  const geometry = new THREE.ConeGeometry(0.05, 0.1, 32);
  const materiald = new THREE.MeshToonMaterial({ color: 0xff0000 });
  const cone = new THREE.Mesh(geometry, materiald);
  cone.rotateZ(-Math.PI / 2);
  cone.position.set(
    dimension.x * size.x + size.x,
    0,
    (dimension.z * size.z) / 2
  );

  group.add(cone);
};

const getPoints = ({ point, matrix, index, power, size }) => {
  let east =
    matrix[(Math.floor(index / power) - 1) * power + (index % power)] || 0;
  let west =
    matrix[(Math.floor(index / power) + 1) * power + (index % power)] || 0;

  let north =
    matrix[Math.floor(index / power) * power - 1 + (index % power)] || 0;
  let south =
    matrix[Math.floor(index / power) * power + 1 + (index % power)] || 0;

  east -= east !== 0 && point.y / size.y;
  west -= west !== 0 && point.y / size.y;
  north -= north !== 0 && point.y / size.y;
  south -= south !== 0 && point.y / size.y;

  let northWest =
    matrix[(Math.floor(index / power) + 1) * power - 1 + (index % power)] || 0;
  let northEast =
    matrix[(Math.floor(index / power) - 1) * power - 1 + (index % power)] || 0;
  let southWest =
    matrix[(Math.floor(index / power) + 1) * power + 1 + (index % power)] || 0;
  let southEast =
    matrix[(Math.floor(index / power) - 1) * power + 1 + (index % power)] || 0;

  northWest -= northWest && point.y / size.y;
  northEast -= northEast && point.y / size.y;
  southWest -= southWest && point.y / size.y;
  southEast -= southEast && point.y / size.y;

  const points = [
    // (North Face)
    ivector(
      0.5,
      -0.5,
      east / 2 ||
        west / 2 ||
        north / 2 ||
        south / 2 ||
        northWest / 2 ||
        northEast / 2 ||
        southWest / 2 ||
        southEast / 2
    ), // 0:  Center
    ivector(1, -1, west || south || southWest), // 1:  NE
    ivector(1, 0, east || south || southEast), // 2:  NW

    // (East Face)
    ivector(
      0.5,
      -0.5,
      east / 2 ||
        west / 2 ||
        north / 2 ||
        south / 2 ||
        northWest / 2 ||
        northEast / 2 ||
        southWest / 2 ||
        southEast / 2
    ), // 3:  Center
    ivector(0, -1, west || north || northWest), // 4:  SE
    ivector(1, -1, west || south || southWest), // 5:  NE

    // (South Face)
    ivector(
      0.5,
      -0.5,
      east / 2 ||
        west / 2 ||
        north / 2 ||
        south / 2 ||
        northWest / 2 ||
        northEast / 2 ||
        southWest / 2 ||
        southEast / 2
    ), // 6:  Center
    ivector(0, 0, east || north || northEast), // 7:  SW
    ivector(0, -1, west || north || northWest), // 8:  SE

    // (West Face)
    ivector(
      0.5,
      -0.5,
      east / 2 ||
        west / 2 ||
        north / 2 ||
        south / 2 ||
        northWest / 2 ||
        northEast / 2 ||
        southWest / 2 ||
        southEast / 2
    ), // 9:  Center
    ivector(1, 0, east || south || southEast), // 10: NW
    ivector(0, 0, east || north || northEast) // 11: SW
  ];

  return points.map(
    point =>
      new THREE.Vector3(point.x * size.x, point.y * size.z, point.z * size.y)
  );
}; -->
