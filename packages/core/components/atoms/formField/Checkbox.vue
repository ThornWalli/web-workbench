<template>
  <wb-env-atom-form-field
    :label-align="labelAlign || defaultLabelAlign"
    tag="div"
    class="wb-env-atom-form-field-checkbox"
    v-bind="$attrs">
    <template #default="{ id }">
      <wb-env-atom-checkbox
        :id="id"
        :model-value="modelValue"
        :name="name"
        :value="value"
        :type="type"
        :readonly="readonly"
        :disabled="disabled"
        @update:model-value="onUpdateModelValue" />
    </template>
    <template #after>
      <slot name="after" />
    </template>
  </wb-env-atom-form-field>
</template>

<script lang="ts" setup generic="T, TValue">
import WbEnvAtomFormField, { ALIGN } from '../FormField.vue';
import type { TYPE } from '../Checkbox.vue';
import WbEnvAtomCheckbox from '../Checkbox.vue';

const defaultLabelAlign = ALIGN.RIGHT;

defineProps<{
  labelAlign?: ALIGN | `${ALIGN}`;
  modelValue?: T;
  name?: string;
  value?: TValue;
  type?: TYPE | `${TYPE}` | string;
  readonly?: boolean;
  disabled?: boolean;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', value: T): void;
}>();

function onUpdateModelValue(e: T | undefined) {
  $emit('update:model-value', e as T);
}
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field-checkbox {
  position: relative;
  display: flex;
  line-height: 30px;

  & .wb-env-atom-checkbox {
    flex: 0;
  }

  & :deep(> div) {
    align-items: center;
  }

  & :deep(div > .label) {
    flex: 1;

    /* padding-left: 22px;
    line-height: 1;
    line-height: 18px; */
  }

  @media (hover: hover) {
    &:hover {
      & :deep(svg) {
        filter: var(--filter-default);
      }
    }
  }

  @media (hover: none) {
    &:active {
      & :deep(svg) {
        filter: var(--filter-default);
      }
    }
  }
}
</style>
