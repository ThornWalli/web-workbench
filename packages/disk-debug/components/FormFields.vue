<template>
  <div class="wb-disks-examples-form-fields">
    <wb-form>
      <div class="col-2">
        <div class="user-interface">
          <div class="title">Radio / Checkbox</div>
          <div class="col-1">
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox
                  v-bind="checkboxSingleBoolean"
                  label="Single Checkbox (Boolean)" />
              </li>
              <li>
                <wb-form-field-checkbox
                  v-bind="checkboxSingleValue"
                  label="Single Checkbox (Value)" />
              </li>
              <li>
                <wb-form-field-checkbox
                  value="single-value-a"
                  v-bind="radioSingleValue"
                  title="Multiple Item Select" />
              </li>
              <li>
                <wb-form-field-checkbox
                  value="single-value-b"
                  v-bind="radioSingleValue"
                  title="Multiple Item Select" />
              </li>
            </ul>
          </div>
          <div class="title">Radio / Checkbox - Groups</div>
          <div class="col-2">
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  label-top
                  v-bind="checkboxGroupObject"
                  title="Multiple Item Select" />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  label-top
                  v-bind="checkboxGroupList"
                  title="Single Item Select" />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  label-top
                  v-bind="checkboxGroupSingle"
                  title="Single Item Select" />
              </li>
            </ul>
          </div>
          <div class="title">Item Select</div>
          <div class="col-2">
            <ul class="inputs col-2">
              <li>
                <wb-form-field-item-select
                  title="Single Item Select"
                  v-bind="itemSelectSingle" />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-item-select
                  title="Multiple Item Select (Array)"
                  v-bind="itemSelectList" />
              </li>
            </ul>
          </div>
          <div class="col-2">
            <ul class="inputs">
              <li>
                <wb-form-field-item-select
                  title="Multiple Item Select (Object)"
                  v-bind="itemSelectObject" />
              </li>
            </ul>
          </div>
          <div class="title">Fields</div>
          <ul class="inputs">
            <li>
              <wb-form-field-dropdown v-bind="fieldDropdownA" />
            </li>
            <li>
              <wb-form-field-dropdown v-bind="fieldDropdownB" />
            </li>
            <li>
              <wb-form-field-textfield v-bind="fieldTextfield" />
            </li>
            <li>
              <wb-form-field-textarea v-bind="fieldTextarea" label-top />
            </li>
            <li>
              <wb-form-field-range-slider v-bind="fieldRangeSlider" label-top />
            </li>
          </ul>
        </div>

        <div>
          <fieldset>
            <legend>Model</legend>
            <ul>
              <li v-for="(value, key) in model" :key="key">
                <strong>{{ key }}:</strong> {{ value }}
              </li>
            </ul>
          </fieldset>
          <div class="title">Buttons</div>
          <ul class="buttons">
            <li>
              <wb-button type="upload" label="Upload Button" />
            </li>
            <li>
              <wb-button style-type="primary" label="Primary Button" />
            </li>
            <li>
              <wb-button style-type="secondary" label="Secondary Button" />
            </li>
            <li>
              <wb-button style-type="dialog" label="Dialog Button" />
            </li>
          </ul>
        </div>
      </div>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import WbFormFieldItemSelect from '@web-workbench/core/components/elements/formField/ItemSelect.vue';
import WbFormFieldCheckboxGroup from '@web-workbench/core/components/elements/formField/CheckboxGroup.vue';
import WbFormFieldCheckbox from '@web-workbench/core/components/elements/formField/Checkbox.vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import WbFormFieldDropdown from '@web-workbench/core/components/elements/formField/Dropdown.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbFormFieldTextarea from '@web-workbench/core/components/elements/formField/Textarea.vue';
import WbFormFieldRangeSlider from '@web-workbench/core/components/elements/formField/RangeSlider.vue';
import { computed, ref } from 'vue';
import { TYPE } from '@web-workbench/core/components/elements/Checkbox.vue';

interface Model {
  itemSelectSingle: string;
  itemSelectList: string[];
  itemSelectObject: { [key: string]: unknown };
  checkboxGroupSingle: string | undefined;
  checkboxGroupList: string[];
  checkboxGroupObject: object;

