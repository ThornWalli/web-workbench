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
    :type="buttonType"
    class="wb-env-atom-button"
    :class="styleClasses"
    :disabled="disabled"
    @click="onClick">
    <span class="label">{{ label }}</span>
  </button>
</template>

<script lang="ts" setup>
import { computed, type ButtonHTMLAttributes } from 'vue';

enum STYLE_TYPE {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DIALOG = 'dialog'
}

const defaultAccept = 'application/json';
const defaultStyleType = STYLE_TYPE.PRIMARY;
const defaultType: ButtonHTMLAttributes['type'] = 'button';
const defaultLabel = 'Button';

const $props = defineProps<{
  disabled?: boolean;
  accept?: string;
  type?: 'upload' | ButtonHTMLAttributes['type'];
  styleType?: STYLE_TYPE | `${STYLE_TYPE}`;
  id?: string;
  name?: string;
  label?: string;
}>();

const accept = computed(() => $props.accept || defaultAccept);
const label = computed(() => $props.label || defaultLabel);

const $emit = defineEmits<{
  (e: 'update:model-value' | 'upload', files: FileList | null): void;
  (e: 'click'): void;
}>();

const type = computed(() => $props.type || defaultType);
const styleType = computed(() => $props.styleType || defaultStyleType);

const buttonType = computed(() => {
  return type.value === 'upload' ? 'button' : type.value;
});
const upload = computed(() => type.value === 'upload');
const styleClasses = computed(() => {
  return {
    disabled: $props.disabled,
    upload: upload.value,
    ['type-' + styleType.value]: styleType.value
  };
});

const onInput = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    $emit('upload', e.target.files);
    $emit('update:model-value', e.target.files);
  }
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

  .style-filled & {
    --color-primary-label: var(
      --color-button-filled-primary-label,
      var(--color-button-primary-label, #05a)
    );
    --color-primary-background: var(
      --color-button-filled-primary-background,
      var(--color-button-primary-background, #fff)
    );
    --color-primary-border: var(
      --color-button-filled-primary-border,
      var(--color-button-primary-border, #fff)
    );
    --color-primary-outline: var(
      --color-button-filled-primary-outline,
      var(--color-button-primary-outline, #05a)
    );
    --color-secondary-label: var(
      --color-button-filled-secondary-label,
      var(--color-button-secondary-label, #fff)
    );
    --color-secondary-background: var(
      --color-button-filled-secondary-background,
      var(--color-button-secondary-background, #05a)
    );
    --color-secondary-border: var(
      --color-button-filled-secondary-border,
      var(--color-button-secondary-border, #fff)
    );
    --color-dialog-label: var(
      --color-button-filled-dialog-label,
      var(--color-button-dialog-label, #05a)
    );
    --color-dialog-background: var(
      --color-button-filled-dialog-background,
      var(--color-button-dialog-background, #fff)
    );
    --color-dialog-border: var(
      --color-button-filled-dialog-border,
      var(--color-button-dialog-border, #fa5)
    );
    --color-dialog-outline: var(
      --color-button-filled-dialog-outline,
      var(--color-button-dialog-outline, #05a)
    );
  }

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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
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
