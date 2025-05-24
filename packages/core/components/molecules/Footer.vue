<template>
  <footer class="wb-env-molecule-footer">
    <nav ref="menu" class="menu">
      <wb-env-molecule-context-menu
        :direction="DIRECTION.TOP"
        :items="preparedItems"
        :parent-layout="parentLayout || defaultParentLayout"
        @update:model-value="onUpdateModelValueContextMenu" />
    </nav>
  </footer>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';

import WbEnvMoleculeContextMenu, {
  DIRECTION
} from '../molecules/ContextMenu.vue';
import { computed } from 'vue';
import type { MenuItemBase } from '../../classes/MenuItem';
import useCore from '../../composables/useCore';
import type { Layout } from '../../types';

const { core } = useCore();

const defaultParentLayout = {
  size: ipoint(window.innerWidth, window.innerHeight)
};

const $props = defineProps<{
  parentLayout?: Layout;
  title?: string;
  items?: Array<MenuItemBase>;
}>();

const $emit = defineEmits<{
  (e: 'inputContextMenu', ...args: unknown[]): void;
}>();

const preparedItems = computed(() => {
  return (
    $props.items || core.value?.modules.windows?.contextMenu.activeItems.items
  );
});

function onUpdateModelValueContextMenu(...args: unknown[]) {
  $emit('inputContextMenu', ...args);
}
</script>

<style lang="postcss" scoped>
.wb-env-molecule-footer {
  --color-background: var(--color-header-background, #fff);
  --color-title: var(--color-header-title, #05a);

  position: relative;

  /* z-index: 101; */
  height: 20px;
  color: var(--color-title);
  user-select: none;
  background: var(--color-background);

  & > .menu {
    /* margin: 0 26px; */
    margin-right: var(--default-element-margin);
  }
}
</style>
