<template>
  <div class="wb-env-atom-form-field-item-select">
    <div v-if="title" class="title">
      {{ title }}
    </div>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <wb-env-atom-form-field-field-item-select-item
          v-bind="item"
          :name="item.name || name"
          :model="model"
          :multiple="multiple"
          :readonly="item.readonly || readonly"
          :disabled="item.disabled || disabled" />
      </li>
    </ul>
  </div>
</template>

<script>
import WbEnvAtomFormFieldFieldItemSelectItem from './itemSelect/Item';

export default {
  components: { WbEnvAtomFormFieldFieldItemSelectItem },
  props: {
    title: {
      type: String,
      default: 'Item Select Title'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'value'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default() {
        return { value: {} };
      }
    },
    items: {
      type: Array,
      required: false,
      default() {
        return [
          { label: 'Item 1', value: 'item-1' },
          { label: 'Item 2', value: 'item-2' }
        ];
      }
    }
  }
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
