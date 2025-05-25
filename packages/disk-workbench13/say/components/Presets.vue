<template>
  <div ref="rootEl" class="wb-disks-workbench13-options">
    <wb-grid class="grid">
      <wb-button
        v-for="(item, index) in preparedItems"
        :key="index"
        type="button"
        style-type="primary"
        :label="item.label"
        @click="onClick(item)" />
    </wb-grid>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import items from '../items.json';
import WbButton from '@web-workbench/core/components/atoms/Button.vue';
import WbGrid from '@web-workbench/core/components/atoms/Grid.vue';
import type { Model } from '../types';
import { DEFAULT_PRESET_LANGUAGE } from '../utils';

const $emit = defineEmits<{
  (e: 'select', value: string): void;
}>();

const $props = defineProps<{
  model: Model;
  language: string;
  displayLanguage?: string;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const preparedItems = computed<Item[]>(() => {
  return items.map(item => {
    return {
      value: item.key,
      label:
        item.value[
          ($props.displayLanguage ||
            DEFAULT_PRESET_LANGUAGE) as keyof typeof item.value
        ] || ''
    };
  });
});

function onClick(item: Item) {
  $emit(
    'select',
    items.find(({ key }) => key === item.value)?.value[
      $props.language as keyof (typeof items)[0]['value']
    ] || ''
  );
}

interface Item {
  value: string;
  label: string;
}
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-options {
  position: relative;
  min-width: 100px;
  container-type: inline-size;

  & .grid {
    container-type: inline-size;

    --grid-columns: 1;

    @container (min-width: 200px) {
      --grid-columns: 2;
    }

    @container (min-width: 400px) {
      --grid-columns: 3;
    }
  }
}
</style>
