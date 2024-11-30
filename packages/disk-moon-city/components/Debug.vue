<template>
  <div v-if="city" class="mc-debug font-style-bitfont">
    <div>
      <div>
        {{ fillTextEnd('Type', 14, ' ') }}
        <mc-text :content="fillTextStart('Value', 8, ' ')" /> /
        {{ fillTextEnd('Storage', 7, ' ') }}
        {{ fillTextEnd('Prod.', 6, ' ') }}
        {{ fillTextStart('Costs', 5, ' ') }}
        <mc-text :content="fillTextStart('Diff.', 6, ' ')" />
      </div>
      <div v-for="slot in storage" :key="slot">
        {{ fillTextEnd(slot.name, 14, ' ') }}
        <mc-text
          :color="getValueColor(slot)"
          :content="fillTextStart(slot.value, 8, ' ')" />
        /
        {{ fillTextEnd(slot.infinite ? 'Infin.' : slot.storage, 7, ' ') }}
        {{ fillTextEnd(slot.production, 6, ' ') }}
        <mc-text
          embed
          :content="fillTextStart('-' + slot.costs, 5, ' ')" />&nbsp;
        <mc-text
          embed
          :color="getDiffColor(slot)"
          :content="fillTextStart(slot.production - slot.costs, 6, ' ')" />
      </div>
    </div>
    <div>
      <div>
        {{ fillTextStart('Type', 5, ' ') }}
        {{ fillTextStart('Value', 5, ' ') }}
        {{ fillTextStart('Level', 5, ' ') }}
        {{ fillTextStart('Re.', 3, ' ') }}
        {{ fillTextStart('Tr.', 3, ' ') }}
        <mc-text :content="fillTextStart('Re.C.', 5, ' ')" />
        <mc-text :content="fillTextStart('Tr.C.', 5, ' ')" />
      </div>
      <div v-for="employee in employees" :key="employee.type">
        {{
          fillTextStart(
            autoShort(t(`employee.${employee.type}`).shortName, 5),
            5,
            ' '
          )
        }}
        {{ fillTextStart(employee.value, 5, ' ') }}
        {{ fillTextStart(employee.level.toFixed(2), 5, ' ') }}
        {{ fillTextStart(employee.recruiting ? 'Yes' : 'No', 3, ' ') }}
        {{ fillTextStart(employee.training ? 'Yes' : 'No', 3, ' ') }}
        <mc-text
          embed
          color="red"
          :content="fillTextStart('-' + employee.recruitmentCosts, 5, ' ')" />
        <mc-text
          embed
          color="red"
          :content="fillTextStart('-' + employee.trainingCosts, 5, ' ')" />
      </div>
    </div>
    <div>Mood: {{ city.resident.mood.toFixed(2) }}</div>
  </div>
</template>

<script setup>
import useCore from '../composables/useCore';
import useI18n from '../composables/useI18n.js';
import { STORAGE_TYPE } from '../utils/keys.js';
import { autoShort, fillTextEnd, fillTextStart } from '../utils/string.js';

import McText from './Text.vue';

const { t } = useI18n();
const { core } = useCore();

const getValueColor = slot => {
  const value = Math.max(slot.value / slot.costs, 0);
  if (value > 0.5) {
    return 'green';
  } else if (value > 0.25) {
    return 'yellow';
  } else {
    return 'red';
  }
};

const getDiffColor = slot => {
  const diff = slot.production - slot.costs;
  if (diff / slot.costs > 0.5 || !slot.costs) {
    return 'green';
  } else if (diff / slot.production >= 0) {
    return 'yellow';
  } else {
    return 'red';
  }
};

/**
 * @type {import('vue').ComputedRef<import('../classes/CityEmployee.js').default[]>}
 */
const employees = computed(() => {
  return [city.value.securityService, city.value.soldier, city.value.mercenary];
});

/**
 * @type {import('vue').ComputedRef<import('../classes/City.js').default>}
 */
const city = computed(() => {
  return core.currentPlayer?.city;
});

const storage = computed(() => {
  return (city.value.storage.slots || []).map(slot => {
    let costs = city.value.getCostValue(slot.type);
    switch (slot.type) {
      case STORAGE_TYPE.FOOD:
        costs += city.value.getPopulationFood();
        break;
      case STORAGE_TYPE.ENERGY:
        costs += city.value.getPopulationEnergy();
        break;
    }

    let costPercentage = Math.max(1 - slot.value / costs, 0);
    if (costPercentage === Infinity || isNaN(costPercentage)) {
      costPercentage = 0;
    }

    return {
      infinite: slot.infinite,
      name: slot.type,
      value: slot.value,
      storage: city.value.getMaxStorageValue(slot.type),
      production: city.value.getProductionValue(slot.type),
      costs,
      costPercentage
    };
  });
});
</script>

<style lang="postcss" scoped>
.mc-debug {
  position: fixed;
  top: 4px;
  left: 6px;
  display: flex;
  gap: 4px;
  line-height: 14px;
  white-space: pre-wrap;

  & > div {
    padding: 2px;
    border: solid white 2px;
  }
}
</style>
