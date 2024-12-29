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

<script>
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbButton from '@web-workbench/core/components/atoms/Button';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper';
import WbFormFieldTextfield from '@web-workbench/core/components/atoms/formField/Textfield';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextfield },

  props: {
    model: {
      type: Object,
      default() {
        return {
          background: '#000000',
          foreground: '#ffffff'
        };
      }
    }
  },
  emits: ['close'],

  setup() {
    return useWindow();
  },

  data() {
    const hexPattern = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
    return {
      currentModel: { ...this.model },

      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      fields: {
        background: {
          label: 'Background',
          placeholder: '#000…',
          pattern: hexPattern
        },
        foreground: {
          label: 'Foreground',
          placeholder: '#FFF',
          pattern: hexPattern
        }
      }
    };
  },
  methods: {
    onClickCancel() {
      this.$emit('close');
    },
    onSubmit() {
      this.$emit('close', this.currentModel);
    }
  }
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
