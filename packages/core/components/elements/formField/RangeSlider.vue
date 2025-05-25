<template>
  <wb-env-element-form-field
    tag="div"
    class="wb-env-element-form-range-slider"
    v-bind="$attrs">
    <slot name="before" />
    <wb-env-element-range-slider
      v-bind="rangeSlider"
      :model-value="value"
      style-type="form-field"
      @update:model-value="onUpdateModelValue" />
    <template #after>
      <slot name="after" />
    </template>
  </wb-env-element-form-field>
</template>

<script lang="ts" setup>
import WbEnvElementRangeSlider from '../RangeSlider.vue';
import WbEnvElementFormField from '../FormField.vue';
import { computed } from 'vue';

const $props = defineProps({
  modelValue: {
    type: Number,
    default: undefined
  },
  id: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false
  },
  min: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  },
  step: {
    type: Number,
    default: null
  },
  handleSize: {
    type: Number,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  directionVertical: {
    type: Boolean,
    default: false
  }
});

const $emit = defineEmits<{
  (e: 'update:model-value', value: number): void;
}>();

const value = computed(() => {
  return $props.modelValue;
});

const rangeSlider = computed(() => {
  return {
    name: $props.name,
    min: $props.min,
    max: $props.max,
    step: $props.step,
    handleSize: $props.handleSize,
    readonly: $props.readonly,
    disabled: $props.disabled,
    directionVertical: $props.directionVertical
  };
});
const onUpdateModelValue = (value: number) => {
  $emit('update:model-value', value);
};
</script>
