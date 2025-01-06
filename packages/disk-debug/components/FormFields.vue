<template>
  <div class="wb-disks-examples-form-fields">
    <wb-form>
      <div class="col-2">
        <div class="user-interface">
          <div class="title">Radio / Checkbox - Groups</div>
          <div class="col-2">
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  v-bind="checkboxGroupObject"
                  title="Multiple Item Select" />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  v-bind="checkboxGroupList"
                  title="Single Item Select" />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
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

<script>
import WbFormFieldItemSelect from '@web-workbench/core/components/atoms/formField/ItemSelect';
import WbFormFieldCheckboxGroup from '@web-workbench/core/components/atoms/formField/CheckboxGroup';
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbButton from '@web-workbench/core/components/atoms/Button';
import WbFormFieldDropdown from '@web-workbench/core/components/atoms/formField/Dropdown';
import WbFormFieldTextfield from '@web-workbench/core/components/atoms/formField/Textfield';
import WbFormFieldTextarea from '@web-workbench/core/components/atoms/formField/Textarea';
import WbFormFieldRangeSlider from '@web-workbench/core/components/atoms/formField/RangeSlider';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbFormFieldItemSelect,
    WbFormFieldCheckboxGroup,
    WbForm,
    WbButton,
    WbFormFieldDropdown,
    WbFormFieldTextfield,
    WbFormFieldTextarea,
    WbFormFieldRangeSlider
  },

  setup() {
    return useWindow();
  },

  data() {
    return {
      title: 'Inputs - Examples',
      model: {
        itemSelectSingle: null,
        itemSelectList: [],
        itemSelectObject: {},
        checkboxGroupSingle: null,
        checkboxGroupList: [],
        checkboxGroupObject: {},

        checkboxGroup: false,
        checkboxGroupA: false,
        checkboxGroupB: false,
        checkboxGroupV: false,
        radioGroup: null,
        fieldDropdownA: null,
        fieldDropdownB: [],
        fieldTextfield: null,
        fieldTextarea: '',
        fieldRangeSlider: 0
      }
    };
  },

  computed: {
    itemSelectSingle() {
      return {
        name: 'itemSelectSingle',
        modelValue: this.model.itemSelectSingle,
        'onUpdate:model-value': value => (this.model.itemSelectSingle = value),
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
    },
    itemSelectList() {
      return {
        multiple: true,
        modelValue: this.model.itemSelectList,
        'onUpdate:model-value': value => (this.model.itemSelectList = value),
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
    },
    itemSelectObject() {
      return {
        multiple: true,
        modelValue: this.model.itemSelectObject,
        'onUpdate:model-value': value => (this.model.itemSelectObject = value),
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
    },
    checkboxGroupSingle() {
      return {
        radio: true,
        label: null,
        modelValue: this.model.checkboxGroupSingle,
        'onUpdate:model-value': value =>
          (this.model.checkboxGroupSingle = value),
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
    },
    checkboxGroupList() {
      return {
        label: null,
        modelValue: this.model.checkboxGroupList,
        'onUpdate:model-value': value => (this.model.checkboxGroupList = value),
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
    },
    checkboxGroupObject() {
      return {
        label: null,
        modelValue: this.model.checkboxGroupObject,
        'onUpdate:model-value': value =>
          (this.model.checkboxGroupObject = value),
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
    },
    radioGroup() {
      return {
        label: null,
        name: 'radioGroup',
        model: this.model,
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
    },
    fieldDropdownA() {
      return {
        name: 'fieldDropdownA',
        modelValue: this.model.fieldDropdownA,
        'onUpdate:model-value': value => (this.model.fieldDropdownA = value)
      };
    },
    fieldDropdownB() {
      return {
        name: 'fieldDropdownB',
        modelValue: this.model.fieldDropdownB,
        'onUpdate:model-value': value => (this.model.fieldDropdownB = value),
        size: 3,
        multiple: true
      };
    },
    fieldTextfield() {
      return {
        name: 'fieldTextfield',
        modelValue: this.model.fieldTextfield,
        'onUpdate:model-value': value => (this.model.fieldTextfield = value)
      };
    },
    fieldTextarea() {
      return {
        name: 'fieldTextarea',
        modelValue: this.model.fieldTextarea,
        'onUpdate:model-value': value => (this.model.fieldTextarea = value)
      };
    },
    fieldRangeSlider() {
      return {
        styleType: 'color-select',
        name: 'fieldRangeSlider',
        modelValue: this.model.fieldRangeSlider,
        'onUpdate:model-value': value => (this.model.fieldRangeSlider = value),
        max: 255,
        min: 0,
        step: 1,
        handleSize: 0.2
      };
    }
  }
};
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
