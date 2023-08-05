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
                  v-model="model"
                  title="Single Item Select"
                />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  v-bind="radioGroup"
                  v-model="model"
                  radio
                  title="Multiple Item Select"
                />
              </li>
            </ul>
          </div>
          <strong>Item Select</strong>
          <div class="col-2">
            <ul class="inputs col-2">
              <li>
                <wb-form-field-item-select
                  v-model="model"
                  title="Single Item Select"
                  v-bind="itemSelectA"
                />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-item-select
                  v-model="model"
                  title="Multiple Item Select"
                  v-bind="itemSelectB"
                  multiple
                />
              </li>
            </ul>
          </div>
          <strong>Fields</strong>
          <ul class="inputs">
            <li>
              <wb-form-field-dropdown v-model="model.fieldDropdownA" v-bind="fieldDropdownA" />
            </li>
            <li>
              <wb-form-field-dropdown v-model="model.fieldDropdownB" v-bind="fieldDropdownB" />
            </li>
            <li>
              <wb-form-field-textbox v-model="model.fieldTextbox" v-bind="fieldTextbox" />
            </li>
            <li>
              <wb-form-field-textarea v-model="model.fieldTextarea" v-bind="fieldTextarea" label-top />
            </li>
            <li>
              <wb-form-field-range-slider v-model="model.fieldRangeSlider" v-bind="fieldRangeSlider" label-top />
            </li>
          </ul>
        </div>

        <div>
          <fieldset>
            <legend>Model</legend>
            <ul>
              <li v-for="(value, key) in model" :key="key">
                <strong>{{ key }}:</strong>  {{ value }}
              </li>
            </ul>
          </fieldset>
          <strong>Buttons</strong>
          <ul class="inputs">
            <li>
              <wb-button
                type="upload"
                label="Upload Button"
              />
            </li>
            <li>
              <wb-button
                style-type="primary"
                label="Primary Button"
              />
            </li>
            <li>
              <wb-button
                style-type="secondary"
                label="Secondary Button"
              />
            </li>
            <li>
              <wb-button
                style-type="dialog"
                label="Dialog Button"
              />
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
import WbFormFieldTextbox from '@web-workbench/core/components/atoms/formField/Textbox';
import WbFormFieldTextarea from '@web-workbench/core/components/atoms/formField/Textarea';
import WbFormFieldRangeSlider from '@web-workbench/core/components/atoms/formField/RangeSlider';

import useWindow, { windowProps, windowEmits } from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbFormFieldItemSelect,
    WbFormFieldCheckboxGroup,
    WbForm,
    WbButton,
    WbFormFieldDropdown,
    WbFormFieldTextbox,
    WbFormFieldTextarea,
    WbFormFieldRangeSlider
  },

  props: {
    ...windowProps
  },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    return useWindow(props, context);
  },

  data () {
    return {
      title: 'Inputs - Examples',
      model: {
        itemSelect: 'value-3',
        itemSelectA: null,
        itemSelectB: null,
        itemSelectC: null,
        checkboxGroupA: false,
        checkboxGroupB: false,
        checkboxGroupC: false,
        radioGroup: null,
        fieldDropdownA: 'option-2',
        fieldDropdownB: [
          'option-3'
        ],
        fieldTextbox: 'Example Text 1',
        fieldTextarea: 'Example Text 2',
        fieldRangeSlider: 128
      }

    };
  },

  computed: {

    itemSelectA () {
      return {
        name: 'itemSelect',
        model: this.model,
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
    itemSelectB () {
      return {
        model: this.model,
        items: [
          {
            name: 'itemSelectA',
            label: 'Item 1',
            value: 'value-1'
          },
          {
            name: 'itemSelectB',
            label: 'Item 2',
            value: 'value-2'
          },
          {
            name: 'itemSelectC',
            label: 'Item 3',
            value: 'value-3'
          }
        ]
      };
    },
    checkboxGroup () {
      return {
        label: null,
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
    radioGroup () {
      return {
        label: null,
        name: 'radioGroup',
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
    fieldDropdownA () {
      return { };
    },
    fieldDropdownB () {
      return {
        size: 3,
        multiple: true
      };
    },
    fieldTextbox () {
      return {
        name: 'fieldTextbox',
        model: this.model
      };
    },
    fieldTextarea () {
      return {
        name: 'fieldTextarea',
        model: this.model
      };
    },
    fieldRangeSlider () {
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
