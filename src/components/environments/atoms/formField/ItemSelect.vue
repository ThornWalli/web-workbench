<template>
  <div class="wb-env-atom-form-field-item-select">
    <div
      v-if="title"
      class="item-select__title"
    >
      {{ title }}
    </div>
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
      >
        <wb-env-atom-form-field-field-item-select-item
          v-bind="item"
          :name="item.name || name"
          :model="model"
          :multiple="multiple"
          :readonly="item.readonly || readonly"
          :disabled="item.disabled || disabled"
        />
      </li>
    </ul>
  </div>
</template>

<story
  name="ItemSelect"
  group="Environments/Atoms/FormField"
  knobs="{}">
  <ItemSelect />
</story>

<script>

import WbEnvAtomFormFieldFieldItemSelectItem from '@/components/environments/atoms/formField/itemSelect/Item';

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
      default () {
        if (this.multiple) {
          return { item1: false, item2: false };
        } else {
          return { [this.name]: {} };
        }
      }
    },
    items: {
      type: Array,
      required: false,
      default () {
        if (this.multiple) {
          return [
            { label: 'Item 1', name: 'item1' },
            { label: 'Item 2', name: 'item2' }
          ];
        } else {
          return [
            { label: 'Item 1', value: 'item-1' },
            { label: 'Item 2', value: 'item-2' }
          ];
        }
      }
    }
  }
};
</script>

<style lang="postcss">
:root {
  --color__itemSelect__border: #fff;
}

.wb-env-atom-form-field-item-select {
  margin: 0 2px;
  list-style: none;

  @nest .wb-env-molecule-form > & {
    margin: var(--default-element-margin);
  }

  & > .item-select__title {
    display: block;
    padding: 0 2px;
    margin: var(--default-element-margin) 0;
  }

  & ul {
    border: solid var(--color__itemSelect__border);
    border-width: 0 0 2px 0;

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
