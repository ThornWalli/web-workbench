<template>
  <ul class="wb-disks-mooncity-shop-item-list">
    <li v-for="(item, index) in items" :key="index">
      <mc-atom-shop-item :type="type" :index="index" :name="name" :model="model" :value="item" />
    </li>
  </ul>
</template>

<script>
import McAtomShopItem from '../../atoms/ShopItem';
export default {
  components: {
    McAtomShopItem
  },
  props: {
    model: {
      type: Object,
      default () {
        return {
          name: null
        };
      }
    },
    name: {
      type: String,
      default: 'name'
    },
    type: {
      type: String,
      default: 'vehicle'
    },
    items: {
      type: Array,
      default () {
        return [
          {}, {}, {}, {}, {}, {}, {}, {}
        ];
      }
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-shop-item-list {
  display: flex;
  flex-wrap: wrap;

  & li {
    margin: 1px;
  }
}
</style>
