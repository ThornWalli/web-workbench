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
        ['type-' + this.type]: true
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
  --color-text: var(--color-textbox-text, #fff);
  --color-background: var(--color-textbox-background, #05a);
  --color-border: var(--color-textbox-border, #05a);
  --color-outline: var(--color-textbox-outline, #fff);
  --color-dialog-text: var(--color-textbox-dialog-text, #05a);
  --color-dialog-background: var(--color-textbox-dialog-background, #fff);
  --color-dialog-border: var(--color-textbox-dialog-border, #fff);
  --color-dialog-outline: var(--color-textbox-dialog-outline, #05a);
  --color-disabled-readonly-text: var(--color-textbox-disabled-readonly-text, #05a);
  --color-disabled-readonly-background: var(--color-textbox-disabled-readonly-background, #fff);

  & input {
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    padding: 6px;
    padding-bottom: 4px;
    margin: 0 -2px;
    color: var(--color-text);
    vertical-align: middle;
    appearance: none;
    background: var(--color-background);
    border: solid var(--color-border) 2px;
    outline: solid var(--color-outline) 2px;
    outline-offset: -4px;

    .wb-env-molecule-dialog-content & {
      box-sizing: border-box;
      display: block;
      width: 100%;
      color: var(--color-dialog-text);
      background: var(--color-dialog-background);
      border: solid var(--color-dialog-border) 2px;
      outline: solid var(--color-dialog-outline) 2px;
    }

    &::placeholder {
      color: currentColor;
    }

    &:disabled,
    &[readonly] {
      color: var(--color-disabled-readonly-text);
      background: var(--color-disabled-readonly-background);
    }

    &:not([readonly]) {
      &:focus {
        filter: var(--filter-default);
      }

      html.no-touchevents & {
        &:hover {
          filter: var(--filter-default);
        }
      }

      html.touchevents & {
        &:active {
          filter: var(--filter-default);
        }
      }
    }
  }

  &.label-top {
    & input {
      width: calc(100% + 4px);
    }
  }

  &.type-color {
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
