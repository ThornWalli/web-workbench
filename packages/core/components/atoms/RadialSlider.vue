<template>
  <div
    ref="rootEl"
    class="wb-atom-radial-slider"
    :class="styleClasses"
    touch-action="none"
    :style="style">
    <div class="handle-wrapper">
      <div class="handle" @pointerdown="onPointerDown" />
      <div class="indicator" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';
import { ref, computed, onUnmounted } from 'vue';
import domEvents from '../../services/domEvents';
import {
  clamp,
  getRadOfVector,
  getRadOfElement,
  addRadToVector
} from '../../utils/math';
import { reverse, linear } from '../../utils/math/easing';
import {
  getNormalizedPointerByRect,
  type NormalizedPointerEvent
} from '@web-workbench/core/services/dom';

const $props = defineProps({
  styleType: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: 'value'
  },
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  easing: {
    type: Function,
    default(value: number) {
      return linear(value);
    }
  },
  circumference: {
    type: Number,
    default() {
      return Math.PI * 2;
    }
  }
});

const $emit = defineEmits(['update:model-value']);

const rootEl = ref<HTMLElement | null>(null);
const active = ref(false);
let subscription = new Subscription();
const easing = ref(reverse($props.easing));

const startRad = ref(0);
const startNormValue = ref(0);

const styleClasses = computed(() => {
  return {
    'transition-active': active.value,
    [`type-${$props.styleType}`]: $props.styleType
  };
});
const style = computed(() => {
  return {
    '--rad': progress.value * 2 * Math.PI * range.value
  };
});
const range = computed(() => {
  return circumferenceCenter.value / (Math.PI * 2);
});
const circumferenceCenter = computed(() => {
  return $props.circumference / 2;
});
const progress = computed(() => {
  return easing.value($props.modelValue / $props.max);
});

onUnmounted(() => {
  resetSubscriptions();
});
const resetSubscriptions = () => {
  subscription.unsubscribe();
  subscription = new Subscription();
  active.value = false;
};
const onPointerDown = (e: NormalizedPointerEvent) => {
  subscription.add(domEvents.pointerMove.subscribe(onPointerMove.bind(this)));
  subscription.add(domEvents.pointerUp.subscribe(onPointerUp.bind(this)));
  active.value = true;
  startRad.value = getNormRadFromPosition(e);
  startNormValue.value = $props.modelValue / $props.max;
};
const getNormRadFromPosition = (e: NormalizedPointerEvent) => {
  if (rootEl.value) {
    const offsetRad = getRadOfElement(rootEl.value);
    const normVector = getNormalizedPointerByRect(
      e,
      rootEl.value.getBoundingClientRect()
    );
    // mirror vector with calculated css rotation offset
    // to prevent 0 to Math.PI jump at the beginning of the available range
    // to set the zero point to the center of the available range
    // to get a resulting radian range of -Math.PI to + Math.PI
    const vector = addRadToVector(
      normVector,
      -offsetRad - Math.PI - circumferenceCenter.value
    );
    // mirror back the resulting radian of the mirrored vector
    const rad = getRadOfVector(vector) - Math.PI;
    // normalize & clamp rad to the range of -1 to +1
    const normRad = clamp(rad / circumferenceCenter.value, -1, 1);
    // normalize rad to the range of 0 to 1
    return (normRad + 1) / 2;
  }
  return 0;
};
const onPointerMove = (e: NormalizedPointerEvent) => {
  let normValue = getNormRadFromPosition(e);
  const test = normValue - startRad.value;
  normValue = Math.min(Math.max(startNormValue.value + test, 0), 1);
  // move the back jump when overwinding the handle
  let value;
  if (Math.abs(progress.value - normValue) < 0.5) {
    value = $props.easing(normValue) * $props.max;
  } else {
    value = Math.round(progress.value) * $props.max;
  }
  $emit('update:model-value', value);
};
const onPointerUp = () => {
  resetSubscriptions();
};
</script>

<style lang="postcss" scoped>
.wb-atom-radial-slider {
  --rad: 0;
  --rotation: -90deg;
  --stroke-width: 0%;
  --handle-size: 20%;
  --translate: calc(var(--handle-size) / 2 - var(--stroke-width) / 2);
  --size: calc(100% - var(--handle-size) + var(--stroke-width));

  display: inline-block;
  width: 100%;
  transform: rotate(var(--rotation));

  &::before {
    display: block;
    padding-top: 100%;
    content: '';
  }

  & .handle-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
  }

  & .handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  & .indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: white;
    border-radius: 50%;
    transform: rotate(calc(var(--rad) * 1rad));

    &::before {
      position: absolute;
      top: 50%;
      left: 0%;
      width: 50%;
      height: 2px;
      content: '';
      background: red;
    }
  }

  & .transition-active .handle {
    transition-duration: 350ms;
    transition-property: transform;
  }

  &.type-screen-panel-control-knob {
    & .handle {
      opacity: 0;
    }

    & .indicator {
      display: none;
    }
  }
}
</style>
