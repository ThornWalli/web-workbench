<template>
  <div class="wb-disks-extras13-web-paint-view-menu-item">
    <input
      :id="currentId"
      :model-value="modelValue"
      type="radio"
      :name="menuId"
      :value="currentId"
      :checked="modelValue === currentId"
      @change="$emit('update:model-value', currentId)" />
    <label :for="currentId">
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

const $emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();
const defaultId = useId();
const currentId = computed(() => {
  return $props.id || defaultId;
});

const $props = defineProps<{
  label: string;
  id: string;
  menuId?: string;
  modelValue?: string | null;
}>();
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-view-menu-item {
  --color-background: var(--color-view-menu-item-background, #05a);
  --color-label: var(--color-view-menu-item-label, #05a);

  .style-filled & {
    --color-background: var(
      --color-view-filled-menu-item-background,
      var(--color-view-menu-item-background)
    );
    --color-label: var(
      --color-view-filled-menu-item-label,
      var(--color-view-menu-item-label)
    );
  }

  & label {
    display: block;
    min-width: 120px;
    padding: 4px;
    color: var(--color-label);
    background: var(--color-background);

    & span {
      display: block;
      width: 99%;
      overflow: hidden;
      text-overflow: ellipsis;
      text-wrap: nowrap;
    }
  }

  & input {
    position: absolute;
    opacity: 0;
  }

  & input:checked + label {
    filter: invert(1);
  }
}
</style>
