<template>
  <div class="mc-stats-navigation">
    <div :key="currentPage" class="buttons">
      <mc-button
        v-for="({ label, shortLabel, action }, index) in actions[currentPage]"
        :key="index"
        :model-value="action === modelValue"
        :label="label"
        :short-label="shortLabel"
        @click="onClick(action)" />
    </div>
  </div>
</template>

<script setup>
import useAudioControl from '../../composables/useAudioControl';
import { NAVIGATION_TYPES } from '../../utils/keys';
import McButton from '../Button.vue';

const currentPage = ref(0);

const { playSfx } = useAudioControl();

defineProps({
  modelValue: {
    type: String,
    default: null,
    validator: value => Object.values(NAVIGATION_TYPES).includes(value)
  },
  actions: {
    type: Array,
    default: () => [
      [
        {
          label: 'Ubersicht',
          shortLabel: 'Ubersicht',
          action: NAVIGATION_TYPES.OVERVIEW
        },
        {
          label: 'Aktuelles Log',
          shortLabel: 'Aktue. Log',
          action: NAVIGATION_TYPES.CURRENT_LOG
        },
        {
          label: 'Letztes Log',
          shortLabel: 'Letzt. Log',
          action: NAVIGATION_TYPES.LAST_LOG
        },
        {
          label: 'Bevölkerung',
          shortLabel: 'Bevölker.',
          action: NAVIGATION_TYPES.POPULATION
        },
        { label: 'Credits', action: NAVIGATION_TYPES.CREDITS },
        { label: 'Weiter', action: NAVIGATION_TYPES.NEXT }
      ],
      [
        {
          label: 'Sicherheitsdienst',
          shortLabel: 'S.Dienst',
          action: NAVIGATION_TYPES.SECURITY_SERVICE
        },
        { label: 'Soldaten', action: NAVIGATION_TYPES.SOLDIER },
        { label: 'Spione', action: NAVIGATION_TYPES.MERCENARY },
        { label: 'Strom', action: NAVIGATION_TYPES.ENERGY },
        { label: 'Nahrung', action: NAVIGATION_TYPES.FOOD },
        { label: 'Weiter', action: NAVIGATION_TYPES.NEXT }
      ],
      [
        { label: 'Erz', action: NAVIGATION_TYPES.MINREAL_ORE },
        {
          label: 'Energiezellen',
          shortLabel: 'Energiezel.',
          action: NAVIGATION_TYPES.ENERGY_CELL
        },
        { label: 'Gebäude', action: NAVIGATION_TYPES.BUILDINGS },
        { label: 'Fahrzeuge', action: NAVIGATION_TYPES.VEHICLES },
        { label: 'Waffen', action: NAVIGATION_TYPES.WEAPONS },
        { label: '&gt;&gt;', action: NAVIGATION_TYPES.NEXT }
      ]
    ]
  }
});

const $emit = defineEmits(['update:model-value']);

const onClick = async action => {
  playSfx('button_1_click');
  if (action === 'next') {
    currentPage.value = (currentPage.value + 1) % 3;
  } else {
    $emit('update:model-value', action);
  }
};
</script>

<style lang="postcss" scoped>
.mc-stats-navigation {
  display: flex;
  align-items: center;
  height: 100%;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 8px;

  /* padding: 6px 0; */
}
</style>
