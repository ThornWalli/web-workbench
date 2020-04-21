<template>
  <label class="wb-atom-item-select-item">
    <input
      :id="id"
      v-model="checked"
      :name="name"
      :disabled="disabled"
      :type="multiple ? 'checkbox' : 'radio'"
      :value="value || 'on'"
      :form-ignore="formIgnore"
    >
    <span
      v-if="label"
      class="field__label"
      @click="onClick"
      v-html="label"
    />
  </label>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: false,
      default: null
    },
    id: {
      type: String,
      required: false,
      default: null
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: [String, Number],
      required: false,
      default: null
    },
    label: {
      type: String,
      required: false,
      default: 'Item Label'
    },
    formIgnore: {
      type: Boolean,
      required: false,
      default: false
    },
    setChecked: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function () {
    return {
      checked: false
    };
  },
  computed: {
    selected: {
      get () {
        return this.checked;
      },
      set (value) {
        this.checked = value;
      }
    }
  },
  created () {
    this.checked = this.setChecked;
  },
  methods: {
    onClick () {
      this.$emit('click', this);
    }
  }
};
</script>

<style lang="postcss">
.wb-atom-item-select-item {
  display: block;
  margin: 0;
  border: solid var(--workbenchColor_1) calc(2 / var(--global_fontSize) * 1rem);

  & > * {
    display: inline-block;
  }

  & > input {
    display: none;
  }

  & .field__label {
    display: block;
    padding: calc(4 / var(--global_fontSize) * 1em);
    padding-bottom: 0;
    line-height: calc(18 / var(--global_fontSize) * 1em);
    text-transform: uppercase;
    background: var(--workbenchColor_3);
  }

  & > input:checked + .field__label {
    filter: invert(100%);
  }

  & > input[disabled] + .field__label {
    color: var(--workbenchColor_1);
    background: var(--workbenchColor_2);
  }
}
</style>
