<template>
  <wb-env-atom-form-field-dropdown
    v-bind="$attrs"
    :model-value="$attrs.modelValue"
    :options="options" />
</template>

<script lang="ts" setup>
import type Core from '@web-workbench/core/classes/Core';
import WbEnvAtomFormFieldDropdown from '../Dropdown.vue';
import { computed } from 'vue';
import { capitalCase } from 'change-case';

const $props = defineProps<{
  core: Core;
}>();

const options = computed(() => {
  return Array.from(
    $props.core.modules.symbols?.symbols.values().map(symbol => {
      return {
        title: capitalCase(symbol.key),
        value: symbol.key
      };
    }) || []
  );
});
</script>
