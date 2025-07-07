<template>
  <wb-form class="wb-disks-extras13-web-paint-settings" @submit="onSubmit">
    <div class="grid">
      <fieldset>
        <legend>General</legend>
        <wb-form-field-checkbox-group
          v-if="generalSettings.items.length > 0"
          label-top
          v-bind="generalSettings" />
        <p><em>For this Settings you need restart Web Paint.</em></p>
      </fieldset>
      <fieldset>
        <legend>Fit Zoom</legend>
        <wb-form-field-checkbox v-bind="fieldFitZoomActive" />
        <wb-form-field-textfield v-bind="fieldFitZoomOffset" />
      </fieldset>
      <fieldset>
        <legend>Display</legend>
        <wb-form-field-color v-bind="fieldDisplayBackground" />
        <wb-form-field-color v-bind="fieldDisplayForeground" />
      </fieldset>
      <fieldset>
        <legend>Grid</legend>
        <wb-form-field-color v-bind="fieldGridColor" />
        <wb-form-field-textfield v-bind="fieldGridLineWidth" />
        <wb-form-field-textfield v-bind="fieldGridVisibleCount" />
      </fieldset>
    </div>
    <wb-button-wrapper align="outer" direction="vertical" full>
      <wb-button style-type="primary" label="Save" type="submit" />
      <wb-button
        style-type="secondary"
        label="Reset"
        type="button"
        @click="onClickReset" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldCheckboxGroup from '@web-workbench/core/components/elements/formField/CheckboxGroup.vue';
import WbFormFieldColor from '../formField/Color.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbFormFieldCheckbox from '@web-workbench/core/components/elements/formField/Checkbox.vue';

import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';

import { CONFIG_NAMES } from '../../types';
import type { Model } from '../../types';
import Color from '../../lib/classes/Color';
import { getDefaultConfig } from '../../utils';
import theme from '../../theme';
import useCore from '@web-workbench/core/composables/useCore';

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

const $props = defineProps<{
  model: Model;
}>();

const { core } = useCore();

interface CurrentModel {
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]: string;
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]: string;
  [CONFIG_NAMES.WEB_PAINT_GRID_COLOR]: string;
  [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE]: boolean;
  [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_OFFSET]: number;
  [CONFIG_NAMES.WEB_PAINT_NATIVE_THEME]: boolean;
  [CONFIG_NAMES.WEB_PAINT_DEBUG]: boolean;
  [CONFIG_NAMES.WEB_PAINT_GRID_LINE_WIDTH]: number;
  [CONFIG_NAMES.WEB_PAINT_GRID_VISIBLE_COUNT]: number;
}

const currentModel = ref<CurrentModel>({
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND
  ),
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND
  ),
  [CONFIG_NAMES.WEB_PAINT_GRID_COLOR]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_GRID_COLOR
  ),
  [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE
  ),
  [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_OFFSET]:
    core.value!.config.get(CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_OFFSET) || 0,
  [CONFIG_NAMES.WEB_PAINT_NATIVE_THEME]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_NATIVE_THEME
  ),
  [CONFIG_NAMES.WEB_PAINT_DEBUG]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DEBUG
  ),
  [CONFIG_NAMES.WEB_PAINT_GRID_LINE_WIDTH]:
    core.value!.config.get(CONFIG_NAMES.WEB_PAINT_GRID_LINE_WIDTH) || 1,
  [CONFIG_NAMES.WEB_PAINT_GRID_VISIBLE_COUNT]:
    core.value!.config.get(CONFIG_NAMES.WEB_PAINT_GRID_VISIBLE_COUNT) || 10
});
const generalSettings = computed(() => ({
  hideLabel: true,
  items: [
    {
      label: 'Native Theme',
      name: CONFIG_NAMES.WEB_PAINT_NATIVE_THEME
    },
    {
      label: 'Debug',
      name: CONFIG_NAMES.WEB_PAINT_DEBUG
    }
  ],
  modelValue: currentModel.value,
  'onUpdate:model-value': (value: CurrentModel) => (currentModel.value = value)
}));

const fieldFitZoomActive = computed(() => ({
  label: 'Fit Zoom',
  modelValue: currentModel.value[CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE],
  'onUpdate:model-value': (value: boolean) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE]: value
    };
  }
}));
const fieldFitZoomOffset = computed(() => ({
  label: 'Fit Zoom Offset',
  modelValue:
    currentModel.value[CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_OFFSET] || 0.1,
  type: 'number',
  step: 0.01,
  min: 0,
  required: true,
  'onUpdate:model-value': (value: number) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_OFFSET]: value
    };
  }
}));

const fieldDisplayBackground = computed(() => ({
  label: 'Background',
  modelValue: Color.fromHex(
    currentModel.value[CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]
  ),
  'onUpdate:model-value': (value: Color) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]: value.toHex()
    };
  }
}));
const fieldDisplayForeground = computed(() => ({
  label: 'Foreground',
  modelValue: Color.fromHex(
    currentModel.value[CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]
  ),
  'onUpdate:model-value': (value: Color) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]: value.toHex()
    };
  }
}));
const fieldGridColor = computed(() => ({
  label: 'GridColor',
  modelValue: Color.fromHex(
    currentModel.value[CONFIG_NAMES.WEB_PAINT_GRID_COLOR]
  ),
  'onUpdate:model-value': (value: Color) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_GRID_COLOR]: value.toHex()
    };
  }
}));

const fieldGridLineWidth = computed(() => ({
  label: 'Line Width (px)',
  modelValue: currentModel.value[CONFIG_NAMES.WEB_PAINT_GRID_LINE_WIDTH] || 1,
  type: 'number',
  step: 1,
  min: 1,
  required: true,
  'onUpdate:model-value': (value: number) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_GRID_LINE_WIDTH]: value
    };
  }
}));

const fieldGridVisibleCount = computed(() => ({
  label: 'Visible Count',
  modelValue:
    currentModel.value[CONFIG_NAMES.WEB_PAINT_GRID_VISIBLE_COUNT] || 10,
  type: 'number',
  step: 1,
  min: 1,
  required: true,
  'onUpdate:model-value': (value: number) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_GRID_VISIBLE_COUNT]: value
    };
  }
}));

const onSubmit = () => {
  core.value!.config.set(currentModel.value);
  const colors = {
    background: Color.fromHex(
      currentModel.value[CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]
    ),
    foreground: Color.fromHex(
      currentModel.value[CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]
    )
  };
  const grid = {
    color: Color.fromHex(currentModel.value[CONFIG_NAMES.WEB_PAINT_GRID_COLOR]),
    lineWidth: currentModel.value[CONFIG_NAMES.WEB_PAINT_GRID_LINE_WIDTH],
    visibleCount: currentModel.value[CONFIG_NAMES.WEB_PAINT_GRID_VISIBLE_COUNT]
  };

  const app = $props.model.app;
  app.setDisplayColors(colors);
  app.setDisplayGrid(grid);

  $props.model.actions.setTheme(theme);

  $emit('close');
};

function onClickReset() {
  currentModel.value = getDefaultConfig();
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-settings {
  min-width: 480px;
  padding: var(--default-element-margin);

  & .wb-env-fragment-form {
    display: flex;
    flex-direction: column;
    gap: calc(var(--default-element-margin) * 2);
    padding: calc(var(--default-element-margin) * 2);
  }

  & .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--default-element-margin);
  }
}
</style>
