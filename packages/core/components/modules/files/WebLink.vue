<template>
  <div class="wb-module-files-web-link">
    <wb-form @submit="onSubmit">
      <wb-form-field-textfield v-bind="fieldName" v-model="currentModel.name" />
      <wb-form-field-textfield
        v-bind="fieldUrl"
        v-model="currentModel.url"
        type="url" />
      <wb-form-field-dropdown
        v-bind="fieldSymbol"
        v-model="currentModel.symbol" />
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
import { capitalCase } from 'change-case';

import { SYMBOL } from '../../../utils/symbols';
import WbForm from '../../molecules/Form.vue';
import WbButton from '../../atoms/Button.vue';
import WbButtonWrapper from '../../molecules/ButtonWrapper.vue';
import WbFormFieldTextfield from '../../atoms/formField/Textfield.vue';
import WbFormFieldDropdown from '../../atoms/formField/Dropdown.vue';

import type { SaveFileMetaOptions } from '../../../classes/modules/Files/contextMenu';
import { computed, ref } from 'vue';
import type Item from '../../../classes/FileSystem/Item';

export interface Model extends SaveFileMetaOptions {
  actions: {
    save: (
      options: {
        name: string;
        url: string;
        symbol: SYMBOL;
      } & SaveFileMetaOptions,
      fsItem?: Item
    ) => Promise<Item>;
  };
  name: string;
  url: string;
  symbol: SYMBOL;
}

const $props = defineProps<{
  fsItem?: Item;
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

const fieldUrl = computed(() => {
  return {
    disabled: locked.value,
    placeholder: 'http://…',
    label: 'Url'
  };
});

const fieldSymbol = computed(() => {
  return {
    disabled: locked.value,
    label: 'Symbol',
    options: Object.keys(SYMBOL).map((symbol: string) => {
      return {
        title: capitalCase(symbol),
        value: SYMBOL[symbol as keyof typeof SYMBOL]
      };
    })
  };
});

const disabledSave = computed(() => {
  return (
    !currentModel.value.name ||
    !currentModel.value.url ||
    !currentModel.value.symbol
  );
});

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
.wb-module-files-web-link {
  width: 380px;
}
</style>
