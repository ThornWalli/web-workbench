<template>
  <mc-screen class="mc-stats-screen-current-log">
    <mc-text-drawer :lines="lines" />
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import McScreen from '../../Screen.vue';
import McTextDrawer from '../../TextDrawer.vue';
import useCore from '../../../composables/useCore';
import { BUILDING_KEY } from '../../../utils/keys';
import useI18n from '../../../composables/useI18n';

const { core } = useCore();

const { t } = useI18n();

const data = [
  [
    t('building')[BUILDING_KEY.ORE_STORAGE].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.ORE_STORAGE).length
  ],
  [
    t('building')[BUILDING_KEY.REFINERY].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.REFINERY).length
  ],
  [
    t('building')[BUILDING_KEY.POWER_STATION].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.POWER_STATION).length
  ],
  [
    t('building')[BUILDING_KEY.ENERGY_TRANSMITTER].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.ENERGY_TRANSMITTER)
      .length
  ],
  [
    t('building')[BUILDING_KEY.HOUSE].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.HOUSE).length
  ],
  [
    t('building')[BUILDING_KEY.GREEN_HOUSE].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.GREEN_HOUSE).length
  ],
  [
    t('building')[BUILDING_KEY.FOOD_STORAGE].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.FOOD_STORAGE).length
  ],
  [
    t('building')[BUILDING_KEY.VEHICLE_FACTORY].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.VEHICLE_FACTORY)
      .length
  ],
  [
    t('building')[BUILDING_KEY.BARRACK].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.BARRACK).length
  ],
  [
    t('building')[BUILDING_KEY.WEAPON_FACTORY].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.WEAPON_FACTORY)
      .length
  ],
  [
    t('building')[BUILDING_KEY.VAULT].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.VAULT).length
  ],
  [
    t('building')[BUILDING_KEY.SHIELD_GENERATOR].name,
    core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.SHIELD_GENERATOR)
      .length
  ]
];

const lines = computed(() => {
  return [
    [
      {
        content: 'Gebäude:'
      }
    ],
    ...data.reduce((result, [name, value], i) => {
      if (i % 2 === 0) {
        result.push([]);
      } else {
        result[result.length - 1].push({ content: ' ' });
      }
      result[result.length - 1].push({
        content: name.padEnd(15, '.') + ' ' + String(value).padStart(3, '0')
      });
      return result;
    }, [])
    // [
    //   {
    //     content:
    //       'Erzlager'.padEnd(15, '.') +
    //       ' ' +
    //       String(
    //         core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.ORE_STORAGE)
    //           .length
    //       ).padStart(3, '0')
    //   },
    //   { content: ' ' },
    //   {
    //     content:
    //       'Raffinerie'.padEnd(15, '.') +
    //       ' ' +
    //       String(
    //         core.currentPlayer.city.getBuildingsByKey(BUILDING_KEY.REFINERY)
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
    //         core.currentPlayer.city.getBuildingsByKey(
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
    //         core.currentPlayer.city.getBuildingsByKey(
    //           BUILDING_KEY.ENERGY_TRANSMITTER
    //         ).length
    //       ).padStart(3, '0')
    //   }
    // ]
  ];
});
</script>
