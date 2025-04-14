<template>
  <base-radio-button
    v-slot="{ checked }"
    :model-value="resolveModelValue?.key"
    :value="resolveInstance.key"
    class="mc-shop-item"
    :class="{ [`type-${type}`]: true }"
    @update:model-value="onUpdateModelValue">
    <img :src="src" :title="name" />
    <div class="indicator" :class="{ selected: checked }" />
  </base-radio-button>
</template>

<script setup>
import { computed } from 'vue';
import graphics from '../../utils/graphics.js';
import Vehicle from '../../classes/Vehicle.js';
import Building from '../../classes/Building.js';
import Weapon from '../../classes/Weapon.js';
import BaseRadioButton from '../base/RadioButton.vue';
import useAudioControl from '../../composables/useAudioControl.js';

const { playSfx } = useAudioControl();
const $emit = defineEmits(['update:model-value']);

const onUpdateModelValue = value => {
  playSfx('button_3_click');
  $emit('update:model-value', (value && $props.instance) || null);
};

const $props = defineProps({
  modelValue: {
    type: Function,
    default: null
  },
  name: {
    type: String,
    required: true
  },
  instance: {
    type: Function,
    required: true
  }
});

const type = computed(() => {
  if (resolveInstance.value instanceof Vehicle) {
    return 'vehicle';
  } else if (resolveInstance.value instanceof Building) {
    return 'building';
  } else if (resolveInstance.value instanceof Weapon) {
    return 'weapon';
  }
  return null;
});

const resolveInstance = computed(() => {
  return new $props.instance();
});
const resolveModelValue = computed(() => {
  return $props.modelValue && new $props.modelValue();
});

const src = computed(
  () => graphics.shop[String(type.value)][resolveInstance.value.key]
);
</script>

<style lang="postcss" scoped>
.mc-shop-item {
  position: relative;
  display: block;
  width: 64px;
  height: 64px;
  background: url('../../assets/graphics/shop/item/frame/vehicle.png');
  background-size: contain;

  &::after {
    pointer-events: none;
  }

  & img {
    display: block;
    width: 100%;
  }

  & .indicator {
    position: absolute;
    top: 2px;
    right: 0;
    width: 14px;
    height: 16px;
    pointer-events: none;
    background: url('../../assets/graphics/shop/item/indicator/default.png');
    background-size: contain;

    &::before,
    &::after {
      position: absolute;
      inset: 0;
      content: '';
      background: url('../../assets/graphics/shop/item/indicator/hover.png');
      background-size: contain;
      opacity: 0;
      transition: opacity 0.2s steps(3);
    }

    &::after {
      background-image: url('../../assets/graphics/shop/item/indicator/selected.png');
    }
  }

  &:hover .indicator:not(.selected) {
    &::before {
      opacity: 1;
    }
  }

  & .indicator.selected {
    &::after {
      opacity: 1;
    }
  }

  &.type-vehicle {
    position: relative;
    background-image: url('../../assets/graphics/shop/item/frame/vehicle.png');

    &::after {
      position: absolute;
      inset: 0;
      content: '';
      background: url('../../assets/graphics/shop/item/frame/vehicle_foregroud.png');
      background-size: contain;
    }
  }

  &.type-weapon {
    position: relative;
    background-image: url('../../assets/graphics/shop/item/frame/weapon.png');

    &::after {
      position: absolute;
      inset: 0;
      content: '';
      background: url('../../assets/graphics/shop/item/frame/weapon_foreground.png');
      background-size: contain;
    }
  }

  &.type-building {
    position: relative;
    background-image: url('../../assets/graphics/shop/item/frame/building.png');

    /* &::after {
      position: absolute;
      inset: 0;
      content: '';
      background: url('../../assets/graphics/shop/item/frame/building_foregroud.png');
      background-size: contain;
    } */
  }
}
</style>
