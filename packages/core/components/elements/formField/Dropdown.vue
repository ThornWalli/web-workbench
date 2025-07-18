<template>
  <wb-env-element-form-field
    tag="label"
    class="wb-env-element-form-field-dropdown"
    :class="styleClasses"
    :label="label">
    <div class="wrapper">
      <select :model-value="currentModel" v-bind="input" @change="onChange">
        <template v-for="(item, index) in options" :key="index">
          <optgroup v-if="isOptgroup(item)" :label="item.label">
            <option
              v-for="(option, optIndex) in item.options"
              :key="`${index}-${optIndex}`"
              :selected="isSelected(option)"
              :value="option.value">
              {{ option?.title || option?.label }}
            </option>
          </optgroup>
          <option v-else :selected="isSelected(item)" :value="item.value">
            {{ item?.title || item?.label }}
          </option>
        </template>
      </select>
      <span v-if="!disabled && !readonly" class="select-expander">
        <svg-control-tiny-array-down />
      </span>
    </div>
  </wb-env-element-form-field>
</template>

<script lang="ts" setup generic="T">
import WbEnvElementFormField from '../FormField.vue';
import SvgControlTinyArrayDown from '../../../assets/svg/control/tiny_arrow_down.svg?component';
import { computed } from 'vue';

// --- Neue Schnittstellen-Definitionen ---
export interface DropdownOption {
  title?: string;
  label?: string;
  value?: string | number | boolean;
}

export interface DropdownOptgroup {
  label: string;
  options: DropdownOption[];
}

type DropdownItem = DropdownOption | DropdownOptgroup;

const $props = defineProps<{
  styleType?: 'default' | 'compact';
  modelValue?: T;
  label?: string;
  id?: string;
  name?: string;
  size?: number;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  // Angepasster Typ für die 'options'-Prop
  options?: DropdownItem[];
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', value: T): void;
}>();

const currentModel = computed(() => {
  return $props.modelValue;
});

const input = computed(() => {
  return {
    id: $props.id,
    name: $props.name,
    size: ($props.size || 1) > 1 ? $props.size : undefined,
    multiple: $props.multiple,
    readonly: $props.readonly,
    disabled: $props.disabled
  };
});

const styleClasses = computed(() => {
  return {
    [`style-type-${$props.styleType || 'default'}`]: true
  };
});

const onChange = (e: Event) => {
  if (e.target instanceof HTMLSelectElement) {
    let value;
    if ($props.multiple) {
      value = Array.from(e.target.selectedOptions).map(option => option.value);
    } else {
      value = e.target.value;
    }
    $emit('update:model-value', value as T);
  }
};

function isOptgroup(item: DropdownItem): item is DropdownOptgroup {
  return (
    (item as DropdownOptgroup).options !== undefined &&
    (item as DropdownOptgroup).label !== undefined
  );
}

function isSelected(option: DropdownOption): boolean {
  if ($props.multiple && Array.isArray($props.modelValue)) {
    return $props.modelValue.includes(option.value);
  } else if (
    typeof $props.modelValue === 'string' ||
    typeof $props.modelValue === 'number' ||
    typeof $props.modelValue === 'boolean'
  ) {
    return $props.modelValue === option.value;
  }
  return false;
}
</script>

