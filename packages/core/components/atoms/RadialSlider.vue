<template>
  <div
    class="wb-atom-radial-slider"
    :class="styleClasses"
    touch-action="none"
    :style="style"
  >
    <div class="handle-wrapper">
      <div
        class="handle"
        @pointerdown="onPointerDown"
      />
      <div class="indicator" />
    </div>
  </div>
</template>

<script>
import { Subscription } from 'rxjs';
import domEvents from '../../services/domEvents';
import { getNormalizedPointer } from '../../utils/pointer';
import {
  clamp,
  getRadOfVector,
  getRadOfElement,
  addRadToVector
} from '../../utils/math';
import { reverse, linear } from '../../utils/math/easing';

export default {

  props: {
    styleType: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: 'value'
    },
    model: {
      type: Object,
      default () {
        return {
          value: 0
        };
      }
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
      default (value) {
        return linear(value);
      }
    },
    circumference: {
      type: Number,
      default () {
        return Math.PI * 2;
      }
    }
  },

  data () {
    return {
      active: false,
      subscription: new Subscription(),
      reverse: reverse(this.easing),

      offsetRad: 0,
      startRad: 0,
      currentRad: 0
    };
  },

  computed: {
    styleClasses () {
      return {
        'transition-active': this.active,
        [`type-${this.styleType}`]: this.styleType
      };
    },
    style () {
      return {
        '--rad': this.progress * 2 * Math.PI * this.range
      };
    },
    range () {
      return this.circumference / (Math.PI * 2);
    },
    circumferenceCenter () {
      return this.circumference / 2;
    },
    progress () {
      return this.reverse(this.value / this.max);
    },
    value: {
      get () {
        return this.model[this.name];
      },
      set (value) {
        this.model[this.name] = value;
      }
    }
  },

  unmounted () {
    this.resetSubscriptions();
  },

  methods: {

    resetSubscriptions () {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();
      this.active = false;
    },

    onPointerDown (e) {
      this.subscription.add(
        domEvents.getPointerMove().subscribe(this.onPointerMove.bind(this)),
        domEvents.getPointerUp().subscribe(this.onPointerUp.bind(this))
      );
      this.active = true;
      this.startNormRad = this.getNormRadFromPosition(e);
      this.startNormValue = this.value / this.max;
    },

    getNormRadFromPosition (e) {
      const offsetRad = getRadOfElement(this.$el);
      const normVector = getNormalizedPointer(e, this.$el.getBoundingClientRect());
      // mirror vector with calculated css rotation offset
      // to prevent 0 to Math.PI jump at the beginning of the available range
      // to set the zero point to the center of the available range
      // to get a resulting radian range of -Math.PI to + Math.PI
      const vector = addRadToVector(normVector, -offsetRad - Math.PI - this.circumferenceCenter);
      // mirror back the resulting radian of the mirrored vector
      const rad = getRadOfVector(vector) - Math.PI;
      // normalize & clamp rad to the range of -1 to +1
      const normRad = clamp(rad / this.circumferenceCenter, -1, 1);
      // normalize rad to the range of 0 to 1
      return (normRad + 1) / 2;
    },

    onPointerMove (e) {
      let normValue = this.getNormRadFromPosition(e);
      const test = normValue - this.startNormRad;
      normValue = Math.min(Math.max(this.startNormValue + test, 0), 1);
      // move the back jump when overwinding the handle
      if (Math.abs(this.progress - normValue) < 0.5) {
        this.value = this.easing(normValue) * this.max;
      } else {
        this.value = Math.round(this.progress) * this.max;
      }
    },

    onPointerUp () {
      this.resetSubscriptions();
    }

  }
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
    content: "";
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
      content: "";
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
