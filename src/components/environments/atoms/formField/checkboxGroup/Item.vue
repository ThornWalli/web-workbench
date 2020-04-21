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

<story
  name="Item"
  group="Environments/Atoms/FormField/CheckboxGroup"
  knobs="{}">
  <Item />
</story>

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

.wb-env-atom-form-field-checkbox-group-item {
  position: relative;
  display: flex;
  line-height: 30px;

  & > * {
    display: inline-block;
  }

  & > input {
    display: none;
  }

  & > input[disabled] + svg {
    background: var(--workbenchColor_1);
    fill: var(--workbenchColor_1);
  }

  &:hover > input:not([disabled]) + svg {
    filter: invert(100%);
  }

  & svg {
    display: block;

    /* position: absolute;
    top: 0;
    left: 0; */
    background: var(--workbenchColor_3);
  }

  &.item--checkbox {
    & .svg__primary {
      fill: currentColor;
    }

    & .svg__secondary {
      visibility: hidden;
      fill: currentColor;
    }
  }

  &.item--radio {
    & svg {
      & .svg__primary {
        fill: var(--workbenchColor_1);
      }

      & .svg__secondary {
        visibility: hidden;
        fill: var(--workbenchColor_1);
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
        filter: invert(100%);
      }
    }
  }

  @nest html.touchevents & {
    &:active {
      & svg {
        filter: invert(100%);
      }
    }
  }
}
</style>
