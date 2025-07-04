<!-- eslint-disable complexity -->
<script setup>
import { ref } from 'vue';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { ivector } from '@js-basics/vector';

const $props = defineProps({
  matrix: {
    type: Array,
    required: true
  }
});

const scene = inject('scene');

const subscription = new Subscription();
// const animationLoopSubject = inject('animationLoopSubject');

const group = ref();

onMounted(() => {
  // const material = new THREE.MeshNormalMaterial();

  const size = ivector(0.2, 0.2, 0.1);
  const matrix = $props.matrix || [
    // 0, 0, 0, 0, 1, 0, 0, 0, 0

    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0.4, 0, 0, 0, 0, 0, 0, 0
  ];
  const power = Math.sqrt(matrix.length);
  const preparedMatrix = matrix.map((z, index) => {
    const x = index % power;
    const y = Math.floor(index / power);
    return ivector(x * size.x, y * size.y, z * size.z);
  });
  console.log({ matrix, preparedMatrix });

  group.value = markRaw(new THREE.Group());
  const test = new THREE.Group();
  preparedMatrix.forEach((point, index) => {
    let top =
      matrix[(Math.floor(index / power) + 1) * power + (index % power)] || 0;
    let left =
      matrix[Math.floor(index / power) * power + 1 + (index % power)] || 0;

    let bottom =
      matrix[(Math.floor(index / power) - 1) * power + (index % power)] || 0;
    let right =
      matrix[Math.floor(index / power) * power - 1 + (index % power)] || 0;

    top -= top !== 0 && point.z / size.z;
    left -= left !== 0 && point.z / size.z;
    bottom -= bottom !== 0 && point.z / size.z;
    right -= right !== 0 && point.z / size.z;

    let bottomLeft =
      matrix[(Math.floor(index / power) + 1) * power + 1 + (index % power)] ||
      0;

    let bottomRight =
      matrix[(Math.floor(index / power) + 1) * power - 1 + (index % power)] ||
      0;

    let topLeft =
      matrix[(Math.floor(index / power) - 1) * power + 1 + (index % power)] ||
      0;

    let topRight =
      matrix[(Math.floor(index / power) - 1) * power - 1 + (index % power)] ||
      0;

    bottomLeft -= bottomLeft && point.z / size.z;
    bottomRight -= bottomRight && point.z / size.z;
    topLeft -= topLeft && point.z / size.z;
    topRight -= topRight && point.z / size.z;
    console.log(
      preparedMatrix[(Math.floor(index / power) + 1) * power + (index % power)],
      (Math.floor(index / power) + 1) * power + (index % power)
    );
    // bottomLeft -= point.z;
    // bottomRight -= point.z;
    // topLeft -= point.z;
    // topRight -= point.z;

    // const topIndex = (Math.floor(index / power) + 1) * power + (index % power);
    // if (top && preparedMatrix[topIndex]) {
    //   top -= 1 - preparedMatrix[topIndex].z / size.z;
    //   if (index === 12) {
    //     console.log('xxxx', preparedMatrix[topIndex]);
    //   }
    // }

    // const leftIndex = Math.floor(index / power) * power + 1 + (index % power);
    // const rightIndex = Math.floor(index / power) * power - 1 + (index % power);
    // if (right && preparedMatrix[rightIndex]) {
    //   // right -= 1 - preparedMatrix[rightIndex].z / size.z;
    //   if (index === 11) {
    //     console.log('zzzz', preparedMatrix[rightIndex]);
    //   }
    // }
    // if (index === 10) {
    //   console.log(
    //     [
    //       [topLeft, top, topRight].join(' '),
    //       [left, 'X', right].join(' '),
    //       [bottomLeft, bottom, bottomRight].join(' ')
    //     ].join('\n')
    //   );
    // }
    // if (index === 11) {
    //   console.log(
    //     {
    //       top,
    //       bottom,
    //       left,
    //       right,
    //       bottomLeft,
    //       bottomRight,
    //       topLeft,
    //       topRight
    //     },
    //     [
    //       ([topLeft, top, topRight].join(' '),
    //       [left, 'X', right].join(' '),
    //       [bottomLeft, bottom, bottomRight].join(' '))
    //     ].join('\n')
    //   );
    // }

    // if (index === 12) {
    //   console.log(
    //     [
    //       [topLeft, top, topRight].join(' '),
    //       [left, 'X', right].join(' '),
    //       [bottomLeft, bottom, bottomRight].join(' ')
    //     ].join('\n')
    //   );
    //   // top = 0;
    //   // bottom = 0;
    //   // left = 0;
    //   // right = 0;

    //   // bottomLeft = 0;
    //   // bottomRight = 0;
    //   // topLeft = 0;
    //   // topRight = 0;
    //   console.log({
    //     test: preparedMatrix[
    //       (Math.floor(index / power) + 1) * power + (index % power)
    //     ].z,
    //     pointZ: point.z,
    //     top,
    //     bottom,
    //     left,
    //     right,
    //     bottomLeft,
    //     bottomRight,
    //     topLeft,
    //     topRight
    //   });
    // }
    const points = [
      // top
      ivector(0, 1, top || bottomRight || right),
      ivector(1, 1, bottomLeft || top || left),
      ivector(
        0.5,
        0.5,
        top / 2 ||
          bottom / 2 ||
          left / 2 ||
          right / 2 ||
          bottomLeft / 2 ||
          topLeft / 2 ||
          bottomRight / 2 ||
          topRight / 2
      ),
      // bottom
      ivector(0, 0, bottom || right || topRight),

      ivector(1, 0, bottom || left || topLeft),
      ivector(
        0.5,
        0.5,
        top / 2 ||
          bottom / 2 ||
          left / 2 ||
          right / 2 ||
          bottomLeft / 2 ||
          topLeft / 2 ||
          bottomRight / 2 ||
          topRight / 2
      ),

      // left
      ivector(0, 0, bottom || right || topRight),
      ivector(0, 1, top || bottomRight || right),
      ivector(
        0.5,
        0.5,
        top / 2 ||
          bottom / 2 ||
          left / 2 ||
          right / 2 ||
          bottomLeft / 2 ||
          topLeft / 2 ||
          bottomRight / 2 ||
          topRight / 2
      ),

      // right
      ivector(1, 0, bottom || left || topLeft),
      ivector(1, 1, bottomLeft || top || left),
      ivector(
        0.5,
        0.5,
        top / 2 ||
          bottom / 2 ||
          left / 2 ||
          right / 2 ||
          bottomLeft / 2 ||
          topLeft / 2 ||
          bottomRight / 2 ||
          topRight / 2
      )
    ];

    const preparedPoints = points.map(point => {
      point = ivector(() => point * size);
      return new THREE.Vector3(point.x, point.y, point.z);
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(preparedPoints);

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.2 + (index / preparedMatrix.length) * 0.8, 0, 0),
      side: THREE.DoubleSide,
      wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(point.x, point.y, point.z);
    test.add(cube);
  });
  console.log(group.value);
  test.position.set(-0.3, -0.3, 0);
  group.value.add(test);
  // group.value.position.set(-0.3, -0.3, 0);
  group.value.rotation.set(Math.PI / -3, 0, Math.PI / -4);
  scene.value.add(group.value);
  const geometry = new THREE.ConeGeometry(0.05, 0.1, 32);
  const materiald = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const cone = new THREE.Mesh(geometry, materiald);
  cone.rotateY(Math.PI / 2);
  cone.position.set(0, 0.5, 0);
  group.value.add(cone);

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
</script>
