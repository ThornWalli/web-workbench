<template>
  <mc-screen class="mc-stats-screen">
    <mc-text-drawer :lines="lines" loop />
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import { NAVIGATION_TYPES, STORAGE_TYPE } from '../../utils/keys';
import McScreen from '../Screen.vue';
import McTextDrawer from '../TextDrawer.vue';
import useCore from '../../composables/useCore';

const { core } = useCore();

const $props = defineProps({
  action: {
    type: String,
    required: true,
    validator: value => Object.values(NAVIGATION_TYPES).includes(value)
  }
});

const lines = computed(() => {
  switch ($props.action) {
    case NAVIGATION_TYPES.OVERVIEW:
      return getOverviewLines();
  }
  return [];
});

const getOverviewLines = () => {
  const city = core.currentPlayer.city;
  return [
    [{ block: true, content: 'Leute', underline: true, color: 'blue' }],
    { spacer: true },
    [
      { content: 'Einwohner:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.population}`,
        color: 'white'
      },
      {
        background: true,
        content: ` / ${city.getMaxStorageValue(STORAGE_TYPE.HUMANS)}`,
        color: 'gray'
      }
    ],
    {
      content: ''.padEnd(40, '-'),
      color: 'white'
    },
    [
      { content: 'Sicherheitsdienst:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.securityService}`,
        color: 'white'
      },
      {
        background: true,
        content: ` / ${city.securityService}`,
        color: 'gray'
      }
    ],
    [
      { content: 'Soldaten:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.soldiers}`,
        color: 'white'
      },
      {
        background: true,
        content: ` / ${city.soldiers}`,
        color: 'gray'
      }
    ],
    [
      { content: 'Soeldner:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.mercenary}`,
        color: 'white'
      },
      {
        background: true,
        content: ` / ${city.mercenary}`,
        color: 'gray'
      }
    ],
    [
      { content: 'Sicherheitsdienst-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.securityService}`,
        color: 'gray'
      }
    ],
    [
      { content: 'Soldaten-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.securityService}`,
        color: 'gray'
      }
    ],
    [
      { content: 'Soeldner-Level:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.securityService}`,
        color: 'gray'
      }
    ],
    [{ block: true, content: 'Rohstoffe', underline: true, color: 'blue' }],
    { spacer: true },

    [
      { content: 'Energie:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${String(0).padStart(10, '0')}`,
        color: 'yellow'
      }
    ],
    [
      { content: 'Energiezellen:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.mercenary}`,
        color: 'white'
      },
      {
        background: true,
        content: ` / ${city.mercenary}`,
        color: 'gray'
      }
    ],
    [
      { content: 'Mineral-Erz:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.getStorageValue(STORAGE_TYPE.MINERAL_ORE)}`,
        color: 'white'
      },
      {
        background: true,
        content: ` / ${city.getMaxStorageValue(STORAGE_TYPE.MINERAL_ORE)}`,
        color: 'gray'
      }
    ],
    [
      { content: 'Nahrung:', color: 'dark-yellow' },
      { spacer: true },
      {
        background: true,
        content: `${city.mercenary}`,
        color: 'white'
      },
      {
        background: true,
        content: ` / ${city.mercenary}`,
        color: 'gray'
      }
    ]
  ];
};
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
