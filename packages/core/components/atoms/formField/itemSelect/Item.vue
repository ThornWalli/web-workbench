<template>
  <label class="wb-env-atom-form-field-item-select-item" @click="onClick">
    <input v-bind="inputData" @input="onUpdateModelValue()" />
    <span class="label" v-html="label || '&nbsp;'" />
  </label>
</template>

<script setup>
import { computed } from 'vue';

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
  multiple: {
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
  },
  canUnselect: {
    type: Boolean,
    default: false
  }
});

const $emit = defineEmits(['update:model-value']);

const isChecked = computed(() => {
  if ($props.multiple) {
    if (Array.isArray($props.modelValue)) {
      return ($props.modelValue || []).includes($props.value);
    } else if ($props.value) {
      return $props.modelValue[$props.name] === $props.value;
    } else {
      return $props.modelValue[$props.name];
    }
  }
  return $props.modelValue === $props.value;
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

const onUpdateModelValue = checked => {
  if (checked === undefined) {
    checked = isChecked.value;
  }
  let value;
  if ($props.multiple) {
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
