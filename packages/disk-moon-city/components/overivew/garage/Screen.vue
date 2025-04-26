<template>
  <mc-screen
    class="mc-overview-garage-screen"
    :change-key="vehicle.id"
    :background-image="backgroundImage">
    <text-drawer :key="vehicle.id" :lines="lines" />
    <slot />
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import Vehicle from '../../../classes/Vehicle';
import useI18n from '../../../composables/useI18n';
import graphics from '../../../utils/graphics';
import McScreen from '../../Screen.vue';
import TextDrawer from '../../TextDrawer.vue';
import { fillTextStart } from '../../../utils/string';

const lines = computed(() => {
  const vehicle = $props.vehicle;
  return [
    [
      [
        {
          background: true,
          content: `${t(`garage.info.label.name`)}: `,
          color: 'dark-yellow'
        },
        {
          background: true,
          content: t(`vehicle.${vehicle.key}.name`),
          color: 'yellow'
        }
      ]
    ],
    [
      {
        background: true,
        color: 'yellow',
        content: `${t('garage.info.label.repair_cost')}: `
      },
      {
        background: true,
        content: fillTextStart(
          ((vehicle.maxArmor - vehicle.armor) / vehicle.maxArmor) *
            vehicle.price,
          5,
          '0'
        ),
        color: 'gray'
      }
    ],

    { spacer: true },
    [
      {
        content: `${t(`view.shop.info.label.vehicle_data`)}:`,
        color: 'dark-blue',
        background: true,
        underline: true
      }
    ],
    [
      [
        {
          content: `${t(`view.shop.info.label.vehicle_storage`)}   : `,
          color: 'dark-blue',
          background: true
        },
        {
          content: fillTextStart(
            vehicle.storage.slots.map(
              slot =>
                `${slot.value}${t('label.unit')} ${t(`storageType.${slot.type}.shortName`)}`
            ),
            2,
            '0'
          ),
          color: 'white',
          background: true
        }
      ]
    ],
    [
      [
        {
          content: `${t(`view.shop.info.label.armor`)}  : `,
          color: 'dark-blue',
          background: true
        },
        {
          content: `${fillTextStart(vehicle.armor, 2, '0')} / ${fillTextStart(vehicle.maxArmor, 2, '0')}`,
          color: 'white',
          background: true
        }
      ]
    ],
    [
      [
        {
          content: `${t(`view.shop.info.label.weapon`)} : `,
          color: 'dark-blue',
          background: true
        },
        {
          content: t(`vehicle_weapon.${vehicle.weapon.key}.name`),
          color: 'white',
          background: true
        }
      ]
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
.mc-overview-garage-screen {
  & :deep(.mc-alert-bar) {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
