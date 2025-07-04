<template>
  <div class="wb-module-files-edit">
    <wb-form class="form" @submit="onSubmit">
      <div class="table-wrapper">
        <div class="items">
          <div v-for="(item, index) in items" :key="index" class="item">
            <div class="name">
              <wb-form-field-checkbox
                v-model="selectedItems"
                :disabled="isLocked"
                :label="item.name"
                :value="item.name" />
            </div>
            <div class="value">
              <wb-form-field-dropdown-symbol
                v-if="item.name === 'symbol'"
                :disabled="isLocked"
                :core="core"
                hide-label
                :label="item.name"
                :model-value="item.value"
                @update:model-value="onUpdateModelValue(item.name, $event)" />
              <wb-form-field-checkbox
                v-else-if="typeof item.value === 'boolean'"
                :disabled="isLocked"
                hide-label
                :label="item.name"
                :model-value="item.value"
                @update:model-value="onUpdateModelValue(item.name, $event)" />
              <wb-form-field-textarea
                v-else-if="typeof item.value === 'string'"
                :disabled="isLocked"
                fluid
                resize="vertical"
                hide-label
                :label="item.name"
                :model-value="item.value"
                @update:model-value="onUpdateModelValue(item.name, $event)" />
              <wb-form-field-textarea
                v-else
                :disabled="isLocked"
                fluid
                resize="vertical"
                hide-label
                :label="item.name"
                :model-value="JSON.stringify(item.value) || ''"
                @update:model-value="onUpdateModelValue(item.name, $event)" />
            </div>
            <div class="type">
              <wb-form-field-dropdown
                :disabled="isLocked"
                :model-value="item.type"
                v-bind="fieldItemValueFormat"
                @update:model-value="onUpdateValueType(item.name, $event)" />
            </div>
          </div>
        </div>
      </div>
      <div class="navigation style-filled">
        <div class="create">
          <wb-form-field-dropdown
            :disabled="isLocked"
            hide-label
            v-bind="fieldItemMeta" />
          <wb-button
            :disabled="!currentItem"
            label="Add"
            style-type="secondary"
            @click="onClickAdd" />
          <wb-button
            :disabled="selectedItems.length < 1"
            :label="`Delete&nbsp;(${selectedItems.length})`"
            style-type="secondary"
            @click="onClickDelete" />
        </div>
        <wb-button-wrapper align="outer" full>
          <wb-button
            label="Cancel"
            style-type="secondary"
            @click="onClickCancel" />
          <wb-button
            :disabled="isLocked || hasInvalidItems"
            label="Save"
            style-type="secondary"
            type="submit" />
        </wb-button-wrapper>
      </div>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import WbForm from '../../../fragments/Form.vue';
import WbButton from '../../../elements/Button.vue';
import WbButtonWrapper from '../../../fragments/ButtonWrapper.vue';
import WbFormFieldTextarea from '../../../elements/formField/Textarea.vue';
import WbFormFieldCheckbox from '../../../elements/formField/Checkbox.vue';
import WbFormFieldDropdown from '../../../elements/formField/Dropdown.vue';
import type { DropdownOption } from '../../../elements/formField/Dropdown.vue';
import WbFormFieldDropdownSymbol from '../../../elements/formField/dropDown/Symbol.vue';

import type FsItem from '../../../../classes/FileSystem/Item';
import { ITEM_META } from '../../../../classes/FileSystem/types';
import type { ItemMetaValue } from '../../../../classes/FileSystem/types';
import type { EditModel } from '../../../../modules/Files/types';
import useWindow from '../../../../composables/useWindow';

const { core } = useWindow();

const selectedItems = ref<string[]>([]);

const $props = defineProps<{
  fsItem: FsItem;
  model: EditModel;
}>();

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

const items = ref<
  {
    name: string;
    value: ItemMetaValue;
    valid: boolean;
    type: string;
  }[]
>(
  Array.from($props.fsItem.meta.entries()).map(([key, value]) => {
    return {
      name: key,
      value,
      valid: true,
      type: typeof value
    };
  })
);

const currentItem = ref<string>();

const isLocked = computed(() => $props.fsItem.locked);

const fieldItemMeta = computed(() => {
  const options: DropdownOption[] = Array.from(Object.values(ITEM_META))
    .filter(key => !hasItem(key))
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

function hasItem(key: string) {
  return items.value.some(item => item.name === key);
}

function getItem(key: string) {
  return items.value.find(item => item.name === key);
}

function onUpdateModelValue(key: string, value: string | boolean) {
  const item = getItem(key)!;
  if (item.type === 'boolean') {
    item.value = value === 'true';
    item.valid =
      typeof item.value === 'boolean' &&
      item.value !== null &&
      item.value !== undefined;
  } else if (item.type === 'number') {
    item.value = Number(value);
    item.valid =
      !isNaN(item.value) && item.value !== null && item.value !== undefined;
  } else if (item.type === 'string') {
    item.value = String(value);
    item.valid = item.value !== null && item.value !== undefined;
  } else {
    try {
      item.value = JSON.parse(value as string);
      item.valid = item.value !== null && item.value !== undefined;
    } catch (e) {
      item.valid = false;
      console.warn(e);
    }
  }
}

// eslint-disable-next-line complexity
function onUpdateValueType(key: string, value: string) {
  const item = items.value.find(item => item.name === key);
  if (!item) {
    return;
  }
  let result;
  item.valid = true;
  if (value === 'string') {
    item.value = String(item?.value || '');
    item.valid = item.value !== null && item.value !== undefined;
  } else if (value === 'number') {
    item.value = Number(item?.value || '');
    item.valid =
      !isNaN(item.value) && item.value !== null && item.value !== undefined;
  } else if (value === 'boolean') {
    item.value = Boolean(item?.value || '');
    item.valid =
      typeof item.value === 'boolean' &&
      item.value !== null &&
      item.value !== undefined;
  } else if (value === 'object') {
    try {
      item.value = JSON.parse(String(item?.value || ''));
    } catch (e) {
      item.valid = false;
      console.warn(e);
    }
  }
  if (result) {
    item.value = result;
  }
}

const hasInvalidItems = computed(() => {
  return items.value.some(item => !item.valid);
});

function onClickCancel() {
  $emit('close');
}

async function onSubmit() {
  if (!$props.fsItem.locked && !hasInvalidItems.value) {
    const model = Object.fromEntries(
      items.value.map(item => [item.name, item.value])
    );
    await $props.model.actions.saveItemMeta($props.fsItem, model, true);
    $emit('close');
  }
}

function onClickAdd() {
  if (currentItem.value) {
    items.value.push({
      name: currentItem.value || '',
      value: '' as ItemMetaValue,
      valid: true,
      type: 'string'
    });
  }
  currentItem.value = '';
}

function onClickDelete() {
  items.value = items.value.filter(
    item => !selectedItems.value.includes(item.name)
  );
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
    box-sizing: border-box;
    flex: 1;
    padding: var(--default-element-margin);
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: var(--default-element-margin);
    width: 100%;
    height: 100%;

    & .item {
      display: grid;
      grid-template-columns: 30% 1fr auto;

      &:not(:last-child) {
        padding-bottom: var(--default-element-margin);
        border-bottom: solid var(--workbench-color-4) 2px;
      }

      & .name {
        padding-right: calc(4 * var(--default-element-margin));
        word-wrap: break-word;

        & :deep(> *),
        & :deep(> * > *) {
          width: 100%;
        }
      }

      & > div {
        display: flex;
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
  display: grid;
  grid-template-columns: 0.5fr 0.25fr 0.25fr;
}
</style>
