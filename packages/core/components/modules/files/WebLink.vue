<template>
  <div class="wb-module-files-web-link">
    <wb-form @submit="onSubmit">
      <wb-form-field-textbox v-bind="fields.name" :model="model" />
      <wb-form-field-textbox v-bind="fields.url" :model="model" type="url" />
      <wb-form-field-dropdown v-bind="fields.symbol" :model="model" />
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

import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';
import { SYMBOL } from '../../../utils/symbols';
import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFormFieldTextbox from '../../atoms/formField/Textbox';
import WbFormFieldDropdown from '../../atoms/formField/Dropdown';

export default {
  components: {
    WbForm,
    WbButton,
    WbButtonWrapper,
    WbFormFieldTextbox,
    WbFormFieldDropdown
  },

  props: {
    ...windowProps,
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
  emits: [...windowEmits, 'close'],

  setup(props, context) {
    return useWindow(props, context);
  },

  data() {
    const locked = (this.fsItem || {}).locked;

    return {
      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      fields: {
        name: {
          disabled: locked,
          placeholder: 'Name',
          label: 'Name',
          name: 'name'
        },
        url: {
          disabled: locked,
          placeholder: 'http://…',
          label: 'Url',
          name: 'url'
        },
        symbol: {
          disabled: locked,
          label: 'Symbol',
          name: 'symbol',
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
      return !this.model.name || !this.model.url || !this.model.symbol;
    }
  },

  methods: {
    onClickCancel() {
      this.$emit('close');
    },
    async onSubmit() {
      if (await this.model.actions.save(this.model, this.fsItem)) {
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
