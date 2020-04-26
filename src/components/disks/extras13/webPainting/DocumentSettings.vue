<template>
  <div class="wb-disks-extras13-web-painting-document-settings">
    <wb-form class="document-settings__form" @submit="onSubmit">
      <wb-form-field-textbox v-bind="fields.width" :model="model.options.size" class="document-settings__form__size" />
      <wb-form-field-textbox v-bind="fields.height" :model="model.options.size" class="document-settings__form__size" />
      <wb-form-field-textbox v-bind="fields.windowBackground" :model="model.options" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" />
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

import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';
import contextMenu from '@/web-workbench/disks/extras13/webPainting/contextMenu';

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
        };
      }
    }
  },

  data () {
    const size = this.model.canvas.size;
    return {

      cancelLabel: 'Cancel',
      saveLabel: 'Save',

      size: {
        width: size.x,
        height: size.y
      },

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
        windowBackground: {
          label: 'Window BG',
          name: 'windowBackground',
          placeholder: '#000…'
        }
      }

    };
  },
  computed: {
    contextMenu () {
      return contextMenu({ core: this.core, model: this.model });
    }
  },
  methods: {
    onClickCancel () {
      this.$emit('close');
    },
    onSubmit () {
      if (!this.locked) {
        this.model.canvas.setSize(this.size.width, this.size.height);
        // await this.model.actions.save(this.model, this.fsItem);
      }
      this.$emit('close');
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-extras13-web-painting-document-settings {
  width: 380px;
  padding: var(--default-element-margin);

  & .document-settings__form__size {
    &::after {
      align-self: center;
      padding-left: var(--default-element-margin);
      content: "px";
    }
  }
}
</style>
