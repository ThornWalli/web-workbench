<template>
  <wb-form class="wb-disks-extras13-web-paint-embed-image" @submit="onSubmit">
    <div class="preview">
      <img :src="src" />
    </div>
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
    <div class="position">
      <div>
        <wb-form-field-textfield v-bind="fieldX" />
        <wb-form-field-textfield v-bind="fieldY" />
      </div>

      <div>
        <origin-select v-model="origin" with-center />
      </div>
    </div>
    <wb-button-wrapper>
      <wb-button type="submit" style-type="primary" label="Apply" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbFormFieldDropdown from '@web-workbench/core/components/elements/formField/Dropdown.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import OriginSelect from '../OriginSelect.vue';

import { ORIGIN } from '../../types';
import type { Model } from '../../types';
import { ipoint } from '@js-basics/vector';
import type { IPoint } from '@js-basics/vector';
import { loadImage } from '@web-workbench/core/utils/image';
import type { TriggerRefresh } from '@web-workbench/core/types/component';
import { RESIZE_TYPE } from '../../types/worker/main';
import type { InsertImagePayload } from '../../types/worker.payload';
import { imageDataFromBlob } from '@web-workbench/core/utils/imageData';

const $emit = defineEmits<{
  (e: 'close'): void;
  (e: 'refresh', value: TriggerRefresh): void;
}>();

const $props = defineProps<{
  model: Model;
  blob: Blob;
}>();

const hasDisplay = computed(() => {
  return $props.model.app.currentDisplay !== undefined;
});

const originDimension = ref(ipoint(0, 0));
const src = ref();

const relative = ref(true);
const percantage = ref(false);
const origin = ref<ORIGIN>(ORIGIN.CENTER);

const currentModel = reactive<{
  position: IPoint & number;
  dimension: IPoint & number;
  dimensionType: 'px' | '%';
  resizeType: RESIZE_TYPE;
}>({
  position: ipoint(0, 0),
  dimension: ipoint(0, 0),
  dimensionType: 'px',
  resizeType: RESIZE_TYPE.NEAREST_NEIGHBOR
});

const _dimension = computed(() => {
  if (relative.value) {
    return originDimension.value;
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
    label: 'Height',
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
    label: 'Type',
    modelValue: currentModel.resizeType,
    'onUpdate:modelValue': (value: RESIZE_TYPE) => {
      currentModel.resizeType = value;
    },
    options: [
      { label: 'Nearest Neighbor', value: RESIZE_TYPE.NEAREST_NEIGHBOR },
      { label: 'Bilinear', value: RESIZE_TYPE.BICUBIC },
      { label: 'Bilinear', value: RESIZE_TYPE.BILINEAR },
      { label: 'Bicubic', value: RESIZE_TYPE.BICUBIC },
      { label: 'Lanczos', value: RESIZE_TYPE.LANCZOS }
    ]
  };
});

function getDimensionValue(value: IPoint & number, decode = false) {
  if (percantage.value) {
    if (decode) {
      return ipoint(() => (value * originDimension.value) / 100);
    } else {
      return ipoint(() => (value / originDimension.value) * 100);
    }
  }
  return ipoint(() => Math.round(value));
}

// #region Test

const fieldX = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'X',
    modelValue: currentModel.position.x || 0,
    'onUpdate:modelValue': (value: number) => {
      currentModel.position = ipoint(Number(value), currentModel.position.y);
    },
    type: 'number'
  };
});
const fieldY = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'Y',
    modelValue: currentModel.position.y || 0,
    'onUpdate:modelValue': (value: number) => {
      currentModel.position = ipoint(currentModel.position.x, Number(value));
    },
    type: 'number'
  };
});

// #endregion

async function onSubmit() {
  const { data, width, height } = await imageDataFromBlob($props.blob);
  $props.model.app.actions.insertImage({
    buffer: new Uint8ClampedArray(data),
    bufferDimension: ipoint(width, height),
    position: currentModel.position,
    dimension: currentModel.dimension,
    type: currentModel.resizeType,
    origin: origin.value
  } as InsertImagePayload);
  $emit('close');
}

onMounted(async () => {
  src.value = URL.createObjectURL($props.blob);
  const img = await loadImage(src.value);
  currentModel.dimension = ipoint(img.naturalWidth, img.naturalHeight);
  originDimension.value = currentModel.dimension;
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-embed-image {
  --form-field-label-width: 50px;

  min-width: 320px;
  padding: var(--default-element-margin);

  & .preview {
    display: flex;
    justify-content: center;
    margin-bottom: var(--default-element-margin);
    background: url('../../assets/grid.png');
    background-color: #fff;

    & img {
      display: block;
      width: 60%;
      height: auto;
      aspect-ratio: 1;
      object-fit: contain;
      image-rendering: pixelated;
    }
  }

  .size-compare {
    width: 60px;
    color: green;
    text-align: center;

    &.invalid {
      color: red;
    }
  }

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

  & .position {
    display: flex;
    flex-direction: row;
    gap: var(--default-element-margin);
    align-items: center;
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

  & .no-display {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    & > div {
      width: 80%;
      padding: var(--default-element-margin);
      color: var(--color-disks-web-paint-grid-warning-foreground);
      text-align: center;
      background-color: var(--color-disks-web-paint-grid-warning-background);
      border: solid var(--color-disks-web-paint-grid-warning-border) 2px;
    }
  }
}
</style>
