<template>
  <div class="wb-module-files-cloud-connect">
    <wb-form @submit="onSubmit">
      <wb-form-field-textbox v-bind="fields.id" :model="model" />
      <wb-form-field-textbox v-bind="fields.apiKey" :model="model" />
      <wb-form-field-textbox v-bind="fields.url" :model="model" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="primary"
          :label="applyLabel"
          type="submit"
          :disabled="disabledConnect"
        />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>

import { toRef } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbButton from '@web-workbench/core/components/atoms/Button';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper';
import WbFormFieldTextbox from '@web-workbench/core/components/atoms/formField/Textbox';

import useWindow, { windowProps, windowEmits } from '@web-workbench/core/composables/useWindow';
import contextMenu from '../../cloud/contextMenu';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextbox },

  props: {
    ...windowProps,
    model: {
      type: Object,
      default () {
        return {
          id: null,
          apiKey: null,
          url: null
        };
      }
    }
  },
  emits: [
    ...windowEmits, 'close'
  ],

  setup (props, context) {
    const model = toRef(props, 'model');

    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

  data () {
    return {

      cancelLabel: 'Cancel',
      applyLabel: 'Connect',

      fields: {
        id: {
          label: 'ID',
          name: 'id',
          placeholder: 'ID…'
        },
        apiKey: {
          label: 'Api Key',
          name: 'apiKey',
          placeholder: 'Api Key…'
        },
        url: {
          label: 'Url',
          name: 'url',
          placeholder: 'https://…'
        }
      }

    };
  },

  computed: {
    disabledConnect () {
      return !this.model.id || !this.model.apiKey || !this.model.url;
    }
  },

  methods: {
    onClickCancel () {
      this.$emit('close');
    },
    onSubmit () {
      if (!this.disabledConnect) {
        this.$emit('close', this.model);
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-files-cloud-connect {
  width: 380px;
}
</style>
