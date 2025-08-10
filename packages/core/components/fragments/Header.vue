<template>
  <header
    class="wb-env-fragment-header"
    :class="{ absolute: absolute }"
    @pointerdown="onPointerDown">
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
import { Subscription } from 'rxjs';
import domEvents from '@web-workbench/core/services/domEvents';

const defaultTitle = 'Web-Workbench release. Version 1.3';
const defaultParentLayout = {
  size: ipoint(window.innerWidth, window.innerHeight)
};

const $props = defineProps<{
  core?: Core;
  absolute?: boolean;
  parentLayout?: Layout;
  title?: string;
  showCover?: boolean;
  items?: Array<MenuItemBase>;
}>();

const $emit = defineEmits<{
  (e: 'cover', event: PointerEvent, cover: boolean): void;
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

function resetCover(e: PointerEvent) {
  cover.value = false;
  unregisterMove();
  $emit('cover', e, cover.value);
}

function registerMove() {
  subscription = subscription || new Subscription();
  subscription.add(domEvents.pointerCancel$.subscribe(pointerCancel));
  subscription.add(domEvents.pointerLeave$.subscribe(onPointerLeave));
  subscription.add(domEvents.pointerUp$.subscribe(onPointerUp));
}

function unregisterMove() {
  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }
}

let subscription;
function onPointerDown(e: PointerEvent) {
  if (e.button === MOUSE_BUTTON.RIGHT) {
    e.preventDefault();
    registerMove();
    cover.value = true;
    $emit('cover', e, cover.value);
  }
}

function pointerCancel(e) {
  resetCover(e);
}

function onPointerUp(e) {
  resetCover(e);
}

function onPointerLeave(e) {
  resetCover(e);
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
    padding-top: 3px;
    padding-left: 30px;
    color: var(--color-cover-title);
    background: var(--color-cover-background);
  }

  & > .menu {
    margin-left: 26px;
  }

  &.absolute {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
