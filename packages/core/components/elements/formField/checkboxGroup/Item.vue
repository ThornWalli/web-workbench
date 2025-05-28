<template>
  <label
    class="wb-env-element-form-field-checkbox-group-item"
    :class="styleClasses"
    @click="onClick">
    <input v-bind="inputData" @input="onUpdateModelValue()" />
    <svg-control-input-checkbox v-if="!radio" />
    <svg-control-input-radio v-if="radio" />
    <span v-if="label" class="label">{{ label }}</span>
  </label>
</template>

<script lang="ts" setup generic="T extends CheckboxGroupModel">
import { computed } from 'vue';
import SvgControlInputCheckbox from '../../../../assets/svg/control/input_checkbox.svg?component';
import SvgControlInputRadio from '../../../../assets/svg/control/input_radio.svg?component';
import type { Model as CheckboxGroupModel } from '../CheckboxGroup.vue';

export interface Model {
  label: string;
  value?: string | number;
  name: string;
  readonly?: boolean;
  disabled?: boolean;
}

const $props = defineProps<{
  modelValue: T;
  label?: string;
  name?: string;
  value?: string | number;
  radio?: boolean;
  readonly?: boolean;
  disabled?: boolean;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', value: T): void;
}>();

const styleClasses = computed(() => {
  return {
    radio: $props.radio,
    checkbox: !$props.radio
  };
});

const inputData = computed(() => {
  return {
    checked: isChecked.value,
    value: $props.value,
    name: $props.name,
    readonly: $props.readonly,
    disabled: $props.disabled,
    type: $props.radio ? 'radio' : 'checkbox'
  };
});

const isChecked = computed(() => {
  if (Array.isArray($props.modelValue)) {
    return ($props.modelValue || []).includes($props.value);
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
  return false;
});

const onUpdateModelValue = (checked?: boolean) => {
  if (checked !== undefined) {
    checked = isChecked.value;
  }

  const modelValue = $props.modelValue;
  let value: T | undefined;

  if (Array.isArray(modelValue)) {
    if (checked) {
      value = modelValue.filter(v => v !== $props.value) as T;
    } else {
      value = [...modelValue, $props.value] as T;
    }
  } else if ($props.name) {
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
  }
  if (value !== undefined) {
    $emit('update:model-value', value);
  }
};

const onClick = (e: Event) => {
  if (isChecked.value) {
    onUpdateModelValue(true);
    e.preventDefault();
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-element-form-field-checkbox-group-item {
  --color-disabled-icon: var(--color-checkbox-group-item-disabled-icon, #fff);
  --color-background: var(--color-checkbox-group-item-background, #05a);
  --color-disabled-background: var(
    --color-checkbox-group-item-disabled-background,
    #fff
  );
  --color-checkbox-icon: var(--color-checkbox-group-item-checkbox-icon, #fff);
  --color-radio-icon: var(--color-checkbox-group-item-radio-icon, #fff);

  position: relative;
  display: flex;
  line-height: 30px;

  & > span {
    flex: 1;
  }

  & > input {
    display: none;
  }

  & > input[disabled] + svg {
    background: var(--color-disabled-background);
    fill: var(--color-disabled-icon);
  }

  &:hover > input:not([disabled]) + svg {
    filter: var(--filter-default);
  }

  & svg {
    display: block;
    flex: 0 0 16px;
    background: var(--color-background);
  }

  &.checkbox {
    & :deep(.svg-primary) {
      fill: var(--color-checkbox-icon);
    }

    & :deep(.svg-secondary) {
      visibility: hidden;
      fill: var(--color-checkbox-icon);
    }
  }

  &.radio {
    & svg {
      & :deep(.svg-primary) {
        fill: var(--color-radio-icon);
      }

      & :deep(.svg-secondary) {
        visibility: hidden;
        fill: var(--color-radio-icon);
      }
    }
  }

  & > input:checked + svg {
    & :deep(.svg-secondary) {
      visibility: visible;
    }
  }

  & .label {
    padding-left: 22px;
    line-height: 1;
    line-height: 18px;
  }

  html.no-touchevents & {
    &:hover {
      & svg {
        filter: var(--filter-default);
      }
    }
  }

  html.touchevents & {
    &:active {
      & svg {
        filter: var(--filter-default);
      }
    }
  }
}
</style>
