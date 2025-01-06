<template>
  <div class="wb-module-files-edit">
    <wb-form class="form" @submit="onSubmit">
      <div>
        <wb-form-field-textfield v-bind="fieldId" />
        <wb-form-field-textfield v-bind="fieldName" />
        <wb-form-field-dropdown v-bind="fieldSymbol" />
        <div class="cols">
          <div class="col-2">
            <wb-form-field-checkbox-group v-bind="fieldCheckboxes" />
          </div>
          <div class="col-2">
            <wb-form-field-checkbox-group v-bind="fieldWindowSettings" />
          </div>
        </div>
      </div>
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
          type="submit" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script setup>
import { capitalCase } from 'change-case';

import { ITEM_META } from '../../../classes/FileSystem/Item';
import { SYMBOL } from '../../../utils/symbols';
import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFormFieldTextfield from '../../atoms/formField/Textfield';
import WbFormFieldDropdown from '../../atoms/formField/Dropdown';
import WbFormFieldCheckboxGroup from '../../atoms/formField/CheckboxGroup';

import { computed, ref } from 'vue';

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
      return {
        actions: {
          // eslint-disable-next-line no-empty-function
          save() {}
        },
        id: null,
        name: null,
        symbol: null,
        visible: false
      };
    }
  }
});

const $emit = defineEmits(['close']);

const currentModel = ref({ ...$props.model });

const cancelLabel = 'Cancel';
const saveLabel = 'Save';

const fieldCheckboxes = computed(() => {
  return {
    disabled: $props.fsItem.locked,
    label: 'Others',
    name: null,
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
    'onUpdate:modelValue': value => {
      currentModel.value = value;
    }
  };
});

const fieldWindowSettings = computed(() => {
  return {
    disabled: $props.fsItem.locked,
    label: 'Window Settings',
    name: null,
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
    'onUpdate:modelValue': value => {
      currentModel.value = value;
    }
  };
});

const fieldSymbol = computed(() => {
  return {
    disabled: $props.fsItem.locked,
    label: 'Symbol',
    name: 'symbol',
    options: Object.keys(SYMBOL).map(symbol => {
      return {
        title: capitalCase(symbol),
        value: SYMBOL[String(symbol)]
      };
    }),
    modelValue: currentModel.value.symbol,
    'onUpdate:modelValue': value => {
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
    'onUpdate:modelValue': value => {
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
    'onUpdate:modelValue': value => {
      currentModel.value.name = value;
    }
  };
});

const onClickCancel = () => {
  $emit('close');
};

const onSubmit = async () => {
  if (!$props.fsItem.locked) {
    await $props.model.actions.save(currentModel.value, $props.fsItem);
  }
  $emit('close');
};
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
