<template>
  <div class="mc-stats-info">
    <div :key="currentPage" class="buttons">
      <mc-button
        v-for="({ label, shortLabel, action }, index) in actions[currentPage]"
        :key="index"
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
        { label: 'Ubersicht', shortLabel: 'Ubersicht', action: 'overview' },
        {
          label: 'Aktuelles Log',
          shortLabel: 'Aktue. Log',
          action: 'current_log'
        },
        { label: 'Letztes Log', shortLabel: 'Letzt. Log', action: 'last_log' },
        {
          label: 'Bevoelkerung',
          shortLabel: 'Bevoelker.',
          action: 'population'
        },
        { label: 'Credits', action: 'credits' },
        { label: 'Weiter', action: 'next' }
      ],
      [
        {
          label: 'Sicherheitsdienst',
          shortLabel: 'S.Dienst',
          action: 'security'
        },
        { label: 'Soldaten', action: 'soldiers' },
        { label: 'Spione', action: 'mercenary' },
        { label: 'Strom', action: 'energy' },
        { label: 'Nahrung', action: 'food' },
        { label: 'Weiter', action: 'next' }
      ],
      [
        { label: 'Erz', action: 'resource_ore' },
        {
          label: 'Energiezellen',
          shortLabel: 'Energiezel.',
          action: 'resource_energy_cell'
        },
        { label: 'Gebaeude', action: 'buildings' },
        { label: 'Fahrzeuge', action: 'vehicles' },
        { label: 'Waffen', action: 'weapons' },
        { label: 'Weiter', action: 'next' }
      ]
    ]
  }
});

const $emit = defineEmits(['update:model-value']);

const onClick = async action => {
  await playSfx('button_1_click');
  if (action === 'next') {
    currentPage.value = (currentPage.value + 1) % 3;
  } else {
    $emit('update:model-value', action);
  }
};
</script>

<style lang="postcss" scoped>
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 8px;
  padding: 4px 0;
}
</style>
