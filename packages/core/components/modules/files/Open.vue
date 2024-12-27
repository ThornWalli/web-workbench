<template>
  <div class="wb-module-files-open">
    <wb-form @submit="onSubmit">
      <wb-form-field-textfield
        v-bind="fields.path"
        v-model="currentModel.path"
        readonly />
      <wb-file-select
        v-bind="fields.fileSelect"
        :file-system="filesModule.fileSystem"
        :fs-item="fileSelectFsItem"
        :model="currentModel"
        @select="onSelect" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          v-if="cancelLabel"
          style-type="secondary"
          :label="cancelLabel"
          @click="onClickCancel" />
        <wb-button
          v-if="openLabel"
          style-type="primary"
          :label="openLabel"
          type="submit"
          :disabled="isItemContainer" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>
import { markRaw, reactive } from 'vue';

import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFileSelect from '../../modules/files/atoms/FileSelect';
import WbFormFieldTextfield from '../../atoms/formField/Textfield';

import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbForm,
    WbButton,
    WbButtonWrapper,
    WbFormFieldTextfield,
    WbFileSelect
  },

  props: {
    fsItem: {
      type: Object,
      default() {
        return null;
      }
    },

    model: {
      type: Object,
      default() {
        return reactive({
          path: null
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
      currentModel: {
        ...this.model,
        path: this.model.path || this.fsItem.getPath()
      },

      filesModule: markRaw(this.core.modules.files),
      cancelLabel: 'Cancel',
      openLabel: 'Open',

      fields: {
        path: {
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

      currentFsItem: this.fsItem || markRaw(this.core.modules.files.fs.root)
    };
  },

  computed: {
    isItemContainer() {
      return this.currentFsItem instanceof ItemContainer;
    },
    fileSelectFsItem() {
      return this.fsItem || markRaw(this.core.modules.files.fs.root);
    }
  },

  methods: {
    onSelect(fsItem) {
      this.currentFsItem = markRaw(fsItem);
      if (fsItem instanceof ItemContainer) {
        this.currentModel.path = fsItem.getPath();
      }
    },

    onClickCancel() {
      this.$emit('close');
    },
    onSubmit() {
      this.$emit('close', this.currentModel.path);
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-files-open {
  width: 380px;

  & :deep(input[disabled] + .label) {
    text-align: center;
  }
}
</style>
