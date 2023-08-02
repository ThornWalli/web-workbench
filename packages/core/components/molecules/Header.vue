<template>
  <header class="wb-env-molecule-header" @mouseout="onMouseOut" @pointerdown="onPointerDown" @pointerup="onPointerUp">
    <nav
      v-if="!(showCover || cover)"
      ref="menu"
      class="menu"
    >
      <wb-env-molecule-context-menu :items="items" :content-size="contentSize" @update:model-value="onUpdateModelValueContextMenu" />
    </nav>
    <div v-if="(showCover || cover)" class="cover">
      <span>{{ title }}</span>
    </div>
  </header>
</template>

<script>

import { ipoint } from '@js-basics/vector';
import WbEnvMoleculeContextMenu from '../molecules/ContextMenu';
import webWorkbench from '../../index.js';

export default {
  components: {
    WbEnvMoleculeContextMenu
  },
  props: {
    contentSize: {
      type: Object,
      default () {
        return ipoint(window.innerWidth, window.innerHeight);
      }
    },
    title: {
      type: String,
      default: 'Web-Workbench release. Version 1.3'
    },
    showCover: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default () {
        return webWorkbench.modules.windows.contextMenu.activeItems.items;
      }
    }
  },

  emits: [
    'inputContextMenu'
  ],

  data () {
    return {
      cover: false
    };
  },

  methods: {
    onUpdateModelValueContextMenu (...args) {
      this.$emit('inputContextMenu', ...args);
    },

    onMouseOut () {
      this.cover = false;
    },

    onPointerDown (e) {
      if (e.which === 3) {
        e.preventDefault();
        this.cover = true;
      }
    },

    onPointerUp (e) {
      if (e.which === 3) {
        this.cover = false;
      }
    }

  }

};

</script>

<style lang="postcss" scoped>
.wb-env-molecule-header {
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

  & > .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 2px;
    padding-left: 30px;
    color: var(--color-cover-title);
    background: var(--color-cover-background);
  }

  & > .menu {
    margin-left: 26px;
  }
}
</style>
