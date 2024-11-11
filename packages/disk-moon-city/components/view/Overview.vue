<template>
  <div class="mc-view-overview">
    <teleport to="#layout_content_1">
      <mc-frame-overview-primary>
        <mc-overview-vehicle-arrives
          v-if="roundStart && !skipVehicleArrives"
          v-model="arrived"
          :vehicles="vehicles" />
        <mc-map v-else ref="map">
          <mc-alert-bar ref="mapAlert" />
        </mc-map>
        <mc-overview-weapon-attack
          @shoot="onWeaponAttackShoot"
          @alert="onWeaponAttackAlert" />
      </mc-frame-overview-primary>
    </teleport>
    <teleport to="#layout_content_2">
      <mc-frame-overview-secondary>
        <mc-overview-garage ref="garage" />
      </mc-frame-overview-secondary>
    </teleport>
    <teleport to="#layout_screen">
      <mc-overview-round-start
        v-if="roundStart && arrived"
        @round-start="() => $emit('round-start')" />
    </teleport>
  </div>
</template>

<script setup>
import McFrameOverviewPrimary from '../frame/OverviewPrimary.vue';
import McFrameOverviewSecondary from '../frame/OverviewSecondary.vue';

import McMap from '../Map.vue';
import McOverviewWeaponAttack from '../overivew/WeaponAttack.vue';
import McOverviewGarage from '../overivew/Garage.vue';
import McOverviewRoundStart from '../overivew/RoundStart.vue';
import McOverviewVehicleArrives from '../overivew/VehicleArrives.vue';
import McAlertBar from '../AlertBar.vue';

import { watch } from 'vue';
import useCore from '../../composables/useCore';

const { core } = useCore();

const vehicles = computed(() => core.currentPlayer.city.vehicles);

const mapAlert = ref(null);
const map = ref(null);

const onWeaponAttackShoot = ({ player, weapon }) => {
  core.currentPlayer.city.useWeapon(weapon);

  map.value.weaponShoot({ player, weapon });
};
const onWeaponAttackAlert = message => mapAlert.value.show(message);

const arrived = ref(false);
const garage = ref(null);
const $props = defineProps({
  skipVehicleArrives: {
    type: Boolean,
    default: false
  },
  roundStart: {
    type: Boolean,
    default: false
  }
});

watch(
  () => $props.roundStart,
  value => {
    if (value) {
      if (garage.value) {
        garage.value.unselect();
      }
      if ($props.skipVehicleArrives) {
        arrived.value = true;
      }
    }
  },
  { immediate: true }
);

defineEmits(['round-start']);
</script>

<style lang="postcss" scoped>
.mc-map {
  position: absolute;
  top: 26px;
  left: 14px;
}

.mc-overview-vehicle-arrives {
  position: absolute;
  top: 26px;
  left: 14px;
}

.mc-overview-weapon-attack {
  position: absolute;
  top: 288px;
  left: 8px;
}
</style>
