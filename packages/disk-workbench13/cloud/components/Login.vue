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

<script setup>
import { computed, ref } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbButton from '@web-workbench/core/components/atoms/Button';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper';
import WbFormFieldTextfield from '@web-workbench/core/components/atoms/formField/Textfield';
import WbFormFieldDropdown from '@web-workbench/core/components/atoms/formField/Dropdown';
import useWindow from '@web-workbench/core/composables/useWindow';
import contextMenu from '../contextMenu';

const $props = defineProps({
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
});

const $emit = defineEmits(['close']);

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const currentModel = ref({ ...$props.model });

const applyLabel = 'Login';

const fields = {
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
};

const parsedItems = computed(() => {
  return [
    {
      title: 'Select Storage',
      value: null
    },
    ...$props.items.map(item => {
      return {
        title: item.name,
        value: item.id
      };
    })
  ];
});

const disabledSubmit = computed(() => {
  return (
    !currentModel.value.email ||
    !currentModel.value.password ||
    !currentModel.value.storage
  );
});

function onSubmit() {
  if (!disabledSubmit.value) {
    $emit('close', currentModel.value);
  }
}
</script>

<style lang="postcss" scoped>
.wb-module-files-cloud-connect {
  width: 380px;
}
</style>
