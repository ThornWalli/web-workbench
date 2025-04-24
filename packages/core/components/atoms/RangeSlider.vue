<template>
  <div class="wb-env-atom-range-slider" :style="style" :class="styleClasses">
    <input
      :orient="directionVertical ? 'vertical' : 'horizontal'"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="onInput" />
    <i />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const $props = defineProps({
  modelValue: {
    type: Number,
    default: undefined
  },
  min: {
    type: Number,
    default() {
      return 0;
    }
  },
  max: {
    type: Number,
    default() {
      return 1;
    }
  },
  step: {
    type: Number,
    default() {
      return 0.1;
    }
  },
  name: {
    type: String,
    default: 'value'
  },
  handleSize: {
    type: Number,
    default() {
      return 0.2;
    }
  },
  styleType: {
    type: String,
    default: 'window'
  },
  directionVertical: {
    type: Boolean,
    default: false
  }
});

const $emit = defineEmits(['update:modelValue']);

const style = computed(() => {
  const vars = {
    '--value': ($props.modelValue || 0) / $props.max,
    '--direction': $props.directionVertical ? 1 : 0,
    '--size': $props.handleSize * 100 + '%'
  };
  return vars;
});

const styleClasses = computed(() => {
  return {
    'direction-x': !$props.directionVertical,
    'direction-y': $props.directionVertical,
    [`type-${$props.styleType}`]: $props.styleType
  };
});

const onInput = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    $emit('update:modelValue', Number(e.target.value));
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-range-slider {
  --color-background: var(--color-range-slider-background, #05a);
  --color-border: var(--color-range-slider-border, #fff);
  --color-thumb-background: var(--color-range-slider-thumb-background, #fff);
  --thumb-background: var(--color-thumb-background);
  --thumb-width: var(--size, 20px);
  --thumb-height: var(--size, 20px);

  position: relative;
  width: 100%;
  padding: 2px;
  appearance: none;
  outline: none;
  background: var(--color-background);
  border: solid var(--color-border) 2px;

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

  &.direction-x {
    & i {
      top: 0;
      left: calc(var(--value) * (100% - var(--thumb-width)));
    }

    & input {
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
    }
  }

  &.direction-y {
    & i {
      top: calc((1 - var(--value)) * (100% - var(--thumb-height)));
      left: 0;
    }

    & input {
      left: 50%;
      height: 100%;
      transform: translateX(-50%);
    }
  }

  & input[orient='vertical'] {
    writing-mode: vertical-lr;
    direction: rtl;
  }

  &.type-window {
    &.direction-x {
      height: 18px;
    }

    &.direction-y {
      height: 18px;
    }
  }

  &.type-form-field {
    &.direction-x {
      --thumb-height: 22px;
    }

    &.direction-y {
      --thumb-width: 18px;
    }
  }

  &.type-document-reader {
    &.direction-x {
      --thumb-height: 22px;
    }

    &.direction-y {
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
