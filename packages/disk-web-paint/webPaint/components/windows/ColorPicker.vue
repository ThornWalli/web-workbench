<template>
  <wb-form
    class="wb-disks-extras13-web-paint-window-color-picker"
    @submit="onSubmit">
    <div class="controls">
      <div>
        <color-picker
          type="circle"
          :width="200"
          :density="ipoint(32, 32)"
          :model-value="currentColor"
          @update:model-value="onUpdateModelValue" />
      </div>
      <div class="colors">
        <div v-if="colorType === 'rgba'">
          <color-picker
            type="rgba_red"
            :width="60"
            :height="180"
            :density="ipoint(1, 10)"
            :model-value="currentColor"
            @update:model-value="onUpdateModelValue" />
          <color-picker
            type="rgba_green"
            :width="60"
            :height="180"
            :density="ipoint(1, 10)"
            :model-value="currentColor"
            @update:model-value="onUpdateModelValue" />
          <color-picker
            type="rgba_blue"
            :width="60"
            :height="180"
            :density="ipoint(1, 10)"
            :model-value="currentColor"
            @update:model-value="onUpdateModelValue" />
          <color-picker
            type="rgba_alpha"
            :width="60"
            grid
            :height="180"
            :density="ipoint(1, 10)"
            :model-value="currentColor"
            @update:model-value="onUpdateModelValue" />
        </div>
        <div v-else>
          <color-picker
            type="hsla_hue"
            :width="60"
            :height="180"
            :density="ipoint(1, 10)"
            :model-value="currentColor"
            @update:model-value="onUpdateModelValue" />
          <color-picker
            type="hsla_saturation"
            :width="60"
            :height="180"
            :density="ipoint(1, 10)"
            :model-value="currentColor"
            @update:model-value="onUpdateModelValue" />

          <color-picker
            type="hsla_lightness"
            :width="60"
            :height="180"
            :density="ipoint(1, 10)"
            :model-value="currentColor"
            @update:model-value="onUpdateModelValue" />
          <color-picker
            type="hsla_alpha"
            :width="60"
            grid
            :height="180"
            :density="ipoint(1, 10)"
            :model-value="currentColor"
            @update:model-value="onUpdateModelValue" />
        </div>
        <wb-form-field-dropdown
          hide-label
          style-type="compact"
          v-bind="fieldColorType" />
      </div>
    </div>
    <div class="controls">
      <div class="values">
        <div v-if="colorType === 'rgba'" class="rgba">
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorRgbaRed" />
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorRgbaGreen" />
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorRgbaBlue" />
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorRgbaAlpha" />
        </div>
        <div v-else class="hsla">
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorHslaHue" />
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorHslaSaturation" />
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorHslaLightness" />
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorHslaAlpha" />
        </div>
        <div class="hex">
          <span></span>
          <wb-form-field-textfield
            style-type="compact"
            v-bind="fieldColorHslaHex" />
        </div>
      </div>
      <div
        class="preview"
        :style="{
          '--value': `rgba(${currentColor.toCSSRGBA()})`
        }"></div>
    </div>
    <wb-button-wrapper embed>
      <wb-button
        type="submit"
        :label="t('window.color_picker.apply.label')"
        style-type="dialog" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Color from '../../lib/classes/Color';
import ColorPicker from '../ColorPicker.vue';
import WbFormFieldDropdown from '@web-workbench/core/components/elements/formField/Dropdown.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';

import { ipoint } from '@js-basics/vector';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import useI18n from '../../composables/useI18n';

const { t } = useI18n();

const $emit = defineEmits<{
  (e: 'close', color?: Color): void;
}>();

const $props = defineProps<{
  color?: Color;
}>();

const currentColor = ref($props.color || new Color(255, 0, 0, 255));

function onUpdateModelValue(color: Color) {
  currentColor.value = color;
}
const colorType = ref('rgba'); // Default to RGBA

const fieldColorType = computed(() => {
  return {
    label: 'Color Type',
    modelValue: colorType.value,
    'onUpdate:modelValue': (value: string) => {
      colorType.value = value;
    },
    options: [
      { value: 'rgba', label: 'RGBA' },
      { value: 'hsla', label: 'HSLA' }
    ]
  };
});

