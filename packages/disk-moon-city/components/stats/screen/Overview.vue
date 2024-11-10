<template>
  <mc-screen class="mc-stats-screen-overview">
    <mc-text-drawer v-if="lines.length" :lines="lines" loop />
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import { STORAGE_TYPE, TRAINING_TYPE } from '../../../utils/keys';
import McScreen from '../../Screen.vue';
import McTextDrawer from '../../TextDrawer.vue';
import useCore from '../../../composables/useCore';
import { normalizePercentage } from './utils';

const { core } = useCore();

const lines = computed(() => {
  const city = core.currentPlayer.city;
  return [
    [{ block: true, content: 'Leute', underline: true, color: 'blue' }],

    [
      { content: 'Einwohner:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.population}`,
        color: 'white'
      },
      {
        content: ' / '
      },
      {
        background: true,
        content: city.getMaxStorageValue(STORAGE_TYPE.HUMANS),
        color: 'gray'
      }
    ],
    {
      content: ''.padEnd(39, '-'),
      color: 'white'
    },
    [
      { content: 'Sicherheitsdienst:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: String(
          city.getStorageValue(STORAGE_TYPE.SECURITY_SERVICE)
        ).padStart(6, '0'),
        color: 'white'
      },
      {
        content: ' / '
      },
      {
        background: true,
        content: String(
          city.getMaxStorageValue(STORAGE_TYPE.SECURITY_SERVICE)
        ).padStart(6, '0'),
        color: 'gray'
      }
    ],
    [
      { content: 'Soldaten:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${String(city.getStorageValue(STORAGE_TYPE.SOLDIER)).padStart(6, '0')}`,
        color: 'white'
      },
      {
        content: ' / '
      },
      {
        background: true,
        content: String(city.getMaxStorageValue(STORAGE_TYPE.SOLDIER)).padStart(
          6,
          '0'
        ),
        color: 'gray'
      }
    ],
    [
      { content: 'Söldner:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: String(city.getStorageValue(STORAGE_TYPE.MERCENARY)).padStart(
          6,
          '0'
        ),
        color: 'white'
      },
      {
        content: ' / '
      },
      {
        background: true,
        content: String(
          city.getMaxStorageValue(STORAGE_TYPE.MERCENARY)
        ).padStart(6, '0'),
        color: 'gray'
      }
    ],
    [
      { content: 'Sicherheitsdienst-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `% ${normalizePercentage(city.getTrainingValue(TRAINING_TYPE.SECURITY_SERVICE), city.getStorageValue(STORAGE_TYPE.SECURITY_SERVICE))}`,
        color: 'white'
      }
    ],
    [
      { content: 'Soldaten-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `% ${normalizePercentage(city.getTrainingValue(TRAINING_TYPE.SOLDIER), city.getStorageValue(STORAGE_TYPE.SOLDIER))}`,
        color: 'white'
      }
    ],
    [
      { content: 'Söldner-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `% ${normalizePercentage(city.getTrainingValue(TRAINING_TYPE.MERCENARY), city.getStorageValue(STORAGE_TYPE.MERCENARY))}`,
        color: 'white'
      }
    ],
    { break: true },
    [{ block: true, content: 'Rohstoffe', underline: true, color: 'blue' }],

    [
      { content: 'Energie:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${String(city.getEnergy()).padStart(11, '0')}`,
        color: 'yellow'
      }
    ],
    [
      { content: 'Energiezellen:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: String(
          city.getStorageValue(STORAGE_TYPE.ENERGY_CELL)
        ).padStart(6, '0'),
        color: 'white'
      },
      {
        content: ' / '
      },
      {
        background: true,
        content: String(
          city.getMaxStorageValue(STORAGE_TYPE.ENERGY_CELL)
        ).padStart(6, '0'),
        color: 'gray'
      }
    ],
    [
      { content: 'Mineral-Erz:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: String(
          city.getStorageValue(STORAGE_TYPE.MINERAL_ORE)
        ).padStart(6, '0'),
        color: 'white'
      },
      {
        content: ' / '
      },
      {
        background: true,
        content: String(
          city.getMaxStorageValue(STORAGE_TYPE.MINERAL_ORE)
        ).padStart(6, '0'),
        color: 'gray'
      }
    ],
    [
      { content: 'Nahrung:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: String(city.getStorageValue(STORAGE_TYPE.FOOD)).padStart(
          6,
          '0'
        ),
        color: 'white'
      },
      {
        content: ' / '
      },
      {
        background: true,
        content: String(city.getMaxStorageValue(STORAGE_TYPE.FOOD)).padStart(
          6,
          '0'
        ),
        color: 'gray'
      }
    ]
  ];
});
</script>

<style lang="postcss" scoped>
:deep(.mc-text:not(.embed)) {
  padding-right: 0;
  padding-left: 0;

  & .mc-text-canvas {
    top: 2px;
    left: 0;
  }
}
</style>
