<template>
  <wb-form class="wb-disks-extras13-web-painting-color-select">
    <span ref="colorPaletteSecondary" :style="stylePrimaryColor" class="color-select secondary" @contextmenu="onContextMenuSecondary">
      <span ref="colorPalettePrimary" :style="styleSecondaryColor" class="color-select primary" />
    </span>
    <ul data-hook="colorPaletteItems">
      <li v-for="(item, colorIndex) in colors" :key="colorIndex">
        <label><input v-model="index" type="radio" name="index" :value="colorIndex"><span :style="{'background-color': item.toRGB()}" /></label>
      </li>
    </ul>
  </wb-form>
</template>

<script>

import { Subscription } from 'rxjs';

import { toRaw, markRaw } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form';
import domEvents from '@web-workbench/core/services/domEvents';

import Color from '../../lib/Color';

export default {
  components: {
    WbForm
  },

  props: {
    model: {
      type: Object,
      default () {
        return {
          primaryColor: new Color(0, 0, 0),
          secondaryColor: new Color(255, 255, 255),
          paletteSteps: new Color(1, 1, 1)
        };
      }
    }
  },
  data () {
    return {
      index: 0,
      subscription: new Subscription(),
      colors: [
        markRaw(new Color(0, 0, 0)), markRaw(new Color(255, 255, 255))
      ],
      primarySelect: true
    };
  },

  computed: {
    paletteSteps () {
      return this.model.paletteSteps;
    },
    stylePrimaryColor () {
      return { 'background-color': `${toRaw(this.model.primaryColor).toRGB()}` };
    },
    styleSecondaryColor () {
      return { 'background-color': `${toRaw(this.model.secondaryColor).toRGB()}` };
    }
  },

  watch: {

    paletteSteps () {
      this.refreshColors();
    },

    index (index) {
      const color = this.colors[Number(index)];
      if (this.primarySelect) {
        this.model.primaryColor = color;
      } else {
        this.model.secondaryColor = color;
      }
    }
  },

  unmounted () {
    this.subscription.unsubscribe();
  },

  mounted () {
    this.refreshColors();
    this.subscription.add(domEvents.keypress.subscribe((e) => {
      switch (e.keyCode) {
        case 120:
        case 88:
          this.toggleColors();
          break;
      }
    }));
  },

  methods: {
    toggleColors () {
      const tmp = this.model.primaryColor;
      this.model.primaryColor = this.model.secondaryColor;
      this.model.secondaryColor = tmp;
    },

    refreshColors () {
      const paletteSteps = this.paletteSteps;
      const colors = [];
      for (let r = paletteSteps.r; r >= 0; r--) {
        for (let g = paletteSteps.g; g >= 0; g--) {
          for (let b = paletteSteps.b; b >= 0; b--) {
            colors.push(markRaw(new Color(
              Math.floor((255 / paletteSteps.r) * r),
              Math.floor((255 / paletteSteps.g) * g),
              Math.floor((255 / paletteSteps.b) * b)
            )));
          }
        }
      }
      this.colors = colors;
    },

    onContextMenuSecondary (e) {
      e.preventDefault();
      this.toggleColors();
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-color-select {
  --color-web-painting-color-select-background: #000;
  --color-web-painting-color-select-border: #fff;

  position: relative;
  background: var(--color-web-painting-color-select-background);
  border-left: solid var(--color-web-painting-color-select-border) 2px;

  & input {
    display: none;
  }

  & ul {
    clear: fix;

    & li {
      float: left;

      & span {
        position: relative;

        /* z-index: 1; */
        display: block;
        width: 12px;
        height: 12px;
      }

      & input:checked + svg,
      &:hover input:not([disabled]) + span {
        /* z-index: 2; */

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          content: "";
          border: solid var(--color-web-painting-color-select-border) 2px;
          mix-blend-mode: difference;
        }
      }
    }
  }

  & .color-select {
    &.primary {
      position: relative;
      top: 50%;
      left: 50%;
      display: block;
      width: 50%;
      height: 50%;
      background: transparent;
      transform: translate(-50%, -50%);
    }

    &.secondary {
      display: block;
      height: 22px;
      background: transparent;
    }
  }

}
</style>
