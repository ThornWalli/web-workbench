<template>
  <wb-env-atom-form-field
    class="wb-env-atom-form-field-checkbox-group"
    :label="label"
    label-top>
    <ul>
      <li v-for="({ value, ...item }, index) in items" :key="index">
        <wb-env-atom-form-field-checkbox-group-item
          :radio="radio"
          :label="item.label"
          :value="value"
          :name="name || item.name"
          :model-value="modelValue"
          :readonly="item.readonly || readonly"
          :disabled="item.disabled || disabled"
          @update:model-value="onUpdateModelValue" />
      </li>
    </ul>
  </wb-env-atom-form-field>
</template>

<script setup>
import WbEnvAtomFormField from '../FormField';
import WbEnvAtomFormFieldCheckboxGroupItem from './checkboxGroup/Item';

defineProps({
  label: {
    type: String,
    default: 'Checkbox Group Title'
  },
  name: {
    type: String,
    default: null
  },
  radio: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [Object, Array, String, Number],
    default: null
  },
  items: {
    type: Array,
    default() {
      // radio
      // return [
      //   { label: 'Item 1', value: 'item-1' },
      //   { label: 'Item 2', value: 'item-2' }
      // ];
      return [
        { label: 'Item 1', name: 'item1' },
        { label: 'Item 2', name: 'item2' }
      ];
    }
  }
});

const $emit = defineEmits(['update:model-value']);

const onUpdateModelValue = value => {
  $emit('update:model-value', value);
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field-checkbox-group {
  list-style: none;

  & > .title {
    display: block;
  }

  & ul {
    position: relative;

    & li {
      margin: var(--default-element-margin) 0;

      & > * {
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }
}
</style>