  checkboxSingleBoolean: boolean;
  checkboxSingleValue: string;
  radioSingleBoolean: boolean;
  radioSingleValue: string;

  checkboxGroup: boolean;
  checkboxGroupA: boolean;
  checkboxGroupB: boolean;
  checkboxGroupV: boolean;
  fieldDropdownA: string;
  fieldDropdownB: string[];
  fieldTextfield: string;
  fieldTextarea: string;
  fieldRangeSlider: number;
}
const model = ref<Model>({
  itemSelectSingle: '',
  itemSelectList: [],
  itemSelectObject: {},
  checkboxGroupSingle: undefined,
  checkboxGroupList: [],
  checkboxGroupObject: {},

  checkboxSingleBoolean: false,
  checkboxSingleValue: 'single-value',
  radioSingleBoolean: false,
  radioSingleValue: 'radio-single-value',

  checkboxGroup: false,
  checkboxGroupA: false,
  checkboxGroupB: false,
  checkboxGroupV: false,
  fieldDropdownA: '',
  fieldDropdownB: ['option-a', 'option-b'],
  fieldTextfield: '',
  fieldTextarea: '',
  fieldRangeSlider: 0
});

const checkboxSingleBoolean = computed(() => {
  return {
    modelValue: model.value.checkboxSingleBoolean,
    'onUpdate:model-value': (value: boolean) =>
      (model.value.checkboxSingleBoolean = value),
    label: 'Checkbox Single Boolean'
  };
});
const checkboxSingleValue = computed(() => {
  return {
    value: 'single-value',
    modelValue: model.value.checkboxSingleValue,
    'onUpdate:model-value': (value: string) =>
      (model.value.checkboxSingleValue = value),
    label: 'Checkbox Single Value'
  };
});

const radioSingleValue = computed(() => {
  return {
    name: 'radioSingleValue',
    type: TYPE.RADIO,
    modelValue: model.value.radioSingleValue,
    'onUpdate:model-value': (value: string) =>
      (model.value.radioSingleValue = value),
    label: 'Checkbox Single Value'
  };
});

