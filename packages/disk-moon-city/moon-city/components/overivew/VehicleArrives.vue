<template>
  <div class="mc-overview-vehicle-arrives">
    <div
      v-for="vehicle in preparedVehicles"
      :key="vehicle.key"
      class="vehicle"
      :class="{
        hide: !vehicle.arrived,
        arrived: incomingVehicles < vehicle.index
      }"
      @transitionend="onTransitionEnd($event)">
      <img
        v-if="vehicle.src"
        :src="vehicle.src"
        :title="t(`vehicle.${vehicle.key}.name`)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import graphics from '../../utils/graphics';
import useAudioControl from '../../composables/useAudioControl';
import type Vehicle from '../../classes/Vehicle';
import { SFX } from '../../utils/sounds';
import useI18n from '../../composables/useI18n';

const { t } = useI18n();

const incomingVehicles = ref(-1);

const $props = defineProps<{
  vehicles: Vehicle[];
  modelValue: boolean;
}>();

const availableVehicles = computed(() => {
  return $props.vehicles.filter(vehicle => vehicle.arrived);
});

const $emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void;
}>();
const { playSfx } = useAudioControl();

const nextVehicle = () => {
  if (incomingVehicles.value < availableVehicles.value.length - 1) {
    playSfx(SFX.VEHICLE_ARRIVE);
    incomingVehicles.value = incomingVehicles.value + 1;
  } else {
    $emit('update:model-value', true);
  }
};

const preparedVehicles = computed(() => {
  return $props.vehicles.map(vehicle => ({
    ...vehicle,
    index: availableVehicles.value.indexOf(vehicle),
    src: graphics.shop.vehicle[vehicle.key]
  }));
});

const onTransitionEnd = (e: Event) => {
  if (
    e.target instanceof HTMLElement &&
    e.target.classList.contains('vehicle')
  ) {
    window.setTimeout(() => {
      nextVehicle();
    }, 200);
  }
};

const start = () => {
  window.setTimeout(() => {
    nextVehicle();
  }, 200);
};
onMounted(() => {
  start();
});
</script>

<style lang="postcss" scoped>
.mc-overview-vehicle-arrives {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 260px;
  height: 232px;
  padding: 2px;
  overflow: hidden;
  background: url('../../assets/graphics/background/ground.png');
  background-size: contain;

  & div {
    display: block;
    width: calc(100% / 4);
    transition: transform 0.55s linear;
    will-change: transform;

    & img {
      display: block;
      width: 100%;
    }
  }

  & .hide {
    visibility: hidden;
  }

  & .arrived {
    transform: translateY(250%);
  }
}
</style>
