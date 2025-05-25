<template>
  <div class="wb-disks-extras13-web-painting-display-settings">
    <wb-form @submit="onSubmit">
      <fieldset>
        <legend>Foreground / Background</legend>
        <wb-form-field-textfield
          v-bind="fields.background"
          v-model="currentModel.background" />
        <wb-form-field-textfield
          v-bind="fields.foreground"
          v-model="currentModel.foreground" />
      </fieldset>
      <wb-button-wrapper align="outer" full>
        <wb-button
          v-if="cancelLabel"
          style-type="secondary"
          :label="cancelLabel"
          @click="onClickCancel" />
        <wb-button
          v-if="saveLabel"
          style-type="primary"
          :label="saveLabel"
          type="submit" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';

import { ref } from 'vue';

interface DisplaySettings {
  background: string;
  foreground: string;
}

const $props = defineProps<{
  model: DisplaySettings;
}>();

const $emit = defineEmits<{
  (e: 'close', model?: DisplaySettings): void;
}>();

const currentModel = ref({ ...$props.model });
const cancelLabel = ref('Cancel');
const saveLabel = ref('Save');
const fields = ref({
  background: {
    label: 'Background',
    placeholder: '#000…',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
  },
  foreground: {
    label: 'Foreground',
    placeholder: '#FFF',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
  }
});
const onClickCancel = () => {
  $emit('close');
};
const onSubmit = () => {
  $emit('close', currentModel.value);
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-display-settings {
  min-width: 360px;
  padding: var(--default-element-margin);

  & fieldset {
    /* width: 100%; */

    margin: var(--default-element-margin);
  }
}
</style>
