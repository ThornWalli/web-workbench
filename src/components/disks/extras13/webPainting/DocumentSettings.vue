<template>
  <div class="wb-disks-extras13-web-painting-document-settings">
    <wb-form class="document-settings__form" @submit="onSubmit">
      <div class="col-2">
        <fieldset>
          <legend>Dimension</legend>
          <wb-form-field-textbox v-bind="fields.width" :model="model.size" type="number" class="document-settings__form__size" />
          <wb-form-field-textbox v-bind="fields.height" :model="model.size" type="number" class="document-settings__form__size" />
        </fieldset>
      </div>
      <div class="col-2">
        <fieldset>
          <legend>Palette</legend>
          <wb-form-field-textbox v-bind="fields.paletteSteps.red" :model="model.paletteSteps" type="number" :min="1" :max="30" />
          <wb-form-field-textbox v-bind="fields.paletteSteps.green" :model="model.paletteSteps" type="number" :min="1" :max="30" />
          <wb-form-field-textbox v-bind="fields.paletteSteps.blue" :model="model.paletteSteps" type="number" :min="1" :max="30" />
        </fieldset>
      </div>
      <wb-button-wrapper align="outer" full class="col-1">
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

import Color from '../../../../web-workbench/disks/extras13/webPainting/lib/Color';
import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';

import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextbox },
  mixins: [
    MixinWindowComponent
  ],
  props: {
    model: {
      type: Object,
      default () {
        return {
          paletteSteps: new Color(1, 1, 1).toJSON(),
          size: {
            width: 0,
            height: 0
          }
        };
      }
    }
  },

  emits: [
    'close'
  ],

  data () {
    return {

      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      fields: {
        width: {
          label: 'Width',
          name: 'width',
          placeholder: 'Width'
        },
        height: {
          label: 'Height',
          name: 'height',
          placeholder: 'Height'
        },

        paletteSteps: {
          red: {
            label: 'Red',
            name: 'red',
            placeholder: '0...32'
          },
          green: {
            label: 'Green',
            name: 'green',
            placeholder: '0...32'
          },
          blue: {
            label: 'Blue',
            name: 'blue',
            placeholder: '0...32'
          }
        },

        displayForeground: {
          label: 'Foreground',
          name: 'foreground',
          placeholder: '#FFF'
        },
        displayBackground: {
          label: 'Background',
          name: 'background',
          placeholder: '#000…'
        }
      }

    };
  },
  computed: {
    // contextMenu () {
    //   return contextMenu({ core: this.core, model: this.model });
    // }
  },
  methods: {
    onClickCancel () {
      this.$emit('close');
    },
    onSubmit () {
      this.$emit('close', this.model);
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-document-settings {
  min-width: 480px;
  padding: var(--default-element-margin);

  & .document-settings__form {
    display: flex;
    flex-flow: row nowrap;
  }

  & .col-1 {
    width: 100%;
  }

  & .col-2 {
    width: 50%;
  }

  & fieldset {
    /* width: 100%; */

    margin: var(--default-element-margin);
  }

  & .document-settings__form__size {
    &::after {
      align-self: center;
      padding-left: var(--default-element-margin);
      content: "px";
    }
  }
}
</style>
