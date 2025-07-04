<template>
  <wb-form class="wb-disks-extras13-web-paint-settings" @submit="onSubmit">
    <fieldset>
      <legend>General</legend>
      <wb-form-field-checkbox-group
        v-if="generalSettings.items.length > 0"
        label-top
        v-bind="generalSettings" />
    </fieldset>
    <fieldset>
      <legend>Display Defaults</legend>
      <wb-form-field-color v-bind="fieldDisplayBackground" />
      <wb-form-field-color v-bind="fieldDisplayForeground" />
      <wb-form-field-color v-bind="fieldDisplayGridColor" />
    </fieldset>
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
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_GRID_COLOR]: string;
  [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE]: boolean;
  [CONFIG_NAMES.WEB_PAINT_NATIVE_THEME]: boolean;
  [CONFIG_NAMES.WEB_PAINT_DEBUG]: boolean;
}

const currentModel = ref<CurrentModel>({
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DISPLAY_BACKGROUND
  ),
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DISPLAY_FOREGROUND
  ),
  [CONFIG_NAMES.WEB_PAINT_DISPLAY_GRID_COLOR]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DISPLAY_GRID_COLOR
  ),
  [CONFIG_NAMES.WEB_PAINT_FIT_IMAGE]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_FIT_IMAGE
  ),
  [CONFIG_NAMES.WEB_PAINT_NATIVE_THEME]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_NATIVE_THEME
  ),
  [CONFIG_NAMES.WEB_PAINT_DEBUG]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINT_DEBUG
  )
});
const generalSettings = computed(() => ({
  hideLabel: true,
  items: [
    {
      label: 'Fit Image',
      name: CONFIG_NAMES.WEB_PAINT_FIT_IMAGE
    },
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
const fieldDisplayGridColor = computed(() => ({
  label: 'GridColor',
  modelValue: Color.fromHex(
    currentModel.value[CONFIG_NAMES.WEB_PAINT_DISPLAY_GRID_COLOR]
  ),
  'onUpdate:model-value': (value: Color) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINT_DISPLAY_GRID_COLOR]: value.toHex()
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
    ),
    grid: Color.fromHex(
      currentModel.value[CONFIG_NAMES.WEB_PAINT_DISPLAY_GRID_COLOR]
    )
  };

  const app = $props.model.app;
  app.setDisplayColors(colors);

  $props.model.actions.setTheme(theme);

  $emit('close');
};

function onClickReset() {
  currentModel.value = getDefaultConfig();
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-settings {
  min-width: 240px;
  padding: var(--default-element-margin);

  & fieldset {
    margin-bottom: calc(var(--default-element-margin) * 2);
  }

  & .wb-env-fragment-form {
    display: flex;
    flex-direction: column;
    gap: calc(var(--default-element-margin) * 2);
    padding: calc(var(--default-element-margin) * 2);
  }
}
</style>
