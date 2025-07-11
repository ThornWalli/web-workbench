<template>
  <div class="wb-disks-debug-symbols">
    <div>
      <figure
        v-for="symbol in core?.modules.symbols?.symbols.values() || []"
        :key="symbol.key"
        :class="{ selected: showSelected, 'symbol-used': showSymbolUsed }">
        <i>
          <component :is="symbol.component" />
        </i>
        <figcaption>{{ symbol.group }} - {{ symbol.key }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import contextMenu from '../symbols/contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import useCore from '@web-workbench/core/composables/useCore';
import { CONFIG_NAME } from '../types';
import type { ModelSymbol } from '../types';

const model = reactive<ModelSymbol>({
  [CONFIG_NAME.SHOW_SYMBOL_USED]: false,
  [CONFIG_NAME.SHOW_SELECTED]: false
});
const { core } = useCore();
const { setContextMenu } = useWindow();

setContextMenu(contextMenu, { model: model });

const showSelected = computed(() => {
  return model[CONFIG_NAME.SHOW_SELECTED];
});
const showSymbolUsed = computed(() => {
  return model[CONFIG_NAME.SHOW_SYMBOL_USED];
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
