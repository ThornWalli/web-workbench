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

import ContextMenuItems from '../../../../web-workbench/classes/ContextMenuItems';
import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/cloud/contextMenu';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextbox },
  mixins: [
    MixinWindowComponent
  ],

  props: {
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
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
    },
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
