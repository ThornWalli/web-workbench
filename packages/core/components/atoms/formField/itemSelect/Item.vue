<template>
  <label class="wb-env-atom-form-field-item-select-item" @click="onClick">
    <input v-bind="inputData" @input="onUpdateModelValue()" />
    <span class="label" v-html="label || '&nbsp;'" />
  </label>
</template>

<script lang="ts" setup generic="T extends ItemSelectModel">
import { computed } from 'vue';
import type { Model as ItemSelectModel } from '../ItemSelect.vue';

export interface Model {
  label: string;
  value?: string | number;
  name?: string;
  readonly?: boolean;
  disabled?: boolean;
}

const $props = defineProps<{
  modelValue: T;
  label?: string;
  name?: string;
  value: string | number;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  canUnselect?: boolean;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', value: T): void;
}>();

// eslint-disable-next-line vue/return-in-computed-property
const isChecked = computed(() => {
  const modelValue = $props.modelValue;
  if ($props.multiple && typeof modelValue === 'object') {
    if (Array.isArray(modelValue)) {
      return (modelValue || []).includes($props.value);
    } else if (
      $props.modelValue &&
      $props.name &&
      typeof $props.modelValue === 'object'
    ) {
      const modelValue = $props.modelValue as Record<string, unknown>;
      if ($props.value) {
        return modelValue[$props.name] === $props.value;
      } else {
        return !!modelValue[$props.name];
      }
    }
  } else if (typeof modelValue === 'string' || typeof modelValue === 'number') {
    return modelValue === $props.value;
  }
});

const inputData = computed(() => {
  return {
    checked: isChecked.value,
    value: $props.value,
    name: $props.name,
    readonly: $props.readonly,
    disabled: $props.disabled,
    type: $props.multiple ? 'checkbox' : 'radio'
  };
});

const onUpdateModelValue = (checked?: boolean) => {
  if (checked !== undefined) {
    checked = isChecked.value;
  }

  const modelValue = $props.modelValue;
  let value: T;

  if (Array.isArray(modelValue)) {
    if (checked) {
      value = modelValue.filter(v => v !== $props.value) as T;
    } else {
      value = [...modelValue, $props.value] as T;
    }
  } else if ($props.name && typeof modelValue === 'object') {
    if (checked) {
      if ($props.value) {
        value = {
          ...modelValue,
          [$props.name]: null
        };
      } else {
        value = {
          ...modelValue,
          [$props.name]: false
        };
      }
    } else {
      value = {
        ...modelValue,
        [$props.name]: $props.value ? $props.value : true
      };
    }
  } else {
    value = (checked ? '' : $props.value) as T;
  }

  $emit('update:model-value', value);
};

const onClick = (e: Event) => {
  if (isChecked.value) {
    onUpdateModelValue(true);
    e.preventDefault();
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field-item-select-item {
  --color-border: var(--color-item-select-item-border, #fff);
  --color-background: var(--color-item-select-item-background, #05a);
  --color-disabled-label-text: var(
    --color-item-select-item-disabled-label-text,
    #fff
  );
  --color-disabled-label-background: var(
    --color-item-select-item-disabled-label-background,
    #000
  );

  display: block;
  margin: 0;
  border: solid var(--color-border) 2px;

  & > * {
    display: inline-block;
  }

  & > input {
    display: none;
  }

  & .label {
    display: block;
    padding: 4px;
    padding-bottom: 0;
    line-height: 18px;
    text-transform: uppercase;
    background: var(--color-background);
  }

  & > input:not([disabled]):checked + .label {
    filter: var(--filter-default);
  }

  & > input[disabled] + .label {
    color: var(--color-disabled-label-text);
    background: var(--color-disabled-label-background);
  }
}
</style>
