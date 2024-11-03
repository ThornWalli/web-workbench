<template>
  <div class="mc-frame-overview-primary">
    <mc-map />
    <mc-weapon-attack />
  </div>
</template>

<script setup>
import McMap from '../Map.vue';
import McWeaponAttack from '../WeaponAttack.vue';
</script>

<style lang="postcss" scoped>
.mc-frame-overview-primary {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/overview-content-1-1.png');
  background-size: contain;

  & .mc-map {
    position: absolute;
    top: 25px;
    left: 16px;
  }
}
</style>