const itemSelectSingle = computed(() => {
  return {
    label: 'Item Select Single',
    name: 'itemSelectSingle',
    modelValue: model.value.itemSelectSingle,
    'onUpdate:model-value': (value: Model['itemSelectSingle']) =>
      (model.value.itemSelectSingle = value),
    items: [
      {
        label: 'Item 1',
        value: 'value-1'
      },
      {
        label: 'Item 2',
        value: 'value-2'
      },
      {
        label: 'Item 3',
        value: 'value-3'
      }
    ]
  };
});
const itemSelectList = computed(() => {
  return {
    label: 'Item Select List',
    multiple: true,
    modelValue: model.value.itemSelectList,
    'onUpdate:model-value': (value: Model['itemSelectList']) =>
      (model.value.itemSelectList = value),
    items: [
      {
        label: 'Item 1',
        value: 'value-1'
      },
      {
        label: 'Item 2',
        value: 'value-2'
      },
      {
        label: 'Item 3',
        value: 'value-3'
      }
    ]
  };
});
const itemSelectObject = computed(() => {
  return {
    label: 'Item Select Object',
    multiple: true,
    modelValue: model.value.itemSelectObject,
    'onUpdate:model-value': (value: Model['itemSelectObject']) =>
      (model.value.itemSelectObject = value),
    items: [
      {
        name: 'itemSelectCItem1',
        label: 'Item 1',
        value: 'value-1'
      },
      {
        name: 'itemSelectCItem2',
        label: 'Item 2',
        value: 'value-2'
      },
      {
        name: 'itemSelectCItem3',
        label: 'Item 3'
      }
    ]
  };
});
const checkboxGroupSingle = computed(() => {
  return {
    label: 'Checkbox Group Single',
    name: 'checkboxGroupSingle',
    radio: true,
    modelValue: model.value.checkboxGroupSingle,
    'onUpdate:model-value': (value: Model['checkboxGroupSingle']) =>
      (model.value.checkboxGroupSingle = value),
    items: [
      {
        label: 'Radio 1',
        value: 'value-1'
      },
      {
        label: 'Radio 2',
        value: 'value-2'
      },
      {
        label: 'Radio 3',
        value: 'value-3'
      }
    ]
  };
});
const checkboxGroupList = computed(() => {
  return {
    label: 'Checkbox Group List',
    name: 'checkboxGroupList',
    modelValue: model.value.checkboxGroupList,
    'onUpdate:model-value': (value: Model['checkboxGroupList']) =>
      (model.value.checkboxGroupList = value),
    items: [
      {
        name: 'checkboxGroupA',
        label: 'Checkbox 1',
        value: 'value-1'
      },
      {
        name: 'checkboxGroupB',
        label: 'Checkbox 2',
        value: 'value-2'
      },
      {
        name: 'checkboxGroupC',
        label: 'Checkbox 3',
        value: 'value-3'
      }
    ]
  };
});
const checkboxGroupObject = computed(() => {
  return {
    label: 'Checkbox Group Object',
    modelValue: model.value.checkboxGroupObject,
    'onUpdate:model-value': (value: Model['checkboxGroupObject']) =>
      (model.value.checkboxGroupObject = value),
    items: [
      {
        name: 'checkboxGroupA',
        label: 'Checkbox 1',
        value: 'value-1'
      },
      {
        name: 'checkboxGroupB',
        label: 'Checkbox 2',
        value: 'value-2'
      },
      {
        name: 'checkboxGroupC',
        label: 'Checkbox 3',
        value: 'value-3'
      }
    ]
  };
});
const fieldDropdownA = computed(() => {
  return {
    label: 'Dropdown',
    name: 'fieldDropdownA',
    modelValue: model.value.fieldDropdownA,
    'onUpdate:model-value': (value: string | string[]) =>
      (model.value.fieldDropdownA = value as string),
    options: [
      { label: 'Option A', value: 'option-a' },
      { label: 'Option B', value: 'option-b' },
      { label: 'Option C', value: 'option-c' }
    ]
  };
});
const fieldDropdownB = computed(() => {
  return {
    label: 'Dropdown (multiple)',
    name: 'fieldDropdownB',
    modelValue: model.value.fieldDropdownB,
    'onUpdate:model-value': (value: string[]) =>
      (model.value.fieldDropdownB = value),
    size: 3,
    multiple: true,
    options: [
      { label: 'Option A', value: 'option-a' },
      { label: 'Option B', value: 'option-b' },
      { label: 'Option C', value: 'option-c' }
    ]
  };
});
const fieldTextfield = computed(() => {
  return {
    label: 'Textfield',
    name: 'fieldTextfield',
    modelValue: model.value.fieldTextfield,
    'onUpdate:model-value': (value: string) =>
      (model.value.fieldTextfield = value)
  };
});
const fieldTextarea = computed(() => {
  return {
    label: 'Textarea',
    name: 'fieldTextarea',
    modelValue: model.value.fieldTextarea,
    'onUpdate:model-value': (value: string) =>
      (model.value.fieldTextarea = value)
  };
});
const fieldRangeSlider = computed(() => {
  return {
    styleType: 'color-select',
    name: 'fieldRangeSlider',
    modelValue: model.value.fieldRangeSlider,
    'onUpdate:model-value': (value: number) =>
      (model.value.fieldRangeSlider = value),
    max: 255,
    min: 0,
    step: 1,
    handleSize: 0.2
  };
});
</script>

<style lang="postcss" scoped>
.wb-disks-examples-form-fields {
  min-width: 600px;
  margin: 10px;

  & .title {
    display: block;
    padding: 10px 0;
  }

  & .wb-form {
    display: flex;
    gap: 10px;
  }

  & ul.buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  & fieldset {
    margin-bottom: 10px;

    & ul {
      & > li {
        padding: 5px 0;
      }
    }
  }

  & .col-2 {
    display: flex;
    flex-wrap: wrap;

    & > * {
      flex: 0 0 50%;

      /* padding: 0 10px; */
    }
  }
}
</style>
