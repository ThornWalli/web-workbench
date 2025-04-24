<template>
  <ul
    class="wb-atom-context-menu"
    :class="{ [`direction-${direction}`]: direction }">
    <component
      :is="getComponent(item)"
      v-for="item in sortedItems"
      :key="item.id"
      tag="li"
      :item="item"
      :direction="direction"
      :parent-layout="parentLayout"
      v-bind="item"
      @update:model-value="onUpdateModelValueItem" />
  </ul>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';
import { computed, defineAsyncComponent } from 'vue';
import ItemText from '../atoms/contextMenu/Text.vue';
import ItemUpload from '../atoms/contextMenu/Upload.vue';
import ItemSeparator from '../atoms/contextMenu/Separator.vue';
import ItemSpacer from '../atoms/contextMenu/Spacer.vue';
import type MenuItem from '../../classes/MenuItem';
import { MENU_ITEM_TYPE } from '../../classes/MenuItem';

// const examples = [
//   {
//     title: 'Item 1'
//   },
//   {
//     title: 'Item 2',
//     items: [
//       {
//         title: 'Sub Item 1',
//         hotKey: 'S',
//         keyCode: 73
//       },
//       {
//         type: MENU_ITEM_TYPE.SEPARATOR
//       },
//       {
//         title: 'Sub Item 2',
//         items: [
//           {
//             title: 'Sub Item 2.1'
//           },
//           {
//             title: 'Sub Item 2.2',
//             items: [
//               {
//                 title: 'Sub Item 2.1'
//               },
//               {
//                 title: 'Sub Item 2.2',
//                 items: [
//                   {
//                     title: 'Sub Item 2.1'
//                   },
//                   {
//                     title: 'Sub Item 2.2'
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         title: 'Sub Item 3'
//       }
//     ]
//   },
//   {
//     title: 'Checkbox',
//     items: [
//       {
//         type: MENU_ITEM_TYPE.RADIO,
//         name: 'test-radio-1',
//         value: 'test-radio-value-1',
//         title: 'Checkbox 1 (as Radio)'
//       },
//       {
//         type: MENU_ITEM_TYPE.RADIO,
//         name: 'test-radio-1',
//         value: 'test-radio-value-2',
//         title: 'Checkbox 2 (as Radio)'
//       },
//       {
//         type: MENU_ITEM_TYPE.RADIO,
//         name: 'test-radio-1',
//         value: 'test-radio-value-3',
//         title: 'Checkbox 3 (as Radio)'
//       },
//       {
//         type: MENU_ITEM_TYPE.SEPARATOR
//       },
//       {
//         type: MENU_ITEM_TYPE.CHECKBOX,
//         name: 'test-checkbox-1',
//         value: 'test-checkbox-value-1',
//         title: 'Checkbox 1'
//       },
//       {
//         type: MENU_ITEM_TYPE.CHECKBOX,
//         name: 'test-checkbox-2',
//         value: 'test-checkbox-value-2',
//         title: 'Checkbox 2'
//       },
//       {
//         type: MENU_ITEM_TYPE.CHECKBOX,
//         name: 'test-checkbox-3',
//         value: 'test-checkbox-value-3',
//         title: 'Checkbox 3'
//       }
//     ]
//   },
//   {
//     type: MENU_ITEM_TYPE.CHECKBOX,
//     title: 'Item 5',
//     hotKey: 'I',
//     keyCode: 73
//   }
// ];
// generateMenuItems(examples);

const ItemDefault = defineAsyncComponent(
  () => import('../atoms/contextMenu/Item.vue')
);

const $props = defineProps({
  direction: {
    type: String,
    default: 'bottom',
    validator: (value: string) => ['top', 'bottom'].includes(value)
  },
  parentLayout: {
    type: Object,
    default() {
      return {
        size: ipoint(window.innerWidth, window.innerHeight)
      };
    }
  },
  items: {
    type: Array<MenuItem>,
    required: false,
    default() {
      return [];
    }
  }
});

const $emit = defineEmits(['update:model-value']);

const sortedItems = computed(() => {
  const items = $props.items;
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
    display: block;
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
