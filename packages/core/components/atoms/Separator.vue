<template>
  <hr class="wb-separator" :style="{ '--size': size }" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const defaultSize = 2;
const $props = defineProps<{
  size?: number;
}>();
const size = computed(() => {
  return $props.size ? $props.size : defaultSize;
});
</script>

<style lang="postcss" scoped>
.wb-separator {
  --color-border: var(--color-separator-filled-color, #fff);

  .style-filled & {
    --color-border: var(--color-separator-filled-color, #fff);
  }

  margin: var(--default-element-margin) 0;
  border: none;
  border-top: solid var(--color-border) calc(var(--size) * 1px);
}
</style>
