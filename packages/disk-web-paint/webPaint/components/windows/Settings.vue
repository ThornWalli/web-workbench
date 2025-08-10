<template>
  <wb-form class="wb-disks-extras13-web-paint-settings" @submit="onSubmit">
    <wb-view-menu>
      <template #default>
        <wb-view-menu-container :label="t('window.settings.general.title')">
          <wb-form-field-checkbox-group
            v-if="generalSettings.items.length > 0"
            label-top
            v-bind="generalSettings" />
          <p class="font-bit-font">
            {{ t('window.settings.general.text') }}
          </p>
        </wb-view-menu-container>
        <wb-view-menu-container :label="t('window.settings.fit_zoom.title')">
          <wb-form-field-checkbox v-bind="fieldFitZoomActive" />
          <wb-form-field-textfield v-bind="fieldFitZoomOffset" />
        </wb-view-menu-container>
        <wb-view-menu-container :label="t('window.settings.display.title')">
          <wb-form-field-color v-bind="fieldDisplayBackground" />
          <wb-form-field-color v-bind="fieldDisplayForeground" />
        </wb-view-menu-container>
        <wb-view-menu-container :label="t('window.settings.document.title')">
          <wb-form-field-color v-bind="fieldDocumentBackground" />
        </wb-view-menu-container>
        <wb-view-menu-container :label="t('window.settings.pixel_grid.title')">
          <wb-form-field-color v-bind="fieldPixelGridColor" />
          <wb-form-field-textfield v-bind="fieldPixelGridLineWidth" />
          <wb-form-field-textfield v-bind="fieldPixelGridVisibleCount" />
        </wb-view-menu-container>
      </template>
      <template #foot>
        <wb-button-wrapper align="outer" direction="horizontal" full>
          <wb-button
            style-type="secondary"
            :label="t('window.settings.reset.label')"
            type="button"
            @click="onClickReset" />
          <wb-button
            style-type="primary"
            :label="t('window.settings.save.label')"
            type="submit" /> </wb-button-wrapper
      ></template>
    </wb-view-menu>
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

import WbViewMenu from '@web-workbench/core/components/fragments/ViewMenu.vue';
import WbViewMenuContainer from '@web-workbench/core/components/fragments/ViewMenuContainer.vue';

import { CONFIG_NAMES } from '../../types';
import type { Model } from '../../types';
import Color from '@web-workbench/core/classes/Color';
import { getDefaultConfig } from '../../utils';
import theme from '../../theme';
import useCore from '@web-workbench/core/composables/useCore';
import useI18n from '../../composables/useI18n';

const { t } = useI18n();

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

const $props = defineProps<{
  model: Model;
}>();

const { core } = useCore();

interface CurrentModel {
  [CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND]: string;
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]: string;
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]: string;
  [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_COLOR]: string;
  [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE]: boolean;
  [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_OFFSET]: number;
  [CONFIG_NAMES.WEB_PAINT_NATIVE_THEME]: boolean;
  [CONFIG_NAMES.WEB_PAINT_DEBUG]: boolean;
  [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_LINE_WIDTH]: number;
  [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT]: number;
}

const currentModel = ref<CurrentModel>({
  [CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND
  ),
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND
  ),
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND
  ),
  [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_COLOR]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_COLOR
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
  [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_LINE_WIDTH]:
    core.value!.config.get(CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_LINE_WIDTH) || 1,
  [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT]:
    core.value!.config.get(CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT) ||
    10
});
const generalSettings = computed(() => ({
  hideLabel: true,
  items: [
    {
      label: t('window.settings.general.items.native_theme.label'),
      name: CONFIG_NAMES.WEB_PAINT_NATIVE_THEME
    },
    {
      label: t('window.settings.general.items.debug.label'),
      name: CONFIG_NAMES.WEB_PAINT_DEBUG
    }
  ],
  modelValue: currentModel.value,
  'onUpdate:model-value': (value: CurrentModel) => (currentModel.value = value)
}));

const fieldFitZoomActive = computed(() => ({
  label: t('window.settings.fit_zoom.items.active.label'),
  modelValue: currentModel.value[CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE],
  'onUpdate:model-value': (value: boolean) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE_ACTIVE]: value
    };
  }
}));
const fieldFitZoomOffset = computed(() => ({
  label: t('window.settings.fit_zoom.items.offset.label'),
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

const fieldDocumentBackground = computed(() => ({
  label: t('window.settings.document.items.background.label'),
  modelValue: Color.fromHex(
    currentModel.value[CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND]
  ),
  'onUpdate:model-value': (value: Color) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND]: value.toHex()
    };
  }
}));

// #region Display Colors

const fieldDisplayBackground = computed(() => ({
  label: t('window.settings.display.items.background.label'),
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
  label: t('window.settings.display.items.foreground.label'),
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

// #endregion

const fieldPixelGridColor = computed(() => ({
  label: t('window.settings.pixel_grid.items.grid_color.label'),
  modelValue: Color.fromHex(
    currentModel.value[CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_COLOR]
  ),
  'onUpdate:model-value': (value: Color) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_COLOR]: value.toHex()
    };
  }
}));

const fieldPixelGridLineWidth = computed(() => ({
  label: t('window.settings.pixel_grid.items.line_width.label'),
  modelValue:
    currentModel.value[CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_LINE_WIDTH] || 1,
  type: 'number',
  step: 1,
  min: 1,
  required: true,
  'onUpdate:model-value': (value: number) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_LINE_WIDTH]: value
    };
  }
}));

const fieldPixelGridVisibleCount = computed(() => ({
  label: 'Visible Count',
  modelValue:
    currentModel.value[CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT] || 10,
  type: 'number',
  step: 1,
  min: 1,
  required: true,
  'onUpdate:model-value': (value: number) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT]: value
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
  const pixelGrid = {
    color: Color.fromHex(
      currentModel.value[CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_COLOR]
    ),
    lineWidth: currentModel.value[CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_LINE_WIDTH],
    visibleCount:
      currentModel.value[CONFIG_NAMES.WEB_PAINT_PIXEL_GRID_VISIBLE_COUNT]
  };

  const app = $props.model.app;
  app.setDisplayColors(colors);
  app.setDisplayPixelGrid(pixelGrid);

  $props.model.actions.setTheme(theme);

  $emit('close');
};

function onClickReset() {
  currentModel.value = getDefaultConfig();
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-settings {
  display: flex;
  flex-direction: column;
  min-width: 420px;
  height: 240px;

  /* padding: var(--default-element-margin); */

  & .wb-disks-extras13-web-paint-view-menu {
    flex: 1;
  }

  /* & .wb-env-fragment-form {
    display: flex;
    flex-direction: column;
    gap: calc(var(--default-element-margin) * 2);
    padding: calc(var(--default-element-margin) * 2);
  } */
}
</style>
