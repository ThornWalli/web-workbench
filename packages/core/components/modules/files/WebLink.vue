<template>
  <div class="wb-module-files-web-link">
    <wb-form @submit="onSubmit">
      <wb-form-field-textbox v-bind="fields.name" v-model="currentModel.name" />
      <wb-form-field-textbox
        v-bind="fields.url"
        v-model="currentModel.url"
        type="url" />
      <wb-form-field-dropdown
        v-bind="fields.symbol"
        v-model="currentModel.symbol" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          v-if="cancelLabel"
          style-type="secondary"
          :label="cancelLabel"
          @click="onClickCancel" />
        <wb-button
          v-if="saveLabel"
          style-type="primary"
          :label="saveLabel"
          type="submit"
          :disabled="disabledSave" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';

import { SYMBOL } from '../../../utils/symbols';
import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFormFieldTextbox from '../../atoms/formField/Textbox';
import WbFormFieldDropdown from '../../atoms/formField/Dropdown';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbForm,
    WbButton,
    WbButtonWrapper,
    WbFormFieldTextbox,
    WbFormFieldDropdown
  },

  props: {
    fsItem: {
      type: Object,
      default() {
        return null;
      }
    },
    model: {
      type: Object,
      default() {
        return {
          actions: {
            save: () => {
              /* empty */
            }
          },
          name: null,
          url: null,
          symbol: null
        };
      }
    }
  },
  emits: ['close'],

  setup() {
    return useWindow();
  },

  data() {
    const locked = (this.fsItem || {}).locked;

    return {
      currentModel: { ...this.model },

      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      fields: {
        name: {
          disabled: locked,
          placeholder: 'Name',
          label: 'Name'
        },
        url: {
          disabled: locked,
          placeholder: 'http://…',
          label: 'Url'
        },
        symbol: {
          disabled: locked,
          label: 'Symbol',
          options: Object.keys(SYMBOL).map(symbol => {
            return {
              title: capitalCase(symbol),
              value: SYMBOL[String(symbol)]
            };
          })
        }
      }
    };
  },

  computed: {
    disabledSave() {
      return (
        !this.currentModel.name ||
        !this.currentModel.url ||
        !this.currentModel.symbol
      );
    }
  },

  methods: {
    onClickCancel() {
      this.$emit('close');
    },
    async onSubmit() {
      if (await this.model.actions.save(this.currentModel, this.fsItem)) {
        this.$emit('close');
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-files-web-link {
  width: 380px;
}
</style>
