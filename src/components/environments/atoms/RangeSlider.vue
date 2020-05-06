<template>
  <input
    v-model="model[name]"
    class="wb-env-atom-range-slider"
    :style="style"
    :class="styleClasses"
    type="range"
    :min="min"
    :max="max"
    :step="step"
  >
</template>

<script>
import { ipoint } from '@js-basics/vector';
export default {
  props: {
    model: {
      type: [
        Array, Object
      ],
      default () {
        return {
          value: 0
        };
      }
    },
    min: {
      type: Number,
      default () {
        return 0;
      }
    },
    max: {
      type: Number,
      default () {
        return 1;
      }
    },
    step: {
      type: Number,
      default () {
        return 0.1;
      }
    },
    name: {
      type: String,
      default: 'value'
    },
    handleSize: {
      type: Number,
      default () {
        return 0.2;
      }
    },
    styleType: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      positions: {
        start: ipoint(),
        move: ipoint(),
        current: ipoint()
      }
    };
  },

  computed: {
    style () {
      const vars = {
        '--direction': this.directionVertical ? 1 : 0
      };
      vars['--size'] = this.handleSize * 100 + '%';
      return vars;
    },
    styleClasses () {
      return {
        'range-slider--direction-x': !this.directionVertical,
        'range-slider--direction-y': this.directionVertical,
        [`style-type--${this.styleType}`]: this.styleType
      };
    }
  }
};
</script>

<style lang="postcss">

:root {
  --color__rangeSlider__background: #05a;
  --color__rangeSlider__border: #fff;
  --color__rangeSlider__thumb_background: #fff;
}

.wb-env-atom-range-slider {
  --size: 0;
  --thumb-background: var(--color__rangeSlider__thumb_background);
  --thumb-width: var(--size, 20px);
  --thumb-height: var(--size, 20px);

  position: relative;
  width: 100%;
  padding: 2px;
  background: var(--color__rangeSlider__background);
  border: solid var(--color__rangeSlider__border) 2px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    position: relative;
    width: var(--helper-width, 100%);
    width: var(--thumb-width);
    height: var(--thumb-height);
    background: var(--thumb-background);
    -webkit-border-radius: 0;
    -webkit-appearance: none;

  }

  &.style-type--window {
    &.range-slider--direction-x {
      height: 18px;
    }

    &.range-slider--direction-y {
      height: 18px;
    }
  }

  &.style-type--form-field {
    &.range-slider--direction-x {
      --thumb-height: 22px;
    }

    &.range-slider--direction-y {
      --thumb-width: 18px;
    }

  }
}
</style>
