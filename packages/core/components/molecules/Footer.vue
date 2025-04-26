<template>
  <footer class="wb-env-molecule-footer">
    <nav ref="menu" class="menu">
      <wb-env-molecule-context-menu
        direction="top"
        :items="preparedItems"
        :parent-layout="parentLayout"
        @update:model-value="onUpdateModelValueContextMenu" />
    </nav>
  </footer>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';

import WbEnvMoleculeContextMenu from '../molecules/ContextMenu.vue';
import { computed } from 'vue';
import type MenuItem from '../../classes/MenuItem';
import useCore from '../../composables/useCore';

const { core } = useCore();

const $props = defineProps({
  parentLayout: {
    type: Object,
    default() {
      return {
        size: ipoint(window.innerWidth, window.innerHeight)
      };
    }
  },
  title: {
    type: String,
    default: 'Web-Workbench release. Version 1.3'
  },
  items: {
    type: Array<MenuItem>,
    default() {
      return undefined;
    }
  }
});

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
