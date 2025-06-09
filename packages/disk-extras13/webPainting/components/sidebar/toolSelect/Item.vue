<template>
  <button
    v-if="passive"
    class="wb-disks-extras13-web-painting-tool-select-item"
    @click="$emit('click', $event, value)">
    <component :is="component" />
    <svg-web-painting-disabled
      v-if="disabled"
      class="controls-tools-disabled" />
    <span>{{ title }}</span>
  </button>
  <div v-else class="wb-disks-extras13-web-painting-tool-select-item">
    <input
      :id="id"
      :disabled="disabled"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue?.value === value"
      @input="onInput(value)" />
    <label :for="id">
      <component :is="component" />
      <svg-web-painting-disabled
        v-if="disabled"
        class="controls-tools-disabled"
        :title="title" />
      <span>{{ title }}</span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, markRaw, useId, type FunctionalComponent } from 'vue';

import SvgWebPaintingDisabled from '../../../assets/svg/web-painting/disabled.svg?component';
import SvgWebPaintingDottedFreehand from '../../../assets/svg/web-painting/dotted_freehand.svg?component';
import SvgWebPaintingContinuousFreehand from '../../../assets/svg/web-painting/continuous_freehand.svg?component';
import SvgWebPaintingStraightLine from '../../../assets/svg/web-painting/straight_line.svg?component';
import SvgWebPaintingCurve from '../../../assets/svg/web-painting/curve.svg?component';
import SvgWebPaintingFillTool from '../../../assets/svg/web-painting/fill_tool.svg?component';
import SvgWebPaintingAirBrush from '../../../assets/svg/web-painting/airbrush.svg?component';
import SvgWebPaintingUnfilledFilledRectangle from '../../../assets/svg/web-painting/unfilled_filled_rectangle.svg?component';
import SvgWebPaintingUnfilledFilledCircle from '../../../assets/svg/web-painting/unfilled_filled_circle.svg?component';
import SvgWebPaintingUnfilledFilledEllipse from '../../../assets/svg/web-painting/unfilled_filled_ellipse.svg?component';
import SvgWebPaintingUnfilledFilledPolygon from '../../../assets/svg/web-painting/unfilled_filled_polygon.svg?component';
import SvgWebPaintingBrushSelector from '../../../assets/svg/web-painting/brush_selector.svg?component';
import SvgWebPaintingText from '../../../assets/svg/web-painting/text.svg?component';
import SvgWebPaintingGrid from '../../../assets/svg/web-painting/grid.svg?component';
import SvgWebPaintingSymmetry from '../../../assets/svg/web-painting/symmetry.svg?component';
import SvgWebPaintingMagnify from '../../../assets/svg/web-painting/magnify.svg?component';
import SvgWebPaintingZoom from '../../../assets/svg/web-painting/zoom.svg?component';
import SvgWebPaintingUndoLastPaintingAction from '../../../assets/svg/web-painting/undo.svg?component';
import SvgWebPaintingRedoLastPaintingAction from '../../../assets/svg/web-painting/redo.svg?component';
import SvgWebPaintingClear from '../../../assets/svg/web-painting/clear.svg?component';

import { TOOLS } from '@web-workbench/disk-extras13/webPainting/types/select';

const id = useId();

const icons: {
  [key in TOOLS]: FunctionalComponent;
} = {
  [TOOLS.DOTTED_FREEHAND]: markRaw(SvgWebPaintingDottedFreehand),
  [TOOLS.CONTINUOUS_FREEHAND]: markRaw(SvgWebPaintingContinuousFreehand),
  [TOOLS.STRAIGHT_LINE]: markRaw(SvgWebPaintingStraightLine),
  [TOOLS.CURVE]: markRaw(SvgWebPaintingCurve),
  [TOOLS.FILL_TOOL]: markRaw(SvgWebPaintingFillTool),
  [TOOLS.AIR_BRUSH]: markRaw(SvgWebPaintingAirBrush),
  [TOOLS.UNFILLED_FILLED_RECTANGLE]: markRaw(
    SvgWebPaintingUnfilledFilledRectangle
  ),
  [TOOLS.UNFILLED_FILLED_CIRCLE]: markRaw(SvgWebPaintingUnfilledFilledCircle),
  [TOOLS.UNFILLED_FILLED_ELLIPSE]: markRaw(SvgWebPaintingUnfilledFilledEllipse),
  [TOOLS.UNFILLED_FILLED_POLYGON]: markRaw(SvgWebPaintingUnfilledFilledPolygon),
  [TOOLS.BRUSH_SELECTOR]: markRaw(SvgWebPaintingBrushSelector),
  [TOOLS.TEXT]: markRaw(SvgWebPaintingText),
  [TOOLS.GRID]: markRaw(SvgWebPaintingGrid),
  [TOOLS.SYMMETRY]: markRaw(SvgWebPaintingSymmetry),
  [TOOLS.MAGNIFY]: markRaw(SvgWebPaintingMagnify),
  [TOOLS.ZOOM]: markRaw(SvgWebPaintingZoom),
  [TOOLS.STACK_UNDO]: markRaw(SvgWebPaintingUndoLastPaintingAction),
  [TOOLS.STACK_REDO]: markRaw(SvgWebPaintingRedoLastPaintingAction),
  [TOOLS.CLEAR]: markRaw(SvgWebPaintingClear)
};

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: TOOLS): void;
  (e: 'click', event: MouseEvent, value: TOOLS): void;
}>();

const $props = defineProps<{
  name: string;
  modelValue?: { value: string };
  passive?: boolean;
  disabled?: boolean;
  title: string;
  value: TOOLS;
}>();

const component = computed(() => {
  return icons[$props.value];
});

function onInput(value: TOOLS) {
  $emit('update:model-value', value);
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-tool-select-item {
  --color-web-painting-tool-select-item: var(--workbench-color-2);
  --color-web-painting-tool-select-item-selected: var(--workbench-color-4);

  position: relative;

  &button {
    padding: 0;
    appearance: none;
    background: transparent;
    border: none;

    &:hover :deep(svg) {
      fill: var(--color-web-painting-tool-select-selected);
    }
  }

  & input {
    display: none;
  }

  & svg {
    display: block;
    fill: var(--color-web-painting-tool-select-item);
  }

  & span {
    display: none;
  }

  & input:checked + label,
  &:hover input:not([disabled]) + label {
    & :deep(svg) {
      fill: var(--color-web-painting-tool-select-selected);
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
