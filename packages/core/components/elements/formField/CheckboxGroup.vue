<template>
  <wb-env-element-form-field
    class="wb-env-element-form-field-checkbox-group"
    :label="label">
    <ul>
      <li v-for="({ value, ...item }, index) in items" :key="index">
        <wb-env-element-form-field-checkbox-group-item
          :radio="radio || false"
          :label="item.label"
          :value="value"
          :name="name || item.name"
          :model-value="modelValue"
          :readonly="item.readonly || readonly || false"
          :disabled="item.disabled || disabled || false"
          @update:model-value="onUpdateModelValue" />
      </li>
    </ul>
  </wb-env-element-form-field>
</template>

<script lang="ts" setup generic="T extends Model">
import WbEnvElementFormField from '../FormField.vue';
import WbEnvElementFormFieldCheckboxGroupItem from './checkboxGroup/Item.vue';
import type { Model as ItemModel } from './checkboxGroup/Item.vue';

export type ModelObject = {
  [key: string]: unknown;
  [key: number]: unknown;
};
export type ModelList = unknown[];
export type Model = ModelObject | ModelList;

defineProps<{
  label?: string;
  name?: string;
  radio?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  read?: boolean;
  modelValue: T;
  items: Array<ItemModel>;
}>();
// const $props = defineProps({
//   label: {
//     type: String,
//     default: 'Checkbox Group Title'
//   },
//   name: {
//     type: String,
//     default: null
//   },
//   radio: {
//     type: Boolean,
//     default: false
//   },
//   readonly: {
//     type: Boolean,
//     default: false
//   },
//   disabled: {
//     type: Boolean,
//     default: false
//   },
//   read: {
//     type: Boolean,
//     default: false
//   },
//   modelValue: {
//     type: [Object, Array],
//     default: null
//   },
//   items: {
//     type: Array<
//       InstanceType<typeof WbEnvElementFormFieldCheckboxGroupItem>['$props']
//     >,
//     default() {
//       // radio
//       // return [
//       //   { label: 'Item 1', value: 'item-1' },
//       //   { label: 'Item 2', value: 'item-2' }
//       // ];
//       return [
//         { label: 'Item 1', name: 'item1' },
//         { label: 'Item 2', name: 'item2' }
//       ];
//     }
//   }
// });

const $emit = defineEmits<{
  (e: 'update:model-value', value: T): void;
}>();

const onUpdateModelValue = (value: T) => {
  $emit('update:model-value', value);
};
</script>

<style lang="postcss" scoped>
.wb-env-element-form-field-checkbox-group {
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
