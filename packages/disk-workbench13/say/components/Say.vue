<template>
  <div ref="rootEl" class="wb-disks-workbench13-say">
    <div class="input">
      <wb-form-field-textarea
        embed
        fluid
        hide-label
        v-bind="fieldValue"
        :placeholder="placeholder" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import WbFormFieldTextarea from '@web-workbench/core/components/elements/formField/Textarea.vue';
import type { Model } from '../types';

const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const placeholder = ref('Enter your text here and then press "Play"...');

const rootEl = ref<HTMLInputElement | null>(null);

const $emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();

const fieldValue = computed(() => {
  return {
    modelValue: $props.model.value,
    'onUpdate:model-value': (value: string) => {
      $emit('update:model-value', value);
    }
  };
});
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-say {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: calc(120px);
  height: 100%;
  min-height: calc(80px);

  & .input {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;

    & > * {
      flex: 1;
    }
  }

  & .wb-env-element-form-field-textarea {
    flex: 1;
  }

  & :deep(.wb-env-element-form-field-textarea textarea) {
    border-color: var(--workbench-color-1);
  }

  & :deep(.wb-env-element-form-field-textarea > div),
  & :deep(.wb-env-element-form-field-textarea .wrapper > span),
  & :deep(.wb-env-element-form-field-textarea .wrapper > span > *:first-child),
  & :deep(.wb-env-element-form-field-textarea) {
    height: 100%;
  }
}
</style>
