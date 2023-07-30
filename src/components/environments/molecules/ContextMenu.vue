<template>
  <ul class="wb-atom-context-menu">
    <component
      :is="getComponent(item)"
      v-for="(item) in sortedItems"
      :key="item.id"
      tag="li"
      :content-size="contentSize"
      v-bind="item"
      @update:model-value="onUpdateModelValueItem"
    />
  </ul>
</template>

<script>

import { ipoint } from '@js-basics/vector';
import { defineAsyncComponent } from 'vue';
import Separator from '../atoms/contextMenu/Separator';
import { generateMenuItems, MENU_ITEM_TYPE } from '../../../web-workbench/classes/MenuItem';

const examples = [
  {
    title: 'Item 1'
  },
  {
    title: 'Item 2',
    items: [
      {
        title: 'Sub Item 1',
        hotKey: 'S',
        keyCode: 73
      },
      {
        separator: true
      },
      {
        title: 'Sub Item 2',
        items: [
          {
            title: 'Sub Item 2.1'
          },
          {
            title: 'Sub Item 2.2',
            items: [
              {
                title: 'Sub Item 2.1'
              },
              {
                title: 'Sub Item 2.2',
                items: [
                  {
                    title: 'Sub Item 2.1'
                  },
                  {
                    title: 'Sub Item 2.2'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'Sub Item 3'
      }
    ]
  },
  {
    title: 'Checkbox',
    items: [
      {
        type: MENU_ITEM_TYPE.RADIO,
        name: 'test-radio-1',
        value: 'test-radio-value-1',
        title: 'Checkbox 1 (as Radio)'
      },
      {
        type: MENU_ITEM_TYPE.RADIO,
        name: 'test-radio-1',
        value: 'test-radio-value-2',
        title: 'Checkbox 2 (as Radio)'
      },
      {
        type: MENU_ITEM_TYPE.RADIO,
        name: 'test-radio-1',
        value: 'test-radio-value-3',
        title: 'Checkbox 3 (as Radio)'
      },
      {
        separator: true
      },
      {
        type: MENU_ITEM_TYPE.CHECKBOX,
        name: 'test-checkbox-1',
        value: 'test-checkbox-value-1',
        title: 'Checkbox 1'
      },
      {
        type: MENU_ITEM_TYPE.CHECKBOX,
        name: 'test-checkbox-2',
        value: 'test-checkbox-value-2',
        title: 'Checkbox 2'
      },
      {
        type: MENU_ITEM_TYPE.CHECKBOX,
        name: 'test-checkbox-3',
        value: 'test-checkbox-value-3',
        title: 'Checkbox 3'
      }
    ]
  },
  {
    type: MENU_ITEM_TYPE.CHECKBOX,
    title: 'Item 5',
    hotKey: 'I',
    keyCode: 73
  }
]; ;

export default {
  components: {
    Separator,
    Item: defineAsyncComponent(() => import('../atoms/contextMenu/Item'))
  },
  props: {
    contentSize: {
      type: Object,
      default () {
        return ipoint(window.innerWidth, window.innerHeight);
      }
    },
    items: {
      type: Array,
      required: false,
      default () {
        return generateMenuItems(examples);
      }
    }
  },
  emits: [
    'update:modelValue'
  ],
  computed: {
    sortedItems () {
      const items = this.items;
      return items.sort((a, b) => {
        if (a.order > b.order) {
          return 1;
        } else if (a.order === b.order) {
          return 0;
        }
        return -1;
      });
    }
  },
  methods: {
    onUpdateModelValueItem (...args) {
      this.$emit('update:modelValue', ...args);
    },
    getComponent (item) {
      return item.separator ? 'Separator' : 'Item';
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-atom-context-menu {
  --color__border: var(--color__contextMenu__border, #05a);

  clear: fix;

  .wb-env-atom-context-menu-item > & {
    display: none;
  }

  .wb-env-atom-context-menu-item:hover > & {
    display: block;
  }

  & .wb-env-atom-context-menu-item {
    float: left;
    margin-right: 9px;
  }

  & .wb-atom-context-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    box-sizing: border-box;
    min-width: 75px;
    margin-top: -2px;
    border: solid var(--color__border) 2px;

    & .wb-env-atom-context-menu-item {
      float: none;
      margin-right: 0;
    }
  }

  /* * :not(.wb-env-atom-context-menu-item) > .wb-atom-context-menu > .wb-env-atom-context-menu-item.js--context-halign-right >  & {
    right: 0;
    left: auto;
    margin-right: -2px;
  } */

  .wb-atom-context-menu .wb-env-atom-context-menu-item.js--context-halign-right > * & {
    left: 100%;
    margin-left: -2px;
  }

  .wb-atom-context-menu .wb-env-atom-context-menu-item.js--context-halign-left > * & {
    right: 100%;
    left: auto;
    margin-left: 2px;
  }

  .wb-atom-context-menu .wb-env-atom-context-menu-item.js--context-valign-top > * & {
    top: auto;
    bottom: 0;
    margin-top: 2px;
  }

  .wb-atom-context-menu .wb-env-atom-context-menu-item.js--context-valign-bottom > * & {
    top: 0;
    bottom: auto;
    margin-top: -2px;
  }
}
</style>
