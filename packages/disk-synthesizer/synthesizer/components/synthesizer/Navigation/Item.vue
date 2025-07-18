<template>
  <div v-if="text" :class="styleClasses">
    <span>
      <i v-if="iconAlign === 'left' && currentIcon">
        <component :is="currentIcon" />
      </i>
      <span v-if="text" v-html="text" />
      <i v-if="iconAlign === 'right' && currentIcon">
        <component :is="currentIcon" />
      </i>
    </span>
  </div>
  <label
    v-else-if="modelValue !== undefined"
    :class="styleClasses"
    :disabled="disabled ? true : undefined">
    <input
      :name="name"
      :checled="modelValue === value"
      :disabled="disabled ? true : undefined"
      :value="value"
      :type="value === undefined ? 'checkbox' : 'radio'"
      @input="onInput" />
    <span>
      <i v-if="iconAlign === 'left' && currentIcon">
        <component :is="currentIcon" />
      </i>
      <span v-if="!hideLabel && label" v-html="label" />
      <i v-if="iconAlign === 'right' && currentIcon">
        <component :is="currentIcon" />
      </i>
    </span>
  </label>
  <button v-else :class="styleClasses" :disabled="disabled" @click="onClick">
    <span>
      <i v-if="!iconAlign || (iconAlign === 'left' && currentIcon)">
        <component :is="currentIcon" />
      </i>
      <span v-if="!hideLabel && label" v-html="label" />
      <i v-if="iconAlign === 'right' && currentIcon">
        <component :is="currentIcon" />
      </i>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';

export interface Props {
  selected?: boolean;
  disabled?: boolean;
  text?: string;
  label?: string;
  hideLabel?: boolean;
  name?: string;
  value?: string | number;
  modelValue?: string | number;
  action?: (value: unknown) => Promise<void>;
  icon?: string;
  iconAlign?: 'left' | 'right';
}
const $props = defineProps<Props>();
// const $props = defineProps({
//   selected: {
//     type: Boolean,
//     default: false
//   },
//   disabled: {
//     type: Boolean,
//     default: false
//   },
//   text: {
//     type: String,
//     default: null
//   },
//   label: {
//     type: String,
//     default: ''
//   },
//   hideLabel: {
//     type: Boolean,
//     default: false
//   },
//   name: {
//     type: String,
//     default: undefined
//   },
//   value: {
//     type: [String, Number],
//     default: undefined
//   },
//   modelValue: {
//     type: [String, Number],
//     default: undefined
//   },
//   action: {
//     type: Function,
//     default: null
//   },
//   icon: {
//     type: String,
//     default: null
//   },
//   iconAlign: {
//     type: String,
//     default: 'left'
//   }
// });

const $emit = defineEmits<{
  (e: 'update:model-value', value?: string | number): void;
}>();

const currentIcon = computed(() => {
  if ($props.icon === undefined) {
    return null;
  }
  return {
    prev: defineAsyncComponent(
      () => import('../../../assets/svg/icons/prev.svg?component')
    ),
    next: defineAsyncComponent(
      () => import('../../../assets/svg/icons/next.svg?component')
    ),
    doublePrev: defineAsyncComponent(
      () => import('../../../assets/svg/icons/double_prev.svg?component')
    ),
    doubleNext: defineAsyncComponent(
      () => import('../../../assets/svg/icons/double_next.svg?component')
    ),
    skipPrev: defineAsyncComponent(
      () => import('../../../assets/svg/icons/skip_prev.svg?component')
    ),
    skipNext: defineAsyncComponent(
      () => import('../../../assets/svg/icons/skip_next.svg?component')
    ),
    play: defineAsyncComponent(
      () => import('../../../assets/svg/icons/play.svg?component')
    ),
    pause: defineAsyncComponent(
      () => import('../../../assets/svg/icons/pause.svg?component')
    ),
    stop: defineAsyncComponent(
      () => import('../../../assets/svg/icons/stop.svg?component')
    ),
    reset: defineAsyncComponent(
      () => import('../../../assets/svg/icons/reset.svg?component')
    )
  }[$props.icon];
});

const styleClasses = computed(() => {
  return {
    selected: $props.selected
  };
});

function onClick(e: Event) {
  if (typeof $props.action === 'function') {
    Promise.resolve($props.action(e)).catch(err => {
      throw err;
    });
  }
}

function onInput() {
  $emit('update:model-value', $props.value);
  if (typeof $props.action === 'function') {
    Promise.resolve($props.action($props.modelValue)).catch(err => {
      throw err;
    });
  }
}
</script>

<style lang="postcss" scoped>
button {
  padding: 0;
  appearance: none;
  background: none;
  border: none;
}

div {
  user-select: none;

  & > span {
    display: block;
    font-family: var(--font-family-bit-font);
    font-size: 10px;
    line-height: 1;
    color: var(--workbench-color-3);
    letter-spacing: 0.3px;
    background: var(--workbench-color-1);
  }
}

button,
label {
  display: block;
  width: 100%;
  text-align: center;
  user-select: none;
  outline: none;

  & input {
    display: none;
  }

  & > span {
    display: block;
    padding: 2px;
    font-family: var(--font-family-bit-font);
    font-size: 10px;
    line-height: 1;

    /* line-height: 8px; */
    color: var(--workbench-color-3);
    letter-spacing: 0.3px;
    background: var(--workbench-color-1);
    border: solid currentColor;
    border-width: 0 2px 2px 0;
  }

  & i {
    fill: currentColor;

    & + span {
      margin-left: 5px;
    }
  }

  & span + i {
    margin-left: 0;
  }

  &[disabled] > span {
    color: var(--workbench-color-4);
    background: var(--workbench-color-3);
  }

  &:not([disabled]) {
    &.selected > span,
    &:active > span,
    & input:checked + span {
      color: var(--workbench-color-1);
      background: var(--workbench-color-3);
      border-color: var(--workbench-color-3);
    }
  }
}
</style>
