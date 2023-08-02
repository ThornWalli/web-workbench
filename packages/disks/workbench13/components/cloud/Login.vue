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

import { toRef } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbButton from '@web-workbench/core/components/atoms/Button';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper';
import WbFormFieldTextbox from '@web-workbench/core/components/atoms/formField/Textbox';
import WbFormFieldDropdown from '@web-workbench/core/components/atoms/formField/Dropdown';

import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import contextMenu from '../../cloud/contextMenu';

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
    items: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  emits: [
    ...windowEmits, 'close'
  ],

  setup (props, context) {
    const model = toRef(props, 'model');

    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

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
