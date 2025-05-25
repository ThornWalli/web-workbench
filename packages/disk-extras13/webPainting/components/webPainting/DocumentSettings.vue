<template>
  <div class="wb-disks-extras13-web-painting-document-settings">
    <!-- <pre
      style="position: fixed;top: 0;
    left: 0"
    >{{ fields }}{{ model.size[fields.width.name] }}</pre> -->
    <wb-form class="form" @submit="onSubmit">
      <div class="col-2">
        <fieldset>
          <legend>Dimension</legend>
          <wb-form-field-textfield
            v-bind="fields.width"
            v-model="currentModel.size.width"
            type="number"
            class="form-size" />
          <wb-form-field-textfield
            v-bind="fields.height"
            v-model="currentModel.size.height"
            type="number"
            class="form-size" />
        </fieldset>
      </div>
      <div class="col-2">
        <fieldset>
          <legend>Palette</legend>
          <wb-form-field-textfield
            v-bind="fields.paletteSteps.red"
            v-model="currentModel.paletteSteps.red"
            type="number"
            :min="1"
            :max="30" />
          <wb-form-field-textfield
            v-bind="fields.paletteSteps.green"
            v-model="currentModel.paletteSteps.green"
            type="number"
            :min="1"
            :max="30" />
          <wb-form-field-textfield
            v-bind="fields.paletteSteps.blue"
            v-model="currentModel.paletteSteps.blue"
            type="number"
            :min="1"
            :max="30" />
        </fieldset>
      </div>
      <wb-button-wrapper align="outer" full class="col-1">
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

import type Color from '../../lib/Color';
import { ref } from 'vue';

interface DocumentSettings {
  paletteSteps: Color;
  size: {
    width: number;
    height: number;
  };
}
const $props = defineProps<{
  model: DocumentSettings;
}>();

const $emit = defineEmits<{
  (e: 'close', model?: DocumentSettings): void;
}>();
const currentModel = ref({ ...$props.model });
const cancelLabel = ref('Cancel');
const saveLabel = ref('Save');

const fields = ref({
  width: {
    label: 'Width',
    placeholder: 'Width'
  },
  height: {
    label: 'Height',
    placeholder: 'Height'
  },

  paletteSteps: {
    red: {
      label: 'Red',
      placeholder: '0...32'
    },
    green: {
      label: 'Green',
      placeholder: '0...32'
    },
    blue: {
      label: 'Blue',
      placeholder: '0...32'
    }
  },

  displayForeground: {
    label: 'Foreground',
    placeholder: '#FFF'
  },
  displayBackground: {
    label: 'Background',
    placeholder: '#000…'
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
.wb-disks-extras13-web-painting-document-settings {
  min-width: 480px;
  padding: var(--default-element-margin);

  & .form {
    display: flex;
    flex-flow: row nowrap;
  }

  & .col-1 {
    width: 100%;
  }

  & .col-2 {
    width: 50%;
  }

  & fieldset {
    /* width: 100%; */

    margin: var(--default-element-margin);
  }

  & .form-size {
    &::after {
      align-self: center;
      padding-left: var(--default-element-margin);
      content: 'px';
    }
  }
}
</style>
