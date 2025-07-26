<template>
  <div
    v-if="currentContainerId === id"
    class="wb-disks-extras13-web-paint-view-menu-container">
    <slot> Container {{ label }} </slot>
  </div>
</template>

<script setup lang="ts">
import { inject, onUnmounted, ref, useId } from 'vue';

const id = useId();

const $props = defineProps<{
  label?: string;
}>();

const currentContainerId = inject('currentContainerId', ref());
console.log(currentContainerId);
const registerContainer = inject(
  'registerContainer',
  (value: { id: string; label?: string }) => {
    console.warn('registerContainer is not provided', value);
  }
);
if (!registerContainer) {
  throw new Error('registerContainer is not provided');
}
const unregisterContainer = inject('unregisterContainer', (id: string) => {
  console.warn('unregisterContainer is not provided', id);
});
if (!unregisterContainer) {
  throw new Error('unregisterContainer is not provided');
}

registerContainer({ id, label: $props.label });

onUnmounted(() => {
  unregisterContainer(id);
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-view-menu-container {
  /* empty */
}
</style>
