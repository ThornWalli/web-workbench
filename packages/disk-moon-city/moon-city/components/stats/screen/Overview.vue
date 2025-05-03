<template>
  <mc-screen class="mc-stats-screen-overview">
    <mc-text-drawer v-if="lines.length" :lines="lines" loop />
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import { STORAGE_TYPE } from '../../../types';
import McScreen from '../../Screen.vue';
import McTextDrawer from '../../TextDrawer.vue';
import useCore from '../../../composables/useCore';
import { fillTextEnd, fillTextStart } from '../../../utils/string';
import { normalizePercentage } from '../../../utils/number';

const { core } = useCore();

const lines = computed(() => {
  const city = core.currentPlayer.city;
  const isPopulationMax =
    city.getMaxStorageValue(STORAGE_TYPE.HUMAN) < city.population;

  return [
    [{ block: true, content: 'Leute', underline: true, color: 'blue' }],

    [
      { content: 'Einwohner:', color: 'dark-yellow' },
      { spacer: true },
      {
        class: isPopulationMax && 'blinking-error',
        background: true,
        content: `${city.population}`,
        color: 'white'
      },
      {
        class: isPopulationMax && 'blinking-error',
        content: ' / '
      },
      {
        class: isPopulationMax && 'blinking-error',
        background: true,
        content: city.getMaxStorageValue(STORAGE_TYPE.HUMAN),
        color: 'gray'
      }
    ],
    {
      content: fillTextEnd('', 39, '-'),
      color: 'white'
    },
    [
      { content: 'Sicherheitsdienst/Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: fillTextStart(city.securityService.value, 4, '0'),
        color: 'white'
      }
    ],
    [
      { content: 'Soldaten:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: fillTextStart(city.soldier.value, 4, '0'),
        color: 'white'
      }
    ],
    [
      { content: 'Söldner:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: fillTextStart(city.mercenary.value, 4, '0'),

        color: 'white'
      }
    ],
    [
      { content: 'Sicherheitsdienst-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `% ${fillTextStart(normalizePercentage(city.securityService.trained, city.securityService.value), 3, ' ')}`,
        color: 'white'
      }
    ],
    [
      { content: 'Soldaten-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `% ${fillTextStart(normalizePercentage(city.soldier.trained, city.soldier.value), 3, ' ')}`,
        color: 'white'
      }
    ],
    [
      { content: 'Söldner-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `% ${fillTextStart(normalizePercentage(city.mercenary.trained, city.mercenary.value), 3, ' ')}`,
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
        content: `${fillTextStart(city.getEnergy(), 11, '0')}`,
        color: 'yellow'
      }
    ],
    [
      { content: 'Energiezellen:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: fillTextStart(
          city.getStorageValue(STORAGE_TYPE.ENERGY_CELL),
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
        content: fillTextStart(
          city.getMaxStorageValue(STORAGE_TYPE.ENERGY_CELL),
          6,
          '0'
        ),
        color: 'gray'
      }
    ],
    [
      { content: 'Mineral-Erz:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: fillTextStart(
          city.getStorageValue(STORAGE_TYPE.MINERAL_ORE),
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
        content: fillTextStart(
          city.getMaxStorageValue(STORAGE_TYPE.MINERAL_ORE),
          6,
          '0'
        ),
        color: 'gray'
      }
    ],
    [
      { content: 'Nahrung:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: fillTextStart(city.getStorageValue(STORAGE_TYPE.FOOD), 6, '0'),
        color: 'white'
      },
      {
        content: ' / '
      },
      {
        background: true,
        content: fillTextStart(
          city.getMaxStorageValue(STORAGE_TYPE.FOOD),
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
