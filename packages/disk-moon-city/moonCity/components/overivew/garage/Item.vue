<template>
  <div class="mc-overview-garage-item" :class="{ disabled }">
    <mc-label
      type="glossy"
      text-glossy
      :disabled="disabled || empty"
      :color="empty ? 'orange' : 'dark-yellow'"
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

<script lang="ts" setup>
import McLabelProgressBar from '../../label/ProgressBar.vue';
import McLabelSeparator from '../../label/Separator.vue';
import McLabel from '../../Label.vue';
import McLabelIndicator from '../../label/Indicator.vue';

const $emit = defineEmits<{
  (e: 'select'): void;
}>();

defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  empty: {
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
.mc-overview-garage-item {
  display: flex;
  width: 218px;

  &.disabled {
    filter: grayscale(100%);
  }

  & .mc-label {
    width: 136px;
  }
}
</style>
