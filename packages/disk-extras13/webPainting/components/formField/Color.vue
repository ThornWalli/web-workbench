<template>
  <wb-env-element-form-field
    :label-align="labelAlign || defaultLabelAlign"
    tag="div"
    class="wb-env-element-form-color-picker"
    v-bind="$attrs">
    <template #default="{ id, required }">
      <wb-color-picker
        v-bind="input"
        :id="id"
        :model-value="currentModelValue"
        :required="required"
        @update:model-value="onUpdateModelValue" />
      <wb-form-field-range-slider
        :model-value="currentOpacity"
        style-type="color-select"
        hide-label
        :label="null"
        class="color-slider"
        :max="255"
        :min="0"
        :step="1"
        :handle-size="0.2"
        @update:model-value="opacity = $event">
        <template #after>
          <span>{{ opacity.toString(16).toUpperCase() }}</span>
        </template>
      </wb-form-field-range-slider>
    </template>
    <template #after>
      <slot name="after" />
    </template>
  </wb-env-element-form-field>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import WbEnvElementFormField, {
  ALIGN
} from '@web-workbench/core/components/elements/FormField.vue';
import WbColorPicker, { COLOR_SELECT_SIZE } from '../ColorSelect.vue';
import WbFormFieldRangeSlider from '@web-workbench/core/components/elements/formField/RangeSlider.vue';

const defaultLabelAlign = ALIGN.LEFT;
const defaultSize = COLOR_SELECT_SIZE.MEDIUM;

const $emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();

const currentModelValue = computed(() => {
  const value = $props.modelValue || '';
  return value.length >= 6 ? value.slice(0, 6) : value;
});

const currentOpacity = computed(() => {
  const value = $props.modelValue || '';
  return value.length >= 8 ? parseInt(value.slice(6, 8), 16) : 255;
});

const opacity = ref(255);

const $props = defineProps<{
  labelAlign?: ALIGN | `${ALIGN}`;
  modelValue: string;
  name?: string;
  id?: string;
  readonly?: boolean;
  disabled?: boolean;
  size?: COLOR_SELECT_SIZE;
}>();

const input = computed(() => {
  return {
    name: $props.name,
    size: $props.size || defaultSize,
    readonly: $props.readonly,
    disabled: $props.disabled
  };
});

function onUpdateModelValue(e: string) {
  $emit('update:model-value', e + opacity.value.toString(16).padStart(2, '0'));
}
</script>

<style lang="postcss" scoped>
.wb-env-element-form-color-picker {
  position: relative;
  display: flex;
  line-height: 30px;

  & .wb-env-element-form-range-slider {
    & :deep(.wb-env-element-range-slider) {
      flex: initial;
      width: 60px;
    }

    & :deep(span) {
      width: 30px;
      text-align: center;
    }
  }

  & .wb-env-element-form-range-slider,
  & .wb-env-element-color-picker {
    flex: initial;
  }

  & :deep(> div) {
    align-items: center;
  }

  & :deep(div > .label) {
    flex: 1;
  }
}
</style>
