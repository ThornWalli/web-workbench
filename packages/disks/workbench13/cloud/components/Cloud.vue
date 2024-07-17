<template>
  <div class="wb-disks-workbench13-cloud-connect">
    <wb-form>
      <wb-item-select
        v-bind="fields.itemSelect"
        :items="parsedItems"
        :model="model" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="secondary"
          :label="labels.disconnect"
          :disabled="disabledDisconnect"
          @click="onClickDisconnect" />
        <wb-button
          style-type="secondary"
          :label="labels.logout"
          :disabled="disabledLogout"
          @click="onClickLogout" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script setup>
import { toRef, ref, computed } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbButton from '@web-workbench/core/components/atoms/Button';
import WbItemSelect from '@web-workbench/core/components/atoms/formField/ItemSelect';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';

const $props = defineProps({
  model: {
    type: Object,
    default() {
      return {
        id: null,
        items: []
      };
    }
  }
});

const model = toRef($props, 'model');
const windowContext = useWindow();
windowContext.setContextMenu(contextMenu, { model: model.value });

const labels = ref({
  disconnect: 'Disconnect',
  logout: 'Logout'
});

const fields = ref({
  itemSelect: {
    title: 'Mounted Storages:',
    name: 'id'
  }
});

const parsedItems = computed(() => {
  const items = this.model.items;
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
  return !this.model.id || this.model.items.length < 1;
});

const disabledLogout = computed(() => {
  return (
    !this.parsedItems.find(
      item => item.id === this.model.id && item.isLogged
    ) || this.model.items.length < 1
  );
});

const onClickDisconnect = () => {
  this.model.actions.disconnect(this.model.id);
};

const onClickLogout = () => {
  this.model.actions.logout(this.model.id);
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-cloud-connect {
  width: 380px;
}
</style>
