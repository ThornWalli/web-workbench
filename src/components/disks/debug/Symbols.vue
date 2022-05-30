<template>
  <div class="wb-disks-debug-symbols">
    <div>
      <figure v-for="name in symbols" :key="name" :class="{'js--selected': showSelected, 'js--symbol-used': showSymbolUsed}">
        <i><component :is="symbolsModule.symbols.get(name)" /></i>
        <figcaption>{{ name }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<script>

import { SYMBOL } from '../../../web-workbench/utils/symbols';
import ContextMenuItems from '../../../web-workbench/classes/ContextMenuItems';
import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu, { CONFIG_NAMES } from '@/web-workbench/disks/debug/symbol/contextMenu';

export default {
  mixins: [
    MixinWindowComponent
  ],

  data () {
    return {
      model: {
        [CONFIG_NAMES.SHOW_SYMBOL_USED]: false,
        [CONFIG_NAMES.SHOW_SELECTED]: false
      }
    };
  },

  computed: {
    showSelected () {
      return this.model[CONFIG_NAMES.SHOW_SELECTED];
    },
    showSymbolUsed () {
      return this.model[CONFIG_NAMES.SHOW_SYMBOL_USED];
    },
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
    },
    symbolsModule () {
      return this.core.modules.symbols;
    },
    symbols () {
      return Object.values(SYMBOL);
    }
  }

};
</script>

<style lang="postcss" scoped>
.wb-disks-debug-symbols {
  min-width: 380px;

  & > div {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    & figure {
      position: relative;
      width: calc(100% / 3);
      padding: 10px 0;
      padding-top: 23px;
      margin: 0;
      border-bottom: solid var(--color__window__border) 2px;
      border-left: solid var(--color__window__border) 2px;

      &.js--selected {
        & svg {
          filter: var(--filter__default);
        }
      }

      & i {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 75px;

        & > * {
          position: relative;
          margin: 0 auto;
        }
      }

      & figcaption {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 5px;
        padding-right: 2px;
        color: var(--color__window__background);
        text-align: center;
        background: var(--color__window__text);
      }
    }
  }
}
</style>