// #region Rgba

const fieldColorRgbaRed = computed(() => ({
  label: 'Red',
  modelValue: String(currentColor.value.r),
  'onUpdate:modelValue': (value: number) => {
    currentColor.value.r = value;
  },
  type: 'number',
  min: 0,
  max: 255
}));
const fieldColorRgbaGreen = computed(() => ({
  label: 'Green',
  modelValue: String(currentColor.value.g),
  'onUpdate:modelValue': (value: number) => {
    currentColor.value.g = value;
  },
  type: 'number',
  min: 0,
  max: 255
}));
const fieldColorRgbaBlue = computed(() => ({
  label: 'Blue',
  modelValue: String(currentColor.value.b),
  'onUpdate:modelValue': (value: number) => {
    currentColor.value.b = value;
  },
  type: 'number',
  min: 0,
  max: 255
}));
const fieldColorRgbaAlpha = computed(() => ({
  label: 'Alpha',
  modelValue: String(currentColor.value.a),
  'onUpdate:modelValue': (value: number) => {
    currentColor.value.a = value;
  },
  type: 'number',
  min: 0,
  max: 255
}));

// #endregion

// #region Hsla
const fieldColorHslaHue = computed(() => ({
  label: 'Hue',
  modelValue: String(currentColor.value.getHslaHue()),
  'onUpdate:modelValue': (value: number) => {
    currentColor.value.setHslaHue(value);
  },
  type: 'number',
  min: 0,
  max: 360
}));
const fieldColorHslaSaturation = computed(() => ({
  label: 'Saturation',
  modelValue: String(currentColor.value.getHslaSaturation()),
  'onUpdate:modelValue': (value: number) => {
    currentColor.value.setHslaSaturation(value);
  },
  type: 'number',
  min: 0,
  max: 100
}));
const fieldColorHslaLightness = computed(() => ({
  label: 'Lightness',
  modelValue: String(currentColor.value.getHslaLightness()),
  'onUpdate:modelValue': (value: number) => {
    currentColor.value.setHslaLightness(value);
  },
  type: 'number',
  min: 0,
  max: 100
}));
const fieldColorHslaAlpha = computed(() => ({
  label: 'Alpha',
  modelValue: String(currentColor.value.a),
  'onUpdate:modelValue': (value: number) => {
    currentColor.value.a = value;
  },
  type: 'number',
  min: 0,
  max: 255
}));
// #endregion

const fieldColorHslaHex = computed(() => ({
  label: 'Hex',
  modelValue: currentColor.value.toHex(),
  'onUpdate:modelValue': (value: string) => {
    if (Color.isValidHex(value)) {
      currentColor.value = Color.fromHex(value);
    }
  },
  type: 'text',
  updateOnBlur: true
  // readonly: true
}));

function onSubmit(e: Event) {
  e.preventDefault();
  $emit('close', currentColor.value);
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-window-color-picker {
  padding: calc(var(--default-element-margin) * 2);
  color: #fff;
  background-color: #000;

  /* empty */
  & .colors {
    & > div {
      display: flex;
      gap: calc(var(--default-element-margin) * 2);
    }
  }

  & .controls {
    display: flex;
    gap: calc(var(--default-element-margin) * 2);
    align-items: center;
  }

  & .values {
    flex: 1;

    & > div {
      display: grid;
      grid-template-rows: repeat(1, 1fr);
      grid-template-columns: repeat(2, 1fr);
      gap: 0 calc(var(--default-element-margin) * 1);

      &.rgba,
      &.hsla {
        grid-template-rows: repeat(2, 1fr);
      }
    }
  }

  & :deep(.wb-env-element-form-field .label) {
    flex: 1;
  }

  & :deep(.wb-env-element-form-field input) {
    flex: none;
    width: 80px;
  }

  & .preview {
    position: relative;
    flex: none;
    width: 48px;
    height: 48px;
    border: solid #fff 2px;

    &::before {
      position: absolute;
      inset: 0;
      content: '';
      background: url('../../assets/grid.png');
      background-color: #fff;
    }

    &::after {
      position: absolute;
      inset: 0;
      content: '';
      background-color: var(--value);
    }
  }
}
</style>
