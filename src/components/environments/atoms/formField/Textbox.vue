<template>
  <wb-env-atom-form-field tag="div" class="wb-env-atom-form-textbox" v-bind="$attrs" :class="styleClasses">
    <input
      ref="input"
      v-model="currentModel"
      v-bind="input"
    >
  </wb-env-atom-form-field>
</template>

<script>

import WbEnvAtomFormField from '@/components/environments/atoms/FormField';

export default {

  components: { WbEnvAtomFormField },

  props: {
    model: {
      type: [
        Array, Object
      ],
      default () {
        return {};
      }
    },
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Placeholder'
    },
    pattern: {
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
    disabled: {
      type: Boolean,
      default: false
    },
    autocomplete: {
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
    input () {
      return {
        name: this.name,
        type: this.type,
        placeholder: this.placeholder,
        pattern: this.pattern,
        min: this.min,
        max: this.max,
        readonly: this.readonly,
        disabled: this.disabled,
        autocomplete: this.autocomplete ? 'on' : 'off'
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-textbox {
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

  & input {
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    padding: 6px;
    padding-bottom: 4px;
    margin: 0 -2px;
    color: var(--color__text);
    vertical-align: middle;
    appearance: none;
    background: var(--color__background);
    border: solid var(--color__border) 2px;
    outline: solid var(--color__outline) 2px;
    outline-offset: -4px;

    .wb-env-molecule-dialog-content & {
      box-sizing: border-box;
      display: block;
      width: 100%;
      color: var(--color__dialog__text);
      background: var(--color__dialog__background);
      border: solid var(--color__dialog__border) 2px;
      outline: solid var(--color__dialog__outline) 2px;
    }

    &::placeholder {
      color: currentColor;
    }

    &:disabled,
    &[readonly] {
      color: var(--color__disabledReadonlyText);
      background: var(--color__disabledReadonlyBackground);
    }

    &:not([readonly]) {
      &:focus {
        filter: var(--filter__default);
      }

      html.no-touchevents & {
        &:hover {
          filter: var(--filter__default);
        }
      }

      html.touchevents & {
        &:active {
          filter: var(--filter__default);
        }
      }
    }
  }

  &.form-field--label-top {
    & input {
      width: calc(100% + 4px);
    }
  }

  &.textbox--type-color {
    /* outline: none; */

    & input {
      flex: 0 0 32px;
      height: 32px;
      padding: 2px;
      margin: 0 -2px;
      line-height: 1;
      border: none;

      &::-webkit-color-swatch-wrapper {
        padding: 0;

        &::-webkit-color-swatch {
          border: none;
        }
      }
    }
  }
}
</style>
