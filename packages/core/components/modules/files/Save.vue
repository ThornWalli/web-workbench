<template>
  <div class="wb-module-files-save">
    <wb-form @submit="onSubmit">
      <wb-form-field-textfield v-bind="fieldPath" readonly />
      <wb-file-select
        v-bind="fieldFileSelect"
        :file-system="filesModule.fileSystem"
        :fs-item="fileSelectFsItem" />
      <wb-form-field-textfield v-bind="fieldFilename" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="secondary"
          :label="labels.cancel"
          @click="onClickCancel" />
        <wb-button
          style-type="primary"
          :label="labels.save"
          type="submit"
          :disabled="isLocked || saveDisabled" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script setup>
import { reactive, markRaw, onMounted, computed, ref } from 'vue';

import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFileSelect from '../../modules/files/atoms/FileSelect';
import WbFormFieldTextfield from '../../atoms/formField/Textfield';
import { pathJoin } from '../../../utils/fileSystem';
import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import useWindow from '@web-workbench/core/composables/useWindow';

const $props = defineProps({
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
});

const $emit = defineEmits(['close']);

const { core } = useWindow();

const currentModel = ref({
  ...$props.model
});

const filesModule = markRaw(core.value.modules.files);

const labels = {
  cancel: 'Cancel',
  save: 'Save'
};

const fieldPath = computed(() => {
  return {
    label: null,
    placeholder: 'Path…',
    modelValue: currentModel.value.path
  };
});

const fieldFilename = computed(() => {
  return {
    label: null,
    placeholder: 'Filename…',
    modelValue: currentModel.value.filename,
    'onUpdate:model-value': value => {
      currentModel.value.filename = value;
    }
  };
});

const fieldFileSelect = computed(() => {
  return {
    name: 'path',
    modelValue: currentModel.value.path,
    'onUpdate:model-value': value => {
      currentModel.value.path = value;
    },
    onSelect
  };
});

const currentFsItem = ref($props.fsItem || markRaw(filesModule.fs.root));

const fileSelectFsItem = computed(
  () => $props.fsItem || markRaw(filesModule.fs.root)
);

const isLocked = computed(() => {
  if (currentFsItem.value) {
    return currentFsItem.value.locked;
  }
  return false;
});

const saveDisabled = computed(() => {
  return !currentModel.value.filename;
});

/**
 *
 * @param fsItem {import('../../../classes/FileSystem/Item').default}
 */
const onSelect = fsItem => {
  currentFsItem.value = markRaw(fsItem);
  if (fsItem instanceof ItemContainer) {
    currentModel.value.path = fsItem.getPath();
  } else {
    currentModel.value.filename = fsItem.name;
  }
};

onMounted(() => {
  if ($props.id) {
    currentModel.value.filename = $props.id;
  }
});

const onClickCancel = () => {
  $emit('close');
};

const onSubmit = () => {
  const path = pathJoin(currentModel.value.path, currentModel.value.filename);
  $emit('close', path);
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
