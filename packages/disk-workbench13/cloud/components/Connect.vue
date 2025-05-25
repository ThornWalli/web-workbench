<template>
  <div class="wb-module-files-cloud-connect">
    <wb-form @submit="onSubmit">
      <wb-form-field-textfield v-bind="fields.id" v-model="currentModel.id" />
      <wb-form-field-textfield
        v-bind="fields.apiKey"
        v-model="currentModel.apiKey" />
      <wb-form-field-textfield v-bind="fields.url" v-model="currentModel.url" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="primary"
          :label="applyLabel"
          type="submit"
          :disabled="disabledConnect" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { ModelConnect } from '../types';

const $props = defineProps<{
  model: ModelConnect;
}>();

const $emit = defineEmits<{
  (e: 'close', model: ModelConnect): void;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const currentModel = ref({ ...$props.model });

const applyLabel = 'Connect';

const fields = {
  id: {
    label: 'ID',
    placeholder: 'ID…'
  },
  apiKey: {
    label: 'Api Key',
    placeholder: 'Api Key…'
  },
  url: {
    label: 'Url',
    placeholder: 'https://…'
  }
};

const disabledConnect = computed(() => {
  return (
    !currentModel.value.id ||
    !currentModel.value.apiKey ||
    !currentModel.value.url
  );
});

const onSubmit = () => {
  if (!disabledConnect.value) {
    $emit('close', currentModel.value);
  }
};

// export default {
//   components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldTextfield },

//   props: {
//     model: {
//       type: Object,
//       default() {
//         return {
//           id: null,
//           apiKey: null,
//           url: null
//         };
//       }
//     }
//   },

//   emits: ['close'],

//   setup(props) {
//     const model = toRef(props, 'model');

//     const windowContext = useWindow();
//     windowContext.setContextMenu(contextMenu, { model: model.value });
//     return windowContext;
//   },

//   data() {
//     return {
//       currentModel: { ...this.model },

//       cancelLabel: 'Cancel',
//       applyLabel: 'Connect',

//       fields: {
//         id: {
//           label: 'ID',
//           placeholder: 'ID…'
//         },
//         apiKey: {
//           label: 'Api Key',
//           placeholder: 'Api Key…'
//         },
//         url: {
//           label: 'Url',
//           placeholder: 'https://…'
//         }
//       }
//     };
//   },

//   computed: {
//     disabledConnect() {
//       return (
//         !this.currentModel.id ||
//         !this.currentModel.apiKey ||
//         !this.currentModel.url
//       );
//     }
//   },

//   methods: {
//     onClickCancel() {
//       this.$emit('close');
//     },
//     onSubmit() {
//       if (!this.disabledConnect) {
//         this.$emit('close', this.currentModel);
//       }
//     }
//   }
// };
</script>

<style lang="postcss" scoped>
.wb-module-files-cloud-connect {
  width: 380px;
}
</style>
