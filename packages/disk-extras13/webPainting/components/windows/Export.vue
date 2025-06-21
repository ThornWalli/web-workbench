<template>
  <wb-form class="wb-disks-extras13-web-painting-export" @submit="onSubmit">
    <wb-form-field-textfield v-bind="fieldFilename" />
    <wb-form-field-dropdown v-bind="fieldType" />
    <wb-form-field-textfield v-bind="fieldQuality" />
    <div>
      <div class="dimension">
        <div>
          <wb-form-field-textfield v-bind="fieldDimensionWidth" />
          <wb-form-field-textfield v-bind="fieldDimensionHeight" />
        </div>
        <wb-button
          type="button"
          style-type="primary"
          :label="relative ? 'R' : 'A'"
          @click="relative = !relative" />
      </div>
      <wb-form-field-dropdown v-bind="fieldDimensionType" />
    </div>
    <wb-button-wrapper>
      <wb-button type="submit" style-type="primary" label="Export" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ipoint, type IPoint } from '@js-basics/vector';

import useWindow from '@web-workbench/core/composables/useWindow';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbFormFieldDropdown from '@web-workbench/core/components/elements/formField/Dropdown.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import contextMenu from '../../contextMenu';
import type { Model } from '../../types';

const $props = defineProps<{
  model: Model;
}>();

const relative = ref(false);

const originDimension = $props.model.app.currentDocument!.meta.dimension;
const currentModel = reactive({
  type: 'png',
  filename: '',
  quality: 1,
  dimension: $props.model.app.currentDocument!.meta.dimension,
  dimensionType: 'px'
});

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const types = [
  { label: 'PNG', value: 'image/png' },
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'WebP', value: 'image/webp' }
];

const fieldFilename = computed(() => {
  return {
    label: 'Filename',
    modelValue: currentModel.filename,
    'onUpdate:modelValue': (value: string) => {
      currentModel.filename = value;
    },
    placeholder: 'Filename'
  };
});
const fieldType = computed(() => {
  return {
    label: 'Type',
    modelValue: currentModel.type,
    'onUpdate:modelValue': (value: string) => {
      currentModel.type = value;
    },
    options: types
  };
});
const fieldQuality = computed(() => {
  return {
    label: 'Quality',
    type: 'number',
    max: 100,
    min: 1,
    step: 1,
    modelValue: currentModel.quality * 100,
    'onUpdate:modelValue': (value: number) => {
      currentModel.quality = value / 100;
    },
    placeholder: 'Quality (1-100)'
  };
});

const fieldDimensionWidth = computed(() => {
  return {
    type: 'number',
    label: 'Width',
    modelValue: getDimensionValue(currentModel.dimension).x,
    'onUpdate:modelValue': (value: number) => {
      let ratio = 1;
      const x = getDimensionValue(ipoint(value, 0), true).x;
      if (relative.value) {
        ratio = x / originDimension.x;
      }
      currentModel.dimension = ipoint(x, originDimension.y * ratio);
    },
    placeholder: 'Width'
  };
});

const fieldDimensionHeight = computed(() => {
  return {
    type: 'number',
    label: 'Height',
    modelValue: getDimensionValue(currentModel.dimension).y,
    'onUpdate:modelValue': (value: number) => {
      let ratio = 1;
      const y = getDimensionValue(ipoint(0, value), true).y;
      if (relative.value) {
        ratio = y / originDimension.y;
      }
      currentModel.dimension = ipoint(originDimension.x * ratio, y);
    },
    placeholder: 'Height'
  };
});

const fieldDimensionType = computed(() => {
  return {
    label: 'Type',
    modelValue: currentModel.dimensionType || 'px',
    'onUpdate:modelValue': (value: string) => {
      currentModel.dimensionType = value;
    },
    options: [
      { label: 'Pixels', value: 'px' },
      { label: 'Percentage', value: '%' }
    ]
  };
});

function getDimensionValue(value: IPoint & number, decode = false) {
  if (currentModel.dimensionType === '%') {
    if (decode) {
      return ipoint(() =>
        Math.round(value * $props.model.app.currentDocument!.meta.dimension)
      );
    } else {
      return ipoint(
        () => value / $props.model.app.currentDocument!.meta.dimension
      );
    }
  }
  return ipoint(() => Math.round(value));
}

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

function onSubmit() {
  let resize;
  if ($props.model.app.currentDocument!.meta.dimension) {
    resize = getDimensionValue(currentModel.dimension, true);
  }
  $props.model.actions?.export({
    filename: currentModel.filename,
    type: currentModel.type || types[0].value,
    quality: currentModel.quality || 100,
    resize
  });
  $emit('close');
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-export {
  min-width: 320px;
  padding: var(--default-element-margin);

  & .dimension {
    display: flex;
    flex-direction: row;
    gap: var(--default-element-margin);
    margin-bottom: var(--default-element-margin);

    & > * {
      flex: 0;

      &:first-child {
        flex: 1;
      }
    }
  }
}
</style>
