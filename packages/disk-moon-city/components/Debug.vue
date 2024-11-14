<template>
  <div class="mc-debug font-style-bitfont">
    <div v-if="city">
      <div>Credits: {{ core.currentPlayer?.credits }}</div>
      <div v-for="slot in storage" :key="slot">
        <span>{{ fillTextEnd(slot.name, 18, ' ') }}</span>
        <span>
          {{ fillTextStart(slot.value, 5, '0') }} /
          {{ fillTextStart(slot.max, 5, '0') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import useCore from '../composables/useCore';
import { fillTextEnd, fillTextStart } from '../utils/string.js';

const { core } = useCore();

/**
 * @type {import('vue').ComputedRef<import('../classes/City.js').default>}
 */
const city = computed(() => {
  return core.currentPlayer?.city;
});

const storage = computed(() => {
  return (city.value.storage.slots || []).map(slot => {
    return {
      name: slot.type,
      value: slot.value,
      max: city.value.getMaxStorageValue(slot.type)
    };
  });
});
</script>

<style lang="postcss" scoped>
.mc-debug {
  position: fixed;
  top: 0;
  left: 0;
  padding: 2px;
  line-height: 14px;
  white-space: pre-wrap;
  border: solid white 2px;
}
</style>
