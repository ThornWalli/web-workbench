<template>
  <wb-form
    class="wb-disks-extras13-web-paint-image-operation-sharpness"
    @submit="onSubmit">
    <wb-form-field-textfield v-bind="fieldRadius" />
    <wb-form-field-textfield v-bind="fieldThreshold" />
    <wb-button-wrapper>
      <wb-button type="submit" style-type="primary" label="Apply" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';

const $emit = defineEmits<{
  (
    e: 'close',
    value: {
      radius: number;
      threshold: number;
    }
  ): void;
}>();

const currentModel = reactive({
  radius: 1,
  threshold: 0
});

const fieldRadius = computed(() => {
  return {
    type: 'number',
    label: 'Radius',
    modelValue: currentModel.radius,
    'onUpdate:modelValue': (value: number) => {
      currentModel.radius = Number(value);
    },
    min: 1,
    step: 1
  };
});

const fieldThreshold = computed(() => {
  return {
    type: 'number',
    label: 'Threshold',
    modelValue: currentModel.threshold,
    'onUpdate:modelValue': (value: number) => {
      currentModel.threshold = Number(value);
    },
    min: 0,
    max: 1,
    step: 0.01
  };
});

async function onSubmit() {
  $emit('close', {
    radius: currentModel.radius,
    threshold: currentModel.threshold
  });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-image-operation-sharpness {
  min-width: 240px;
  padding: var(--default-element-margin);
}
</style>
