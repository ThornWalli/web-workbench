<template>
  <label class="wb-env-atom-form-field-checkbox-group-item" :class="styleClasses">
    <input
      v-model="currentModel"
      v-bind="input"
      :value="value"
    >
    <svg-control-input-checkbox v-if="!radio" />
    <svg-control-input-radio v-if="radio" />
    <span
      v-if="label"
      class="field__label"
    >{{ label }}</span>
  </label>
</template>

<script>
import SvgControlInputCheckbox from '@/assets/svg/control/input_checkbox.svg?vue-template';
import SvgControlInputRadio from '@/assets/svg/control/input_radio.svg?vue-template';

export default {
  components: { SvgControlInputCheckbox, SvgControlInputRadio },

  props: {
    label: {
      type: String,
      default: 'Item Label'
    },
    model: {
      type: Object,
      default () {
        return {
          value: null
        };
      }
    },
    name: {
      type: String,
      default: null
    },
    value: {
      type: [
        String, Number
      ],
      default: null
    },
    radio: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
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
        'item--radio': this.radio,
        'item--checkbox': !this.radio
      };
    },
    input () {
      return {
        name: this.name,
        readonly: this.readonly,
        disabled: this.disabled,
        type: this.radio ? 'radio' : 'checkbox'
      };
    }
  }
};
</script>

<style lang="postcss">

:root {
  --color__checkboxGroupItem__disabled__icon: #fff;
  --color__checkboxGroupItem__background: #05a;
  --color__checkboxGroupItem__disabled__background: #fff;
  --color__checkboxGroupItem__checkbox__icon: #fff;
  --color__checkboxGroupItem__radio__icon: #fff;
}

.wb-env-atom-form-field-checkbox-group-item {
  position: relative;
  display: flex;
  line-height: 30px;

  & > * {
    flex: 1;
  }

  & > input {
    display: none;
  }

  & > input[disabled] + svg {
    background: var(--color__checkboxGroupItem__disabled__background);
    fill: var(--color__checkboxGroupItem__disabled__icon);
  }

  &:hover > input:not([disabled]) + svg {
    filter: var(--filter__default);
  }

  & svg {
    display: block;
    flex: 0 0 16px;
    background: var(--color__checkboxGroupItem__background);
  }

  &.item--checkbox {
    & .svg__primary {
      fill: var(--color__checkboxGroupItem__checkbox__icon);
    }

    & .svg__secondary {
      visibility: hidden;
      fill: var(--color__checkboxGroupItem__checkbox__icon);
    }
  }

  &.item--radio {
    & svg {
      & .svg__primary {
        fill: var(--color__checkboxGroupItem__radio__icon);
      }

      & .svg__secondary {
        visibility: hidden;
        fill: var(--color__checkboxGroupItem__radio__icon);
      }
    }
  }

  & > input:checked + svg {
    & .svg__secondary {
      visibility: visible;
    }
  }

  & .field__label {
    padding-left: 22px;
    line-height: 1;
    line-height: 18px;
  }

  @nest html.no-touchevents & {
    &:hover {
      & svg {
        filter: var(--filter__default);
      }
    }
  }

  @nest html.touchevents & {
    &:active {
      & svg {
        filter: var(--filter__default);
      }
    }
  }
}
</style>
