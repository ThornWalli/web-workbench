<template>
  <div class="mc-view-overview">
    <teleport to="#layout_content_1">
      <mc-frame-overview-primary>
        <mc-overview-vehicle-arrives
          v-if="roundStart && !skipVehicleArrives"
          v-model="arrived"
          :vehicles="vehicles" />
        <mc-map v-else />
        <mc-overview-weapon-attack />
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

import { watch } from 'vue';
import useCore from '../../composables/useCore';

const { core } = useCore();

const vehicles = computed(() => core.currentPlayer.city.vehicles);

const skipVehicleArrives = ref(true);
const arrived = ref(false);
const garage = ref(null);
const $props = defineProps({
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
      if (skipVehicleArrives.value) {
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
  top: 25px;
  left: 16px;
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
