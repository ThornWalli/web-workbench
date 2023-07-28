<template>
  <div
    class="wb-env-atom-range-slider"
    :style="style"
    :class="styleClasses"
  >
    <input
      v-model="model[name]"
      type="range"
      :min="min"
      :max="max"
      :step="step"
    >
    <i />
  </div>
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
    },
    directionVertical: {
      type: Boolean,
      default: false
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
        '--value': this.model[this.name] / this.max,
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
</style>

<style lang="postcss" scoped>
.wb-env-atom-range-slider {
  --size: 0;
  --thumb-background: var(--color__rangeSlider__thumb_background);
  --thumb-width: var(--size, 20px);
  --thumb-height: var(--size, 20px);

  position: relative;
  width: 100%;
  padding: 2px;
  appearance: none;
  background: var(--color__rangeSlider__background);
  border: solid var(--color__rangeSlider__border) 2px;
  outline: none;

  & input {
    position: relative;
    opacity: 0;
  }

  & i {
    position: absolute;
    width: var(--helper-width, 100%);
    width: var(--thumb-width);
    height: var(--thumb-height);
    pointer-events: none;
    background: var(--thumb-background);
  }

  &::-webkit-slider-thumb {
    position: relative;
    width: var(--helper-width, 100%);
    width: var(--thumb-width);
    height: var(--thumb-height);
    appearance: none;
    background: var(--thumb-background);
    border-radius: 0;

  }

  &.range-slider--direction-x {
    & i {
      top: 0;
      left: calc(var(--value) * (100% - var(--thumb-width)));
    }

    & input {
      top: 50%;
      width: 100%;
      appearance: slider-horizontal;
      transform: translateY(-50%);
    }
  }

  &.range-slider--direction-y {
    & i {
      top: calc((1 - var(--value)) * (100% - var(--thumb-height)));
      left: 0;
    }

    & input {
      left: 50%;
      height: 100%;
      appearance: slider-vertical;
      transform: translateX(-50%);
    }
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

  &.style-type--document-reader {
    &.range-slider--direction-x {
      --thumb-height: 22px;
    }

    &.range-slider--direction-y {
      --thumb-width: 13px;

      /* width: 200px;
      height: 13px;
      border: none;
      transform: rotate(-90deg)  translateX(50%);
      transform-origin: 100px 100px; */

      height: 100%;
      border: none;

    }
  }
}
</style>
