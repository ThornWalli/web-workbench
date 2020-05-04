<template>
  <mc-view class="wb-disks-mooncity-view-shop" style-type="shop">
    <template v-slot:view-1-1>
      <mc-molecule-vehicle-building />
    </template>
    <template v-slot:view-2-1>
      console
    </template>
    <template v-slot:view-2-2>
      <mc-molecule-weapon />
    </template>
  </mc-view>
</template>

<script>

import McView from '../View';
import McMoleculeVehicleBuilding from '../molecules/shop/VehicleBuilding';
import McMoleculeWeapon from '../molecules/shop/Weapon';
export default {
  components: { McView, McMoleculeVehicleBuilding, McMoleculeWeapon }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-view-shop {
  /* empty */
}
</style>
