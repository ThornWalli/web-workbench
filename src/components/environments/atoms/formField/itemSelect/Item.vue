<template>
  <label class="wb-env-atom-form-field-item-select-item">
    <input
      v-model="currentModel"
      v-bind="input"
      :value="value"
    >
    <span
      class="field__label"
      v-html="label || '&nbsp;'"
    />
  </label>
</template>

<script>
export default {
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
    multiple: {
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
    input () {
      return {
        name: this.name,
        readonly: this.readonly,
        disabled: this.disabled,
        type: this.multiple ? 'checkbox' : 'radio'
      };
    }
  }
};
</script>

<style lang="postcss">
:root {
  --color__itemSelectItem__border: #fff;
  --color__itemSelectItem__background: #05a;
  --color__itemSelectItem__disabledLabelText: #fff;
  --color__itemSelectItem__disabledLabelbackground: #000;
}

.wb-env-atom-form-field-item-select-item {
  display: block;
  margin: 0;
  border: solid var(--color__itemSelectItem__border) 2px;

  & > * {
    display: inline-block;
  }

  & > input {
    display: none;
  }

  & .field__label {
    display: block;
    padding: 4px;
    padding-bottom: 0;
    line-height: 18px;
    text-transform: uppercase;
    background: var(--color__itemSelectItem__background);
  }

  & > input:not([disabled]):checked + .field__label {
    filter: var(--filter__default);
  }

  & > input[disabled] + .field__label {
    color: var(--color__itemSelectItem__disabledLabelText);
    background: var(--color__itemSelectItem__disabledLabelbackground);
  }
}
</style>
