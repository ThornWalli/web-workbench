<template>
  <div :class="styleClasses" :disabled="disabled">
    <ul v-for="(row, rowIndex) in preparedItems" :key="rowIndex">
      <li
        v-for="(item, index) in row"
        :key="index"
        :class="{ spacer: item.spacer, fill: item.fill }">
        <navigation-item
          v-if="!item.spacer"
          :disabled="disabled"
          :model="model"
          v-bind="item"></navigation-item>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive } from 'vue';
import NavigationItem from './Navigation/Item';

const model = reactive({});
export default {
  components: { NavigationItem },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    model: {
      type: Object,
      default() {
        return model;
      }
    },
    multline: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default() {
        return [
          { id: 1, title: 'Play' },
          { id: 2, title: 'Pause' },
          { id: 2, title: 'Stop' },
          { id: 2, title: 'Reset' },
          { id: 1, title: 'Item 1 R', value: 'item-1', name: 'test' },
          { id: 2, title: 'Item 2 R', value: 'item-2', name: 'test' },
          { id: 2, title: 'Item 3 R', value: 'item-3', name: 'test' },
          { id: 2, title: 'Item 4 R', value: 'item-4', name: 'test' },
          {
            id: 1,
            title: 'Item 1 C',
            name: 'item1Value'
          },
          {
            id: 2,
            title: 'Item 2 C',
            name: 'item2Value'
          },
          {
            id: 2,
            title: 'Item 3 C',
            name: 'item3Value'
          },
          {
            id: 2,
            title: 'Item 4 C',
            name: 'item4Value'
          }
        ];
      }
    }
  },
  computed: {
    preparedItems() {
      if (!this.items.find(item => Array.isArray(item))) {
        return [this.items];
      } else {
        return this.items;
      }
    },
    styleClasses() {
      return {
        multline: this.multline,
        [`direction-${this.direction}`]: this.direction
      };
    }
  }
};
</script>
<style lang="postcss" scoped>
div {
  padding: 2px;
  padding-bottom: 0;
  color: var(--workbench-color-3);
  background: var(--workbench-color-1);

  &.direction-vertical {
    & ul {
      flex-direction: column;
    }
  }
}

.multline {
  ul {
    flex-wrap: wrap;
  }
}

ul {
  display: flex;
  list-style: none;

  & li {
    padding: 0 2px 2px 0;

    &.spacer,
    &.fill {
      flex: 1;
    }
  }
}
</style>
