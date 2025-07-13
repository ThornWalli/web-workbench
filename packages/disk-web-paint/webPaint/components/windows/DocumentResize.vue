<template>
  <wb-form
    class="wb-disks-extras13-web-paint-document-resize"
    @submit="onSubmit">
    <div class="dimension">
      <div>
        <wb-form-field-textfield v-bind="fieldDimensionWidth" />
        <wb-form-field-textfield v-bind="fieldDimensionHeight" />
        <wb-form-field-dropdown v-bind="fieldResizeType" />
      </div>
      <wb-button
        type="button"
        style-type="primary"
        :label="relative ? 'R' : 'A'"
        @click="relative = !relative" />
      <wb-button
        type="button"
        style-type="primary"
        :label="percantage ? 'PX' : '%'"
        @click="percantage = !percantage" />
    </div>
    <wb-button-wrapper>
      <wb-button
        type="submit"
        style-type="primary"
        :label="t('window.document_resize.save.label')" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';

import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbFormFieldDropdown from '@web-workbench/core/components/elements/formField/Dropdown.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';

import type { Model } from '../../types';
import { RESIZE_TYPE } from '../../types/worker/main';
import useI18n from '../../composables/useI18n';

const { t } = useI18n();

const $props = defineProps<{
  model: Model;
}>();

const relative = ref(true);
const percantage = ref(false);

const originDimension = $props.model.app.currentDocument!.meta.dimension;
const currentModel = reactive({
  filename: '',
  dimension: $props.model.app.currentDocument!.meta.dimension,
  dimensionType: 'px',
  resizeType: RESIZE_TYPE.NEAREST_NEIGHBOR
});

const _dimension = computed(() => {
  if (relative.value) {
    return originDimension;
  } else {
    return currentModel.dimension;
  }
});

const fieldDimensionWidth = computed(() => {
  return {
    type: 'number',
    label: t(`window.resize.width.label`),
    modelValue: getDimensionValue(currentModel.dimension).x,
    'onUpdate:modelValue': (value: number) => {
      let ratio = 1;
      const x = getDimensionValue(ipoint(value, 0), true).x;
      if (relative.value) {
        ratio = x / _dimension.value.x;
      }
      currentModel.dimension = ipoint(x, _dimension.value.y * ratio);
    },
    placeholder: 'Width',
    min: 1,
    step: 1
  };
});

const fieldDimensionHeight = computed(() => {
  return {
    type: 'number',
    label: t(`window.resize.height.label`),
    modelValue: getDimensionValue(currentModel.dimension).y,
    'onUpdate:modelValue': (value: number) => {
      let ratio = 1;
      const y = getDimensionValue(ipoint(0, value), true).y;
      if (relative.value) {
        ratio = y / _dimension.value.y;
      }
      currentModel.dimension = ipoint(_dimension.value.x * ratio, y);
    },
    placeholder: 'Height',
    min: 1,
    step: 1
  };
});

const fieldResizeType = computed(() => {
  return {
    label: t(`window.resize.resize_type.label`),
    modelValue: currentModel.resizeType,
    'onUpdate:modelValue': (value: RESIZE_TYPE) => {
      currentModel.resizeType = value;
    },
    options: [
      {
        label: t(`resize_type.${RESIZE_TYPE.NEAREST_NEIGHBOR}`),
        value: RESIZE_TYPE.NEAREST_NEIGHBOR
      },
      {
        label: t(`resize_type.${RESIZE_TYPE.BICUBIC}`),
        value: RESIZE_TYPE.BICUBIC
      },
      {
        label: t(`resize_type.${RESIZE_TYPE.BILINEAR}`),
        value: RESIZE_TYPE.BILINEAR
      },
      {
        label: t(`resize_type.${RESIZE_TYPE.BICUBIC}`),
        value: RESIZE_TYPE.BICUBIC
      },
      {
        label: t(`resize_type.${RESIZE_TYPE.LANCZOS}`),
        value: RESIZE_TYPE.LANCZOS
      }
    ]
  };
});

function getDimensionValue(value: IPoint & number, decode = false) {
  if (percantage.value) {
    if (decode) {
      return ipoint(() => (value * originDimension) / 100);
    } else {
      return ipoint(() => (value / originDimension) * 100);
    }
  }
  return ipoint(() => Math.round(value));
}

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

async function onSubmit() {
  await $props.model.actions?.documentResize({
    dimension: ipoint(() => Math.round(currentModel.dimension)),
    type: currentModel.resizeType
  });
  $emit('close');
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-document-resize {
  min-width: 320px;
  padding: var(--default-element-margin);

  & .dimension {
    display: flex;
    flex-direction: row;
    gap: var(--default-element-margin);
    margin-bottom: var(--default-element-margin);

    & > * {
      &button {
        width: 40px;
      }

      &:first-child {
        flex: 1;
      }
    }
  }
}
</style>
