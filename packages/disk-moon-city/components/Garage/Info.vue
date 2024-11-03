<template>
  <mc-screen class="mc-garage-info" :background-image="backgroundImage">
    <text-drawer :key="vehicle.key" :lines="lines" />
    <slot></slot>
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import Vehicle from '../../classes/Vehicle';
import useI18n from '../../composables/useI18n';
import graphics from '../../utils/graphics';
import McScreen from '../Screen.vue';
// import McText from '../Text.vue';
import TextDrawer from '../TextDrawer.vue';

const lines = computed(() => {
  const vehicle = $props.vehicle;
  return [
    [
      {
        background: true,
        color: 'yellow',
        content: `${t('garage.info.label.cargo_space')}:&nbsp;`
      },
      {
        background: true,
        color: 'white',
        content: `${vehicle.storage} / ${vehicle.maxStorage}`
      },
      {
        background: true,
        color: 'yellow',
        content: `&nbsp;&nbsp;-&nbsp;&nbsp;`
      },
      {
        background: true,
        color: 'yellow',
        content: `${t('garage.info.label.armor')}:&nbsp;`
      },
      {
        background: true,
        color: 'white',
        content: `${vehicle.armor} / ${vehicle.maxArmor}`
      }
    ],
    [
      {
        background: true,
        color: 'yellow',
        content: `${t('garage.info.label.weapon')}:&nbsp;`
      },
      {
        background: true,
        color: 'white',
        content: `${t(`vehicle_weapon.${vehicle.weapon.key}.name`)}`
      }
    ],
    [
      {
        background: true,
        color: 'yellow',
        content: `${t('garage.info.label.repair_cost')}:&nbsp;`
      },
      {
        background: true,
        content: String(
          ((vehicle.maxArmor - vehicle.armor) / vehicle.maxArmor) *
            vehicle.price
        ).padStart(5, '0'),
        color: 'gray'
      }
    ]
  ];
});

const { t } = useI18n();

const $props = defineProps({
  vehicle: {
    type: Vehicle,
    default: null
  }
});
const backgroundImage = computed(() => {
  return graphics.background.vehicle[$props.vehicle.key];
});
</script>

<style lang="postcss" scoped>
.mc-garage-info {
  & :deep(.mc-screen-alert) {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
