<template>
  <div class="wb-module-files-edit">
    <wb-form @submit="onSubmit">
      <wb-form-field-textbox v-bind="fields.id" :model="model" />
      <wb-form-field-textbox v-bind="fields.name" :model="model" />
      <wb-form-field-dropdown v-bind="fields.symbol" :model="model" />
      <wb-form-field-checkbox-group v-bind="fields.checkboxes" :model="model" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          v-if="cancelLabel"
          style-type="secondary"
          :label="cancelLabel"
          @click="onClickCancel"
        />
        <wb-button
          v-if="saveLabel"
          style-type="primary"
          :label="saveLabel"
          type="submit"
        />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>

import { capitalCase } from 'change-case';
import { SYMBOL } from '../../../web-workbench/utils/symbols';
import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';
import WbFormFieldDropdown from '@/components/environments/atoms/formField/Dropdown';
import WbFormFieldCheckboxGroup from '@/components/environments/atoms/formField/CheckboxGroup';

import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextbox, WbFormFieldDropdown, WbFormFieldCheckboxGroup },
  mixins: [
    MixinWindowComponent
  ],
  props: {
    fsItem: {
      type: Object,
      default () {
        return null;
      }
    },
    model: {
      type: Object,
      default () {
        return {
          actions: {
            // eslint-disable-next-line no-empty-function
            save () {}
          },
          id: null,
          name: null,
          symbol: null,
          visible: false
        };
      }
    }
  },

  data () {
    const locked = this.fsItem.locked;

    return {

      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      fields: {
        id: {
          disabled: locked,
          label: 'Id',
          name: 'id'
        },
        name: {
          disabled: locked,
          label: 'Name',
          name: 'name'
        },
        checkboxes: {
          disabled: locked,
          label: 'Others',
          name: null,
          items: [
            {
              label: 'Visible',
              name: 'visible'
            }
          ]
        },
        symbol: {
          disabled: locked,
          label: 'Symbol',
          name: 'symbol',
          options: Object.keys(SYMBOL).map((symbol) => {
            return {
              title: capitalCase(symbol),
              value: SYMBOL[String(symbol)]
            };
          })
        }
      }

    };
  },

  methods: {
    onClickCancel () {
      this.$emit('close');
    },
    async onSubmit () {
      if (!this.locked) {
        await this.model.actions.save(this.model, this.fsItem);
      }
      this.$emit('close');
    }
  }
};
</script>

<style lang="postcss">
.wb-module-files-edit {
  width: 380px;
  padding: var(--default-element-margin);
}
</style>
