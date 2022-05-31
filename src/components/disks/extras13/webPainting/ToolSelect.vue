<template>
  <wb-form class="wb-disks-extras13-web-painting-tool-select">
    <ul class="controls__tools">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="item.name"
      >
        <label>
          <input v-model="model.index" :disabled="item.disabled" type="radio" name="index" :value="index">
          <component :is="item.component" />
          <svg-web-painting-disabled v-if="item.disabled" class="controls__tools__disabled" />
        </label>
      </li>
    </ul>
  </wb-form>
</template>

<script>

import domEvents from '../../../../web-workbench/services/domEvents';
import SvgWebPaintingDisabled from '@/assets/svg/web-painting/disabled.svg?vue-template';
import SvgWebPaintingDottedFreehand from '@/assets/svg/web-painting/dotted_freehand.svg?vue-template';
import SvgWebPaintingContinuousFreehand from '@/assets/svg/web-painting/continuous_freehand.svg?vue-template';
import SvgWebPaintingStraightLine from '@/assets/svg/web-painting/straight_line.svg?vue-template';
import SvgWebPaintingCurve from '@/assets/svg/web-painting/curve.svg?vue-template';
import SvgWebPaintingFillTool from '@/assets/svg/web-painting/fill_tool.svg?vue-template';
import SvgWebPaintingAirBrush from '@/assets/svg/web-painting/airbrush.svg?vue-template';
import SvgWebPaintingUnfilledFilledRectangle from '@/assets/svg/web-painting/unfilled_filled_rectangle.svg?vue-template';
import SvgWebPaintingUnfilledFilledCircle from '@/assets/svg/web-painting/unfilled_filled_circle.svg?vue-template';
import SvgWebPaintingUnfilledFilledEllipse from '@/assets/svg/web-painting/unfilled_filled_ellipse.svg?vue-template';
import SvgWebPaintingUnfilledFilledPolygon from '@/assets/svg/web-painting/unfilled_filled_polygon.svg?vue-template';
import SvgWebPaintingBrushSelector from '@/assets/svg/web-painting/brush_selector.svg?vue-template';
import SvgWebPaintingText from '@/assets/svg/web-painting/text.svg?vue-template';
import SvgWebPaintingGrid from '@/assets/svg/web-painting/grid.svg?vue-template';
import SvgWebPaintingSymmetry from '@/assets/svg/web-painting/symmetry.svg?vue-template';
import SvgWebPaintingMagnify from '@/assets/svg/web-painting/magnify.svg?vue-template';
import SvgWebPaintingZoom from '@/assets/svg/web-painting/zoom.svg?vue-template';
import SvgWebPaintingUndoLastPaintingAction from '@/assets/svg/web-painting/undo_last_painting_action.svg?vue-template';
import SvgWebPaintingClear from '@/assets/svg/web-painting/clear.svg?vue-template';

import WbForm from '@/components/environments/molecules/Form';

export default {

  components: { WbForm, SvgWebPaintingDisabled },

  props: {
    model: {
      type: Object,
      default () {
        return {
          value: '',
          index: 0,
          filled: false
        };
      }
    }
  },

  data () {
    return {
      subscriptions: [],
      items: [
        {
          component: SvgWebPaintingDottedFreehand,
          name: 'dotted_freehand'
        },
        {
          component: SvgWebPaintingContinuousFreehand,
          name: 'continuous_freehand'
        },
        {
          component: SvgWebPaintingStraightLine,
          name: 'straight_line'
        },
        {
          component: SvgWebPaintingCurve,
          name: 'curve'
        },
        {
          component: SvgWebPaintingFillTool,
          name: 'fill_tool'
        },
        {
          component: SvgWebPaintingAirBrush,
          name: 'airbrush'
        },
        {
          component: SvgWebPaintingUnfilledFilledRectangle,
          name: 'unfilled_filled_rectangle'
        },
        {
          component: SvgWebPaintingUnfilledFilledCircle,
          name: 'unfilled_filled_circle'
        },
        {
          component: SvgWebPaintingUnfilledFilledEllipse,
          name: 'unfilled_filled_ellipse'
        },
        {
          component: SvgWebPaintingUnfilledFilledPolygon,
          name: 'unfilled_filled_polygon'
        },
        {
          component: SvgWebPaintingBrushSelector,
          name: 'brush_selector'
        },
        {
          component: SvgWebPaintingText,
          name: 'text',
          disabled: true
        },
        {
          component: SvgWebPaintingGrid,
          name: 'grid',
          disabled: true
        },
        {
          component: SvgWebPaintingSymmetry,
          name: 'symmetry',
          disabled: true
        },
        {
          component: SvgWebPaintingMagnify,
          name: 'magnify'
        },
        {
          component: SvgWebPaintingZoom,
          name: 'zoom'
        },
        {
          component: SvgWebPaintingUndoLastPaintingAction,
          name: 'undo_last_painting_action',
          passive: true
        },
        {
          component: SvgWebPaintingClear,
          name: 'clear',
          passive: true
        }
      ]
    };
  },

  computed: {
    currentIndex () {
      return this.model.index;
    }
  },

  watch: {
    currentIndex (index) {
      this.model.value = this.items[Number(index)].name;
    }
  },

  destroyed () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  },

  mounted () {
    this.subscriptions.push(domEvents.keypress.subscribe((e) => {
      switch (e.keyCode) {
        case 102:
        case 70:
          this.model.filled = !this.model.filled;
          break;
      }
    }));
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-tool-select {
  --color__webPaintingToolSelect__background: #fff;
  --color__webPaintingToolSelect__border: #fff;
  --color__webPaintingToolSelect__iconBackground: #05a;
  --color__webPaintingToolSelect__icon: #fff;
  --color__webPaintingToolSelect__selected: #fa5;

  position: relative;
  clear: fix;
  background: var(--color__webPaintingToolSelect__background);
  border-bottom: solid var(--color__webPaintingToolSelect__border) 2px;

  & input {
    display: none;
  }

  & svg {
    display: block;
  }

  & li {
    position: relative;
    float: left;
    border: solid var(--color__webPaintingToolSelect__border);
    border-width: 2px 0 0 2px;

    &:nth-child(even) {
      border-width: 2px 2px 0;
    }

    & span {
      display: block;
      width: 22px;
      background: var(--color__webPaintingToolSelect__iconBackground);

      & svg {
        * {
          fill: var(--color__webPaintingToolSelect__icon);
        }
      }
    }

    & input:checked + svg,
    &:hover input:not([disabled]) + svg {
      & * {
        fill: var(--color__webPaintingToolSelect__selected);
      }
    }

    & .controls__tools__disabled {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
    }
  }
}
</style>
