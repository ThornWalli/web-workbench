<template>
  <button
    v-if="passive"
    :title="title"
    class="wb-disks-extras13-web-paint-tool-select-item"
    :class="{ selected }"
    @click="$emit('click', $event, value)">
    <component :is="component" />
    <svg-web-paint-disabled v-if="disabled" class="controls-tools-disabled" />
    <span>{{ title }}</span>
  </button>
  <div
    v-else
    class="wb-disks-extras13-web-paint-tool-select-item"
    :class="{ selected: selected || modelValue?.value === value }">
    <input
      :id="id"
      :disabled="disabled"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue?.value === value"
      @input="onInput(value)" />
    <label :for="id" :title="title">
      <component :is="component" />
      <svg-web-paint-disabled
        v-if="disabled"
        class="controls-tools-disabled"
        :title="title" />
      <span>{{ title }}</span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, markRaw, useId } from 'vue';
import type { FunctionalComponent } from 'vue';

import SvgWebPaintDisabled from '../../../assets/svg/tools/disabled.svg?component';
import SvgWebPaintDottedFreehand from '../../../assets/svg/tools/dotted_freehand.svg?component';
import SvgWebPaintContinuousFreehand from '../../../assets/svg/tools/continuous_freehand.svg?component';
import SvgWebPaintStraightLine from '../../../assets/svg/tools/straight_line.svg?component';
import SvgWebPaintCurve from '../../../assets/svg/tools/curve.svg?component';
import SvgWebPaintFillTool from '../../../assets/svg/tools/fill_tool.svg?component';
import SvgWebPaintAirBrush from '../../../assets/svg/tools/airbrush.svg?component';

import SvgWebPaintStrokedRectangle from '../../../assets/svg/tools/stroked_rectangle.svg?component';
import SvgWebPaintStrokedCircle from '../../../assets/svg/tools/stroked_circle.svg?component';
import SvgWebPaintStrokedEllipse from '../../../assets/svg/tools/stroked_ellipse.svg?component';
import SvgWebPaintStrokedPolygon from '../../../assets/svg/tools/stroked_polygon.svg?component';
import SvgWebPaintFilledRectangle from '../../../assets/svg/tools/filled_rectangle.svg?component';
import SvgWebPaintFilledCircle from '../../../assets/svg/tools/filled_circle.svg?component';
import SvgWebPaintFilledEllipse from '../../../assets/svg/tools/filled_ellipse.svg?component';
import SvgWebPaintFilledPolygon from '../../../assets/svg/tools/filled_polygon.svg?component';
import SvgWebPaintStrokedFilledRectangle from '../../../assets/svg/tools/stroked_filled_rectangle.svg?component';
import SvgWebPaintStrokedFilledCircle from '../../../assets/svg/tools/stroked_filled_circle.svg?component';
import SvgWebPaintStrokedFilledEllipse from '../../../assets/svg/tools/stroked_filled_ellipse.svg?component';
import SvgWebPaintStrokedFilledPolygon from '../../../assets/svg/tools/stroked_filled_polygon.svg?component';

import SvgWebPaintBrushSelector from '../../../assets/svg/tools/brush_selector.svg?component';
import SvgWebPaintText from '../../../assets/svg/tools/text.svg?component';
import SvgWebPaintGrid from '../../../assets/svg/tools/grid.svg?component';
import SvgWebPaintMagnify from '../../../assets/svg/tools/magnify.svg?component';
import SvgWebPaintZoom from '../../../assets/svg/tools/zoom.svg?component';
import SvgWebPaintUndoLastPaintingAction from '../../../assets/svg/tools/undo.svg?component';
import SvgWebPaintRedoLastPaintingAction from '../../../assets/svg/tools/redo.svg?component';
import SvgWebPaintClear from '../../../assets/svg/tools/clear.svg?component';
import SvgWebPaintColorPicker from '../../../assets/svg/tools/color_picker.svg?component';
import SvgWebPaintZoomFit from '../../../assets/svg/tools/zoom_fit.svg?component';
import SvgWebPaintEraser from '../../../assets/svg/tools/eraser.svg?component';

import { SHAPE_STYLE, TOOL } from '../../../types/select';
import type { ToolSelect } from '../../../types/select';

const id = useId();

const defaultTools = {
  [TOOL.NONE]: undefined,
  [TOOL.DOTTED_FREEHAND]: undefined,
  [TOOL.CONTINUOUS_FREEHAND]: undefined,
  [TOOL.STRAIGHT_LINE]: undefined,
  [TOOL.CURVE_LINE]: undefined,
  [TOOL.FILL_TOOL]: undefined,
  [TOOL.AIR_BRUSH]: undefined,
  [TOOL.CROP]: undefined,
  [TOOL.TEXT]: undefined,
  [TOOL.GRID]: undefined,
  [TOOL.SPLIT_SCREEN]: undefined,
  [TOOL.MAGNIFY]: undefined,
  [TOOL.ZOOM]: undefined,
  [TOOL.STACK_REDO]: undefined,
  [TOOL.STACK_UNDO]: undefined,
  [TOOL.CLEAR]: undefined,
  [TOOL.COLOR_PICKER]: undefined,
  [TOOL.ZOOM_FIT]: undefined,
  [TOOL.IMAGE_OPERATION]: undefined // TOOLS.IMAGE_OPERATION intentionally omitted
};

