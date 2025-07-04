<template>
  <button
    v-if="passive"
    class="wb-disks-extras13-web-paint-tool-select-item"
    @click="$emit('click', $event, value)">
    <component :is="component" />
    <svg-web-paint-disabled v-if="disabled" class="controls-tools-disabled" />
    <span>{{ title }}</span>
  </button>
  <div v-else class="wb-disks-extras13-web-paint-tool-select-item">
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

import { SHAPE_STYLE, TOOLS } from '../../../types/select';
import type { ToolSelect } from '../../../types/select';

const id = useId();

const defaultTools = {
  [TOOLS.NONE]: undefined,
  [TOOLS.DOTTED_FREEHAND]: undefined,
  [TOOLS.CONTINUOUS_FREEHAND]: undefined,
  [TOOLS.STRAIGHT_LINE]: undefined,
  [TOOLS.CURVE_LINE]: undefined,
  [TOOLS.FILL_TOOL]: undefined,
  [TOOLS.AIR_BRUSH]: undefined,
  [TOOLS.CROP]: undefined,
  [TOOLS.TEXT]: undefined,
  [TOOLS.SPLIT_SCREEN]: undefined,
  [TOOLS.MAGNIFY]: undefined,
  [TOOLS.ZOOM]: undefined,
  [TOOLS.STACK_REDO]: undefined,
  [TOOLS.STACK_UNDO]: undefined,
  [TOOLS.CLEAR]: undefined,
  [TOOLS.COLOR_PICKER]: undefined,
  [TOOLS.ZOOM_FIT]: undefined,
  [TOOLS.IMAGE_OPERATION]: undefined // TOOLS.IMAGE_OPERATION intentionally omitted
};

const icons: {
  [key in TOOLS]: FunctionalComponent | undefined;
} = {
  ...defaultTools,
  [TOOLS.DOTTED_FREEHAND]: markRaw(SvgWebPaintDottedFreehand),
  [TOOLS.CONTINUOUS_FREEHAND]: markRaw(SvgWebPaintContinuousFreehand),
  [TOOLS.STRAIGHT_LINE]: markRaw(SvgWebPaintStraightLine),
  [TOOLS.CURVE_LINE]: markRaw(SvgWebPaintCurve),
  [TOOLS.FILL_TOOL]: markRaw(SvgWebPaintFillTool),
  [TOOLS.AIR_BRUSH]: markRaw(SvgWebPaintAirBrush),
  [TOOLS.RECTANGLE]: markRaw(SvgWebPaintStrokedFilledRectangle),
  [TOOLS.CIRCLE]: markRaw(SvgWebPaintStrokedFilledCircle),
  [TOOLS.ELLIPSE]: markRaw(SvgWebPaintStrokedFilledEllipse),
  [TOOLS.POLYGON]: markRaw(SvgWebPaintStrokedFilledPolygon),
  [TOOLS.CROP]: markRaw(SvgWebPaintBrushSelector),
  [TOOLS.TEXT]: markRaw(SvgWebPaintText),
  [TOOLS.SPLIT_SCREEN]: markRaw(SvgWebPaintGrid),
  [TOOLS.MAGNIFY]: markRaw(SvgWebPaintMagnify),
  [TOOLS.ZOOM]: markRaw(SvgWebPaintZoom),
  [TOOLS.STACK_UNDO]: markRaw(SvgWebPaintUndoLastPaintingAction),
  [TOOLS.STACK_REDO]: markRaw(SvgWebPaintRedoLastPaintingAction),
  [TOOLS.CLEAR]: markRaw(SvgWebPaintClear),
  [TOOLS.COLOR_PICKER]: markRaw(SvgWebPaintColorPicker),
  [TOOLS.ZOOM_FIT]: markRaw(SvgWebPaintZoomFit)
};
const iconsFilled: {
  [key in TOOLS]: FunctionalComponent | undefined;
} = {
  ...defaultTools,
  [TOOLS.RECTANGLE]: markRaw(SvgWebPaintFilledRectangle),
  [TOOLS.CIRCLE]: markRaw(SvgWebPaintFilledCircle),
  [TOOLS.ELLIPSE]: markRaw(SvgWebPaintFilledEllipse),
  [TOOLS.POLYGON]: markRaw(SvgWebPaintFilledPolygon)
};
const iconsStroked: {
  [key in TOOLS]: FunctionalComponent | undefined;
} = {
  ...defaultTools,
  [TOOLS.RECTANGLE]: markRaw(SvgWebPaintStrokedRectangle),
  [TOOLS.CIRCLE]: markRaw(SvgWebPaintStrokedCircle),
  [TOOLS.ELLIPSE]: markRaw(SvgWebPaintStrokedEllipse),
  [TOOLS.POLYGON]: markRaw(SvgWebPaintStrokedPolygon)
};

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: TOOLS): void;
  (e: 'click', event: MouseEvent, value: TOOLS): void;
}>();

const $props = defineProps<{
  name: string;
  modelValue?: ToolSelect;
  passive?: boolean;
  disabled?: boolean;
  title: string;
  value: TOOLS;
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

function onInput(value: TOOLS) {
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
