<template>
  <wb-form class="wb-disks-extras13-web-painting-tool-select">
    <ul>
      <li v-for="(item, index) in items" :key="index" :class="item.name">
        <label>
          <input
            v-model="currentIndex"
            :disabled="item.disabled"
            type="radio"
            name="index"
            :value="index" />
          <component :is="item.component" />
          <svg-web-painting-disabled
            v-if="item.disabled"
            class="controls-tools-disabled" />
        </label>
      </li>
    </ul>
  </wb-form>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';
import { markRaw, onMounted, onUnmounted, ref, watch } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import domEvents from '@web-workbench/core/services/domEvents';
import SvgWebPaintingDisabled from '../../assets/svg/web-painting/disabled.svg?component';
import SvgWebPaintingDottedFreehand from '../../assets/svg/web-painting/dotted_freehand.svg?component';
import SvgWebPaintingContinuousFreehand from '../../assets/svg/web-painting/continuous_freehand.svg?component';
import SvgWebPaintingStraightLine from '../../assets/svg/web-painting/straight_line.svg?component';
import SvgWebPaintingCurve from '../../assets/svg/web-painting/curve.svg?component';
import SvgWebPaintingFillTool from '../../assets/svg/web-painting/fill_tool.svg?component';
import SvgWebPaintingAirBrush from '../../assets/svg/web-painting/airbrush.svg?component';
import SvgWebPaintingUnfilledFilledRectangle from '../../assets/svg/web-painting/unfilled_filled_rectangle.svg?component';
import SvgWebPaintingUnfilledFilledCircle from '../../assets/svg/web-painting/unfilled_filled_circle.svg?component';
import SvgWebPaintingUnfilledFilledEllipse from '../../assets/svg/web-painting/unfilled_filled_ellipse.svg?component';
import SvgWebPaintingUnfilledFilledPolygon from '../../assets/svg/web-painting/unfilled_filled_polygon.svg?component';
import SvgWebPaintingBrushSelector from '../../assets/svg/web-painting/brush_selector.svg?component';
import SvgWebPaintingText from '../../assets/svg/web-painting/text.svg?component';
import SvgWebPaintingGrid from '../../assets/svg/web-painting/grid.svg?component';
import SvgWebPaintingSymmetry from '../../assets/svg/web-painting/symmetry.svg?component';
import SvgWebPaintingMagnify from '../../assets/svg/web-painting/magnify.svg?component';
import SvgWebPaintingZoom from '../../assets/svg/web-painting/zoom.svg?component';
import SvgWebPaintingUndoLastPaintingAction from '../../assets/svg/web-painting/undo_last_painting_action.svg?component';
import SvgWebPaintingClear from '../../assets/svg/web-painting/clear.svg?component';

import type { ToolSelect } from '../../lib/types';
import { KEYBOARD_KEY } from '@web-workbench/core/services/dom';

const $props = defineProps<{
  modelValue: ToolSelect;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: ToolSelect): void;
}>();

const currentIndex = ref($props.modelValue.index);
const subscription = new Subscription();

const items = ref([
  {
    component: markRaw(SvgWebPaintingDottedFreehand),
    name: 'dotted_freehand'
  },
  {
    component: markRaw(SvgWebPaintingContinuousFreehand),
    name: 'continuous_freehand'
  },
  {
    component: markRaw(SvgWebPaintingStraightLine),
    name: 'straight_line'
  },
  {
    component: markRaw(SvgWebPaintingCurve),
    name: 'curve'
  },
  {
    component: markRaw(SvgWebPaintingFillTool),
    name: 'fill_tool'
  },
  {
    component: markRaw(SvgWebPaintingAirBrush),
    name: 'airbrush'
  },
  {
    component: markRaw(SvgWebPaintingUnfilledFilledRectangle),
    name: 'unfilled_filled_rectangle'
  },
  {
    component: markRaw(SvgWebPaintingUnfilledFilledCircle),
    name: 'unfilled_filled_circle'
  },
  {
    component: markRaw(SvgWebPaintingUnfilledFilledEllipse),
    name: 'unfilled_filled_ellipse'
  },
  {
    component: markRaw(SvgWebPaintingUnfilledFilledPolygon),
    name: 'unfilled_filled_polygon'
  },
  {
    component: markRaw(SvgWebPaintingBrushSelector),
    name: 'brush_selector'
  },
  {
    component: markRaw(SvgWebPaintingText),
    name: 'text',
    disabled: true
  },
  {
    component: markRaw(SvgWebPaintingGrid),
    name: 'grid',
    disabled: true
  },
  {
    component: markRaw(SvgWebPaintingSymmetry),
    name: 'symmetry',
    disabled: true
  },
  {
    component: markRaw(SvgWebPaintingMagnify),
    name: 'magnify'
  },
  {
    component: markRaw(SvgWebPaintingZoom),
    name: 'zoom'
  },
  {
    component: markRaw(SvgWebPaintingUndoLastPaintingAction),
    name: 'undo_last_painting_action',
    passive: true
  },
  {
    component: markRaw(SvgWebPaintingClear),
    name: 'clear',
    passive: true
  }
]);

watch(
  () => currentIndex.value,
  index => {
    setValue({
      value: items.value[Number(index)].name,
      index
    });
  }
);

onUnmounted(() => {
  subscription.unsubscribe();
});

onMounted(() => {
  subscription.add(
    domEvents.keyPress.subscribe(e => {
      switch (e.key) {
        case KEYBOARD_KEY.NUM_PAD_6:
        case KEYBOARD_KEY.KEY_F:
          setValue({ filled: false });
          break;
      }
    })
  );
});

const setValue = (modelValue: ToolSelect) => {
  $emit('update:model-value', {
    ...$props.modelValue,
    ...modelValue
  });
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-tool-select {
  --color-web-painting-tool-select-background: #fff;
  --color-web-painting-tool-select-border: #fff;
  --color-web-painting-tool-select-icon-background: #05a;
  --color-web-painting-tool-select-icon: #fff;
  --color-web-painting-tool-select-selected: #fa5;

  position: relative;
  clear: fix;
  background: var(--color-web-painting-tool-select-background);
  border-bottom: solid var(--color-web-painting-tool-select-border) 2px;

  & input {
    display: none;
  }

  & svg {
    display: block;
  }

  & li {
    position: relative;
    float: left;
    border: solid var(--color-web-painting-tool-select-border);
    border-width: 2px 0 0 2px;

    &:nth-child(even) {
      border-width: 2px 2px 0;
    }

    & span {
      display: block;
      width: 22px;
      background: var(--color-web-painting-tool-select-icon-background);

      & svg {
        & :deep(*) {
          fill: var(--color-web-painting-tool-select-icon);
        }
      }
    }

    & input:checked + :deep(svg *),
    &:hover input:not([disabled]) + :deep(svg *) {
      fill: var(--color-web-painting-tool-select-selected);
    }

    & .controls-tools-disabled {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
    }
  }
}
</style>
