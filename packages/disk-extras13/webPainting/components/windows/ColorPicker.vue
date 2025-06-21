<template>
  <div class="wb-disks-extras13-web-painting-color-picker">
    <!-- <div class="color-pickers">
      <color-picker
        v-for="{ type, density } in colorPickers"
        :key="type"
        :type="type"
        :density="density" />
    </div> -->

    <div>
      {{ currentColor.toHex().toUpperCase() }}
      <wb-form-field-range-slider
        :model-value="currentColor.r"
        style-type="color-select"
        hide-label
        label="Red"
        :max="255"
        :min="0"
        :step="1"
        :handle-size="0.2"
        @update:model-value="onUpdateModelValue({ r: $event })">
        <template #after>
          <span>{{ currentColor.r.toString(16).toUpperCase() }}</span>
        </template>
      </wb-form-field-range-slider>
      <wb-form-field-range-slider
        :model-value="currentColor.g"
        style-type="color-select"
        hide-label
        label="Green"
        :max="255"
        :min="0"
        :step="1"
        :handle-size="0.2"
        @update:model-value="onUpdateModelValue({ r: $event })">
        <template #after>
          <span>{{ currentColor.g.toString(16).toUpperCase() }}</span>
        </template>
      </wb-form-field-range-slider>
      <wb-form-field-range-slider
        :model-value="currentColor.b"
        style-type="color-select"
        hide-label
        label="Blue"
        :max="255"
        :min="0"
        :step="1"
        :handle-size="0.2"
        @update:model-value="onUpdateModelValue({ r: $event })">
        <template #after>
          <span>{{ currentColor.b.toString(16).toUpperCase() }}</span>
        </template>
      </wb-form-field-range-slider>
      <wb-form-field-range-slider
        :model-value="currentColor.a"
        style-type="color-select"
        hide-label
        label="Alpha"
        :max="255"
        :min="0"
        :step="1"
        :handle-size="0.2"
        @update:model-value="onUpdateModelValue({ r: $event })">
        <template #after>
          <span>{{ currentColor.a.toString(16).toUpperCase() }}</span>
        </template>
      </wb-form-field-range-slider>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WbFormFieldRangeSlider from '@web-workbench/core/components/elements/formField/RangeSlider.vue';

import { Color } from '../../lib/classes/Color';
import { ref } from 'vue';

interface ColorDescription {
  r: number;
  g: number;
  b: number;
  a?: number;
}

// const $emit = defineEmits<{
//   (e: 'update:model-value', value: Color): void;
// }>();
const $props = defineProps<{
  modelValue: Color;
}>();

const currentColor = ref($props.modelValue);

function onUpdateModelValue(value: Partial<ColorDescription>) {
  currentColor.value = new Color(
    value.r ?? currentColor.value.r,
    value.g ?? currentColor.value.g,
    value.b ?? currentColor.value.b,
    value.a ?? currentColor.value.a
  );
}
</script>

<style lang="postcss" scoped>
.wb-env-element-color-select {
  width: 128px;
}

button {
  padding: var(--default-element-margin);
  appearance: none;
  background: none;
  border: none;

  svg {
    display: block;
    fill: var(--workbench-color-1);
  }

  :deep(.svg-primary) {
    visibility: hidden;
  }

  :deep(.svg-secondary) {
    fill: var(--workbench-color-1);
  }
}
</style>
