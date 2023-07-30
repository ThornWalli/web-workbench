<template>
  <wb-env-atom-form-field tag="div" class="wb-env-atom-form-range-slider" v-bind="$attrs">
    <slot name="before" />
    <wb-env-atom-range-slider v-bind="rangeSlider" :model="model" style-type="form-field" />
    <slot name="after" />
  </wb-env-atom-form-field>
</template>

<script>

import WbEnvAtomRangeSlider from '@/components/environments/atoms/RangeSlider';
import WbEnvAtomFormField from '@/components/environments/atoms/FormField';

export default {

  components: { WbEnvAtomFormField, WbEnvAtomRangeSlider },

  props: {
    model: {
      type: [
        Array, Object
      ],
      default () {
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
      get () {
        return this.name ? this.model[this.name] : this.model.value;
      },
      set (value) {
        if (this.name) {
          this.model[this.name] = value;
        } else {
          this.model.value = value;
        }
      }
    },
    rangeSlider () {
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

<style lang="postcss" scoped>
.wb-env-atom-form-range-slider {
  --color__text: var(--color__textbox__text, #fff);
  --color__background: var(--color__textbox__background, #05a);
  --color__border: var(--color__textbox__border, #05a);
  --color__outline: var(--color__textbox__outline, #fff);
  --color__dialog__text: var(--color__textbox__dialog__text, #05a);
  --color__dialog__background: var(--color__textbox__dialog__background, #fff);
  --color__dialog__border: var(--color__textbox__dialog__border, #fff);
  --color__dialog__outline: var(--color__textbox__dialog__outline, #05a);
  --color__disabledReadonlyText: var(--color__textbox__disabledReadonlyText, #05a);
  --color__disabledReadonlyBackground: var(--color__textbox__disabledReadonlyBackground, #fff);
}
</style>
