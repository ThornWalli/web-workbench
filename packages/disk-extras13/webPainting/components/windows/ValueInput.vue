<template>
  <wb-form class="value-input" @submit="onSubmit">
    <p v-if="text" class="font-bit-font">
      {{ text }}
    </p>
    <div>
      <wb-form-field-textfield
        auto-focus
        hide-label
        style-type="small"
        :model-value="currentValue"
        v-bind="fieldValue" />
      <div class="controls">
        <icon-button type="button" name="cancel" @click="onClickCancel" />
        <icon-button type="submit" name="apply" />
      </div>
    </div>
  </wb-form>
</template>

<script lang="ts" setup generic="T extends string | number">
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import { computed, nextTick, ref } from 'vue';
import IconButton from '../IconButton.vue';

const $emit = defineEmits<{
  (e: 'close', value?: T): void;
}>();

const $props = defineProps<{
  value?: T;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  text?: string;
  type?: 'text' | 'number' | 'password';
  placeholder?: string;
  required?: boolean;
}>();

const currentValue = ref($props.value !== undefined ? $props.value : '');

function prepareValue(value: T): T {
  if ($props.type === 'number') {
    let value_ = Number(value);
    if (isNaN(value_)) {
      value_ = 0;
    }
    if ($props.max !== undefined && value_ >= $props.max) {
      value_ = $props.max;
    }
    if ($props.min !== undefined && value_ <= $props.min) {
      value_ = $props.min;
    }
    return value_ as T;
  }
  return String(value) as T;
}

const fieldValue = computed(() => ({
  required: $props.required,
  label: 'Value',
  placeholder: $props.placeholder || 'Enter value',
  min: $props.min,
  max: $props.max,
  step: $props.step,
  size: $props.size,
  type: $props.type,
  'onUpdate:modelValue': (value: T) => {
    currentValue.value = '';
    nextTick(() => {
      currentValue.value = prepareValue(value);
    });
  }
}));

function onClickCancel() {
  $emit('close');
}

function onSubmit(e: Event) {
  e.preventDefault();
  $emit('close', currentValue.value);
}
</script>

<style lang="postcss" scoped>
.value-input {
  display: flex;
  flex-direction: column;
  gap: var(--default-element-margin);
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);

  & > div {
    display: flex;
    flex-direction: row;
  }

  & .wb-env-element-form-field {
    flex: 1;

    & > :deep(div > .label) {
      min-width: auto;
    }

    & > :deep(div > input) {
      flex: 1;

      /* width: 120px; */
    }
  }

  & .controls {
    display: flex;
    gap: calc(var(--default-element-margin) * 1);
    align-items: center;
  }
}
</style>
