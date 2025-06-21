<template>
  <div class="wb-disks-extras13-web-painting-settings">
    <wb-form>
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
      <pre>{{ currentModel }}</pre>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import useCore from '@web-workbench/core/composables/useCore';
import useWindow from '@web-workbench/core/composables/useWindow';

import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldCheckboxGroup from '@web-workbench/core/components/elements/formField/CheckboxGroup.vue';
import WbFormFieldColor from '../formField/Color.vue';

import contextMenu from '../../contextMenu';
import { CONFIG_NAMES, type Model } from '../../types';

const { core } = useCore();
const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

interface CurrentModel {
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: string;
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND]: string;
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_GRID_COLOR]: string;
  [CONFIG_NAMES.WEB_PAINTING_FIT_IMAGE]: boolean;
}

const currentModel = ref<CurrentModel>({
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND
  ),
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND
  ),
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_GRID_COLOR]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINTING_DISPLAY_GRID_COLOR
  ),
  [CONFIG_NAMES.WEB_PAINTING_FIT_IMAGE]: core.value!.config.get(
    CONFIG_NAMES.WEB_PAINTING_FIT_IMAGE
  )
});
const generalSettings = computed(() => ({
  hideLabel: true,
  items: [
    {
      label: 'Fit Image',
      name: CONFIG_NAMES.WEB_PAINTING_FIT_IMAGE
    }
  ],
  modelValue: currentModel.value,
  'onUpdate:model-value': (value: CurrentModel) => (currentModel.value = value)
}));

const fieldDisplayBackground = computed(() => ({
  label: 'Background',
  modelValue: currentModel.value[CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND],
  'onUpdate:model-value': (value: string) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: value
    };
  }
}));
const fieldDisplayForeground = computed(() => ({
  label: 'Foreground',
  modelValue: currentModel.value[CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND],
  'onUpdate:model-value': (value: string) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: value
    };
  }
}));
const fieldDisplayGridColor = computed(() => ({
  label: 'GridColor',
  modelValue: currentModel.value[CONFIG_NAMES.WEB_PAINTING_DISPLAY_GRID_COLOR],
  'onUpdate:model-value': (value: string) => {
    currentModel.value = {
      ...currentModel.value,
      [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: value
    };
  }
}));
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-settings {
  min-width: 240px;

  & .wb-env-fragment-form {
    display: flex;
    flex-direction: column;
    gap: calc(var(--default-element-margin) * 2);
    padding: calc(var(--default-element-margin) * 2);
  }
}
</style>
