<template>
  <div v-if="!hidden">
    {{ progress }}
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { images } from '../utils/preload';
import { from, lastValueFrom, mergeMap, tap, toArray } from 'rxjs';

const completes = ref(0);

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
        const { promise, resolve, reject } = Promise.withResolvers();
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = err => {
          reject(err);
        };
        image.src = src;
        return promise;
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
