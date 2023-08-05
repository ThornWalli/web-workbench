<template>
  <wb-form class="wb-disks-extras13-web-painting-brush-select">
    <ul class="controls-brushes">
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

import { Subscription } from 'rxjs';
import { markRaw } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form';
import domEvents from '@web-workbench/core/services/domEvents';
import SvgWebPaintingBuiltInBrush0 from '../../assets/svg/web-painting/built_in_brush_0.svg?component';
import SvgWebPaintingBuiltInBrush1 from '../../assets/svg/web-painting/built_in_brush_1.svg?component';
import SvgWebPaintingBuiltInBrush2 from '../../assets/svg/web-painting/built_in_brush_2.svg?component';
import SvgWebPaintingBuiltInBrush3 from '../../assets/svg/web-painting/built_in_brush_3.svg?component';
import SvgWebPaintingBuiltInBrush4 from '../../assets/svg/web-painting/built_in_brush_4.svg?component';
import SvgWebPaintingBuiltInBrush5 from '../../assets/svg/web-painting/built_in_brush_5.svg?component';
import SvgWebPaintingBuiltInBrush6 from '../../assets/svg/web-painting/built_in_brush_6.svg?component';
import SvgWebPaintingBuiltInBrush7 from '../../assets/svg/web-painting/built_in_brush_7.svg?component';
import SvgWebPaintingBuiltInBrush8 from '../../assets/svg/web-painting/built_in_brush_8.svg?component';
import SvgWebPaintingBuiltInBrush9 from '../../assets/svg/web-painting/built_in_brush_9.svg?component';

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
      subscription: new Subscription(),
      items: [
        {
          component: markRaw(SvgWebPaintingBuiltInBrush0),
          index: 0,
          size: 1
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush1),
          index: 0,
          size: 2
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush2),
          index: 0,
          size: 3
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush3),
          index: 0,
          size: 4
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush4),
          index: 1,
          size: 4
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush5),
          index: 1,
          size: 3
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush6),
          index: 1,
          size: 2
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush7),
          index: 1,
          size: 1
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush8),
          index: 2,
          size: 1
        },
        {
          component: markRaw(SvgWebPaintingBuiltInBrush9),
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

  unmounted () {
    this.subscription.unsubscribe();
  },

  mounted () {
    this.subscription.add(domEvents.keypress.subscribe((e) => {
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

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-brush-select {
  --color-web-painting-brush-select-background: #fff;
  --color-web-painting-brush-select-selected: #fa5;

  position: relative;
  background: var(--color-web-painting-brush-select-background);

  /* &-built_in_brushes {
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

  & .controls-brushes {
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
      & input:checked + :deep(svg *) {
        fill: var(--color-web-painting-brush-select-selected);
      }
    }
  }
}
</style>
