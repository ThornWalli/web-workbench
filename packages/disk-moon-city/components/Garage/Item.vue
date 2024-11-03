<template>
  <div class="mc-garage-item">
    <mc-label
      type="glossy"
      text-glossy
      :disabled="disabled"
      :color="disabled ? 'orange' : 'dark-yellow'"
      selectable
      :model-value="selected"
      :content="name"
      @click="onClickSelect" />
    <mc-label-separator />
    <mc-label-progress-bar :value="armor / maxArmor" />
    <mc-label-separator />
    <mc-label-indicator color="red" :model-value="repairing" />
  </div>
</template>

<script setup>
import McLabelProgressBar from '../Label/ProgressBar.vue';
import McLabelSeparator from '../Label/Separator.vue';
import McLabel from '../Label.vue';
import McLabelIndicator from '../Label/Indicator.vue';

const $emit = defineEmits(['repair', 'select']);

defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'Item'
  },
  repairing: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  armor: {
    type: Number,
    default: 0
  },
  maxArmor: {
    type: Number,
    default: 100
  }
});

const onClickSelect = () => {
  $emit('select');
};
</script>

<style lang="postcss" scoped>
.mc-garage-item {
  display: flex;
  width: 218px;

  & .mc-label {
    width: 136px;
  }
}
</style>
