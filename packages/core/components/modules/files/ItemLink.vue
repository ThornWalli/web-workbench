<template>
  <div class="wb-module-files-item-link">
    <wb-form @submit="onSubmit">
      <wb-form-field-textfield v-bind="fieldName" v-model="currentModel.name" />
      <div class="file">
        <wb-form-field-textfield
          v-bind="fieldPath"
          v-model="currentModel.path" />
        <wb-button
          style-type="secondary"
          label="..."
          @click="onClickFileSelect" />
      </div>
      <wb-form-field-dropdown-symbol
        v-bind="fieldSymbol"
        v-model="currentModel.symbol"
        :core="core" />
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
          :disabled="disabledSave" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import type { SYMBOL } from '../../../utils/symbols';
import WbForm from '../../fragments/Form.vue';
import WbButton from '../../elements/Button.vue';
import WbButtonWrapper from '../../fragments/ButtonWrapper.vue';
import WbFormFieldTextfield from '../../elements/formField/Textfield.vue';
import WbFormFieldDropdownSymbol from '../../elements/formField/dropDown/Symbol.vue';

import type { SaveFileMetaOptions } from '../../../modules/Files/contextMenu';
import { computed, ref } from 'vue';
import type FsItem from '../../../classes/FileSystem/Item';
import useWindow from '@web-workbench/core/composables/useWindow';

const { core } = useWindow();

export interface Model extends SaveFileMetaOptions {
  actions: {
    save: (
      options: {
        name: string;
        path: string;
        symbol: SYMBOL;
      } & SaveFileMetaOptions,
      fsItem?: FsItem
    ) => Promise<FsItem>;
    selectItem: () => Promise<{ fsItem: FsItem }>;
  };
  name: string;
  path: string;
  symbol: SYMBOL;
}

const selectedFsItem = ref<FsItem>();

const $props = defineProps<{
  fsItem?: FsItem;
  model: Model;
}>();

const $emit = defineEmits<{
  (e: 'close', value?: string): void;
}>();

const locked = ref(($props.fsItem || {}).locked);
const currentModel = ref<Model>({
  ...$props.model
});

const cancelLabel = 'Cancel';
const saveLabel = 'Save';

const fieldName = computed(() => {
  return {
    disabled: locked.value,
    placeholder: 'Name',
    label: 'Name'
  };
});

const fieldPath = computed(() => {
  return {
    disabled: locked.value,
    placeholder: 'RAM:…',
    label: 'Path'
  };
});

const fieldSymbol = computed(() => {
  return {
    disabled: locked.value,
    label: 'Symbol'
  };
});

const disabledSave = computed(() => {
  return (
    !currentModel.value.name ||
    !currentModel.value.path ||
    !currentModel.value.symbol
  );
});

async function onClickFileSelect() {
  const { fsItem } = await $props.model.actions.selectItem();
  selectedFsItem.value = fsItem;
  currentModel.value.path = selectedFsItem.value.getPath();
}

function onClickCancel() {
  $emit('close');
}
async function onSubmit() {
  if (await $props.model.actions.save(currentModel.value, $props.fsItem)) {
    $emit('close');
  }
}
</script>

<style lang="postcss" scoped>
.wb-module-files-item-link {
  width: 380px;

  & .file {
    display: flex;
    align-items: center;
    padding-right: var(--default-element-margin);

    & .wb-env-element-form-field {
      flex: 1;
    }

    & .wb-env-element-button {
      width: 40px;
    }
  }

  & .file-select {
    display: flex;
    gap: 10px;
    align-items: center;

    & .wb-env-element-button {
      width: 80px;
    }
  }
}
</style>
