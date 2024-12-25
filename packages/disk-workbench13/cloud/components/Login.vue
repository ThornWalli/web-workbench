<template>
  <div class="wb-module-files-cloud-connect">
    <wb-form @submit="onSubmit">
      <wb-form-field-dropdown
        v-bind="fields.storage"
        v-model="currentModel.storage"
        :options="parsedItems" />
      <wb-form-field-textfield
        v-bind="fields.email"
        v-model="currentModel.email" />
      <wb-form-field-textfield
        v-bind="fields.password"
        v-model="currentModel.password" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="primary"
          :label="applyLabel"
          type="submit"
          :disabled="disabledSubmit" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>
import { toRef } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbButton from '@web-workbench/core/components/atoms/Button';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper';
import WbFormFieldTextfield from '@web-workbench/core/components/atoms/formField/Textfield';
import WbFormFieldDropdown from '@web-workbench/core/components/atoms/formField/Dropdown';
import useWindow from '@web-workbench/core/composables/useWindow';
import contextMenu from '../contextMenu';

export default {
  components: {
    WbForm,
    WbButton,
    WbButtonWrapper,
    WbFormFieldTextfield,
    WbFormFieldDropdown
  },

  props: {
    model: {
      type: Object,
      default() {
        return {
          email: null,
          password: null,
          storage: null
        };
      }
    },
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  emits: ['close'],

  setup(props) {
    const model = toRef(props, 'model');

    const windowContext = useWindow();
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

  data() {
    return {
      currentModel: { ...this.model },

      applyLabel: 'Login',

      fields: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'Email…'
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: 'Password…'
        },
        storage: {
          label: 'Storage'
        }
      }
    };
  },

  computed: {
    parsedItems() {
      return [
        {
          title: 'Select Storage',
          value: null
        },
        ...this.items.map(item => {
          return {
            title: item.name,
            value: item.id
          };
        })
      ];
    },
    disabledSubmit() {
      return (
        !this.currentModel.email ||
        !this.currentModel.password ||
        !this.currentModel.storage
      );
    }
  },

  methods: {
    onClickCancel() {
      this.$emit('close');
    },
    onSubmit() {
      if (!this.disabledSubmit) {
        this.$emit('close', this.currentModel);
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
