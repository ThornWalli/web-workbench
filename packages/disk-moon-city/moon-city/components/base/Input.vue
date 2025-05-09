<template>
  <div
    class="mc-base-input"
    :class="{ border, 'hide-caret': hideCaret }"
    :style="{
      '--border-color': `var(--mc-color-${borderColor || defaultBorderColoor})`,
      '--color': `var(--mc-color-${color || defaultColor})`
    }">
    <input
      ref="input"
      class="font-style-bitfont"
      :inputmode="inputmode"
      :style="`text-align: ${align || defaultAlign}`"
      :type="type"
      :size="size"
      :value="modelValue"
      :maxlength="maxlength"
      @selectionchange="onSelectionChange"
      @input="onInput" />
    <div
      v-if="!hideCaret"
      class="caret"
      :style="`--length: ${caretPosition};`" />
  </div>
</template>

<script lang="ts" setup>
import { watch, computed, nextTick, ref, onMounted } from 'vue';
import { COLOR } from '../../utils/color';
import type { InputMode } from '../../types';

const input = ref();

const defaultColor = COLOR.WHITE;
const defaultBorderColoor = COLOR.BLUE;
const defaultAlign = 'left';

const $props = defineProps<{
  maxlength?: number;
  modelValue?: string;
  align?: 'left' | 'center' | 'right';
  size?: number;
  type?: string;
  inputmode?: InputMode;
  hideCaret?: boolean;
  border?: boolean;
  color?: COLOR;
  borderColor?: COLOR;
  autoFocus?: boolean;
}>();
// const $props = defineProps({
//   maxlength: {
//     type: Number,
//     default: undefined
//   },
//   modelValue: {
//     type: String,
//     default: ''
//   },
//   align: {
//     type: String,
//     default: 'left',
//     validator: value => ['left', 'center', 'right'].includes(value)
//   },
//   size: {
//     type: Number,
//     default: undefined
//   },
//   type: {
//     type: String,
//     default: undefined
//   },
//   inputmode: {
//     type: String,
//     default: undefined
//   },
//   hideCaret: {
//     type: Boolean,
//     default: false
//   },
//   border: {
//     type: Boolean,
//     default: false
//   },
//   color: {
//     type: String,
//     default: COLOR.WHITE,
//     validator: value => Object.values(COLOR).includes(value)
//   },
//   borderColor: {
//     type: String,
//     default: COLOR.BLUE,
//     validator: value => Object.values(COLOR).includes(value)
//   },
//   autoFocus: {
//     type: Boolean,
//     default: false
//   }
// });

const $emit = defineEmits<{
  (e: 'update:model-value', payload: string): void;
}>();

const onInput = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    $emit('update:model-value', e.target.value);
    nextTick(() => {
      input.value.value = $props.modelValue;
    });
  }
};

const selectionStart = ref<number | null>(0);
watch(
  () => $props.modelValue,
  () => {
    selectionStart.value = input.value?.selectionStart;
  }
);

const onSelectionChange = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    selectionStart.value = e.target.selectionStart;
  }
};

const caretPosition = computed(() => {
  return selectionStart.value;
});

onMounted(() => {
  if ($props.autoFocus) {
    window.setTimeout(() => {
      input.value.focus();
    }, 250);
  }
});
</script>

<style lang="postcss" scoped>
.mc-base-input {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  padding: 2px;
  padding-right: 0;
  overflow: hidden;
  color: var(--color);
  border: solid transparent 2px;

  &.border {
    border-color: var(--border-color);
  }

  & .caret {
    position: absolute;
    top: 2px;
    left: calc(2px + var(--length) * (8px + 2px));
    display: block;
    mix-blend-mode: difference;

    &::before {
      display: block;
      width: 6px;
      height: 10px;
      content: '';
      background: currentColor;
      animation: blink 2s infinite;
      animation-timing-function: steps(1);
    }
  }

  & input {
    display: block;
    height: 10px;
    padding: 0;
    margin: 0;
    letter-spacing: 2px;
    appearance: none;
    cursor: pointer;
    caret-color: transparent;
    user-select: none;
    outline: none;
    background: none;
    border: none;

    &::selection {
      background: transparent;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      margin: 0;
      appearance: none;
    }

    /* Firefox */
    &[type='number'] {
      appearance: textfield;
    }
  }
}

@keyframes blink {
  0%,
  100% {
    background: transparent;
  }

  50% {
    background: currentColor;
  }
}
</style>
