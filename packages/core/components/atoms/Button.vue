<template>
  <label v-if="upload" class="wb-env-atom-button" :class="styleClasses">
    <span class="label">{{ label }}</span>
    <input
      :id="id"
      :name="name"
      type="file"
      :accept="accept"
      :disabled="disabled"
      @input="onInput" />
  </label>
  <button
    v-else
    :type="type"
    class="wb-env-atom-button"
    :class="styleClasses"
    :disabled="disabled"
    @click="onClick">
    <span class="label">{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const $props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },

  accept: {
    type: String,
    default: 'application/json'
  },

  type: {
    type: String,
    default() {
      return 'button'; // submit, upload
    }
  },

  styleType: {
    type: String,
    default() {
      return 'primary'; // primary, secondary, dialog
    }
  },

  id: {
    type: String,
    required: false,
    default: null
  },
  name: {
    type: String,
    required: false,
    default: null
  },
  label: {
    type: String,
    required: false,
    default: 'Primary Button'
  }
});

const $emit = defineEmits(['upload', 'click', 'update:modelValue']);

const upload = computed(() => $props.type === 'upload');
const styleClasses = computed(() => {
  return {
    disabled: $props.disabled,
    upload: upload.value,
    ['type-' + $props.styleType]: $props.styleType
  };
});

const onInput = e => {
  $emit('upload', e.target.files);
  $emit('update:modelValue', e.target.files);
};
const onClick = () => {
  $emit('click');
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-button {
  /* Primary Style */
  --color-primary-label: var(--color-button-primary-label, #05a);
  --color-primary-background: var(--color-button-primary-background, #fff);
  --color-primary-border: var(--color-button-primary-border, #fff);
  --color-primary-outline: var(--color-button-primary-outline, #05a);

  /* Secondary Style */
  --color-secondary-label: var(--color-button-secondary-label, #fff);
  --color-secondary-background: var(--color-button-secondary-background, #05a);
  --color-secondary-border: var(--color-button-secondary-border, #fff);

  /* Dialog Style */
  --color-dialog-label: var(--color-button-dialog-label, #05a);
  --color-dialog-background: var(--color-button-dialog-background, #fff);
  --color-dialog-border: var(--color-button-dialog-border, #fa5);
  --color-dialog-outline: var(--color-button-dialog-outline, #05a);

  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 0;
  text-align: center;
  appearance: none;
  user-select: none;
  outline: none;
  background: transparent;
  border: none;
  border-radius: 0;

  & .label {
    display: block;
    padding: 8px;
    padding-bottom: 4px;
    font-family: var(--font-workbench-topaz);
    font-size: var(--global-font-size-px);

    .wb-atom-button-wrapper & {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &.type-primary {
    & .label {
      color: var(--color-primary-label);
      outline: solid var(--color-primary-outline) 2px;
      outline-width: 2px;
      outline-offset: -4px;
      background: var(--color-primary-background);
      border: solid var(--color-primary-border) 2px;
    }
  }

  &.type-secondary {
    & .label {
      color: var(--color-secondary-label);
      background: var(--color-secondary-background);
      border: none;
      border: solid var(--color-secondary-border) 2px;
    }
  }

  &.type-dialog {
    & .label {
      padding: 6px;
      padding-top: 6px;
      padding-bottom: 4px;
      color: var(--color-dialog-label);
      outline: solid var(--color-dialog-outline) 2px;
      outline-offset: -6px;
      background: var(--color-dialog-background);
      border: solid var(--color-dialog-border) 2px;
    }
  }

  &.type-primary,
  &.type-secondary,
  &.type-dialog {
    &:active {
      filter: var(--filter-default);
    }

    &.disabled {
      filter: var(--filter-default);
    }
  }

  &.upload {
    position: relative;
    display: block;
    padding: 0;
    overflow: hidden;

    & input {
      position: absolute;
      top: 0%;
      left: 0%;
      visibility: hidden;
    }
  }
}
</style>
