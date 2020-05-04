<template>
  <div class="wb-disks-mooncity-molecule-map-tactic">
    <mc-atom-map class="map-tactic__map" />
    <div class="map-tactic__weapons" />
  </div>
</template>

<script>
import McAtomMap from '../atoms/Map';
export default {
  components: { McAtomMap }

};
</script>

<style lang="postcss">
.wb-disks-mooncity-molecule-map-tactic {
  position: relative;
  width: 288px;
  height: 374px;
  background: url('~assets/disks/mooncity/img/mask_left_main.png');

  & .map-tactic__map {
    position: absolute;
    top: 26px;
    left: 14px;
  }

  & .map-tactic__weapons {
    position: absolute;
    top: 300px;
    left: 0;
    width: 270px;
    height: 50px;
    background: green;
  }
}
</style>
