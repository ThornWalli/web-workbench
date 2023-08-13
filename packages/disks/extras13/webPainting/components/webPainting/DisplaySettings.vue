<template>
  <div class="wb-disks-extras13-web-painting-display-settings">
    <wb-form @submit="onSubmit">
      <fieldset>
        <legend>Foreground / Background</legend>
        <wb-form-field-textbox v-bind="fields.background" :model="model" />
        <wb-form-field-textbox v-bind="fields.foreground" :model="model" />
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
import WbFormFieldTextbox from '@web-workbench/core/components/atoms/formField/Textbox';

import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextbox },

  props: {
    ...windowProps,
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
  emits: [...windowEmits, 'close'],

  setup(props, context) {
    return useWindow(props, context);
  },

  data() {
    const hexPattern = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
    return {
      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      fields: {
        background: {
          label: 'Background',
          name: 'background',
          placeholder: '#000…',
          pattern: hexPattern
        },
        foreground: {
          label: 'Foreground',
          name: 'foreground',
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
      this.$emit('close', this.model);
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
