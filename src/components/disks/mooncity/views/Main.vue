<template>
  <mc-view class="wb-disks-mooncity-view-main" style-type="main">
    <template #view-1-1>
      <mc-molecule-map-tactic />
    </template>
    <template #view-2-1>
      <mc-molecule-user-creation v-if="createUsers" />
    </template>
    <template #view-2-2>
      <mc-molecule-vehicle-cargo />
    </template>
  </mc-view>
</template>

<script>

import McView from '../View';
import McMoleculeMapTactic from '../molecules/MapTactic';
import McMoleculeUserCreation from '../molecules/UserCreation';
import McMoleculeVehicleCargo from '../molecules/VehicleCargo';

export default {
  components: { McView, McMoleculeMapTactic, McMoleculeUserCreation, McMoleculeVehicleCargo },
  computed: {
    createUsers () {
      return !this.$mooncity.started;
    }
  }
};
</script>

<style>

</style>
