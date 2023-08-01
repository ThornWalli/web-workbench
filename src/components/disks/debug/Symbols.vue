<template>
  <div class="wb-disks-debug-symbols">
    <div>
      <figure v-for="name in symbols" :key="name" :class="{'selected': showSelected, 'symbol-used': showSymbolUsed}">
        <i><component :is="symbolsModule.symbols.get(name)" /></i>
        <figcaption>{{ name }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<script>

import { ref } from 'vue';

import { SYMBOL } from '../../../web-workbench/utils/symbols';

import useWindow, { props as windowProps, emits as windowEmits } from '@/composables/useWindow';

import contextMenu, { CONFIG_NAMES } from '@/web-workbench/disks/debug/symbol/contextMenu';

export default {

  props: {
    ...windowProps
  },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const model = ref({
      [CONFIG_NAMES.SHOW_SYMBOL_USED]: false,
      [CONFIG_NAMES.SHOW_SELECTED]: false
    });
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return { ...windowContext, model };
  },

  computed: {
    showSelected () {
      return this.model[CONFIG_NAMES.SHOW_SELECTED];
    },
    showSymbolUsed () {
      return this.model[CONFIG_NAMES.SHOW_SYMBOL_USED];
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
      border-bottom: solid var(--color-window-border) 2px;
      border-left: solid var(--color-window-border) 2px;

      &.selected {
        & svg {
          filter: var(--filter-default);
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
        color: var(--color-window-background);
        text-align: center;
        background: var(--color-window-text);
      }
    }
  }
}
</style>
