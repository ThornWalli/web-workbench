<template>
  <wb-env-element-form-field
    :id="id"
    v-slot="context"
    :style="dimension?.toCSSVars('dimension')"
    tag="label"
    class="wb-env-element-form-field-textarea"
    :label="label || defaultLabel"
    :class="styleClasses"
    :label-top="labelTop">
    <span class="wrapper">
      <span>
        <textarea
          :id="context.id"
          ref="textareaEl"
          :required="context.required"
          :value="value"
          v-bind="input"
          @input="onInput" />
        <span class="helper resize">
          <svg-control-textarea-resize />
        </span>
      </span>
    </span>
  </wb-env-element-form-field>
</template>

<script lang="ts" setup>
import WbEnvElementFormField from '../FormField.vue';

import SvgControlTextareaResize from '../../../assets/svg/control/textarea_resize.svg?component';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';

const textareaEl = ref<HTMLTextAreaElement | null>(null);
const dimension = ref<IPoint & number>();

const defaultPlaceholder = 'Textarea Placeholder…';
const defaultLabel = 'Textarea Label';

const $props = defineProps<{
  labelTop?: boolean;
  modelValue: string;
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
  wrap?: boolean;
  resize?: RESIZE | `${RESIZE}`;
  readonly?: boolean;
  disabled?: boolean;
  autocomplete?: boolean;
  fluid?: boolean;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();

const styleClasses = computed(() => {
  const resize =
    $props.resize && $props.resize !== RESIZE.NONE ? $props.resize : undefined;
  return {
    dimension: !!dimension.value,
    fluid: $props.fluid,
    resize: $props.resize,
    [`resize-${$props.resize}`]: resize
  };
});

const value = computed(() => {
  return String(
    $props.modelValue !== undefined && $props.modelValue !== null
      ? $props.modelValue
      : ''
  );
});

const input = computed(() => {
  return {
    name: $props.name,
    placeholder: $props.placeholder || defaultPlaceholder,
    rows: $props.rows,
    wrap: $props.wrap ? 'on' : 'off',
    resize: $props.resize,
    readonly: $props.readonly,
    disabled: $props.disabled,
    autocomplete: $props.autocomplete ? 'on' : 'off'
  };
});

let resizeObserver: ResizeObserver;
onMounted(() => {
  if (textareaEl.value && $props.resize && $props.resize !== RESIZE.NONE) {
    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        dimension.value = ipoint(
          (entry.target as HTMLElement).offsetWidth,
          (entry.target as HTMLElement).offsetHeight
        );
      }
    });

    resizeObserver.observe(textareaEl.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

const onInput = (e: Event) => {
  if (e.target instanceof HTMLTextAreaElement) {
    const value = e.target.value;
    $emit('update:model-value', value);
  }
};
</script>

<script lang="ts">
export enum RESIZE {
  NONE = 'none',
  BOTH = 'both',
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}
</script>

<style lang="postcss" scoped>
.wb-env-element-form-field-textarea {
  --color-text: var(--color-textarea-text, #fff);
  --color-background: var(--color-textarea-background, #05a);
  --color-border: var(--color-textarea-border, #05a);
  --color-outline: var(--color-textarea-outline, #fff);
  --color-resize-background: var(--color-textarea-resize-background, #05a);
  --color-resize-icon: var(--color-textarea-resize-icon, #fff);

  .style-filled & {
    --color-text: var(--color-textarea-background, #fff);
    --color-background: var(--color-textarea-text, #05a);
    --color-border: var(--color-textarea-filled-text, #05a);
    --color-outline: var(--color-textarea-filled-text, #fff);
  }

  & textarea {
    box-sizing: border-box;
    display: block;
    width: calc(100% + 4px);
    padding: 6px;
    padding-top: 7px;
    padding-bottom: 4px;
    margin: 0 -2px;
    font-size: 1em;
    line-height: 1.2;
    color: var(--color-text);
    overflow-wrap: break-word;
    white-space: pre-wrap;
    appearance: none;
    resize: none;
    outline: solid var(--color-outline) 2px;
    outline-offset: -4px;
    background: var(--color-background);
    border: solid var(--color-border) 2px;

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

    & .wrapper {
      & > span {
        display: inline-block;
      }
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

    & .wrapper {
      & > span {
        display: block;
      }
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
      display: inline-block;
    }
  }

  &:not(.label-top) {
    & :deep(> div) {
      align-items: baseline;
    }
  }

  &.label-top {
    & :deep(> .label) {
      display: block;
      padding-top: 0;
    }

    & textarea {
      display: block;
      width: 100%;
    }
  }

  &.fluid {
    & .wrapper,
    & .wrapper > span,
    & textarea {
      width: 100%;
      height: 100%;
    }

    &:not(.label-top) {
      & :deep(> div) {
        align-items: center;
      }
    }
  }

  &.dimension {
    &:not(.label-top) {
      & :deep(> div) {
        height: calc(var(--dimension-y) * 1px);
      }
    }
  }

  &.label-top,
  &.fluid {
    & textarea {
      width: calc(100% + 4px);
    }
  }
}
</style>
