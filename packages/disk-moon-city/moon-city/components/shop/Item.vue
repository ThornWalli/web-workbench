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

<script lang="ts" setup>
import { computed } from 'vue';
import graphics, { GRAPHIC_SHOP_TYPE } from '../../utils/graphics';
import Vehicle from '../../classes/Vehicle';
import Building from '../../classes/Building';
import Weapon from '../../classes/Weapon';
import BaseRadioButton from '../base/RadioButton.vue';
import useAudioControl from '../../composables/useAudioControl';
import { SFX } from '../../utils/sounds';
import type { AVAILABLE_BUILDING_TYPES } from '../../classes/buildings/types';
import type { AVAILABLE_VEHICLE_TYPES } from '../../classes/vehicles/types';
import type { AVAILABLE_WEAPON_TYPES } from '../../classes/weapons/types';
import type { BUILDING_KEY, VEHICLE_KEY, WEAPON_KEY } from '../../types';

const { playSfx } = useAudioControl();
const $emit = defineEmits<{
  (
    e: 'update:model-value',
    value:
      | AVAILABLE_BUILDING_TYPES
      | AVAILABLE_VEHICLE_TYPES
      | AVAILABLE_WEAPON_TYPES
      | undefined
  ): void;
}>();

const onUpdateModelValue = (value?: string) => {
  playSfx(SFX.BUTTON_3_CLICK);
  $emit('update:model-value', value ? $props.instance : undefined);
};

const $props = defineProps<{
  modelValue:
    | AVAILABLE_BUILDING_TYPES
    | AVAILABLE_VEHICLE_TYPES
    | AVAILABLE_WEAPON_TYPES
    | undefined;
  name: string;
  instance:
    | AVAILABLE_BUILDING_TYPES
    | AVAILABLE_VEHICLE_TYPES
    | AVAILABLE_WEAPON_TYPES; // new () => unk;
}>();

const type = computed(() => {
  if (resolveInstance.value instanceof Vehicle) {
    return GRAPHIC_SHOP_TYPE.VEHICLE;
  } else if (resolveInstance.value instanceof Building) {
    return GRAPHIC_SHOP_TYPE.BUILDING;
  } else if (resolveInstance.value instanceof Weapon) {
    return GRAPHIC_SHOP_TYPE.WEAPON;
  }
  console.error(`Unknown type`, resolveInstance.value);
  throw new Error(`Unknown type`);
});

const resolveInstance = computed(() => {
  return new $props.instance();
});
const resolveModelValue = computed(() => {
  return $props.modelValue && new $props.modelValue();
});

const src = computed(() => {
  switch (type.value) {
    case GRAPHIC_SHOP_TYPE.VEHICLE:
      return graphics.shop[GRAPHIC_SHOP_TYPE.VEHICLE][
        resolveInstance.value.key as VEHICLE_KEY
      ];
    case GRAPHIC_SHOP_TYPE.BUILDING:
      return graphics.shop[GRAPHIC_SHOP_TYPE.BUILDING][
        resolveInstance.value.key as BUILDING_KEY
      ];
    case GRAPHIC_SHOP_TYPE.WEAPON:
      return graphics.shop[GRAPHIC_SHOP_TYPE.WEAPON][
        resolveInstance.value.key as WEAPON_KEY
      ];
    default:
      throw new Error(`Unknown type`);
  }
});
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
