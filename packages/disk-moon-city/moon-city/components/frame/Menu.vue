<template>
  <div class="mc-frame-menu">
    <div class="content">
      <ul>
        <li
          v-for="(item, index) in items"
          :key="item.key"
          :class="{ separator: index > 0 }">
          <base-button
            :disabled="disabled || disables[item.key]"
            :class="{
              selectable: item.selectable,
              selected: item.key === modelValue
            }"
            @click="onClick($event, item)">
            <img v-if="images[item.key]" :src="images[item.key]" />
            <div class="frame" />
            <div v-if="item.selectable" class="indicator">
              <div />
            </div>
          </base-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import BaseButton from '../base/Button.vue';

import imageMenuShop from '../../assets/graphics/menu/item/shop.png';
import imageMenuCity from '../../assets/graphics/menu/item/city.png';
import imageMenuAttack from '../../assets/graphics/menu/item/attack.png';
import imageMenuStats from '../../assets/graphics/menu/item/stats.png';
import imageMenuOk from '../../assets/graphics/menu/item/ok.png';
import imageMenuSave from '../../assets/graphics/menu/item/save.png';
import useAudioControl from '../../composables/useAudioControl';
import { SFX } from '../../utils/sounds';

const $props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  disables: {
    type: Object,
    default: () => ({})
  }
});

const images: Partial<{
  [key in MENU_ITEM]: string;
}> = {
  [MENU_ITEM.SHOP]: imageMenuShop,
  [MENU_ITEM.CITY]: imageMenuCity,
  [MENU_ITEM.ATTACK]: imageMenuAttack,
  [MENU_ITEM.STATS]: imageMenuStats,
  [MENU_ITEM.OK]: imageMenuOk,
  [MENU_ITEM.SAVE]: imageMenuSave
};

interface Item {
  key: MENU_ITEM;
  selectable: boolean;
  title: string;
  disabled?: boolean;
  enter?: boolean;
}

const items = computed<Item[]>(() => {
  return [
    {
      key: MENU_ITEM.SHOP,
      disabled: false,
      selectable: true,
      title: 'Shop'
    },
    {
      key: MENU_ITEM.CITY,
      disabled: false,
      selectable: true,
      title: 'City'
    },
    {
      key: MENU_ITEM.STATS,
      selectable: true,
      title: 'Stats'
    },
    {
      key: MENU_ITEM.ATTACK,
      selectable: true,
      title: 'Attack'
    },
    {
      key: MENU_ITEM.OK,
      disabled: false,
      selectable: false,
      enter: true,
      title: 'OK'
    },
    {
      key: MENU_ITEM.SAVE,
      selectable: false,
      title: 'Save'
    }
  ];
});

const $emit = defineEmits<{
  (e: 'complete'): void;
  (e: 'update:model-value', value: MENU_ITEM): void;
}>();

const { playSfx } = useAudioControl();

const onClick = async (e: Event, item: Item) => {
  e.preventDefault();
  if ($props.disabled || item.disabled) {
    return;
  }
  await playSfx(SFX.BUTTON_2_CLICK).promise;
  if (item.enter) {
    $emit('complete');
  } else {
    if ($props.modelValue === item.key) {
      $emit('update:model-value', MENU_ITEM.NONE);
      return;
    }
    $emit('update:model-value', item.key);
  }
};
</script>

<script lang="ts">
export enum MENU_ITEM {
  NONE = 'none',
  SHOP = 'shop',
  CITY = 'city',
  ATTACK = 'attack',
  STATS = 'stats',
  OK = 'ok',
  SAVE = 'save',
  INFO = 'info'
}
</script>

<style lang="postcss" scoped>
.mc-frame-menu {
  display: flex;
  width: 100%;

  & ul {
    display: flex;

    & li {
      display: flex;

      &::before {
        display: block;
        width: 8px;
        height: 50px;
        content: '';
        background: url('../../assets/graphics/menu/frame/seperator.png');
        background-size: contain;
      }
    }

    &::after {
      display: block;
      width: 8px;
      height: 50px;
      content: '';
      background: url('../../assets/graphics/menu/frame/seperator.png');
      background-size: contain;
    }
  }

  &::before {
    display: block;
    flex: 0 0 2px;
    height: 50px;
    content: '';
    background: url('../../assets/graphics/menu/frame/start.png');
    background-size: contain;
  }

  &::after {
    display: block;
    flex: 0 0 2px;
    height: 50px;
    content: '';
    background: url('../../assets/graphics/menu/frame/end.png');
    background-size: contain;
  }

  & img {
    display: block;
    width: 36px;
  }

  & button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 50px;

    &[disabled] {
      /* pointer-events: none; */

      & img {
        filter: grayscale(100%);
      }
    }

    & .frame {
      position: absolute;
      inset: 0;
      background: url('../../assets/graphics/menu/frame/item.png');
      background-size: contain;
    }

    &.selectable {
      & .indicator {
        position: absolute;
        top: 2px;
        right: 0;
        width: 14px;
        height: 16px;
        pointer-events: none;
        background: url('../../assets/graphics/shop/item/indicator/default.png');
        background-size: contain;

        &::before {
          position: absolute;
          inset: 0;
          content: '';
          background: url('../../assets/graphics/shop/item/indicator/disabled.png');
          background-size: contain;
          opacity: 0;
          transition: opacity 0.2s steps(3);
        }

        & div {
          position: absolute;
          inset: 0;

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
      }

      &:not(.selected) {
        &:not([disabled]) {
          &:hover .indicator div {
            &::before {
              opacity: 1;
            }
          }
        }
      }

      &.selected {
        & .indicator div {
          &::after {
            opacity: 1;
          }
        }
      }

      &[disabled] {
        & .indicator::before {
          opacity: 1;
        }

        cursor: not-allowed;

        & img {
          filter: grayscale(100%);
        }
      }
    }

    /* & .content {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    height: 20px;
    padding: 2px 0;
    background: url('../assets/graphics/label/menu/fill.png');
    background-size: contain;
  } */
  }
}
</style>
