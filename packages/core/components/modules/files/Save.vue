<template>
  <div class="wb-module-files-save">
    <wb-form @submit="onSubmit">
      <wb-form-field-textbox v-bind="fields.path" :model="model" readonly />
      <wb-file-select
        :file-system="filesModule.fileSystem"
        :fs-item="fileSelectFsItem"
        :model="model"
        name="file"
        @select="onSelect" />
      <wb-form-field-textbox v-bind="fields.filename" :model="model" />
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

import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';
import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFileSelect from '../../modules/files/atoms/FileSelect';
import WbFormFieldTextbox from '../../atoms/formField/Textbox';
import { pathJoin } from '../../../utils/fileSystem';
import ItemContainer from '../../../classes/FileSystem/ItemContainer';

export default {
  components: {
    WbForm,
    WbButton,
    WbButtonWrapper,
    WbFormFieldTextbox,
    WbFileSelect
  },

  props: {
    ...windowProps,
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

  emits: [...windowEmits, 'close'],

  setup(props, context) {
    return useWindow(props, context);
  },

  data() {
    return {
      filesModule: markRaw(this.core.modules.files),
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
      return !this.model.filename;
    }
  },

  mounted() {
    if (this.id) {
      this.model.filename = this.id;
    }
  },

  methods: {
    onSelect(fsItem) {
      this.currentFsItem = fsItem;
      if (fsItem instanceof ItemContainer) {
        this.model.path = fsItem.getPath();
      } else {
        this.model.path = fsItem.getBase();
        this.model.filename = fsItem.id;
      }
    },

    onClickCancel() {
      this.$emit('close');
    },
    onSubmit(e) {
      const path = pathJoin(this.model.path, this.model.filename);
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
