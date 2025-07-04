<template>
  <ul
    ref="rootEl"
    class="wb-element-context-menu"
    :data-index="contextMenuIndex.index"
    :class="{
      'ignore-hover': ignoreHover,
      [`direction-${direction}`]: direction
    }"
    @pointerover="hovered = true"
    @pointerout="
      itemFocus = 0;
      hovered = false;
    ">
    <component
      :is="getComponent(item)"
      v-for="item in sortedItems"
      :key="item.id"
      :core="$props.core"
      tag="li"
      :item="item"
      :direction="direction || defaultDirection"
      :parent-layout="parentLayout || defaultParentLayout"
      @update:model-value="onUpdateModelValueItem" />
  </ul>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';
import {
  computed,
  defineAsyncComponent,
  inject,
  provide,
  ref,
  type ComputedRef,
  type Ref
} from 'vue';
import ItemText from '../elements/menuItem/Text.vue';
import ItemUpload from '../elements/menuItem/Upload.vue';
import ItemSeparator from '../elements/menuItem/Separator.vue';
import ItemSpacer from '../elements/menuItem/Spacer.vue';
import type { Layout } from '@web-workbench/core/types';
import {
  MenuItemSeparator,
  MenuItemSpacer,
  MenuItemText,
  MenuItemUpload,
  type MenuItemBase
} from '@web-workbench/core/classes/MenuItem';
import type Core from '@web-workbench/core/classes/Core';

const rootEl = ref<HTMLElement>();
const hovered = ref(false);

const contextMenuIndex = ref(inject('contextMenuIndex', { index: 0 }));
provide('contextMenuIndex', { index: contextMenuIndex.value.index++ });

const hasFocusedItems = computed(() => {
  return itemFocus.value > 0 || hovered.value;
});
provide('hasFocusedItems', hasFocusedItems);

const ignoreHover = ref(false);
const closeContextMenu = inject('closeContextMenu', () => void 0);
provide('closeContextMenu', () => {
  console.log('Context menu close');
  hovered.value = false;
  ignoreHover.value = true;
  closeContextMenu();
  window.setTimeout(() => {
    ignoreHover.value = false;
  }, 500);
});

const itemFocus = ref(0);
provide('addItemFocus', () => {
  itemFocus.value++;
});
provide('removeItemFocus', () => {
  itemFocus.value--;
});

defineExpose<{
  $el: Ref<HTMLElement | undefined>;
  hasFocusedItem: ComputedRef<boolean>;
}>({
  $el: rootEl,
  hasFocusedItem: hasFocusedItems
});

const ItemDefault = defineAsyncComponent(
  () => import('../elements/MenuItem.vue')
);

const defaultDirection = DIRECTION.BOTTOM;
const defaultParentLayout = {
  size: ipoint(window.innerWidth, window.innerHeight)
};

const $props = defineProps<{
  core?: Core;
  direction?: DIRECTION;
  parentLayout?: Layout;
  items?: MenuItemBase[];
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', ...args: unknown[]): void;
}>();

const sortedItems = computed(() => {
  const items = $props.items || [];
  return items.sort((a, b) => (a.order || 0) - (b.order || 0));
});

function onUpdateModelValueItem(...args: unknown[]) {
  $emit('update:model-value', ...args);
}

function getComponent(item: MenuItemBase) {
  if (item instanceof MenuItemSpacer) {
    return ItemSpacer;
  } else if (item instanceof MenuItemSeparator) {
    return ItemSeparator;
  } else if (item instanceof MenuItemText) {
    return ItemText;
  } else if (item instanceof MenuItemUpload) {
    return ItemUpload;
  } else {
    return ItemDefault;
  }
}
</script>

<script lang="ts">
export enum DIRECTION {
  TOP = 'top',
  BOTTOM = 'bottom'
}
</script>

<style lang="postcss" scoped>
.wb-element-context-menu {
  --color-border: var(--color-context-menu-border, #05a);

  clear: fix;
  display: flex;
  gap: 9px;

  .wb-env-element-context-menu-item > & {
    display: none;
  }

  &:not(.ignore-hover) {
    .wb-env-element-context-menu-item:hover > & {
      display: flex;
      flex-direction: column;
    }
  }

  & .wb-element-context-menu {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    box-sizing: border-box;
    min-width: 75px;
    margin-top: -2px;
    border: solid var(--color-border) 2px;
  }

  &.direction-top .wb-element-context-menu {
    top: auto;
    bottom: 100%;
    margin-top: 2px;
  }

  /* * :not(.wb-env-element-context-menu-item) > .wb-element-context-menu > .wb-env-element-context-menu-item.context-halign-right >  & {
    right: 0;
    left: auto;
    margin-right: -2px;
  } */

  &:not([data-index='1']) {
    &
      > .wb-env-element-context-menu-item.context-halign-right
      > .wb-element-context-menu {
      left: 100%;
    }

    &
      > .wb-env-element-context-menu-item.context-halign-left
      > .wb-element-context-menu {
      right: 100%;
      left: auto;
    }
  }

  &[data-index='1'] {
    &
      > .wb-env-element-context-menu-item.context-halign-right
      > .wb-element-context-menu {
      right: auto;
      left: 0;
    }

    &
      > .wb-env-element-context-menu-item.context-halign-left
      > .wb-element-context-menu {
      right: 0;
      left: auto;
    }

    &
      > .wb-env-element-context-menu-item.context-valign-top
      > .wb-element-context-menu {
      top: auto;
      bottom: 0;
    }

    &
      > .wb-env-element-context-menu-item.context-valign-bottom
      > .wb-element-context-menu {
      top: 100%;
      bottom: auto;
    }
  }
}
</style>
