<template>
  <wb-env-atom-form-field
    tag="div"
    class="wb-env-atom-form-range-slider"
    v-bind="$attrs">
    <slot name="before" />
    <wb-env-atom-range-slider
      v-bind="rangeSlider"
      :model="model"
      style-type="form-field" />
    <slot name="after" />
  </wb-env-atom-form-field>
</template>

<script>
import WbEnvAtomRangeSlider from '../RangeSlider';
import WbEnvAtomFormField from '../FormField';

export default {
  components: { WbEnvAtomFormField, WbEnvAtomRangeSlider },

  props: {
    model: {
      type: [Array, Object],
      default() {
        return {};
      }
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: null
    },
    handleSize: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    directionVertical: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    currentModel: {
      get() {
        return this.name ? this.model[this.name] : this.model.value;
      },
      set(value) {
        if (this.name) {
          this.model[this.name] = value;
        } else {
          this.model.value = value;
        }
      }
    },
    rangeSlider() {
      return {
        name: this.name,
        min: this.min,
        max: this.max,
        step: this.step,
        handleSize: this.handleSize,
        readonly: this.readonly,
        disabled: this.disabled,
        directionVertical: this.directionVertical
      };
    }
  }
};
</script>
