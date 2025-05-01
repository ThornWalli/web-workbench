<template>
  <div class="wb-module-files-open">
    <wb-form @submit="onSubmit">
      <wb-form-field-textfield v-bind="fieldPath" readonly />
      <wb-file-select
        v-if="core?.modules.files?.fileSystem"
        v-bind="fieldFileSelect"
        :file-system="core?.modules.files.fileSystem"
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

<script lang="ts" setup>
import { computed, markRaw, ref } from 'vue';

import WbForm from '../../molecules/Form.vue';
import WbButton from '../../atoms/Button.vue';
import WbButtonWrapper from '../../molecules/ButtonWrapper.vue';
import WbFileSelect from '../../modules/files/atoms/FileSelect.vue';
import WbFormFieldTextfield from '../../atoms/formField/Textfield.vue';

import type FsItemContainer from '../../../classes/FileSystem/ItemContainer';
import useWindow from '../../../composables/useWindow';
import useCore from '../../../composables/useCore';
import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import type Item from '../../../classes/FileSystem/Item';

const { core } = useCore();

if (!core.value?.modules.files) {
  throw new Error('Files module not found');
}

useWindow();

export interface Model {
  path?: string;
}

const $props = defineProps<{
  fsItem: FsItemContainer;
  model: Model;
}>();

const $emit = defineEmits<{
  (e: 'close', value?: string): void;
}>();

const currentModel = ref({
  ...$props.model,
  path: $props.model?.path || $props.fsItem.getPath()
});

const labels = {
  cancel: 'Cancel',
  open: 'Open'
};

const fieldPath = computed(() => {
  return {
    label: null,
    placeholder: 'Path…',
    modelValue: currentModel.value.path
  };
});

const fieldFileSelect = computed(() => {
  return {
    name: 'path',
    modelValue: currentModel.value.path,
    'onUpdate:model-value': (value: string) => {
      currentModel.value.path = value;
    },
    onSelect
  };
});

const currentFsItem = ref<ItemContainer | Item>(
  $props.fsItem || core.value?.modules.files?.fs.root
);

const isItemContainer = computed(
  () => currentFsItem.value instanceof ItemContainer
);

const fileSelectFsItem = computed(() => {
  if ($props.fsItem) {
    return $props.fsItem;
  } else if (core.value?.modules.files?.fs.root) {
    return core.value?.modules.files.fs.root;
  }
  return null;
});

const onSelect = (fsItem: ItemContainer | Item) => {
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
