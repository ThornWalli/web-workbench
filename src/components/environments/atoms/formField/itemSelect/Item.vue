<template>
  <label class="wb-env-atom-form-field-item-select-item">
    <input
      v-model="currentModel"
      v-bind="input"
      :value="value"
    >
    <span
      class="label"
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

<style lang="postcss" scoped>
.wb-env-atom-form-field-item-select-item {
  --color-border: var(--color-item-select-item-border, #fff);
  --color-background: var(--color-item-select-item-background, #05a);
  --color-disabled-label-text: var(--color-item-select-item-disabled-label-text, #fff);
  --color-disabled-label-background: var(--color-item-select-item-disabled-label-background, #000);

  display: block;
  margin: 0;
  border: solid var(--color-border) 2px;

  & > * {
    display: inline-block;
  }

  & > input {
    display: none;
  }

  & .label {
    display: block;
    padding: 4px;
    padding-bottom: 0;
    line-height: 18px;
    text-transform: uppercase;
    background: var(--color-background);
  }

  & > input:not([disabled]):checked + .label {
    filter: var(--filter-default);
  }

  & > input[disabled] + .label {
    color: var(--color-disabled-label-text);
    background: var(--color-disabled-label-background);
  }
}
</style>
