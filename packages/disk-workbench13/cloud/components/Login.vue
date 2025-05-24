<template>
  <div class="wb-module-files-cloud-connect">
    <wb-form @submit="onSubmit">
      <wb-form-field-dropdown v-bind="fieldStorage" />
      <wb-form-field-textfield v-bind="fieldEmail" />
      <wb-form-field-textfield v-bind="fieldPassword" />
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

<script lang="ts" setup>
import { computed, ref } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form.vue';
import WbButton from '@web-workbench/core/components/atoms/Button.vue';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/atoms/formField/Textfield.vue';
import WbFormFieldDropdown from '@web-workbench/core/components/atoms/formField/Dropdown.vue';
import useWindow from '@web-workbench/core/composables/useWindow';
import contextMenu from '../contextMenu';
import type { ModelLogin } from '../types';

const $props = defineProps<{
  model: ModelLogin;
  items: Array<{ id: string; name: string }>;
}>();

const $emit = defineEmits<{
  (e: 'close', model: ModelLogin): void;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const currentModel = ref({ ...$props.model });

const applyLabel = 'Login';

const fieldStorage = computed(() => {
  return {
    label: 'Storage',
    placeholder: 'Select Storage…',
    options: parsedItems.value,
    modelValue: currentModel.value.storage,
    'onUpdate:modelValue': (value: string) => {
      currentModel.value.storage = value;
    }
  };
});

const fieldEmail = computed(() => {
  return {
    label: 'Email',
    placeholder: 'Email…',
    modelValue: currentModel.value.email,
    'onUpdate:modelValue': (value: string) => {
      currentModel.value.email = value;
    }
  };
});

const fieldPassword = computed(() => {
  return {
    type: 'password',
    label: 'Password',
    placeholder: 'Password…',
    modelValue: currentModel.value.password,
    'onUpdate:modelValue': (value: string) => {
      currentModel.value.password = value;
    }
  };
});

const parsedItems = computed(() => {
  return [
    {
      title: 'Select Storage',
      value: undefined
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
