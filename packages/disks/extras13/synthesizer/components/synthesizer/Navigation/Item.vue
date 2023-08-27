<template>
  <div v-if="text" :class="styleClasses">
    <span>{{ text }}</span>
  </div>
  <label
    v-else-if="name"
    :class="styleClasses"
    :disabled="disabled ? true : undefined">
    <input
      v-model="model[name]"
      :disabled="disabled ? true : undefined"
      :value="value"
      :type="value === undefined ? 'checkbox' : 'radio'" />
    <span> {{ title }}</span>
  </label>
  <button v-else :class="styleClasses" :disabled="disabled">
    <span>{{ title }}</span>
  </button>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: undefined
    },
    model: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    styleClasses() {
      return {
        selected: this.selected
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
button {
  padding: 0;
  appearance: none;
  background: none;
  border: none;
}

div {
  user-select: none;

  & span {
    display: block;
    font-family: var(--font-bit-font);
    font-size: 10px;
    line-height: 1;
    color: var(--workbench-color-3);
    letter-spacing: 0.3px;
    background: var(--workbench-color-1);
  }
}

button,
label {
  display: block;
  width: 100%;
  user-select: none;

  & input {
    display: none;
  }

  & span {
    display: block;
    padding: 2px;
    font-family: var(--font-bit-font);
    font-size: 10px;
    line-height: 1;

    /* line-height: 8px; */
    color: var(--workbench-color-3);
    letter-spacing: 0.3px;
    background: var(--workbench-color-1);
    border: solid currentColor;
    border-width: 0 2px 2px 0;
  }

  &[disabled] span {
    color: var(--workbench-color-4);
    background: var(--workbench-color-3);
  }

  &:not([disabled]) {
    &.selected span,
    &:active span,
    & input:checked + span {
      color: var(--workbench-color-1);
      background: var(--workbench-color-3);
      border-color: var(--workbench-color-3);
    }
  }
}
</style>
