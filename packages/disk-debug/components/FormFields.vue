<template>
  <div class="wb-disks-examples-form-fields">
    <wb-form>
      <div class="col-2">
        <div class="user-interface">
          <strong>Radio / Checkbox - Groups</strong>
          <div class="col-2">
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  v-bind="checkboxGroup"
                  title="Single Item Select" />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  radio
                  v-bind="radioGroup"
                  title="Multiple Item Select" />
              </li>
            </ul>
          </div>
          <strong>Item Select</strong>
          <div class="col-2">
            <ul class="inputs col-2">
              <li>
                <wb-form-field-item-select
                  title="Single Item Select"
                  v-bind="itemSelectA" />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-item-select
                  title="Multiple Item Select (Array)"
                  v-bind="itemSelectB" />
              </li>
            </ul>
          </div>
          <div class="col-2">
            <ul class="inputs">
              <li>
                <wb-form-field-item-select
                  title="Multiple Item Select (Object)"
                  v-bind="itemSelectC" />
              </li>
            </ul>
          </div>
          <strong>Fields</strong>
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
          <strong>Buttons</strong>
          <ul class="inputs">
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
        itemSelectA: null,
        itemSelectB: [],
        itemSelectC: {},
        checkboxGroup: false,
        checkboxGroupA: false,
        checkboxGroupB: false,
        checkboxGroupV: false,
        radioGroup: null,
        fieldDropdownA: [],
        fieldDropdownB: [],
        fieldTextfield: null,
        fieldTextarea: null,
        fieldRangeSlider: 0
      }
    };
  },

  computed: {
    itemSelectA() {
      return {
        name: 'itemSelectA',
        modelValue: this.model.itemSelectA,
        'onUpdate:model-value': value => (this.model.itemSelectA = value),
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
    itemSelectB() {
      return {
        multiple: true,
        modelValue: this.model.itemSelectB,
        'onUpdate:model-value': value => (this.model.itemSelectB = value),
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
    itemSelectC() {
      return {
        multiple: true,
        modelValue: this.model.itemSelectC,
        'onUpdate:model-value': value => (this.model.itemSelectC = value),
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
    checkboxGroup() {
      return {
        label: null,
        model: this.model,
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
        model: this.model
      };
    },
    fieldDropdownB() {
      return {
        name: 'fieldDropdownB',
        model: this.model,
        size: 3,
        multiple: true
      };
    },
    fieldTextfield() {
      return {
        name: 'fieldTextfield',
        model: this.model
      };
    },
    fieldTextarea() {
      return {
        name: 'fieldTextarea',
        model: this.model
      };
    },
    fieldRangeSlider() {
      return {
        styleType: 'color-select',
        name: 'fieldRangeSlider',
        model: this.model,
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

  & ul.inputs {
    padding: 10px 0;

    & > li {
      padding: 10px 0;
    }
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

    & > * {
      width: 40%;

      &:nth-child(1) {
        width: 60%;
      }

      padding: 0 10px;
    }
  }
}
</style>
