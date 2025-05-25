<template>
  <div
    class="wb-grid"
    :style="{
      '--grid-columns': columns
    }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  columns?: number;
}>();
</script>

<style lang="postcss" scoped>
.wb-grid {
  --grid-columns: 1;

  display: grid;
  grid-template-columns: repeat(var(--grid-columns, 1), 1fr);
  gap: var(--default-element-margin);
  padding: var(--default-element-margin);

  & > * {
    height: 100%;
  }
}
</style>
