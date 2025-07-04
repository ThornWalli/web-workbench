<template>
  <button
    v-if="passive"
    class="wb-disks-extras13-web-paint-brush-select-item"
    @click="$emit('click', $event, value)">
    <component :is="component" />
    <svg-web-paint-disabled v-if="disabled" class="controls-tools-disabled" />
    <span>{{ title }}</span>
  </button>
  <div v-else class="wb-disks-extras13-web-paint-brush-select-item">
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
      <svg-web-paint-disabled v-if="disabled" class="controls-tools-disabled" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, markRaw, useId, type FunctionalComponent } from 'vue';

import SvgWebPaintDisabled from '../../../assets/svg/tools/disabled.svg?component';
import SvgWebPaintBuiltInBrush0 from '../../../assets/svg/tools/built_in_brush_0.svg?component';
import SvgWebPaintBuiltInBrush1 from '../../../assets/svg/tools/built_in_brush_1.svg?component';
import SvgWebPaintBuiltInBrush2 from '../../../assets/svg/tools/built_in_brush_2.svg?component';
import SvgWebPaintBuiltInBrush3 from '../../../assets/svg/tools/built_in_brush_3.svg?component';
import SvgWebPaintBuiltInBrush4 from '../../../assets/svg/tools/built_in_brush_4.svg?component';
import SvgWebPaintBuiltInBrush5 from '../../../assets/svg/tools/built_in_brush_5.svg?component';
import SvgWebPaintBuiltInBrush6 from '../../../assets/svg/tools/built_in_brush_6.svg?component';
import SvgWebPaintBuiltInBrush7 from '../../../assets/svg/tools/built_in_brush_7.svg?component';
import SvgWebPaintBuiltInBrush8 from '../../../assets/svg/tools/built_in_brush_8.svg?component';
import SvgWebPaintBuiltInBrush9 from '../../../assets/svg/tools/built_in_brush_9.svg?component';
import {
  BRUSH_TYPE,
  type BrushSelect
} from '@web-workbench/disk-web-paint/webPaint/types/select';

const id = useId();

const icons: {
  [key in BRUSH_TYPE]: Partial<{
    [key in number]: FunctionalComponent;
  }>;
} = {
  [BRUSH_TYPE.CIRCLE]: {
    [1]: markRaw(SvgWebPaintBuiltInBrush0),
    [3]: markRaw(SvgWebPaintBuiltInBrush1),
    [5]: markRaw(SvgWebPaintBuiltInBrush2),
    [7]: markRaw(SvgWebPaintBuiltInBrush3)
  },
  [BRUSH_TYPE.SQUARE]: {
    [2]: markRaw(SvgWebPaintBuiltInBrush7),
    [3]: markRaw(SvgWebPaintBuiltInBrush6),
    [4]: markRaw(SvgWebPaintBuiltInBrush5),
    [5]: markRaw(SvgWebPaintBuiltInBrush4)
  },
  [BRUSH_TYPE.DOTS]: {
    [4]: markRaw(SvgWebPaintBuiltInBrush8),
    [8]: markRaw(SvgWebPaintBuiltInBrush9)
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
    icons[$props.value.type][$props.value.size] || SvgWebPaintBuiltInBrush0
  );
});

function onInput({ type, size }: BrushSelect) {
  $emit('update:model-value', { type, size });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-brush-select-item {
  --color-background: var(
    --color-disks-web-paint-sidebar-brush-select-background,
    #fff
  );
  --color-foreground: var(
    --color-disks-web-paint-sidebar-brush-select-item-foreground,
    #fff
  );
  --color-selected-foreground: var(
    --color-disks-web-paint-sidebar-brush-select-item-selected-foreground,
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
