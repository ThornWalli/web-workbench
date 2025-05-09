<template>
  <div :key="currentPage" class="mc-button-navigation">
    <mc-button
      v-for="(item, index) in currentPageItems"
      :key="index"
      :model-value="item.value === modelValue"
      :label="prepareLabel(item)"
      :short-label="item.shortLabel || prepareLabel(item)"
      @click="onClick(item)" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import useAudioControl from '../composables/useAudioControl';
import McButton from './Button.vue';
import { SFX } from '../utils/sounds';

const { playSfx } = useAudioControl();
const currentPage = ref(0);

export interface ButtonNavigationItem {
  label?: string;
  shortLabel?: string;
  value?: string;
  next?: boolean;
}

export type ButtonNavigationItemList = ButtonNavigationItem[][];

const $props = defineProps({
  modelValue: {
    type: String,
    default: 'none'
  },
  items: {
    type: Array<ButtonNavigationItem[]>,
    default: () => [
      [
        {
          label: 'Button 1',
          shortLabel: 'Btn. 1',
          value: 'button-1'
        },
        { next: true }
      ],
      [
        {
          label: 'Button 2',
          shortLabel: 'Btn. 2',
          value: 'button-2'
        },
        { next: true }
      ]
    ]
  }
});

const currentPageItems = computed(() => {
  return $props.items[currentPage.value] || [];
});

const $emit = defineEmits(['update:model-value']);

const onClick = async ({ next, value }: ButtonNavigationItem) => {
  playSfx(SFX.BUTTON_1_CLICK);
  if (next) {
    currentPage.value = (currentPage.value + 1) % $props.items.length;
  } else {
    $emit('update:model-value', value);
  }
};

const prepareLabel = (item: ButtonNavigationItem) => {
  if (item.next) {
    return item.label || '>>';
  }
  return item.label;
};
</script>

<style lang="postcss" scoped>
.mc-button-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 8px;
}
</style>
