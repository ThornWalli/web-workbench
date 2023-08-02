<template>
  <div class="wb-module-files-edit">
    <wb-form class="form" @submit="onSubmit">
      <div>
        <wb-form-field-textbox v-bind="fields.id" :model="model" />
        <wb-form-field-textbox v-bind="fields.name" :model="model" />
        <wb-form-field-dropdown v-bind="fields.symbol" :model="model" />
        <div class="cols">
          <div class="col-2">
            <wb-form-field-checkbox-group v-bind="fields.checkboxes" :model="model" />
          </div>
          <div class="col-2">
            <wb-form-field-checkbox-group v-bind="fields.windowSettings" :model="model" />
          </div>
        </div>
      </div>
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
import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import { ITEM_META } from '../../../classes/FileSystem/Item';
import { SYMBOL } from '../../../utils/symbols';
import WbForm from '../../molecules/Form';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import WbFormFieldTextbox from '../../atoms/formField/Textbox';
import WbFormFieldDropdown from '../../atoms/formField/Dropdown';
import WbFormFieldCheckboxGroup from '../../atoms/formField/CheckboxGroup';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextbox, WbFormFieldDropdown, WbFormFieldCheckboxGroup },

  props: {
    ...windowProps,
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
  emits: [
    ...windowEmits, 'close'
  ],

  setup (props, context) {
    return useWindow(props, context);
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
              label: 'Symbol Visible',
              name: ITEM_META.VISIBLE
            },
            {
              label: 'Ignore Symbol Rearrange ',
              name: ITEM_META.IGNORE_SYMBOL_REARRANGE
            }

          ]
        },
        windowSettings: {
          disabled: locked,
          label: 'Window Settings',
          name: null,
          items: [
            {
              label: 'Has Scale ?',
              name: ITEM_META.WINDOW_SCALE
            },
            {
              label: 'Has Scroll-X ?',
              name: ITEM_META.WINDOW_SCROLL_X
            },
            {
              label: 'Has Scroll-Y ?',
              name: ITEM_META.WINDOW_SCROLL_Y
            },
            {
              label: 'Is Full-Size ?',
              name: ITEM_META.WINDOW_FULL_SIZE
            },
            {
              label: 'Sort Symbols (Directory)',
              name: ITEM_META.WINDOW_SYMBOL_REARRANGE
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

<style lang="postcss" scoped>
.wb-module-files-edit {
  width: 420px;

  & .form {
    & > div:first-child {
      padding: var(--default-element-margin);
    }
  }

  @media (width >= 420px) {
    & .cols {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      & > * {
        width: 100%;
      }

      & .col-2 {
        width: 50%;
        padding: var(--default-element-margin) 0;
      }
    }
  }

}
</style>
