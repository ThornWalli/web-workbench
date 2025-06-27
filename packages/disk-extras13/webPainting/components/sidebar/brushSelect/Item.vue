<template>
  <button
    v-if="passive"
    class="wb-disks-extras13-web-painting-brush-select-item"
    @click="$emit('click', $event, value)">
    <component :is="component" />
    <svg-web-painting-disabled
      v-if="disabled"
      class="controls-tools-disabled" />
    <span>{{ title }}</span>
  </button>
  <div v-else class="wb-disks-extras13-web-painting-brush-select-item">
    <input
      :id="id"
      :disabled="disabled"
      type="radio"
      name="index"
      :value="`${value.type}_${value.size}`"
      :checked="
        `${modelValue?.type}_${modelValue?.size}` ===
        `${value.type}_${value.size}`
      "
      @input="onInput(value)" />
    <label :for="id">
      <component :is="component" />
      <svg-web-painting-disabled
        v-if="disabled"
        class="controls-tools-disabled" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, markRaw, useId, type FunctionalComponent } from 'vue';

import SvgWebPaintingDisabled from '../../../assets/svg/tools/disabled.svg?component';
import SvgWebPaintingBuiltInBrush0 from '../../../assets/svg/tools/built_in_brush_0.svg?component';
import SvgWebPaintingBuiltInBrush1 from '../../../assets/svg/tools/built_in_brush_1.svg?component';
import SvgWebPaintingBuiltInBrush2 from '../../../assets/svg/tools/built_in_brush_2.svg?component';
import SvgWebPaintingBuiltInBrush3 from '../../../assets/svg/tools/built_in_brush_3.svg?component';
import SvgWebPaintingBuiltInBrush4 from '../../../assets/svg/tools/built_in_brush_4.svg?component';
import SvgWebPaintingBuiltInBrush5 from '../../../assets/svg/tools/built_in_brush_5.svg?component';
import SvgWebPaintingBuiltInBrush6 from '../../../assets/svg/tools/built_in_brush_6.svg?component';
import SvgWebPaintingBuiltInBrush7 from '../../../assets/svg/tools/built_in_brush_7.svg?component';
import SvgWebPaintingBuiltInBrush8 from '../../../assets/svg/tools/built_in_brush_8.svg?component';
import SvgWebPaintingBuiltInBrush9 from '../../../assets/svg/tools/built_in_brush_9.svg?component';
import {
  BRUSH_TYPE,
  type BrushSelect
} from '@web-workbench/disk-extras13/webPainting/types/select';

const id = useId();

const icons: {
  [key in BRUSH_TYPE]: Partial<{
    [key in number]: FunctionalComponent;
  }>;
} = {
  [BRUSH_TYPE.CIRCLE]: {
    [1]: markRaw(SvgWebPaintingBuiltInBrush0),
    [3]: markRaw(SvgWebPaintingBuiltInBrush1),
    [5]: markRaw(SvgWebPaintingBuiltInBrush2),
    [7]: markRaw(SvgWebPaintingBuiltInBrush3)
  },
  [BRUSH_TYPE.SQUARE]: {
    [2]: markRaw(SvgWebPaintingBuiltInBrush7),
    [3]: markRaw(SvgWebPaintingBuiltInBrush6),
    [4]: markRaw(SvgWebPaintingBuiltInBrush5),
    [5]: markRaw(SvgWebPaintingBuiltInBrush4)
  },
  [BRUSH_TYPE.DOTS]: {
    [4]: markRaw(SvgWebPaintingBuiltInBrush8),
    [8]: markRaw(SvgWebPaintingBuiltInBrush9)
  }
};

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: BrushSelect): void;
  (e: 'click', event: MouseEvent, value: BrushSelect): void;
}>();

const $props = defineProps<{
  name: string;
  modelValue?: BrushSelect;
  passive?: boolean;
  disabled?: boolean;
  title: string;
  value: BrushSelect;
}>();

const component = computed(() => {
  return (
    icons[$props.value.type][$props.value.size] || SvgWebPaintingBuiltInBrush0
  );
});

function onInput({ type, size }: BrushSelect) {
  $emit('update:model-value', { type, size });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-brush-select-item {
  --color-background: var(
    --color-disks-web-painting-sidebar-brush-select-background,
    #fff
  );
  --color-foreground: var(
    --color-disks-web-painting-sidebar-brush-select-item-foreground,
    #fff
  );
  --color-selected-foreground: var(
    --color-disks-web-painting-sidebar-brush-select-item-selected-foreground,
    #fa5
  );

  position: relative;

  &button {
    padding: 0;
    appearance: none;
    background: transparent;
    border: none;
  }

  & input {
    display: none;
  }

  & label {
    display: inline-block;
  }

  & svg {
    display: block;
    fill: var(--color-foreground);
  }

  &button:hover,
  & input:checked + label,
  &:hover input:not([disabled]) + label {
    & :deep(svg) {
      fill: var(--color-selected-foreground);
    }
  }

  & .controls-tools-disabled {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
  }
}
</style>
