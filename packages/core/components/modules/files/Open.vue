<template>
  <div class="wb-module-files-open">
    <wb-form @submit="onSubmit">
      <wb-form-field-textfield v-bind="fieldPath" readonly />
      <wb-file-select
        v-bind="fieldFileSelect"
        :file-system="filesModule.fileSystem"
        :fs-item="fileSelectFsItem" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="secondary"
          :label="labels.cancel"
          @click="onClickCancel" />
        <wb-button
          style-type="primary"
          :label="labels.open"
          type="submit"
          :disabled="isItemContainer" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script setup>
import { computed, markRaw, reactive, ref } from 'vue';

import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFileSelect from '../../modules/files/atoms/FileSelect';
import WbFormFieldTextfield from '../../atoms/formField/Textfield';

import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import useWindow from '@web-workbench/core/composables/useWindow';

const $props = defineProps({
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
});

const $emit = defineEmits(['close']);

const { core } = useWindow();

const currentModel = ref({
  ...$props.model,
  path: $props.model.path || $props.fsItem.getPath()
});

const filesModule = markRaw(core.value.modules.files);

const labels = {
  cancel: 'Cancel',
  open: 'Open'
};

const fieldPath = computed(() => {
  return {
    label: null,
    placeholder: 'Path…',
    modelValue: currentModel.value.pathcurrentModel.path
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

const isItemContainer = computed(
  () => currentFsItem.value instanceof ItemContainer
);

const fileSelectFsItem = computed(
  () => $props.fsItem || markRaw(filesModule.fs.root)
);

const onSelect = fsItem => {
  currentFsItem.value = markRaw(fsItem);
  if (fsItem instanceof ItemContainer) {
    currentModel.value.path = fsItem.getPath();
  }
};

const onClickCancel = () => {
  $emit('close');
};

const onSubmit = () => {
  $emit('close', currentModel.value.path);
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
