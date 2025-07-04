<template>
  <div class="wb-module-files-edit">
    <wb-form class="form" @submit="onSubmit">
      <div>
        <wb-form-field-textfield v-bind="fieldId" />
        <wb-form-field-textfield v-bind="fieldName" />
        <wb-form-field-dropdown-symbol
          v-bind="fieldSymbol"
          v-model="currentModel.symbol"
          :core="core" />
        <div class="cols">
          <div class="col-2">
            <wb-form-field-checkbox-group label-top v-bind="fieldCheckboxes" />
          </div>
          <div class="col-2">
            <wb-form-field-checkbox-group
              label-top
              v-bind="fieldWindowSettings" />
          </div>
        </div>
      </div>
      <wb-button-wrapper align="outer" full>
        <wb-button
          label="Item Meta"
          style-type="secondary"
          @click="onClickItemMeta" />
        <wb-button
          label="Cancel"
          style-type="secondary"
          @click="onClickCancel" />
        <wb-button label="Save" style-type="primary" type="submit" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import WbForm from '../../fragments/Form.vue';
import WbButton from '../../elements/Button.vue';
import WbButtonWrapper from '../../fragments/ButtonWrapper.vue';
import WbFormFieldTextfield from '../../elements/formField/Textfield.vue';
import WbFormFieldDropdownSymbol from '../../elements/formField/dropDown/Symbol.vue';
import WbFormFieldCheckboxGroup from '../../elements/formField/CheckboxGroup.vue';

import type FsItem from '../../../classes/FileSystem/Item';
import { ITEM_META } from '../../../classes/FileSystem/types';
import useWindow from '../../../composables/useWindow';
import type { EditModel } from '../../../modules/Files/types';

const { core } = useWindow();

const $props = defineProps<{
  fsItem: FsItem;
  model: EditModel;
}>();

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentModel = ref<EditModel>({ ...$props.model });

const fieldCheckboxes = computed(() => {
  return {
    disabled: $props.fsItem.locked,
    label: 'Others',
    items: [
      {
        label: 'Symbol Visible',
        name: ITEM_META.VISIBLE
      },
      {
        label: 'Ignore Symbol Rearrange ',
        name: ITEM_META.IGNORE_SYMBOL_REARRANGE
      }
    ],
    modelValue: currentModel.value,
    'onUpdate:modelValue': (model: EditModel) => {
      currentModel.value = model;
    }
  };
});

const fieldWindowSettings = computed(() => {
  return {
    disabled: $props.fsItem.locked,
    label: 'Window Settings',
    name: '',
    items: [
      {
        label: 'Has Scale ?',
        name: ITEM_META.WINDOW_SCALE
      },
      {
        label: 'Has Scroll-X ?',
        name: ITEM_META.WINDOW_SCROLL_X
      },
      {
        label: 'Has Scroll-Y ?',
        name: ITEM_META.WINDOW_SCROLL_Y
      },
      {
        label: 'Is Full-Size ?',
        name: ITEM_META.WINDOW_FULL_SIZE
      },
      {
        label: 'Sort Symbols (Directory)',
        name: ITEM_META.WINDOW_SYMBOL_REARRANGE
      },
      {
        label: 'Has Sidebar?',
        name: ITEM_META.WINDOW_SIDEBAR
      }
    ],
    modelValue: currentModel.value,
    'onUpdate:modelValue': (model: EditModel) => {
      currentModel.value = model;
    }
  };
});

const fieldSymbol = computed(() => {
  return {
    disabled: $props.fsItem.locked,
    label: 'Symbol',
    name: 'symbol',
    modelValue: String(currentModel.value.symbol),
    'onUpdate:modelValue': (value: string | string[]) => {
      currentModel.value.symbol = value;
    }
  };
});
const fieldId = computed(() => {
  return {
    disabled: $props.fsItem.locked,
    label: 'Id',
    name: 'id',
    modelValue: currentModel.value.id,
    'onUpdate:modelValue': (value: string) => {
      currentModel.value.id = value;
    }
  };
});
const fieldName = computed(() => {
  return {
    disabled: $props.fsItem.locked,
    label: 'Name',
    name: 'name',
    modelValue: currentModel.value.name,
    'onUpdate:modelValue': (value: string) => {
      currentModel.value.name = value;
    }
  };
});

function onClickCancel() {
  $emit('close');
}

function onClickItemMeta() {
  $props.model.actions.openItemMeta();
}

async function onSubmit() {
  if (!$props.fsItem.locked) {
    await $props.model.actions.save($props.fsItem, currentModel.value);
  }
  $emit('close');
}
</script>

<style lang="postcss" scoped>
.wb-module-files-edit {
  width: 420px;

  & .form {
    & > div:first-child {
      padding: var(--default-element-margin);
    }
  }

  @media (width >= 420px) {
    & .cols {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      & > * {
        width: 100%;
      }

      & .col-2 {
        width: 50%;
        padding: var(--default-element-margin) 0;
      }
    }
  }
}
</style>
