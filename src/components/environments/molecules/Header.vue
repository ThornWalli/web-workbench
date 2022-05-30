<template>
  <header class="wb-env-molecule-header" @mouseout="onMouseOut" @pointerdown="onPointerDown" @pointerup="onPointerUp">
    <nav
      v-if="!(showCover || cover)"
      ref="menu"
      class="menu"
    >
      <wb-env-molecule-context-menu :items="items" :content-size="contentSize" @input="onInputContextMenu" />
    </nav>
    <div v-if="(showCover || cover)" class="cover">
      <span>{{ title }}</span>
    </div>
  </header>
</template>

<script>

import { ipoint } from '@js-basics/vector';
import webWorkbench from '@/web-workbench';
import WbEnvMoleculeContextMenu from '@/components/environments/molecules/ContextMenu';

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
  data () {
    return {
      cover: false
    };
  },
  methods: {
    onInputContextMenu (...args) {
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

<style lang="postcss">
:root {
  --color__header__background: #fff;
  --color__header__coverBackground: #fff;
  --color__header__coverTitle: #05a;
  --color__header__title: #05a;
}
</style>

<style lang="postcss" scoped>
.wb-env-molecule-header {
  position: relative;

  /* z-index: 101; */
  height: 20px;
  color: var(--color__header__title);
  user-select: none;
  background: var(--color__header__background);

  & > .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 2px;
    padding-left: 30px;
    color: var(--color__header__coverTitle);
    background: var(--color__header__coverBackground);
  }

  & > .menu {
    margin-left: 26px;
  }
}
</style>
