<template>
  <div class="wb-disks-mooncity-molecule-vehicle-building">
    {{ model }}
    <mc-molecule-shop-item-list v-bind="vehicles" class="vehicles-buildings__vehicle" :model="model" />
    <mc-molecule-shop-item-list v-bind="buildings" class="vehicles-buildings__building" :model="model" />
  </div>
</template>

<script>
import McMoleculeShopItemList from './ItemList';
export default {
  components: { McMoleculeShopItemList },
  props: {
    model: {
      type: Object,
      default () {
        return {
          value: null
        };
      }
    }
  },
  data () {
    return {
      vehicles: {
        name: 'value',
        type: 'vehicle',
        items: [
          {
            test: 1
          }, { test: 2 }, {}, {}, {}, {}, {}, {}
        ]
      },
      buildings: {
        name: 'value',
        type: 'building',
        items: [
          {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
        ]
      }
    };
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-molecule-vehicle-building {
  position: relative;
  width: 288px;
  height: 374px;
  background: url('~assets/disks/mooncity/img/mask_left_shop.png');

  & .vehicles-buildings__vehicle {
    position: relative;
    top: 13px;
    left: 12px;
  }

  & .vehicles-buildings__building {
    position: relative;
    top: 31px;
    left: 11px;
  }

}
</style>
