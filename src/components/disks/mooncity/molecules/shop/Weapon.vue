<template>
  <div class="wb-disks-mooncity-molecule-vehicles-weapon">
    <mc-molecule-shop-item-list v-bind="weapons" class="vehicles-buildings__weapon" />
  </div>
</template>

<script>
import McMoleculeShopItemList from './ItemList';
export default {
  components: { McMoleculeShopItemList },
  data () {
    return {
      weapons: {
        name: 'weapon',
        type: 'weapon',
        items: [
          {}, {}, {}
        ]
      }
    };
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-molecule-vehicles-weapon {
  position: relative;
  width: 350px;
  height: 114px;
  background: url('~assets/disks/mooncity/img/mask_right_shop.png');

  & .vehicles-buildings__weapon {
    position: relative;
    top: 22px;
    left: 1px;
  }

}
</style>