<style lang="postcss" scoped>
.wb-env-element-form-field-dropdown {
  --color-disabled-text: var(--color-dropdown-disabled-text, #05a);
  --color-disabled-background: var(--color-dropdown-disabled-background, #fff);
  --color-text: var(--color-dropdown-text, #fff);
  --color-background: var(--color-dropdown-background, #05a);
  --color-border: var(--color-dropdown-border, #05a);
  --color-outline: var(--color-dropdown-outline, #fff);
  --color-scrollbar-primary: var(--color-dropdown-scrollbar-primary, #fff);
  --color-scrollbar-secondary: var(--color-dropdown-scrollbar-secondary, #05a);
  --color-expander-icon: var(--color-dropdown-expander-icon, #05a);
  --color-expander-border: var(--color-dropdown-expander-border, #05a);
  --color-expander-background: var(--color-dropdown-expander-background, #fff);

  .style-filled & {
    --color-disabled-text: var(
      --color-dropdown-filled-disabled-text,
      var(--color-dropdown-disabled-text, #05a)
    );
    --color-disabled-background: var(
      --color-dropdown-filled-disabled-background,
      var(--color-dropdown-disabled-background, #fff)
    );
    --color-text: var(
      --color-dropdown-filled-text,
      var(--color-dropdown-text, #fff)
    );
    --color-background: var(
      --color-dropdown-filled-background,
      var(--color-dropdown-background, #05a)
    );
    --color-border: var(
      --color-dropdown-filled-border,
      var(--color-dropdown-border, #05a)
    );
    --color-outline: var(
      --color-dropdown-filled-outline,
      var(--color-dropdown-outline, #fff)
    );
    --color-scrollbar-primary: var(
      --color-dropdown-filled-scrollbar-primary,
      var(--color-dropdown-scrollbar-primary, #fff)
    );
    --color-scrollbar-secondary: var(
      --color-dropdown-filled-scrollbar-secondary,
      var(--color-dropdown-scrollbar-secondary, #05a)
    );
    --color-expander-icon: var(
      --color-dropdown-filled-expander-icon,
      var(--color-dropdown-expander-icon, #05a)
    );
    --color-expander-border: var(
      --color-dropdown-filled-expander-border,
      var(--color-dropdown-expander-border, #05a)
    );
    --color-expander-background: var(
      --color-dropdown-filled-expander-background,
      var(--color-dropdown-expander-background, #fff)
    );
  }

  position: relative;

  /* & > * {
    display: inline-block;
    font-size: 1rem;
  } */
  & .wrapper {
    position: relative;
  }

  & select {
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 4px;
    margin: 0 -2px;
    line-height: 18px;
    vertical-align: middle;
    color: var(--color-text);
    appearance: none;
    outline: none;
    outline: solid var(--color-outline) 2px;
    outline-offset: -4px;
    scrollbar-color: var(--color-scrollbar-primary)
      var(--color-scrollbar-secondary);
    background: var(--color-background);
    border: solid var(--color-border) 2px;
    border-radius: 0;

    &::-webkit-scrollbar {
      width: 1em;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--color-scrollbar-secondary);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-scrollbar-primary);
    }

    &:not([size]) {
      padding-top: 6px;
      padding-right: 32px;
      padding-left: 6px;
    }

    &[size] option {
      padding-top: 6px;
      padding-left: 10px;
    }

    &:disabled {
      color: var(--color-disabled-text);
      background: var(--color-disabled-background);
      opacity: 1;
    }

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

  & .select-expander {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;

    /* box-sizing: content-box; */
    display: inline-block;
    flex: 1 auto;
    height: 32px;
    padding: 5px 10px;
    line-height: 1;
    vertical-align: top;
    pointer-events: none;
    background: var(--color-expander-background);
    border: solid var(--color-expander-border);
    border-width: 2px 2px 2px 0;

    /* transform: translateX(-100%); */

    & > * {
      position: absolute;
      top: 1em;
      left: 50%;
      display: block;
      margin-top: -5px;
      margin-left: -5px;
      fill: var(--color-expander-icon);
    }
  }

  & select[size] + .select-expander {
    display: none;
  }

  & select:focus + .select-expander {
    filter: var(--filter-default);
  }

  html.no-touchevents & {
    & select:hover,
    & select:hover + .select-expander {
      filter: var(--filter-default);
    }
  }

  html.touchevents & {
    & select:hover,
    & select:active + .select-expander {
      filter: var(--filter-default);
    }
  }

  &.field-label-top {
    margin-top: 10px;

    & .field-label {
      display: block;
      padding-top: 0;
    }

    & select {
      display: block;
      width: 100%;
    }
  }

  &.style-type-compact {
    margin: 0;
    font-family: var(--font-family-bit-font);
    font-size: calc(var(--font-size-bit-font) * 1px);

    & :deep(.label) {
      font-size: 1em;
      line-height: calc(var(--line-height-bit-font) * 1px);
      letter-spacing: 0;
    }

    & select {
      height: 24px;
      padding: 4px;
      font-size: 1em;
      line-height: 10px;
      letter-spacing: 0;
    }

    & .select-expander {
      height: 24px;
      padding: 0 10px;

      & :deep(> *) {
        margin-top: -4px;
      }
    }
  }
}
</style>
