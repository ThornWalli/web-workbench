
<template>
  <wb-env-atom-form-field class="wb-env-atom-form-field-checkbox-group" :label="label">
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
      >
        <wb-env-atom-form-field-checkbox-group-item
          :radio="radio"
          :name="item.name || name"
          :model="model"
          :readonly="item.readonly || readonly"
          :disabled="item.disabled || disabled"
          v-bind="item"
        />
      </li>
    </ul>
  </wb-env-atom-form-field>
</template>

<story
  name="CheckboxGroup"
  group="Environments/Atoms/FormField"
  knobs="{}">
  <CheckboxGroup />
</story>

<script>

import WbEnvAtomFormField from '@/components/environments/atoms/FormField';
import WbEnvAtomFormFieldCheckboxGroupItem from '@/components/environments/atoms/formField/checkboxGroup/Item';

export default {
  components: { WbEnvAtomFormField, WbEnvAtomFormFieldCheckboxGroupItem },
  props: {
    label: {
      type: String,
      default: 'Checkbox Group Title'
    },
    name: {
      type: String,
      default: 'value'
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
    model: {
      type: Object,
      default () {
        if (this.radio) {
          return { value: {} };
        } else {
          return { item1: false, item2: false };
        }
      }
    },
    items: {
      type: Array,
      default () {
        if (this.radio) {
          return [
            { label: 'Item 1', value: 'item-1' },
            { label: 'Item 2', value: 'item-2' }
          ];
        } else {
          return [
            { label: 'Item 1', name: 'item1' },
            { label: 'Item 2', name: 'item2' }
          ];
        }
      }
    }
  }
};
</script>

<style lang="postcss">

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

  & > .field__label + ul {
    top: -1px;
    margin-top: var(--default-element-margin);
  }
}
</style>
