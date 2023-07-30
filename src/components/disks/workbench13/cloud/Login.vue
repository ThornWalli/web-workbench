<template>
  <div class="wb-module-files-cloud-connect">
    <wb-form @submit="onSubmit">
      <wb-form-field-dropdown v-bind="fields.storage" :model="model" :options="parsedItems" />
      <wb-form-field-textbox v-bind="fields.email" :model="model" />
      <wb-form-field-textbox v-bind="fields.password" :model="model" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="primary"
          :label="applyLabel"
          type="submit"
          :disabled="disabledSubmit"
        />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>

import ContextMenuItems from '../../../../web-workbench/classes/ContextMenuItems';
import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';
import WbFormFieldDropdown from '@/components/environments/atoms/formField/Dropdown';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/cloud/contextMenu';

export default {
  components: {
    WbForm,
    WbButton,
    WbButtonWrapper,
    WbFormFieldTextbox,
    WbFormFieldDropdown
  },
  mixins: [
    MixinWindowComponent
  ],

  props: {
    items: {
      type: Array,
      default () {
        return [];
      }
    }
  },

  emits: [
    'close'
  ],

  data () {
    return {

      model: {
        email: null,
        password: null,
        storage: null
      },

      applyLabel: 'Login',

      fields: {
        email: {
          type: 'email',
          label: 'Email',
          name: 'email',
          placeholder: 'Email…'
        },
        password: {
          type: 'password',
          label: 'Password',
          name: 'password',
          placeholder: 'Password…'
        },
        storage: {
          label: 'Storage',
          name: 'storage'
        }
      }

    };
  },

  computed: {
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
    },
    parsedItems () {
      return [
        {
          title: 'Select Storage',
          value: null
        }, ...this.items.map((item) => {
          return {
            title: item.name,
            value: item.id
          };
        })
      ];
    },
    disabledSubmit () {
      return !this.model.email || !this.model.password || !this.model.storage;
    }
  },

  methods: {
    onClickCancel () {
      this.$emit('close');
    },
    onSubmit () {
      if (!this.disabledSubmit) {
        this.$emit('close', this.model);
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-files-cloud-connect {
  width: 380px;
}
</style>
