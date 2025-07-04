<template>
  <mc-screen class="mc-stats-screen-current-log">
    <mc-text-drawer :lines="lines" loop />
  </mc-screen>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import McScreen from '../../Screen.vue';
import McTextDrawer from '../../TextDrawer.vue';
import useCore from '../../../composables/useCore';
import { BUILDING_KEY } from '../../../types';
import useI18n from '../../../composables/useI18n';
import { fillTextEnd, fillTextStart } from '../../../utils/string';
import type { ConsoleLine } from '@web-workbench/disk-moon-city/moonCity/observables/roundComplete/types';

const { core } = useCore();

const { t } = useI18n();

const data = [
  [
    t(`building.${BUILDING_KEY.ORE_STORAGE}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.ORE_STORAGE).length
  ],
  [
    t(`building.${BUILDING_KEY.REFINERY}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.REFINERY).length
  ],
  [
    t(`building.${BUILDING_KEY.POWER_STATION}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.POWER_STATION)
      .length
  ],
  [
    t(`building.${BUILDING_KEY.ENERGY_TRANSMITTER}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.ENERGY_TRANSMITTER)
      .length
  ],
  [
    t(`building.${BUILDING_KEY.HOUSE}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.HOUSE).length
  ],
  [
    t(`building.${BUILDING_KEY.GREEN_HOUSE}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.GREEN_HOUSE).length
  ],
  [
    t(`building.${BUILDING_KEY.FOOD_STORAGE}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.FOOD_STORAGE).length
  ],
  [
    t(`building.${BUILDING_KEY.VEHICLE_FACTORY}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.VEHICLE_FACTORY)
      .length
  ],
  [
    t(`building.${BUILDING_KEY.BARRACK}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.BARRACK).length
  ],
  [
    t(`building.${BUILDING_KEY.WEAPON_FACTORY}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.WEAPON_FACTORY)
      .length
  ],
  [
    t(`building.${BUILDING_KEY.VAULT}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.VAULT).length
  ],
  [
    t(`building.${BUILDING_KEY.SHIELD_GENERATOR}.name`),
    core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.SHIELD_GENERATOR)
      .length
  ]
];

const lines = computed(() => {
  return [
    [
      {
        content: 'Gebäude:',
        color: 'yellow',
        underline: true,
        block: true
      }
    ],
    ...data.reduce<ConsoleLine[][]>((result, [name, value], i) => {
      let arr = result[result.length - 1];
      if (i % 2 === 0) {
        result.push([]);
      } else if (Array.isArray(arr)) {
        arr.push({ content: ' ' });
      }
      arr = result[result.length - 1];
      if (!Array.isArray(arr)) {
        throw new Error('arr is not an array');
      }
      arr.push({
        class: Number(value) < 1 ? 'blinking-error' : undefined,
        color: Number(value) < 1 ? 'red' : 'dark-yellow',
        content:
          fillTextEnd(String(name), 15, '.') +
          ' ' +
          fillTextStart(String(value), 3, '0')
      });
      return result;
    }, [])
    // [
    //   {
    //     content:
    //       'Erzlager'.padEnd(15, '.') +
    //       ' ' +
    //       String(
    //         core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.ORE_STORAGE)
    //           .length
    //       ).padStart(3, '0')
    //   },
    //   { content: ' ' },
    //   {
    //     content:
    //       'Raffinerie'.padEnd(15, '.') +
    //       ' ' +
    //       String(
    //         core.currentPlayer?.city.getBuildingsByKey(BUILDING_KEY.REFINERY)
    //           .length
    //       ).padStart(3, '0')
    //   }
    // ],
    // [
    //   {
    //     content:
    //       'Kraftwerk'.padEnd(15, '.') +
    //       ' ' +
    //       String(
    //         core.currentPlayer?.city.getBuildingsByKey(
    //           BUILDING_KEY.POWER_STATION
    //         ).length
    //       ).padStart(3, '0')
    //   },
    //   { content: ' ' },
    //   {
    //     content:
    //       'Energiesender'.padEnd(15, '.') +
    //       ' ' +
    //       String(
    //         core.currentPlayer?.city.getBuildingsByKey(
    //           BUILDING_KEY.ENERGY_TRANSMITTER
    //         ).length
    //       ).padStart(3, '0')
    //   }
    // ]
  ];
});
</script>

<style lang="postcss" scoped>
:deep(.mc-text-drawer) {
  & > div {
    gap: 7px;
  }
}
</style>
