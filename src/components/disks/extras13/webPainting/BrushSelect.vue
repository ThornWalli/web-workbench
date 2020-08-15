<template>
  <wb-form class="wb-disks-extras13-web-painting-brush-select">
    <ul class="controls__brushes">
      <li
        v-for="(item, index) in items"
        :key="index"
      >
        <label>
          <input v-model="currentIndex" type="radio" name="index" :value="index">
          <component :is="item.component" />
        </label>
      </li>
    </ul>
  </wb-form>
</template>

<script>

import SvgWebPaintingBuiltInBrush0 from '@/assets/svg/web-painting/built_in_brush_0.svg?vue-template';
import SvgWebPaintingBuiltInBrush1 from '@/assets/svg/web-painting/built_in_brush_1.svg?vue-template';
import SvgWebPaintingBuiltInBrush2 from '@/assets/svg/web-painting/built_in_brush_2.svg?vue-template';
import SvgWebPaintingBuiltInBrush3 from '@/assets/svg/web-painting/built_in_brush_3.svg?vue-template';
import SvgWebPaintingBuiltInBrush4 from '@/assets/svg/web-painting/built_in_brush_4.svg?vue-template';
import SvgWebPaintingBuiltInBrush5 from '@/assets/svg/web-painting/built_in_brush_5.svg?vue-template';
import SvgWebPaintingBuiltInBrush6 from '@/assets/svg/web-painting/built_in_brush_6.svg?vue-template';
import SvgWebPaintingBuiltInBrush7 from '@/assets/svg/web-painting/built_in_brush_7.svg?vue-template';
import SvgWebPaintingBuiltInBrush8 from '@/assets/svg/web-painting/built_in_brush_8.svg?vue-template';
import SvgWebPaintingBuiltInBrush9 from '@/assets/svg/web-painting/built_in_brush_9.svg?vue-template';

import WbForm from '@/components/environments/molecules/Form';
import domEvents from '../../../../web-workbench/services/domEvents';

export default {

  components: {
    WbForm
  },

  props: {
    model: {
      type: Object,
      default () {
        return {
          size: 1,
          index: 0
        };
      }
    }
  },
  data () {
    return {
      currentIndex: 0,
      subscriptions: [],
      items: [
        {
          component: SvgWebPaintingBuiltInBrush0,
          index: 0,
          size: 1
        },
        {
          component: SvgWebPaintingBuiltInBrush1,
          index: 0,
          size: 2
        },
        {
          component: SvgWebPaintingBuiltInBrush2,
          index: 0,
          size: 3
        },
        {
          component: SvgWebPaintingBuiltInBrush3,
          index: 0,
          size: 4
        },
        {
          component: SvgWebPaintingBuiltInBrush4,
          index: 1,
          size: 4
        },
        {
          component: SvgWebPaintingBuiltInBrush5,
          index: 1,
          size: 3
        },
        {
          component: SvgWebPaintingBuiltInBrush6,
          index: 1,
          size: 2
        },
        {
          component: SvgWebPaintingBuiltInBrush7,
          index: 1,
          size: 1
        },
        {
          component: SvgWebPaintingBuiltInBrush8,
          index: 2,
          size: 1
        },
        {
          component: SvgWebPaintingBuiltInBrush9,
          index: 2,
          size: 2
        }
      ]
    };
  },

  watch: {
    currentIndex (index) {
      this.model.index = this.items[Number(index)].index;
      this.model.size = this.items[Number(index)].size;
    }
  },

  destroyed () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  },

  mounted () {
    this.subscriptions.push(domEvents.keypress.subscribe((e) => {
      switch (e.keyCode) {
        case 43:
          // +
          this.model.size++;
          break;
        case 45:
          // -
          this.model.size--;
          break;
      }
    }));
  }
};
</script>

<style lang="postcss">
.wb-disks-extras13-web-painting-brush-select {
  --color__webPaintingBrushSelect__background: #fff;
  --color__webPaintingBrushSelect__selected: #fa5;

  position: relative;
  background: var(--color__webPaintingBrushSelect__background);

  /* &__built_in_brushes {
    box-sizing: content-box;
    display: block;
    background: $workbenchColor_3;
    border: solid $workbenchColor_1;
    border-width: 2px 2px 0 2px;

    svg {
      * {
        fill: $workbenchColor_1;
      }
    }
  } */

  & input {
    display: none;
  }

  & label {
    display: inline-block;
  }

  & svg {
    display: block;
  }

  & .controls__brushes {
    position: relative;
    width: 46px;
    height: 40px;

    & li {
      position: absolute;

      &:nth-child(1) {
        top: -2px;
        left: 2px;
      }

      &:nth-child(2) {
        top: -4px;
        left: 10px;
      }

      &:nth-child(3) {
        top: -2px;
        left: 18px;
      }

      &:nth-child(4) {
        top: 0;
        left: 30px;
      }

      &:nth-child(5) {
        top: 12px;
        left: 2px;
      }

      &:nth-child(6) {
        top: 10px;
        left: 16px;
      }

      &:nth-child(7) {
        top: 8px;
        left: 28px;
      }

      &:nth-child(8) {
        top: 6px;
        left: 38px;
      }

      /* &:nth-child(9) {
        top: 22px;
        left: 30px;
      } */

      &:nth-child(9) {
        top: 20px;
        left: 8px;
      }

      &:nth-child(10) {
        top: 22px;
        left: 30px;
      }

      &:hover,
      & input:checked + svg {
        & * {
          fill: var(--color__webPaintingBrushSelect__selected);
        }
      }
    }
  }
}
</style>
