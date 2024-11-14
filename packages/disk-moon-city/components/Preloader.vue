<template>
  <div v-if="!hidden">
    {{ progress }}
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { images } from '../utils/preload';
import { from, lastValueFrom, mergeMap, tap, toArray } from 'rxjs';

let completes = ref(0);

defineProps({
  hidden: {
    type: Boolean,
    default: true
  }
});

const progress = computed(() => {
  return Math.round((completes.value / images.length) * 100);
});

const loadImages =
  (concurrent = 6) =>
  source =>
    source.pipe(
      mergeMap(src => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = err => {
            reject(err);
          };
          image.src = src;
        });
      }, concurrent)
    );

const start = () => {
  return lastValueFrom(
    from(images).pipe(
      loadImages(),
      tap(() => {
        completes.value++;
      }),
      toArray()
    )
  );
};

defineExpose({
  start
});
</script>
