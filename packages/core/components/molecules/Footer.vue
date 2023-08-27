<template>
  <footer class="wb-env-molecule-footer">
    <nav ref="menu" class="menu">
      <wb-env-molecule-context-menu
        direction="top"
        :items="items"
        :parent-layout="parentLayout"
        @update:model-value="onUpdateModelValueContextMenu" />
    </nav>
  </footer>
</template>

<script>
import { ipoint } from '@js-basics/vector';
import webWorkbench from '@web-workbench/core';
import WbEnvMoleculeContextMenu from '../molecules/ContextMenu';

export default {
  components: {
    WbEnvMoleculeContextMenu
  },
  props: {
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
      type: Array,
      default() {
        return webWorkbench.modules.windows.contextMenu.activeItems.items;
      }
    }
  },

  emits: ['inputContextMenu'],

  data() {
    return {
      cover: false
    };
  },

  methods: {
    onUpdateModelValueContextMenu(...args) {
      this.$emit('inputContextMenu', ...args);
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-molecule-footer {
  --color-background: var(--color-header-background, #fff);
  --color-cover-background: var(--color-header-cover-background, #fff);
  --color-cover-title: var(--color-header-cover-title, #05a);
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
