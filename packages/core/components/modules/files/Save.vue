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

<script lang="ts" setup>
import { markRaw, onMounted, computed, ref } from 'vue';

import WbForm from '../../fragments/Form.vue';
import WbButton from '../../elements/Button.vue';
import WbButtonWrapper from '../../fragments/ButtonWrapper.vue';
import WbFileSelect from '../../modules/files/elements/FileSelect.vue';
import WbFormFieldTextfield from '../../elements/formField/Textfield.vue';

import { pathJoin } from '../../../utils/fileSystem';
import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import useCore from '../../../composables/useCore';
import type Item from '../../../classes/FileSystem/Item';

const { core } = useCore();

if (!core.value?.modules.files) {
  throw new Error('Files module not found');
}

interface Model {
  path: string;
  filename: string;
  file: File | null;
}

const $props = defineProps<{
  fsItem?: ItemContainer;
  id?: string;
  model?: Model;
}>();

const $emit = defineEmits<{
  (e: 'close', value?: string): void;
}>();

const currentModel = ref<Model>({
  path: '',
  filename: '',
  file: null,
  ...$props.model
});

const filesModule =
  core.value?.modules.files && markRaw(core.value?.modules.files);

const labels = {
  cancel: 'Cancel',
  save: 'Save'
};

const fieldPath = computed(() => {
  return {
    hideLabel: true,
    label: 'Path',
    placeholder: 'Path…',
    modelValue: currentModel.value.path
  };
});

const fieldFilename = computed(() => {
  return {
    hideLabel: true,
    label: 'Filename',
    placeholder: 'Filename…',
    modelValue: currentModel.value.filename,
    'onUpdate:model-value': (value: string) => {
      currentModel.value.filename = value;
    }
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

const currentFsItem = ref<Item | ItemContainer>(
  $props.fsItem || markRaw(filesModule.fs.root)
);

const fileSelectFsItem = computed(() => {
  if ($props.fsItem) {
    return $props.fsItem;
  } else if (core.value?.modules.files?.fs.root) {
    return core.value?.modules.files.fs.root;
  }
  return null;
});

const isLocked = computed(() => {
  if (currentFsItem.value) {
    return currentFsItem.value.locked;
  }
  return false;
});

const saveDisabled = computed(() => {
  return !currentModel.value.filename;
});

const onSelect = (fsItem: ItemContainer | Item) => {
  currentFsItem.value = markRaw(fsItem);
  if (fsItem instanceof ItemContainer) {
    currentModel.value.path = fsItem.getPath();
  } else if (fsItem.name) {
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
