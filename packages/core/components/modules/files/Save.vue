<template>
  <div class="wb-module-files-save">
    <wb-form @submit="onSubmit">
      <wb-form-field-textbox
        v-bind="fields.path"
        v-model="currentModel.path"
        readonly />
      <wb-file-select
        :file-system="filesModule.fileSystem"
        :fs-item="fileSelectFsItem"
        :model="model"
        name="file"
        @select="onSelect" />
      <wb-form-field-textbox
        v-bind="fields.filename"
        v-model="currentModel.filename" />
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
          type="submit"
          :disabled="isLocked || saveDisabled" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>
import { reactive, markRaw } from 'vue';

import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFileSelect from '../../modules/files/atoms/FileSelect';
import WbFormFieldTextbox from '../../atoms/formField/Textbox';
import { pathJoin } from '../../../utils/fileSystem';
import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbForm,
    WbButton,
    WbButtonWrapper,
    WbFormFieldTextbox,
    WbFileSelect
  },

  props: {
    fsItem: {
      type: Object,
      default() {
        return null;
      }
    },
    id: {
      type: String,
      default() {
        return null;
      }
    },
    model: {
      type: Object,
      default() {
        return reactive({
          path: null,
          filename: null,
          file: null
        });
      }
    }
  },

  emits: ['close'],

  setup() {
    return useWindow();
  },

  data() {
    return {
      currentModel: { ...this.model },

      filesModule: markRaw(this.core.modules.files),
      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      fields: {
        path: {
          label: null,
          placeholder: 'Path…'
        },

        filename: {
          label: null,
          placeholder: 'Filename…'
        }
      },

      currentFsItem: this.fsItem || markRaw(this.core.modules.files.fs.root)
    };
  },

  computed: {
    fileSelectFsItem() {
      return this.fsItem || markRaw(this.core.modules.files.fs.root);
    },
    isLocked() {
      if (this.currentFsItem) {
        return this.currentFsItem.locked;
      }
      return false;
    },
    saveDisabled() {
      return !this.currentModel.filename;
    }
  },

  mounted() {
    if (this.id) {
      this.currentModel.filename = this.id;
    }
  },

  methods: {
    onSelect(fsItem) {
      this.currentFsItem = fsItem;
      if (fsItem instanceof ItemContainer) {
        this.currentModel.path = fsItem.getPath();
      } else {
        this.currentModel.path = fsItem.getBase();
        this.currentModel.filename = fsItem.id;
      }
    },

    onClickCancel() {
      this.$emit('close');
    },
    onSubmit() {
      const path = pathJoin(this.currentModel.path, this.currentModel.filename);
      this.$emit('close', path);
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-files-save {
  width: 380px;

  & :deep(input[disabled] + .label) {
    text-align: center;
  }
}
</style>
