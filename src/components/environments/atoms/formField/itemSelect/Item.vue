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

<story
  name="Item"
  group="Environments/Atoms/FormField/ItemSelect"
  knobs="{}">
  <Item />
</story>

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
.wb-env-atom-form-field-item-select-item {
  display: block;
  margin: 0;
  border: solid var(--workbenchColor_1) 2px;

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
    background: var(--workbenchColor_3);
  }

  & > input:not([disabled]):checked + .field__label {
    filter: invert(100%);
  }

  & > input[disabled] + .field__label {
    color: var(--workbenchColor_1);
    background: var(--workbenchColor_2);
  }
}
</style>
