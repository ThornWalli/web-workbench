<template>
  <wb-env-element-form-field
    :label-align="labelAlign || defaultLabelAlign"
    tag="div"
    class="wb-env-element-form-color-picker"
    v-bind="$attrs">
    <template #default="{ id, required }">
      <wb-color-select
        v-bind="input"
        :id="id"
        :model-value="modelValue"
        :required="required"
        @update:model-value="onUpdateModelValue" />
    </template>
    <template #after>
      <slot name="after" />
    </template>
  </wb-env-element-form-field>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import WbEnvElementFormField, {
  ALIGN
} from '@web-workbench/core/components/elements/FormField.vue';
import WbColorSelect, { COLOR_SELECT_SIZE } from '../ColorSelect.vue';
import type Color from '../../lib/classes/Color';

const defaultLabelAlign = ALIGN.RIGHT;
const defaultSize = COLOR_SELECT_SIZE.MEDIUM;

const $emit = defineEmits<{
  (e: 'update:model-value', value: Color): void;
}>();

const $props = defineProps<{
  labelAlign?: ALIGN | `${ALIGN}`;
  modelValue: Color;
  name?: string;
  id?: string;
  readonly?: boolean;
  disabled?: boolean;
  size?: COLOR_SELECT_SIZE;
}>();

const input = computed(() => {
  return {
    name: $props.name,
    size: $props.size || defaultSize,
    readonly: $props.readonly,
    disabled: $props.disabled
  };
});

function onUpdateModelValue(e: Color) {
  $emit('update:model-value', e);
}
</script>

<style lang="postcss" scoped>
.wb-env-element-form-color-picker {
  position: relative;
  display: flex;
  line-height: 30px;

  & .wb-env-element-form-range-slider {
    & :deep(.wb-env-element-range-slider) {
      flex: initial;
      width: 60px;
    }

    & :deep(span) {
      width: 30px;
      text-align: center;
    }
  }

  & .wb-env-element-color-select {
    flex: none;
  }

  & .wb-env-element-form-range-slider,
  & .wb-env-element-color-picker {
    flex: initial;
  }

  & :deep(> div) {
    align-items: center;
  }

  & :deep(div > .label) {
    flex: 1;
  }
}
</style>
