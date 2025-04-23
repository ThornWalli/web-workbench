<template>
  <div class="wb-env-atom-form-field-item-select">
    <div v-if="title" class="title">
      {{ title }}
    </div>
    <ul>
      <li v-for="({ label, value, ...item }, index) in items" :key="index">
        <wb-core-form-field-item-select-item
          :label="label"
          :value="value"
          :name="name || item.name"
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

<script lang="ts" setup>
import WbCoreFormFieldItemSelectItem from './itemSelect/Item.vue';

defineProps({
  name: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: 'Item Select Title'
  },
  multiple: {
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
  modelValue: {
    type: [Object, Array, String, Number],
    default: null
  },
  canUnselect: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array<InstanceType<typeof WbCoreFormFieldItemSelectItem>['$props']>,
    required: false,
    default() {
      return [
        { label: 'Item 1', value: 'item-1' },
        { label: 'Item 2', value: 'item-2' }
      ];
    }
  }
});

const $emit = defineEmits(['update:model-value']);

const onUpdateModelValue = (value: string) => {
  $emit('update:model-value', value);
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field-item-select {
  --border: var(--color-item-select-border, #fff);

  margin: 0 2px;
  list-style: none;

  .wb-env-molecule-form > & {
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
