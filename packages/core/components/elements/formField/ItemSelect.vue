<template>
  <div class="wb-env-element-form-field-item-select">
    <div v-if="title" class="title">
      {{ title }}
    </div>
    <ul>
      <li v-for="({ label, value, ...item }, index) in items" :key="index">
        <wb-core-form-field-item-select-item
          :label="label"
          :value="value || ''"
          :name="item.name || preparedName"
          :model-value="modelValue"
          :can-unselect="canUnselect"
          :multiple="multiple"
          :readonly="item.readonly || readonly"
          :disabled="item.disabled || disabled"
          @update:model-value="onUpdateModelValue" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup generic="T extends Model">
import { computed, useId } from 'vue';
import WbCoreFormFieldItemSelectItem, {
  type Model as ItemModel
} from './itemSelect/Item.vue';
export type ModelObject = {
  [key: string]: unknown;
  [key: number]: unknown;
};
export type ModelList = unknown[];
export type Model = ModelObject | ModelList | string | number;

const $props = defineProps<{
  name?: string;
  title?: string;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  modelValue: T;
  canUnselect?: boolean;
  items: Array<ItemModel>;
}>();

const id = useId();
const preparedName = computed(() => {
  return $props.name || id;
});

// defineProps({
//   name: {
//     type: String,
//     default: null
//   },
//   title: {
//     type: String,
//     default: 'Item Select Title'
//   },
//   multiple: {
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
//   modelValue: {
//     type: [Object, Array, String, Number],
//     default: null
//   },
//   canUnselect: {
//     type: Boolean,
//     default: false
//   },
//   items: {
//     type: Array<InstanceType<typeof WbCoreFormFieldItemSelectItem>['$props']>,
//     required: false,
//     default() {
//       return [
//         { label: 'Item 1', value: 'item-1' },
//         { label: 'Item 2', value: 'item-2' }
//       ];
//     }
//   }
// });

const $emit = defineEmits<{
  (e: 'update:model-value', value: T): void;
}>();

const onUpdateModelValue = (model: T) => {
  $emit('update:model-value', model);
};
</script>

<style lang="postcss" scoped>
.wb-env-element-form-field-item-select {
  --border: var(--color-item-select-border, #fff);

  margin: 0 2px;
  list-style: none;

  .wb-env-fragment-form > & {
    margin: var(--default-element-margin);
  }

  & > .title {
    display: block;
    padding: 0 2px;
    margin: var(--default-element-margin) 0;
  }

  & ul {
    border: solid var(--border);
    border-width: 0 0 2px;

    & li {
      margin: 0;

      & > * {
        display: block;
        margin-top: 0;
        margin-bottom: 0;
        border-bottom-width: 0;
      }
    }
  }
}
</style>
