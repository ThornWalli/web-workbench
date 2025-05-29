<template>
  <div class="wb-module-files-edit">
    <wb-form class="form" @submit="onSubmit">
      <div class="table-wrapper">
        <table class="rows">
          <tbody>
            <tr v-for="(row, index) in rows" :key="index" class="row">
              <td class="name">
                <wb-form-field-checkbox
                  v-model="selectedItems"
                  :label="row.name"
                  :value="row.name" />
              </td>
              <td class="value">
                <wb-form-field-dropdown-symbol
                  v-if="row.name === 'symbol'"
                  :core="core"
                  hide-label
                  :label="row.name"
                  :model-value="row.value"
                  @update:model-value="onUpdateModelValue(row.name, $event)" />
                <wb-form-field-checkbox
                  v-else-if="typeof row.value === 'boolean'"
                  hide-label
                  :label="row.name"
                  :model-value="row.value"
                  @update:model-value="onUpdateModelValue(row.name, $event)" />
                <wb-form-field-textarea
                  v-else-if="typeof row.value === 'string'"
                  fluid
                  resize="vertical"
                  hide-label
                  :label="row.name"
                  :model-value="row.value"
                  @update:model-value="onUpdateModelValue(row.name, $event)" />
                <wb-form-field-textarea
                  v-else
                  fluid
                  resize="vertical"
                  hide-label
                  :label="row.name"
                  :model-value="JSON.stringify(row.value) || ''"
                  @update:model-value="onUpdateModelValue(row.name, $event)" />
              </td>
              <td class="type">
                <wb-form-field-dropdown
                  :model-value="rowValueType[row.name]"
                  v-bind="fieldItemValueFormat"
                  @update:model-value="onUpdateValueType(row.name, $event)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="navigation style-filled">
        <div class="create">
          <wb-form-field-dropdown hide-label v-bind="fieldItemMeta" />
          <wb-button label="Add" style-type="secondary" @click="onClickAdd" />
          <wb-button
            :disabled="selectedItems.length < 1"
            label="Delete"
            style-type="secondary"
            @click="onClickDelete" />
        </div>
        <wb-button-wrapper align="outer" full>
          <wb-button
            label="Cancel"
            style-type="secondary"
            @click="onClickCancel" />
          <wb-button label="Save" style-type="secondary" type="submit" />
        </wb-button-wrapper>
      </div>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import WbForm from '../../../fragments/Form.vue';
import WbButton from '../../../elements/Button.vue';
import WbButtonWrapper from '../../../fragments/ButtonWrapper.vue';
import WbFormFieldTextarea from '../../../elements/formField/Textarea.vue';
import WbFormFieldCheckbox from '../../../elements/formField/Checkbox.vue';
import WbFormFieldDropdown, {
  type DropdownOption
} from '../../../elements/formField/Dropdown.vue';
import WbFormFieldDropdownSymbol from '../../../elements/formField/dropDown/Symbol.vue';

import type FsItem from '../../../../classes/FileSystem/Item';
import {
  ITEM_META,
  type ItemMetaValue
} from '../../../../classes/FileSystem/types';
import type { EditModel } from '../../../../modules/Files/types';
import useWindow from '../../../../composables/useWindow';

const { core } = useWindow();

const selectedItems = ref<string[]>([]);

const rowValueType = reactive<{
  [key: string]: string;
}>({});

const $props = defineProps<{
  fsItem: FsItem;
  model: EditModel;
}>();

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentMeta = reactive<{
  [key: string]: ItemMetaValue;
}>(Object.fromEntries($props.fsItem.meta.entries()));

Object.entries(currentMeta).forEach(([key, value]) => {
  rowValueType[key] = typeof value;
});

const rows = computed(() => {
  return Array.from(Object.keys(currentMeta)).map(key => {
    return {
      name: key,
      value: currentMeta[key]
    };
  });
});

const currentItem = ref<string>();

const fieldItemMeta = computed(() => {
  const options: DropdownOption[] = Array.from(Object.values(ITEM_META))
    .filter(key => !(key in currentMeta))
    .map(value => ({
      title: value,
      value
    }));
  options.unshift({
    title: 'Select Item Meta',
    value: ''
  });
  return {
    label: 'Item Meta',
    modelValue: currentItem.value,
    options,
    'onUpdate:modelValue': (value: string) => {
      currentItem.value = value;
    }
  };
});

const fieldItemValueFormat = computed(() => {
  return {
    hideLabel: true,
    label: 'Value Format',
    options: [
      { title: 'String', value: 'string' },
      { title: 'Number', value: 'number' },
      { title: 'Boolean', value: 'boolean' },
      { title: 'JSON', value: 'object' }
    ]
  };
});

function onUpdateModelValue(key: string, value: string | boolean) {
  if (typeof currentMeta[key] === 'boolean') {
    currentMeta[key] = value === 'true';
  } else if (typeof currentMeta[key] === 'string') {
    currentMeta[key] = value;
  } else {
    try {
      currentMeta[key] = JSON.parse(value as string);
    } catch (e) {
      console.warn(e);
    }
  }
}

function onUpdateValueType(key: string, value: string) {
  if (value === 'string') {
    currentMeta[key] = String(currentMeta[key]);
  } else if (value === 'number') {
    currentMeta[key] = Number(currentMeta[key]);
  } else if (value === 'boolean') {
    currentMeta[key] = Boolean(currentMeta[key]);
  } else if (value === 'object') {
    try {
      currentMeta[key] = JSON.parse(String(currentMeta[key]));
    } catch (e) {
      console.warn(e);
    }
  }
  rowValueType[key] = value;
}

function onClickCancel() {
  $emit('close');
}

async function onSubmit() {
  if (!$props.fsItem.locked) {
    console.log(currentMeta);
    await $props.model.actions.saveItemMeta($props.fsItem, currentMeta, true);
  }
  $emit('close');
}

function onClickAdd() {
  if (currentItem.value && currentMeta[currentItem.value] === undefined) {
    currentMeta[currentItem.value] = '' as ItemMetaValue;
    rowValueType[currentItem.value] = 'string';
  }
  currentItem.value = '';
}

function onClickDelete() {
  selectedItems.value.forEach(item => {
    if (currentMeta[item] !== undefined) {
      Reflect.deleteProperty(currentMeta, item);
    }
  });
}
</script>

<style lang="postcss" scoped>
.wb-module-files-edit {
  position: relative;
  height: 100%;

  & .form {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .table-wrapper {
    flex: 1;
  }

  .rows {
    width: 100%;
    height: 100%;
    margin: var(--default-element-margin);

    & .row {
      & td {
        padding: var(--default-element-margin);
      }

      & .name {
        width: 150px;
      }

      & .value {
        & > * {
          width: 100%;
          height: 100%;
          margin: 0;
        }
      }
    }
  }
}

.meta-button {
  flex: 1;
  width: 100%;
}

.navigation {
  position: sticky;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--default-element-margin);
  width: 100%;
  padding: var(--default-element-margin);
  background-color: var(--workbench-color-1);
  border-top: solid 2px var(--workbench-color-4);

  & > * {
    margin: 0;
  }
}

.create {
  display: flex;

  & > * {
    flex: 0;
  }

  & > :nth-child(1) {
    flex: 1;
  }
}
</style>
