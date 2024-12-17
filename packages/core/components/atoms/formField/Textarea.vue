<template>
  <wb-env-atom-form-field
    tag="label"
    class="wb-env-atom-form-field-textarea"
    :label="label"
    :class="styleClasses"
    :label-top="labelTop">
    <span class="wrapper">
      <span>
        <textarea :value="String(value)" v-bind="input" @input="onInput" />
        <span class="helper resize">
          <svg-control-textarea-resize />
        </span>
      </span>
    </span>
  </wb-env-atom-form-field>
</template>

<script setup>
import WbEnvAtomFormField from '../FormField';

import SvgControlTextareaResize from '../../../assets/svg/control/textarea_resize.svg?component';
import { computed } from 'vue';

const $props = defineProps({
  labelTop: {
    type: Boolean,
    default: false
  },

  modelValue: {
    type: String,
    default: undefined
  },

  model: {
    type: Object,
    default() {
      return {};
    }
  },

  label: {
    type: String,
    default: 'Textarea Label'
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
    default: 'Textarea Placeholder…'
  },
  rows: {
    type: Number,
    default: null
  },
  wrap: {
    type: Boolean,
    default: true
  },
  resize: {
    type: String,
    validate: value => ['both', 'horizontal', 'vertical', null].includes(value),
    default: 'both'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: Boolean,
    default: false
  }
});

const $emit = defineEmits(['update:modelValue']);

const value = computed(() => {
  if ($props.modelValue !== undefined) {
    return $props.modelValue;
  }
  return ($props.name ? $props.model[$props.name] : $props.model.value) || '';
});

const styleClasses = computed(() => {
  return {
    resize: $props.resize,
    [`resize-${$props.resize}`]: $props.resize
  };
});

const input = computed(() => {
  return {
    id: $props.id,
    name: $props.name,
    placeholder: $props.placeholder,
    rows: $props.rows,
    wrap: $props.wrap ? 'on' : 'off',
    resize: $props.resize,
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
.wb-env-atom-form-field-textarea {
  --color-text: var(--color-textarea-text, #fff);
  --color-background: var(--color-textarea-background, #05a);
  --color-border: var(--color-textarea-border, #05a);
  --color-outline: var(--color-textarea-outline, #fff);
  --color-resize-background: var(--color-textarea-resize-background, #05a);
  --color-resize-icon: var(--color-textarea-resize-icon, #fff);

  & textarea {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 6px;
    padding-top: 7px;
    padding-bottom: 4px;
    font-size: 1em;
    line-height: 1.2;
    color: var(--color-text);
    overflow-wrap: break-word;
    white-space: pre-wrap;
    appearance: none;
    resize: none;
    background: var(--color-background);
    border: solid var(--color-border) 2px;
    outline: solid var(--color-outline) 2px;
    outline-offset: -4px;

    ::-webkit-resizer {
      display: none;
    }

    &::placeholder {
      color: currentColor;
    }

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

  & .resize {
    position: absolute;
    right: 2px;
    bottom: 2px;
    display: none;
    width: 16px;
    pointer-events: none;

    &::before {
      display: block;
      padding-top: 100%;
      content: '';
      background-color: var(--color-resize-background);
    }

    & svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      & :deep(*) {
        fill: var(--color-resize-icon);
      }
    }
  }

  &.resize {
    & .resize {
      display: block;
    }
  }

  &.resize-both {
    & textarea {
      resize: both;
    }
  }

  &.resize-horizontal {
    & textarea {
      resize: horizontal;
    }
  }

  &.resize-vertical {
    & textarea {
      resize: vertical;
    }
  }

  & textarea:focus + .resize {
    filter: var(--filter-default);
  }

  html.no-touchevents & {
    & textarea:hover + .resize {
      filter: var(--filter-default);
    }
  }

  html.touchevents & {
    & textarea:active + .resize {
      filter: var(--filter-default);
    }
  }

  & .wrapper {
    display: inline-block;

    & > span {
      position: relative;
      display: block;
    }
  }

  &.label-top {
    margin-top: 10px;

    & :deep(> .label) {
      display: block;
      padding-top: 0;
    }

    & textarea {
      display: block;
      width: 100%;
    }
  }
}
</style>
