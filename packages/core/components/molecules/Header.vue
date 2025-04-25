<template>
  <header
    class="wb-env-molecule-header"
    @mouseout="onMouseOut"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp">
    <nav v-if="!(showCover || cover)" ref="menu" class="menu">
      <wb-env-molecule-context-menu
        :items="preparedItems"
        :parent-layout="parentLayout"
        @update:model-value="onUpdateModelValueContextMenu" />
    </nav>
    <div v-if="showCover || cover" class="cover">
      <span>{{ title }}</span>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';

import WbEnvMoleculeContextMenu from '../molecules/ContextMenu.vue';
import { computed, ref } from 'vue';
import type MenuItem from '@web-workbench/core/classes/MenuItem';
import { MOUSE_BUTTON } from '@web-workbench/core/services/dom';
import useCore from '@web-workbench/core/composables/useCore';

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
  showCover: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array<MenuItem>,
    default: []
  }
});

const $emit = defineEmits<{
  (e: 'inputContextMenu', ...args: unknown[]): void;
}>();

const cover = ref(false);

const preparedItems = computed(() => {
  return (
    $props.items || core.value?.modules.windows?.contextMenu.activeItems.items
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
