<template>
  <header
    class="wb-env-fragment-header"
    @mouseout="onMouseOut"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp">
    <nav v-if="!(showCover || cover)" ref="menu" class="menu">
      <wb-env-fragment-context-menu
        :core="core"
        :items="preparedItems"
        :parent-layout="parentLayout || defaultParentLayout"
        @update:model-value="onUpdateModelValueContextMenu" />
    </nav>
    <div v-if="showCover || cover" class="cover">
      <span>{{ title || defaultTitle }}</span>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';

import WbEnvFragmentContextMenu from '../fragments/ContextMenu.vue';
import { computed, ref } from 'vue';
import { MOUSE_BUTTON } from '../../services/dom';
import type { Layout } from '@web-workbench/core/types';
import type { MenuItemBase } from '@web-workbench/core/classes/MenuItem';
import type Core from '@web-workbench/core/classes/Core';

const defaultTitle = 'Web-Workbench release. Version 1.3';
const defaultParentLayout = {
  size: ipoint(window.innerWidth, window.innerHeight)
};

const $props = defineProps<{
  core?: Core;
  parentLayout?: Layout;
  title?: string;
  showCover?: boolean;
  items?: Array<MenuItemBase>;
}>();

const $emit = defineEmits<{
  (e: 'inputContextMenu', ...args: unknown[]): void;
}>();

const cover = ref(false);

const preparedItems = computed(() => {
  return (
    $props.items ||
    $props.core?.modules.windows?.contextMenu.activeItems.items ||
    []
  );
});

function onUpdateModelValueContextMenu(...args: unknown[]) {
  $emit('inputContextMenu', ...args);
}

function onMouseOut() {
  cover.value = false;
}

function onPointerDown(e: PointerEvent) {
  if (e.button === MOUSE_BUTTON.RIGHT) {
    e.preventDefault();
    cover.value = true;
  }
}

function onPointerUp(e: PointerEvent) {
  if (e.button === MOUSE_BUTTON.RIGHT) {
    cover.value = false;
  }
}
</script>

<style lang="postcss" scoped>
.wb-env-fragment-header {
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
