<template>
  <wb-form
    class="wb-disks-extras13-web-paint-document-settings"
    @submit="onSubmit">
    <div class="grid">
      <fieldset>
        <legend>General</legend>
        <wb-form-field-textfield label-top v-bind="fieldName" />
      </fieldset>
      <fieldset>
        <legend>Colors</legend>
        <wb-form-field-color v-bind="fieldBackgroundColor" />
      </fieldset>
    </div>
    <wb-button-wrapper :columns="2">
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
import { computed, reactive } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldColor from '../formField/Color.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';

import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';

import { CONFIG_NAMES } from '../../types';
import type { Model } from '../../types';
import Color from '@web-workbench/core/classes/Color';
import useCore from '@web-workbench/core/composables/useCore';

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

const $props = defineProps<{
  model: Model;
}>();

const { core } = useCore();

const currentDocument = computed(() => $props.model.app.currentDocument);
const currentModel = reactive<{
  name: string;
  background: Color;
}>({
  name: currentDocument.value?.name || '',
  background:
    currentDocument.value?.meta.colors.background || new Color(255, 255, 255)
});

const fieldName = computed(() => ({
  label: 'Name',
  modelValue: currentModel.name,
  'onUpdate:model-value': (value: string) => {
    currentModel.name = value;
  }
}));

const fieldBackgroundColor = computed(() => ({
  label: 'Background',
  modelValue: currentModel.background,
  'onUpdate:model-value': (value: Color) => {
    currentModel.background = value;
  }
}));

const onSubmit = () => {
  if (currentDocument.value) {
    currentDocument.value.meta.colors.background = currentModel.background;
  }

  $emit('close');
};

function onClickReset() {
  currentDocument.value!.meta.colors.background =
    core.value?.config.get(CONFIG_NAMES.WEB_PAINT_DOCUMENT_BACKGROUND) ||
    new Color(255, 255, 255);
  currentModel.background = currentDocument.value!.meta.colors.background;
  $emit('close');
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-document-settings {
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
