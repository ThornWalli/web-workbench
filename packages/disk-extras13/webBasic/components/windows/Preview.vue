<template>
  <div class="wb-disks-extras13-web-basic-preview">
    <ul class="basic">
      <li v-for="(line, index) in lines" :key="index">
        {{ line }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { Model } from '../../types';
import { computed, watch } from 'vue';
import type { TriggerRefresh } from '@web-workbench/core/types/component';

const $emit = defineEmits<{
  (e: 'refresh', value: TriggerRefresh): void;
}>();

const $props = defineProps<{
  model: Model;
}>();

const lines = computed(() => {
  return $props.model.output;
});

watch(
  () => lines.value,
  () => {
    refresh();
  }
);
function refresh() {
  $emit('refresh', { scroll: true });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-basic-preview {
  padding: var(--default-element-margin);
}
</style>
