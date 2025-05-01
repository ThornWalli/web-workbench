<template>
  <div class="wb-disks-debug-symbols">
    <div>
      <figure
        v-for="name in symbols"
        :key="name"
        :class="{ selected: showSelected, 'symbol-used': showSymbolUsed }">
        <i v-if="core?.modules.symbols">
          <component :is="core.modules.symbols.symbols.get(name)" />
        </i>
        <figcaption>{{ name }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';

import { SYMBOL } from '@web-workbench/core/utils/symbols';

import contextMenu from '../symbol/contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import useCore from '@web-workbench/core/composables/useCore';
import { CONFIG_NAMES, type ModelSymbol } from '../types';

const model = reactive<ModelSymbol>({
  [CONFIG_NAMES.SHOW_SYMBOL_USED]: false,
  [CONFIG_NAMES.SHOW_SELECTED]: false
});
const { core } = useCore();
const { setContextMenu } = useWindow();

setContextMenu(contextMenu, { model: model });

const showSelected = computed(() => {
  return model[CONFIG_NAMES.SHOW_SELECTED];
});
const showSymbolUsed = computed(() => {
  return model[CONFIG_NAMES.SHOW_SYMBOL_USED];
});
const symbols = computed(() => {
  return Object.values(SYMBOL);
});
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
