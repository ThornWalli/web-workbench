<template>
  <div :key="currentPage" class="mc-button-navigation">
    <mc-button
      v-for="(item, index) in items[currentPage]"
      :key="index"
      :model-value="item.value === modelValue"
      :label="prepareLabel(item)"
      :short-label="item.shortLabel || prepareLabel(item)"
      @click="onClick(item)" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import useAudioControl from '../composables/useAudioControl';
import McButton from './Button.vue';

const { playSfx } = useAudioControl();
const currentPage = ref(0);

const $props = defineProps({
  modelValue: {
    type: String,
    default: 'none'
  },
  items: {
    type: Array,
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

const $emit = defineEmits(['update:model-value']);

const onClick = async ({ next, value }) => {
  playSfx('button_1_click');
  if (next) {
    currentPage.value = (currentPage.value + 1) % $props.items.length;
  } else {
    $emit('update:model-value', value);
  }
};

const prepareLabel = item => {
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
