<template>
  <div class="wb-module-files-save">
    <wb-form @submit="onSubmit">
      <wb-form-field-textbox v-bind="fields.path" :model="model" readonly />
      <wb-file-select
        :file-system="filesModule.fileSystem"
        :fs-item="fileSelectFsItem"
        :model="model"
        name="file"
        @select="onSelect"
      />
      <wb-form-field-textbox
        v-bind="fields.filename"
        :model="model"
      />
      <wb-button-wrapper align="outer" full>
        <wb-button
          v-if="cancelLabel"
          style-type="secondary"
          :label="cancelLabel"
          @click="onClickCancel"
        />
        <wb-button
          v-if="saveLabel"
          style-type="primary"
          :label="saveLabel"
          type="submit"
          :disabled="isLocked || saveDisabled"
        />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>

import ItemContainer from '@/web-workbench/classes/FileSystem/ItemContainer';
import { pathJoin } from '@/web-workbench/utils/fileSystem';
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
    id: {
      type: String,
      default () {
        return null;
      }
    },
    model: {
      type: Object,
      default () {
        return {
          path: null,
          filename: null,
          file: null
        };
      }
    }
  },

  data () {
    return {
      filesModule: this.core.modules.files,
      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      fields: {
        path: {
          name: 'path',
          label: null,
          placeholder: 'Path…'
        },

        filesSelect: {
          title: null,
          name: 'item'
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
    fileSelectFsItem () {
      return this.fsItem || this.core.modules.files.fs.root;
    },
    isLocked () {
      if (this.currentFsItem) {
        return this.currentFsItem.locked;
      }
      return false;
    },
    saveDisabled () {
      return !this.model.filename;
    }
  },

  mounted () {
    if (this.id) {
      this.model.filename = this.id;
    }
  },

  methods: {

    onSelect (fsItem) {
      this.currentFsItem = fsItem;
      if (fsItem instanceof ItemContainer) {
        this.model.path = fsItem.getPath();
      } else {
        this.model.path = fsItem.getBase();
        this.model.filename = fsItem.id;
      }
    },

    onClickCancel () {
      this.$emit('close');
    },
    onSubmit (e) {
      const path = pathJoin(this.model.path, this.model.filename);
      this.$emit('close', path);
    }
  }
};
</script>

<style lang="postcss">
.wb-module-files-save {
  width: 380px;

  & input[disabled] + .field__label {
    text-align: center;
  }
}
</style>
