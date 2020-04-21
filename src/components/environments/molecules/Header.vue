<template>
  <header class="wb-env-molecule-header" @mouseout="onMouseOut" @mousedown="onMouseDown" @mouseup="onMouseUp">
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

<story
  name="Header"
  group="Environments/Molecules"
  knobs="{}">
  <Header />
</story>

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
        return webWorkbench.modules.windows.contextMenu.activeItems;
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

    onMouseDown (e) {
      if (e.which === 3) {
        e.preventDefault();
        this.cover = true;
      }
    },

    onMouseUp (e) {
      if (e.which === 3) {
        this.cover = false;
      }
    }

  }

};

</script>

<style lang="postcss">
.wb-env-molecule-header {
  position: relative;
  height: 20px;
  color: var(--workbenchColor_3);
  background: var(--workbenchColor_1);

  & > .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 2px;
    padding-left: 30px;
    background: var(--workbenchColor_1);
  }

  & > .menu {
    margin-left: 26px;
  }
}
</style>
