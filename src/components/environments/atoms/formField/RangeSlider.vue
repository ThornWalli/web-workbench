<template>
  <wb-env-atom-form-field tag="div" class="wb-env-atom-form-range-slider" v-bind="$attrs" :class="styleClasses">
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
    styleClasses () {
      return {
        ['textbox--type-' + this.type]: true
      };
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
        autocomplete: this.autocomplete ? 'on' : 'off'
      };
    }
  }
};
</script>

<style lang="postcss">

:root {
  --color__textbox__text: #fff;
  --color__textbox__background: #05a;
  --color__textbox__border: #05a;
  --color__textbox__outline: #fff;
  --color__textbox__dialog__text: #05a;
  --color__textbox__dialog__background: #fff;
  --color__textbox__dialog__border: #fff;
  --color__textbox__dialog__outline: #05a;
  --color__textbox__disabledReadonlyText: #05a;
  --color__textbox__disabledReadonlyBackground: #fff;
}

.wb-env-atom-form-range-slider {
  /* empty */
}
</style>
