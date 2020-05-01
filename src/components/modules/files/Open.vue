<template>
  <div class="wb-module-files-open">
    <wb-form @submit="onSubmit">
      <wb-form-field-textbox v-bind="fields.path" :model="model" readonly />
      <wb-file-select
        v-bind="fields.fileSelect"
        :file-system="filesModule.fileSystem"
        :fs-item="fileSelectFsItem"
        :model="model"
        @select="onSelect"
      />
      <wb-button-wrapper align="outer" full>
        <wb-button
          v-if="cancelLabel"
          style-type="secondary"
          :label="cancelLabel"
          @click="onClickCancel"
        />
        <wb-button
          v-if="openLabel"
          style-type="primary"
          :label="openLabel"
          type="submit"
          :disabled="isItemContainer"
        />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>

import ItemContainer from '@/web-workbench/classes/FileSystem/ItemContainer';
import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import WbFileSelect from '@/components/modules/files/atoms/FileSelect';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';

import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextbox, WbFileSelect },
  mixins: [
    MixinWindowComponent
  ],

  props: {
    core: {
      type: Object,
      default () {
        return null;
      }
    },
    fsItem: {
      type: Object,
      default () {
        return null;
      }
    },
    model: {
      type: Object,
      default () {
        return {
          path: null
        };
      }
    }
  },

  data () {
    return {
      filesModule: this.core.modules.files,
      cancelLabel: 'Cancel',
      openLabel: 'Open',

      fields: {
        path: {
          name: 'path',
          label: null,
          placeholder: 'Path…'
        },

        fileSelect: {
          name: 'path'
        },

        filename: {
          name: 'filename',
          label: null,
          placeholder: 'Filename…'
        }
      },

      currentFsItem: this.fsItem || this.core.modules.files.fs.root

    };
  },

  computed: {
    isItemContainer () {
      return this.currentFsItem instanceof ItemContainer;
    },
    fileSelectFsItem () {
      return this.fsItem || this.core.modules.files.fs.root;
    }
  },

  methods: {

    onSelect (fsItem) {
      this.currentFsItem = fsItem;
      if ((fsItem instanceof ItemContainer)) {
        this.model.path = fsItem.getPath();
      }
    },

    onClickCancel () {
      this.$emit('close');
    },
    onSubmit (e) {
      this.$emit('close', this.model.path);
    }
  }
};
</script>

<style lang="postcss">
.wb-module-files-open {
  width: 380px;

  & input[disabled] + .field__label {
    text-align: center;
  }
}
</style>
