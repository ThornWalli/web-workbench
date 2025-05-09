<template>
  <base-radio-button
    v-slot="{ checked }"
    :disabled="disabled"
    class="mc-overview-weapon-attack-item"
    :class="{ disabled }"
    @click="!disabled && playSfx(SFX.BUTTON_3_CLICK)">
    <mc-label-checkbox edge :model-value="checked" />
    <mc-label
      class="name"
      background="black"
      color="dark-yellow"
      type="glossy"
      text-glossy
      :content="name" />
    <mc-label-separator type="secondary" />
    <mc-label
      class="amount"
      color="gray"
      text-glossy
      background="black"
      :content="fillTextStart(String(count), 3, '0')" />
  </base-radio-button>
</template>

<script lang="ts" setup>
import BaseRadioButton from '../../base/RadioButton.vue';
import McLabelCheckbox from '../../label/Checkbox.vue';
import McLabel from '../../Label.vue';
import McLabelSeparator from '../../label/Separator.vue';
import useAudioControl from '../../../composables/useAudioControl';
import { fillTextStart } from '../../../utils/string';
import { SFX } from '@web-workbench/disk-moon-city/moon-city/utils/sounds';

const { playSfx } = useAudioControl();

defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'Weapon Attack Item'
  },
  count: {
    type: Number,
    default: 0
  }
});
</script>

<style lang="postcss" scoped>
.mc-overview-weapon-attack-item {
  display: flex;

  &.disabled {
    filter: grayscale(100%);
  }

  &.mc-base-radio-button :deep(label) {
    display: flex;
    width: 100%;
  }

  & .name {
    width: 78px;
  }

  & .mc-label-checkbox {
    margin-right: 2px;
  }

  & .mc-label-separator {
    position: relative;
    z-index: 1;
    margin: 0 -2px;
  }
}
</style>
