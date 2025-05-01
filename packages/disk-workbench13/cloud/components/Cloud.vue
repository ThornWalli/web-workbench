<template>
  <div class="wb-disks-workbench13-cloud-connect">
    <wb-form>
      <wb-item-select v-bind="fieldItemSelect" :items="parsedItems" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="secondary"
          :label="disconnectLabel"
          :disabled="disabledDisconnect"
          @click="onClickDisconnect" />
        <wb-button
          style-type="secondary"
          :label="logoutLabel"
          :disabled="disabledLogout"
          @click="onClickLogout" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form.vue';
import WbButton from '@web-workbench/core/components/atoms/Button.vue';
import WbItemSelect from '@web-workbench/core/components/atoms/formField/ItemSelect.vue';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper.vue';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../types';

const $props = defineProps<{
  model: Model;
  setId: (id: string) => void;
}>();
// const $props = defineProps({
//   model: {
//     type: Object,
//     default() {
//       return {
//         id: null,
//         items: []
//       };
//     }
//   },
//   setId: {
//     type: Function,
//     default() {
//       return () => {
//         return;
//       };
//     }
//   }
// });

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, {
  model: $props.model
});

const disconnectLabel = 'Disconnect';
// const loginLabel = 'Login';
const logoutLabel = 'Logout';

const fieldItemSelect = {
  title: 'Mounted Storages:',
  name: 'id',
  modelValue: $props.model.id || '',
  'onUpdate:model-value': (value: string) => $props.setId(value)
};

const parsedItems = computed(() => {
  const items = $props.model.items;
  return items
    .map(item => {
      const isLogged = item.isLogged();
      return {
        label: `${item.name} ${isLogged ? 'LOGGED IN' : ''}`,
        value: item.id,
        isLogged,
        id: item.id
      };
    })
    .concat(
      Array(Math.max(3 - items.length, 0)).fill({
        label: null,
        disabled: true
      })
    );
});

const disabledDisconnect = computed(() => {
  return !$props.model.id || $props.model.items.length < 1;
});

const disabledLogout = computed(() => {
  return (
    !parsedItems.value.find(
      item => item.id === $props.model.id && item.isLogged
    ) || $props.model.items.length < 1
  );
});

const onClickDisconnect = () => {
  if ($props.model.id) {
    $props.model.actions?.disconnect($props.model.id);
  }
};

const onClickLogout = () => {
  if ($props.model.id) {
    $props.model.actions?.logout($props.model.id);
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-cloud-connect {
  width: 380px;
}
</style>
