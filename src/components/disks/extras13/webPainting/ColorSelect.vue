<template>
  <wb-form class="wb-disks-extras13-web-painting-color-select">
    <span ref="colorPaletteSecondary" :style="stylePrimaryColor" class="color-select__secondary" @contextmenu="onContextMenuSecondary">
      <span ref="colorPalettePrimary" :style="styleSecondaryColor" class="color-select__primary" />
    </span>
    <ul data-hook="colorPaletteItems">
      <li v-for="(item, index) in colors" :key="index">
        <label><input v-model="model.index" type="radio" name="index" :value="index"><span :style="{'background-color': item.toRGB()}" /></label>
      </li>
    </ul>
  </wb-form>
</template>

<script>
import domEvents from '../../../../web-workbench/services/domEvents';

import Color from '../../../../web-workbench/disks/extras13/webPainting/lib/Color';
import WbForm from '@/components/environments/molecules/Form';

export default {
  components: {
    WbForm
  },

  props: {
    model: {
      type: Object,
      default () {
        return {
          index: 0,
          primaryColor: new Color(0, 0, 0),
          secondaryColor: new Color(255, 255, 255),
          colorSteps: new Color(1, 1, 1)
        };
      }
    }
  },
  data () {
    return {
      subscribtions: [],
      colors: [
        new Color(0, 0, 0), new Color(255, 255, 255)
      ],
      primarySelect: true
    };
  },

  computed: {
    currentIndex () {
      return this.model.index;
    },
    colorSteps () {
      return this.model.colorSteps;
    },
    stylePrimaryColor () {
      return { 'background-color': `${this.model.primaryColor.toRGB()}` };
    },
    styleSecondaryColor () {
      return { 'background-color': `${this.model.secondaryColor.toRGB()}` };
    }
  },

  watch: {

    colorSteps () {
      this.refreshColors();
    },

    currentIndex (index) {
      const color = this.colors[Number(index)];
      if (this.primarySelect) {
        this.model.primaryColor = color;
      } else {
        this.model.secondaryColor = color;
      }
    }
  },

  destroyed () {
    this.subscribtions.forEach(subscription => subscription.unsubscribe());
  },

  mounted () {
    this.refreshColors();
    this.subscribtions.push(domEvents.keypress.subscribe((e) => {
      console.log(e.keyCode);
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
      const colorSteps = this.colorSteps;
      const colors = [];
      for (let r = colorSteps.r; r >= 0; r--) {
        for (let g = colorSteps.g; g >= 0; g--) {
          for (let b = colorSteps.b; b >= 0; b--) {
            colors.push(new Color(
              Math.floor((255 / colorSteps.r) * r),
              Math.floor((255 / colorSteps.g) * g),
              Math.floor((255 / colorSteps.b) * b)
            ));
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

<style lang="postcss">
.wb-disks-extras13-web-painting-color-select {
  position: relative;
  background: #000;
  border-left: solid var(--workbenchColor_1) 2px;

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
          border: solid var(--workbenchColor_1) 2px;
          mix-blend-mode: difference;
        }
      }
    }
  }

  & .color-select__secondary {
    display: block;
    height: 22px;
    background: transparent;
  }

  & .color-select__primary {
    position: relative;
    top: 50%;
    left: 50%;
    display: block;
    width: 50%;
    height: 50%;
    background: transparent;
    transform: translate(-50%, -50%);
  }
}
</style>
