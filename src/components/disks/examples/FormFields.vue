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
                  title="Single Item Select"
                />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-checkbox-group
                  radio
                  v-bind="radioGroup"
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
                  title="Single Item Select"
                  v-bind="itemSelectA"
                />
              </li>
            </ul>
            <ul class="inputs">
              <li>
                <wb-form-field-item-select
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
              <wb-form-field-dropdown v-bind="fieldDropdownA" />
            </li>
            <li>
              <wb-form-field-dropdown v-bind="fieldDropdownB" />
            </li>
            <li>
              <wb-form-field-textbox v-bind="fieldTextbox" />
            </li>
            <li>
              <wb-form-field-textarea v-bind="fieldTextarea" label-top />
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

import WbFormFieldItemSelect from '@/components/environments/atoms/formField/ItemSelect';
import WbFormFieldCheckboxGroup from '@/components/environments/atoms/formField/CheckboxGroup';
import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbFormFieldDropdown from '@/components/environments/atoms/formField/Dropdown';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';
import WbFormFieldTextarea from '@/components/environments/atoms/formField/Textarea';

import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: {
    WbFormFieldItemSelect,
    WbFormFieldCheckboxGroup,
    WbForm,
    WbButton,
    WbFormFieldDropdown,
    WbFormFieldTextbox,
    WbFormFieldTextarea
  },

  mixins: [
    MixinWindowComponent
  ],

  data () {
    return {
      title: 'Inputs - Examples',
      model: {
        itemSelect: null,
        itemSelectA: null,
        itemSelectB: null,
        itemSelectC: null,
        checkboxGroup: false,
        checkboxGroupA: false,
        checkboxGroupB: false,
        checkboxGroupV: false,
        radioGroup: null,
        fieldDropdownA: [],
        fieldDropdownB: [],
        fieldTextbox: null,
        fieldTextarea: null
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
    radioGroup () {
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
    fieldDropdownA () {
      return {
        name: 'fieldDropdownA',
        model: this.model
      };
    },
    fieldDropdownB () {
      return {
        name: 'fieldDropdownB',
        model: this.model,
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