const icons: {
  [key in TOOL]: FunctionalComponent | undefined;
} = {
  ...defaultTools,
  [TOOL.DOTTED_FREEHAND]: markRaw(SvgWebPaintDottedFreehand),
  [TOOL.CONTINUOUS_FREEHAND]: markRaw(SvgWebPaintContinuousFreehand),
  [TOOL.STRAIGHT_LINE]: markRaw(SvgWebPaintStraightLine),
  [TOOL.CURVE_LINE]: markRaw(SvgWebPaintCurve),
  [TOOL.FILL_TOOL]: markRaw(SvgWebPaintFillTool),
  [TOOL.AIR_BRUSH]: markRaw(SvgWebPaintAirBrush),
  [TOOL.RECTANGLE]: markRaw(SvgWebPaintStrokedFilledRectangle),
  [TOOL.CIRCLE]: markRaw(SvgWebPaintStrokedFilledCircle),
  [TOOL.ELLIPSE]: markRaw(SvgWebPaintStrokedFilledEllipse),
  [TOOL.POLYGON]: markRaw(SvgWebPaintStrokedFilledPolygon),
  [TOOL.CROP]: markRaw(SvgWebPaintBrushSelector),
  [TOOL.TEXT]: markRaw(SvgWebPaintText),
  [TOOL.GRID]: markRaw(SvgWebPaintGrid),
  [TOOL.SPLIT_SCREEN]: markRaw(SvgWebPaintGrid),
  [TOOL.MAGNIFY]: markRaw(SvgWebPaintMagnify),
  [TOOL.ZOOM]: markRaw(SvgWebPaintZoom),
  [TOOL.STACK_UNDO]: markRaw(SvgWebPaintUndoLastPaintingAction),
  [TOOL.STACK_REDO]: markRaw(SvgWebPaintRedoLastPaintingAction),
  [TOOL.CLEAR]: markRaw(SvgWebPaintClear),
  [TOOL.COLOR_PICKER]: markRaw(SvgWebPaintColorPicker),
  [TOOL.ZOOM_FIT]: markRaw(SvgWebPaintZoomFit),
  [TOOL.ERASER]: markRaw(SvgWebPaintEraser)
};
const iconsFilled: {
  [key in TOOL]: FunctionalComponent | undefined;
} = {
  ...defaultTools,
  [TOOL.RECTANGLE]: markRaw(SvgWebPaintFilledRectangle),
  [TOOL.CIRCLE]: markRaw(SvgWebPaintFilledCircle),
  [TOOL.ELLIPSE]: markRaw(SvgWebPaintFilledEllipse),
  [TOOL.POLYGON]: markRaw(SvgWebPaintFilledPolygon),
  [TOOL.ERASER]: markRaw(SvgWebPaintEraser)
};
const iconsStroked: {
  [key in TOOL]: FunctionalComponent | undefined;
} = {
  ...defaultTools,
  [TOOL.RECTANGLE]: markRaw(SvgWebPaintStrokedRectangle),
  [TOOL.CIRCLE]: markRaw(SvgWebPaintStrokedCircle),
  [TOOL.ELLIPSE]: markRaw(SvgWebPaintStrokedEllipse),
  [TOOL.POLYGON]: markRaw(SvgWebPaintStrokedPolygon),
  [TOOL.ERASER]: markRaw(SvgWebPaintEraser)
};

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: TOOL): void;
  (e: 'click', event: MouseEvent, value: TOOL): void;
}>();

const $props = defineProps<{
  name: string;
  modelValue?: ToolSelect;
  title: string;
  value: TOOL;
  selected?: boolean;
  passive?: boolean;
  disabled?: boolean;
}>();

const component = computed(() => {
  if (
    $props.modelValue?.shapeStyle === SHAPE_STYLE.FILLED &&
    iconsFilled[$props.value]
  ) {
    return iconsFilled[$props.value];
  } else if (
    $props.modelValue?.shapeStyle === SHAPE_STYLE.STROKED &&
    iconsStroked[$props.value]
  ) {
    return iconsStroked[$props.value];
  }
  return icons[$props.value];
});

function onInput(value: TOOL) {
  $emit('update:model-value', value);
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-tool-select-item {
  --color-background: var(
    --color-disks-web-paint-sidebar-tool-select-item-background,
    #fff
  );
  --color-foreground: var(
    --color-disks-web-paint-sidebar-tool-select-item-foreground,
    #fff
  );
  --color-selected-background: var(
    --color-disks-web-paint-sidebar-tool-select-item-selected-background,
    #fff
  );
  --color-selected-foreground: var(
    --color-disks-web-paint-sidebar-tool-select-item-selected-foreground,
    #fa5
  );

  position: relative;

  &button {
    display: block;
    padding: 0;
    appearance: none;
    background: var(--color-background);
    border: none;
  }

  & label {
    display: block;
    background: var(--color-background);
  }

  & input {
    display: none;
  }

  & svg {
    display: block;
    fill: var(--color-foreground);
  }

  & span {
    display: none;
  }

  &.selected,
  &button:hover,
  & input:checked + label,
  &:hover input:not([disabled]) + label {
    background: var(--color-selected-background);

    &:deep(svg) {
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
