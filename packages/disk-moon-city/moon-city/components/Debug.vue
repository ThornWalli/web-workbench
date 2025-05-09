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
      <div v-for="slot in storage" :key="slot.name">
        {{ fillTextEnd(slot.name, 14, ' ') }}
        <mc-text
          :color="getValueColor(slot)"
          :content="fillTextStart(String(slot.value), 8, ' ')" />
        /
        {{
          fillTextEnd(String(slot.infinite ? 'Infin.' : slot.storage), 7, ' ')
        }}
        {{ fillTextEnd(String(slot.production), 6, ' ') }}
        <mc-text
          embed
          :content="fillTextStart('-' + slot.costs, 5, ' ')" />&nbsp;
        <mc-text
          embed
          :color="getDiffColor(slot)"
          :content="
            fillTextStart(String(slot.production - slot.costs), 6, ' ')
          " />
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
            autoShort(t(`employee.${employee.type}.shortName`), 5),
            5,
            ' '
          )
        }}
        {{ fillTextStart(String(employee.value), 5, ' ') }}
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

<script lang="ts" setup>
import { computed } from 'vue';
import useCore from '../composables/useCore';
import useI18n from '../composables/useI18n';
import { STORAGE_TYPE, STORAGE_TYPE_TO_RESOURCE } from '../types';
import { autoShort, fillTextEnd, fillTextStart } from '../utils/string';

import McText from './Text.vue';

const { t } = useI18n();
const { core } = useCore();

const getValueColor = (slot: StorageSummary) => {
  const value = Math.max(slot.value / slot.costs, 0);
  if (value > 0.5) {
    return 'green';
  } else if (value > 0.25) {
    return 'yellow';
  } else {
    return 'red';
  }
};

const getDiffColor = (slot: StorageSummary) => {
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
 * @type {import('vue').ComputedRef<import('../classes/CityEmployee').default[]>}
 */
const employees = computed(() => {
  if (!city.value) {
    throw new Error('City is not defined');
  }
  return [city.value.securityService, city.value.soldier, city.value.mercenary];
});

/**
 * @type {import('vue').ComputedRef<import('../classes/City').default>}
 */
const city = computed(() => {
  return core.currentPlayer?.city;
});

const storage = computed<StorageSummary[]>(() => {
  const cityV = city.value;
  if (!cityV) {
    throw new Error('City is not defined');
  }
  return (cityV.storage.slots || []).map(slot => {
    const type = slot.type as STORAGE_TYPE;
    const resourceType = STORAGE_TYPE_TO_RESOURCE[type];
    if (!resourceType) {
      throw new Error(`Resource type ${type} not found`);
    }
    let costs = cityV.getCostValue(resourceType);
    switch (slot.type) {
      case STORAGE_TYPE.FOOD:
        costs += cityV.getPopulationFood();
        break;
      case STORAGE_TYPE.ENERGY:
        costs += cityV.getPopulationEnergy();
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
      storage: cityV.getMaxStorageValue(type),
      production: cityV.getProductionValue(resourceType),
      costs,
      costPercentage
    };
  });
});

interface StorageSummary {
  infinite: boolean;
  name: string;
  value: number;
  storage: number;
  production: number;
  costs: number;
  costPercentage: number;
}
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
