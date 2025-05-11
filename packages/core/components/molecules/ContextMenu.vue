<template>
  <ul
    ref="rootEl"
    class="wb-atom-context-menu"
    :class="{ [`direction-${direction}`]: direction }"
    @pointerover="hovered = true"
    @pointerout="
      itemFocus = 0;
      hovered = false;
    ">
    <component
      :is="getComponent(item)"
      v-for="item in sortedItems"
      :key="item.id"
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
  provide,
  ref,
  type ComputedRef,
  type Ref
} from 'vue';
import ItemText from '../atoms/contextMenu/Text.vue';
import ItemUpload from '../atoms/contextMenu/Upload.vue';
import ItemSeparator from '../atoms/contextMenu/Separator.vue';
import ItemSpacer from '../atoms/contextMenu/Spacer.vue';
import type MenuItem from '../../classes/MenuItem';
import { MENU_ITEM_TYPE } from '../../classes/MenuItem';
import type { Layout } from '@web-workbench/core/types';

const rootEl = ref<HTMLElement>();
const hovered = ref(false);

const hasFocusedItems = computed(() => {
  return itemFocus.value > 0 || hovered.value;
});
provide('hasFocusedItems', hasFocusedItems);

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
  () => import('../atoms/contextMenu/Item.vue')
);

const defaultDirection = DIRECTION.BOTTOM;
const defaultParentLayout = {
  size: ipoint(window.innerWidth, window.innerHeight)
};

const $props = defineProps<{
  direction?: DIRECTION;
  parentLayout?: Layout;
  items?: Array<MenuItem>;
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

function getComponent(item: MenuItem) {
  switch (item.type) {
    case MENU_ITEM_TYPE.SPACER:
      return ItemSpacer;
    case MENU_ITEM_TYPE.SEPARATOR:
      return ItemSeparator;
    case MENU_ITEM_TYPE.TEXT:
      return ItemText;
    case MENU_ITEM_TYPE.UPLOAD:
      return ItemUpload;
    default:
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
.wb-atom-context-menu {
  --color-border: var(--color-context-menu-border, #05a);

  /* gap: 4px; */
  clear: fix;
  display: flex;
  gap: 9px;

  .wb-env-atom-context-menu-item > & {
    display: none;
  }

  .wb-env-atom-context-menu-item:hover > & {
    display: flex;
    flex-direction: column;
  }

  & .wb-atom-context-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    box-sizing: border-box;
    min-width: 75px;
    margin-top: -2px;
    border: solid var(--color-border) 2px;
  }

  &.direction-top .wb-atom-context-menu {
    top: auto;
    bottom: 100%;
    margin-top: 2px;
  }

  /* * :not(.wb-env-atom-context-menu-item) > .wb-atom-context-menu > .wb-env-atom-context-menu-item.context-halign-right >  & {
    right: 0;
    left: auto;
    margin-right: -2px;
  } */

  .wb-atom-context-menu
    .wb-env-atom-context-menu-item.context-halign-right
    > *
    & {
    left: 100%;
    margin-left: -2px;
  }

  .wb-atom-context-menu
    .wb-env-atom-context-menu-item.context-halign-left
    > *
    & {
    right: 100%;
    left: auto;
    margin-left: 2px;
  }

  .wb-atom-context-menu
    .wb-env-atom-context-menu-item.context-valign-top
    > *
    & {
    top: auto;
    bottom: 0;
    margin-top: 2px;
  }

  .wb-atom-context-menu
    .wb-env-atom-context-menu-item.context-valign-bottom
    > *
    & {
    top: 0;
    bottom: auto;
    margin-top: -2px;
  }
}
</style>
