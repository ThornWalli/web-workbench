<template>
  <div
    class="wb-env-element-checkbox"
    :class="{ [currentType]: currentType, disabled, readonly, focus }">
    <input
      :id="id"
      :type="type || defaultType"
      :name="name"
      :value="value"
      :readonly="readonly"
      :disabled="disabled"
      :checked="isChecked"
      @focus="focus = true"
      @blur="focus = false"
      @input="onInput" />
    <svg-control-input-checkbox v-if="currentType === TYPE.CHECKBOX" />
    <svg-control-input-radio v-else />
  </div>
</template>

<script lang="ts" setup generic="T, TValue">
import { computed, ref } from 'vue';
import SvgControlInputCheckbox from '../../assets/svg/control/input_checkbox.svg?component';
import SvgControlInputRadio from '../../assets/svg/control/input_radio.svg?component';
const defaultType = TYPE.CHECKBOX;

const focus = ref(false);

const $props = defineProps<{
  id?: string;
  modelValue: T;
  type?: TYPE | `${TYPE}` | string;
  name?: string;
  value?: TValue;
  readonly?: boolean;
  disabled?: boolean;
}>();

const currentType = computed(() => {
  return $props.type || defaultType;
});

const $emit = defineEmits<{
  (e: 'update:model-value', value: T): void;
}>();

const isChecked = computed(() => {
  const value = $props.modelValue;
  if (Array.isArray(value)) {
    return value.find(v => v === $props.value);
  } else if ($props.name && typeof value === 'object') {
    return (value as { [key: string]: TValue })[$props.name];
  } else if ($props.value) {
    return value === $props.value;
  } else {
    return value as boolean;
  }
});

function onInput(e: Event) {
  const checked = (e.target as HTMLInputElement).checked || false;
  let returnValue: T = checked as T;
  if (Array.isArray($props.modelValue)) {
    if (checked) {
      returnValue = [...$props.modelValue, $props.value] as T;
    } else {
      returnValue = $props.modelValue.filter(v => v !== $props.value) as T;
    }
  } else if ($props.name && typeof $props.modelValue === 'object') {
    returnValue = { ...$props.modelValue, [$props.name]: checked } as T;
  } else if ($props.value) {
    returnValue = (checked ? $props.value : undefined) as T;
  } else if (
    $props.value === undefined &&
    typeof $props.modelValue === 'boolean'
  ) {
    returnValue = checked as T;
  }
  $emit('update:model-value', returnValue);
}
</script>

<script lang="ts">
export enum TYPE {
  CHECKBOX = 'checkbox',
  RADIO = 'radio'
}
</script>

<style lang="postcss" scoped>
.wb-env-element-checkbox {
  position: relative;

  --color-disabled-icon: var(--color-checkbox-disabled-icon, #fff);
  --color-disabled-background: var(--color-checkbox-disabled-background, #fff);
  --color-background: var(--color-checkbox-background, #05a);
  --color-icon: var(--color-checkbox-icon, #fff);
  --color-outline: var(--color-checkbox-icon, #05a);

  .style-filled & {
    --color-disabled-icon: var(
      --color-checkbox-filled-disabled-icon,
      var(--color-checkbox-disabled-icon, #fff)
    );
    --color-disabled-background: var(
      --color-checkbox-filled-disabled-background,
      var(--color-checkbox-disabled-background, #fff)
    );
    --color-background: var(
      --color-checkbox-filled-background,
      var(--color-checkbox-background, #05a)
    );
    --color-icon: var(
      --color-checkbox-filled-icon,
      var(--color-checkbox-icon, #fff)
    );
    --color-outline: var(
      --color-checkbox-filled-icon,
      var(--color-checkbox-icon, #fff)
    );
  }

  & input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &.checkbox {
    & :deep(.svg-primary) {
      fill: var(--color-icon);
    }

    & :deep(.svg-secondary) {
      visibility: hidden;
      fill: var(--color-icon);
    }
  }

  & svg {
    display: block;
    flex: 0 0 16px;
    pointer-events: none;
    background: var(--color-background);
  }

  &.radio {
    & svg {
      & :deep(.svg-primary) {
        fill: var(--color-icon);
      }

      & :deep(.svg-secondary) {
        visibility: hidden;
        fill: var(--color-icon);
      }
    }
  }

  & > input:checked + svg {
    & :deep(.svg-secondary) {
      visibility: visible;
    }
  }

  @media (hover: hover) {
    &:hover > input:not([disabled]) + svg {
      filter: var(--filter-default);
    }
  }

  @media (hover: none) {
    &:active > input:not([disabled]) + svg {
      filter: var(--filter-default);
    }
  }

  /* &.focus {
    position: relative;

    &::before {
      position: absolute;
      inset: -4px;
      content: '';
      border: solid 2px var(--color-outline);
    }
  } */

  input:focus:not([disabled]) + svg {
    filter: var(--filter-default);
  }

  & > input[disabled] + svg {
    background: var(--color-disabled-background);
    filter: none !important;
    fill: var(--color-disabled-icon);
  }
}
</style>
