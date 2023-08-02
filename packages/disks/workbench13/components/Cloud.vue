<template>
  <div class="wb-disks-workbench13-cloud-connect">
    <wb-form>
      <wb-item-select v-bind="fields.itemSelect" :items="parsedItems" :model="model" />
      <wb-button-wrapper align="outer" full>
        <wb-button
          style-type="secondary"
          :label="disconnectLabel"
          :disabled="disabledDisconnect"
          @click="onClickDisconnect"
        />
        <wb-button
          style-type="secondary"
          :label="logoutLabel"
          :disabled="disabledLogout"
          @click="onClickLogout"
        />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>

import { toRef } from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbButton from '@web-workbench/core/components/atoms/Button';
import WbItemSelect from '@web-workbench/core/components/atoms/formField/ItemSelect';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper';
import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import ContextMenuItems from '@web-workbench/core/classes/ContextMenuItems';

import contextMenu from '../cloud/contextMenu';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbItemSelect },

  props: {
    ...windowProps,
    model: {
      type: Object,
      default () {
        return {
          id: null,
          items: []
        };
      }
    }
  },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

  data () {
    return {
      // items: [
      //   // { name: 'Item 1', id: 'item-1' },
      //   // { name: 'Item 2', id: 'item-2' }
      // ],

      disconnectLabel: 'Disconnect',
      loginLabel: 'Login',
      logoutLabel: 'Logout',

      fields: {
        itemSelect: {
          title: 'Mounted Storages:',
          name: 'id'
        }
      }

    };
  },

  computed: {
    parsedItems () {
      const items = this.model.items;
      return items.map((item) => {
        const isLogged = item.isLogged();
        return {
          label: `${item.name} ${isLogged ? 'LOGGED IN' : ''}`,
          value: item.id,
          isLogged,
          id: item.id
        };
      }).concat(Array(Math.max(3 - items.length, 0)).fill({
        label: null,
        disabled: true
      }));
    },
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
    },
    disabledDisconnect () {
      return !this.model.id || this.model.items.length < 1;
    },
    disabledLogout () {
      return !this.parsedItems.find(item => item.id === this.model.id && item.isLogged) || this.model.items.length < 1;
    }

  },

  methods: {
    onClickDisconnect () {
      this.model.actions.disconnect(this.model.id);
    },

    onClickLogout () {
      this.model.actions.logout(this.model.id);
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-cloud-connect {
  width: 380px;
}
</style>
