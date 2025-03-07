<template>
  <label
    class="wb-env-atom-form-field-checkbox-group-item"
    :class="styleClasses"
    @click="onClick">
    <input v-bind="inputData" @input="onUpdateModelValue()" />
    <svg-control-input-checkbox v-if="!radio" />
    <svg-control-input-radio v-if="radio" />
    <span v-if="label" class="label">{{ label }}</span>
  </label>
</template>

<script setup>
import { computed } from 'vue';
import SvgControlInputCheckbox from '../../../../assets/svg/control/input_checkbox.svg?component';
import SvgControlInputRadio from '../../../../assets/svg/control/input_radio.svg?component';

const $props = defineProps({
  modelValue: {
    type: [Object, Array, String, Number],
    default: null
  },
  label: {
    type: String,
    default: 'Item Label'
  },
  name: {
    type: String,
    default: null
  },
  value: {
    type: [String, Number],
    default: null
  },
  radio: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const $emit = defineEmits(['update:model-value']);

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
  if ($props.name) {
    if (Array.isArray($props.modelValue)) {
      return ($props.modelValue || []).includes($props.value);
    } else if ($props.modelValue) {
      if ($props.value) {
        return $props.modelValue[$props.name] === $props.value;
      } else {
        return $props.modelValue[$props.name];
      }
    }
  }
  return $props.modelValue === $props.value;
});

const onUpdateModelValue = checked => {
  if (checked === undefined) {
    checked = isChecked.value;
  }
  let value;
  if (!$props.radio) {
    if (Array.isArray($props.modelValue)) {
      if (checked) {
        value = $props.modelValue.filter(v => v !== $props.value);
      } else {
        value = [...$props.modelValue, $props.value];
      }
    } else if (checked) {
      if ($props.value) {
        value = {
          ...$props.modelValue,
          [$props.name]: null
        };
      } else {
        value = {
          ...$props.modelValue,
          [$props.name]: false
        };
      }
    } else {
      value = {
        ...$props.modelValue,
        [$props.name]: $props.value ? $props.value : true
      };
    }
  } else {
    value = checked ? null : $props.value;
  }
  $emit('update:model-value', value);
};

const onClick = e => {
  if (isChecked.value) {
    onUpdateModelValue(true);
    e.preventDefault();
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field-checkbox-group-item {
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

  & > * {
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
