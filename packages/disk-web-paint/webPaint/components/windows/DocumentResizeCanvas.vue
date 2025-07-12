<template>
  <wb-form
    class="wb-disks-extras13-web-paint-document-resize-canvas"
    @submit="onSubmit">
    <div class="dimension">
      <div>
        <wb-form-field-textfield embed v-bind="fieldDimensionWidth" />
        <wb-form-field-textfield embed v-bind="fieldDimensionHeight" />
      </div>
      <div>
        <wb-button
          type="button"
          style-type="primary"
          :label="relative ? 'Rel.' : 'Abs.'"
          @click="relative = !relative" />
        <wb-button
          type="button"
          style-type="primary"
          :label="percantage ? 'PX' : '%'"
          @click="percantage = !percantage" />
      </div>
      <div>
        <origin-select v-model="origin" with-center />
      </div>
    </div>
    <wb-button-wrapper>
      <wb-button type="submit" style-type="primary" label="Save" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';

import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import OriginSelect from '../OriginSelect.vue';
import { ORIGIN } from '../../types';
import type { Model } from '../../types';

const $props = defineProps<{
  model: Model;
}>();

const relative = ref(true);
const percantage = ref(false);
const origin = ref<ORIGIN>(ORIGIN.CENTER);

const originDimension = $props.model.app.currentDocument!.meta.dimension;
const currentModel = reactive({
  type: 'png',
  filename: '',
  quality: 1,
  dimension: $props.model.app.currentDocument!.meta.dimension,
  dimensionType: 'px'
});

const dimension_ = computed(() => {
  if (relative.value) {
    return originDimension;
  } else {
    return currentModel.dimension;
  }
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
        ratio = x / dimension_.value.x;
        currentModel.dimension = ipoint(x, dimension_.value.y * ratio);
      } else {
        currentModel.dimension = ipoint(x, dimension_.value.y);
      }
    },
    placeholder: 'Width',
    min: 1,
    step: 1
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
        ratio = y / dimension_.value.y;
        currentModel.dimension = ipoint(dimension_.value.x * ratio, y);
      } else {
        currentModel.dimension = ipoint(dimension_.value.x, y);
      }
    },
    placeholder: 'Height',
    min: 1,
    step: 1
  };
});

function getDimensionValue(value: IPoint & number, decode = false) {
  if (percantage.value) {
    if (decode) {
      return ipoint(
        () => value * $props.model.app.currentDocument!.meta.dimension
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

async function onSubmit() {
  await $props.model.actions?.documentResizeCanvas({
    dimension: ipoint(() => Math.round(currentModel.dimension)),
    origin: origin.value
  });
  $emit('close');
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-document-resize-canvas {
  /* width: 220px; */
  padding: var(--default-element-margin);

  & :deep(.wb-env-element-form-textfield .label) {
    min-width: 50px;
  }

  & :deep(.wb-env-element-form-textfield .input) {
    width: 80px;
  }

  & .dimension {
    display: flex;
    flex-direction: row;
    gap: calc(var(--default-element-margin) * 2);
    align-items: center;
    margin-bottom: var(--default-element-margin);

    & > * {
      display: flex;
      flex-direction: column;
      gap: 4px;

      & button {
        width: 48px;
      }

      &:first-child {
        flex: 1;
      }
    }
  }
}
</style>
