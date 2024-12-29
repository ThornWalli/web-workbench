<template>
  <wb-env-atom-form-field
    tag="div"
    class="wb-env-atom-form-textfield"
    v-bind="$attrs"
    :class="styleClasses">
    <template #default>
      <input :value="value" class="input" v-bind="input" @input="onInput" />
    </template>
    <template #after>
      <slot name="after" />
    </template>
  </wb-env-atom-form-field>
</template>

<script setup>
import { computed } from 'vue';
import WbEnvAtomFormField from '../FormField';

const $props = defineProps({
  modelValue: {
    type: [String, Number],
    default: undefined
  },
  model: {
    type: [Array, Object],
    default() {
      return {};
    }
  },
  type: {
    type: String,
    default: 'text'
  },
  id: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: 'Placeholder'
  },
  pattern: {
    type: String,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false
  },
  min: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  },
  step: {
    type: Number,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: Boolean,
    default: false
  },
  size: {
    type: [String, Number],
    default: undefined
  }
});

const $emit = defineEmits(['update:modelValue']);

const value = computed(() => {
  if ($props.modelValue !== undefined) {
    return String($props.modelValue || '');
  }
  return ($props.name ? $props.model[$props.name] : $props.model.value) || '';
});

const styleClasses = computed(() => {
  return {
    ['type-' + $props.type]: true
  };
});

const input = computed(() => {
  return {
    name: $props.name,
    type: $props.type,
    placeholder: $props.placeholder,
    pattern: $props.pattern,
    min: $props.min,
    max: $props.max,
    step: $props.step,
    size: $props.size,
    readonly: $props.readonly,
    disabled: $props.disabled,
    autocomplete: $props.autocomplete ? 'on' : 'off'
  };
});

const onInput = e => {
  const value = e.target.value;
  if ($props.modelValue !== undefined) {
    $emit('update:modelValue', value);
  } else if ($props.name) {
    $props.model[$props.name] = value;
  } else {
    $props.model.value = value;
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-textfield {
  --color-text: var(--color-textfield-text, #fff);
  --color-background: var(--color-textfield-background, #05a);
  --color-border: var(--color-textfield-border, #05a);
  --color-outline: var(--color-textfield-outline, #fff);
  --color-dialog-text: var(--color-textfield-dialog-text, #05a);
  --color-dialog-background: var(--color-textfield-dialog-background, #fff);
  --color-dialog-border: var(--color-textfield-dialog-border, #fff);
  --color-dialog-outline: var(--color-textfield-dialog-outline, #05a);
  --color-disabled-readonly-text: var(
    --color-textfield-disabled-readonly-text,
    #05a
  );
  --color-disabled-readonly-background: var(
    --color-textfield-disabled-readonly-background,
    #fff
  );

  &.embed {
    & input {
      width: auto;
    }
  }

  & input {
    box-sizing: border-box;
    display: inline-block;
    width: calc(100% + 4px);
    height: 32px;
    padding: 6px;
    padding-bottom: 4px;
    margin: 0 -2px;
    font-size: 16px;
    color: var(--color-text);
    vertical-align: middle;
    appearance: none;
    background: var(--color-background);
    border: solid var(--color-border) 2px;
    outline: solid var(--color-outline) 2px;
    outline-offset: -4px;

    .wb-env-molecule-dialog-content & {
      box-sizing: border-box;
      display: block;
      width: 100%;
      color: var(--color-dialog-text);
      background: var(--color-dialog-background);
      border: solid var(--color-dialog-border) 2px;
      outline: solid var(--color-dialog-outline) 2px;
    }

    &::placeholder {
      color: currentColor;
    }

    &:disabled,
    &[readonly] {
      color: var(--color-disabled-readonly-text);
      background: var(--color-disabled-readonly-background);
    }

    &:not([readonly]) {
      &:focus {
        filter: var(--filter-default);
      }

      html.no-touchevents & {
        &:hover {
          filter: var(--filter-default);
        }
      }

      html.touchevents & {
        &:active {
          filter: var(--filter-default);
        }
      }
    }
  }

  &.label-top {
    & input {
      width: calc(100% + 4px);
    }
  }

  &.type-color {
    /* outline: none; */

    & input {
      flex: 0 0 32px;
      height: 32px;
      padding: 2px;
      margin: 0 -2px;
      line-height: 1;
      border: none;

      &::-webkit-color-swatch-wrapper {
        padding: 0;

        &::-webkit-color-swatch {
          border: none;
        }
      }
    }
  }
}
</style>
