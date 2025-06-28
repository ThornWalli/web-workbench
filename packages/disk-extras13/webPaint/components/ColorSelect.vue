<template>
  <component
    :is="tag"
    type="button"
    class="wb-env-element-color-select"
    :style="{
      '--size': currentSize
    }"
    :class="{ disabled, readonly, embed, selected }"
    @click="onClick">
    <canvas
      ref="canvasEl"
      :width="currentSize * 2"
      :height="currentSize * 2"
      :title="modelValue.toHex()" />
  </component>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type Color from '../lib/classes/Color';
import type Window from '@web-workbench/core/classes/Window';
import useCore from '@web-workbench/core/composables/useCore';

const { core } = useCore();

const tag = computed(() => {
  return $props.readonly ? 'div' : 'button';
});

const defaultSize = COLOR_SELECT_SIZE.MEDIUM;

const $emit = defineEmits<{
  (e: 'update:model-value', value: Color): void;
}>();

const $props = defineProps<{
  size?: COLOR_SELECT_SIZE;
  modelValue: Color;
  id?: string;
  name?: string;
  readonly?: boolean;
  disabled?: boolean;
  embed?: boolean;
  selected?: boolean;
}>();

const currentSize = computed(() => {
  return $props.size || defaultSize;
});

const canvasEl = ref<HTMLCanvasElement | null>(null);

watch(
  () => $props.modelValue,
  () => {
    refresh();
  },
  { immediate: true }
);
watch(
  () => tag.value,
  () => {
    nextTick(() => {
      refresh();
    });
  }
);

onMounted(() => {
  refresh();
});

function refresh() {
  if (!canvasEl.value) return;

  const ctx = canvasEl.value.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);

  ctx.fillStyle = `rgba(${$props.modelValue.toCSSRGBA()})`;
  ctx.fillRect(0, 0, canvasEl.value.width, canvasEl.value.height);
}

async function onClick() {
  if ($props.readonly || $props.disabled) {
    return;
  }
  const color = await openColorPicker($props.modelValue);
  if (color) {
    $emit('update:model-value', color);
  }
}

// #region windows
let colorColorPickerWindow: Window | undefined;
async function openColorPicker(color: Color) {
  if (colorColorPickerWindow) {
    return colorColorPickerWindow;
  }
  colorColorPickerWindow = core.value!.modules.windows!.addWindow(
    {
      component: await import('./windows/ColorPicker.vue').then(
        module => module.default
      ),
      componentData: {
        color
      },
      options: {
        title: 'Color Picker',
        filled: true
      }
    },
    {
      group: 'extras13WebPaint'
    }
  );

  return colorColorPickerWindow.awaitClose().then(({ value }) => {
    colorColorPickerWindow = undefined;
    return value;
  });
}
// #endregion
</script>

<script lang="ts">
export enum COLOR_SELECT_SIZE {
  SMALL = 8,
  MEDIUM = 16,
  LARGE = 24,
  XLARGE = 32,
  XXLARGE = 48
}
</script>

<style lang="postcss" scoped>
.wb-env-element-color-select {
  --color-border: var(--color-disks-web-paint-color-select-border, #fff);
  --color-border-selected: var(
    --color-disks-web-paint-color-select-selected-border,
    #000
  );

  .style-filled & {
    --color-border: var(
      --color-disks-web-paint-color-select-filled-border,
      #000
    );
    --color-border-selected: var(
      --color-disks-web-paint-color-select-filled-selected-border,
      #000
    );
  }

  display: block;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  padding: 0;
  appearance: none;
  background: transparent;
  border: none;

  &:not(.embed) {
    border: solid var(--color-border) 2px;
  }

  &.embed {
    &::after {
      position: absolute;
      inset: -2px;
      display: none;
      pointer-events: none;
      content: '';
      border: solid var(--color-border) 2px;
    }

    &:hover,
    &.selected {
      position: relative;

      &::after {
        display: block;
      }
    }
  }

  & canvas {
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  & input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }
}
</style>
