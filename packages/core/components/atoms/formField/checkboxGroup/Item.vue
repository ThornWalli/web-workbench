<template>
  <label
    class="wb-env-atom-form-field-checkbox-group-item"
    :class="styleClasses">
    <input v-model="currentModel" v-bind="input" :value="value" />
    <svg-control-input-checkbox v-if="!radio" />
    <svg-control-input-radio v-if="radio" />
    <span v-if="label" class="label">{{ label }}</span>
  </label>
</template>

<script>
import SvgControlInputCheckbox from '../../../../assets/svg/control/input_checkbox.svg?component';
import SvgControlInputRadio from '../../../../assets/svg/control/input_radio.svg?component';

export default {
  components: { SvgControlInputCheckbox, SvgControlInputRadio },

  props: {
    label: {
      type: String,
      default: 'Item Label'
    },
    model: {
      type: Object,
      default() {
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
      type: [String, Number],
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
    styleClasses() {
      return {
        radio: this.radio,
        checkbox: !this.radio
      };
    },
    input() {
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

<style lang="postcss" scoped>
.wb-env-atom-form-field-checkbox-group-item {
  --color-disabled-icon: var(--color-checkbox-group-item-disabled-icon, #fff);
  --color-background: var(--color-checkbox-group-item-background, #05a);
  --color-disabled-background: var(
    --color-checkbox-group-item-disabled-background,
    #fff
  );
  --color-checkbox-icon: var(--color-checkbox-group-item-checkbox-icon, #fff);
  --color-radio-icon: var(--color-checkbox-group-item-radio-icon, #fff);

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
    background: var(--color-disabled-background);
    fill: var(--color-disabled-icon);
  }

  &:hover > input:not([disabled]) + svg {
    filter: var(--filter-default);
  }

  & svg {
    display: block;
    flex: 0 0 16px;
    background: var(--color-background);
  }

  &.checkbox {
    & :deep(.svg-primary) {
      fill: var(--color-checkbox-icon);
    }

    & :deep(.svg-secondary) {
      visibility: hidden;
      fill: var(--color-checkbox-icon);
    }
  }

  &.radio {
    & svg {
      & :deep(.svg-primary) {
        fill: var(--color-radio-icon);
      }

      & :deep(.svg-secondary) {
        visibility: hidden;
        fill: var(--color-radio-icon);
      }
    }
  }

  & > input:checked + svg {
    & :deep(.svg-secondary) {
      visibility: visible;
    }
  }

  & .label {
    padding-left: 22px;
    line-height: 1;
    line-height: 18px;
  }

  html.no-touchevents & {
    &:hover {
      & svg {
        filter: var(--filter-default);
      }
    }
  }

  html.touchevents & {
    &:active {
      & svg {
        filter: var(--filter-default);
      }
    }
  }
}
</style>
