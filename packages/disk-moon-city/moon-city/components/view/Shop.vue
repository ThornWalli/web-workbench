<template>
  <div class="mc-view-shop">
    <teleport to="#layout_content_1">
      <mc-frame-shop-primary>
        <template #content-1>
          <div class="mc-view-shop-content">
            <ul class="items">
              <li v-for="{ key, name, instance } in vehicleItems" :key="key">
                <mc-shop-item
                  v-model="selectedItem"
                  type="vehicle"
                  v-bind="{ instance, name }" />
              </li>
            </ul>
          </div>
        </template>
        <template #content-2>
          <div class="mc-view-shop-content">
            <ul class="items">
              <li v-for="{ key, name, instance } in buildingItems" :key="key">
                <mc-shop-item
                  v-model="selectedItem"
                  type="building"
                  v-bind="{ instance, name }" />
              </li>
            </ul>
          </div>
        </template>
      </mc-frame-shop-primary>
    </teleport>
    <teleport to="#layout_content_2">
      <mc-frame-shop-secondary>
        <div class="mc-view-shop-content">
          <ul class="items weapon">
            <li v-for="{ key, name, instance } in weaponItems" :key="key">
              <mc-shop-item
                v-model="selectedItem"
                type="weapon"
                v-bind="{ instance, name }" />
            </li>
          </ul>
          <div class="buttons">
            <mc-button
              :disabled="!selectedItem"
              size="large"
              :label="t('view.shop.button.buy')"
              color="red"
              border
              @click="onClickBuy" />
            <mc-button
              :disabled="!canSell"
              size="small"
              :label="
                t('view.shop.button.sell').length > 4
                  ? t('view.shop.button.sell').slice(0, 4) + '.'
                  : t('view.shop.button.sell')
              "
              color="red"
              border
              @click="onClickSell" />
          </div>
        </div>
      </mc-frame-shop-secondary>
    </teleport>
    <teleport to="#layout_screen">
      <mc-shop-screen v-if="selectedItem" v-model="selectedItem">
        <mc-alert-bar ref="screenAlert" />
      </mc-shop-screen>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import McFrameShopPrimary from '../frame/ShopPrimary.vue';
import McFrameShopSecondary from '../frame/ShopScondary.vue';
import McButton from '../Button.vue';
import McShopScreen from '../shop/Screen.vue';
import McAlertBar from '../AlertBar.vue';

import { BUILDING_KEY, VEHICLE_KEY, WEAPON_KEY } from '../../types';
import useI18n from '../../composables/useI18n';

import McShopItem from '../shop/Item.vue';
import { BUILDING, VEHICLE, WEAPON } from '../../utils/types';
import useCore from '../../composables/useCore';
import useAudioControl from '../../composables/useAudioControl';
import { ERROR_MESSAGE } from '../../classes/City';
import { SFX } from '../../utils/sounds';
import type { AVAILABLE_VEHICLE_TYPES } from '../../classes/vehicles/types';
import type { AVAILABLE_BUILDING_TYPES } from '../../classes/buildings/types';
import type { AVAILABLE_WEAPON_TYPES } from '../../classes/weapons/types';

const { t } = useI18n();
const { core } = useCore();
const { playSfx } = useAudioControl();

const SHOP_ITEM_TYPE = {
  VEHICLE: 'vehicle',
  BUILDING: 'building',
  WEAPON: 'weapon'
};

const screenAlert = ref<typeof McAlertBar>();

const vehicleItems = computed(() => {
  return Object.values(VEHICLE_KEY).map(key => {
    return {
      key,
      type: 'vehicle',
      name: t(`vehicle.${key}.name`),
      instance: VEHICLE[key]
    };
  });
});

const buildingItems = computed(() => {
  return Object.values(BUILDING_KEY).map(key => {
    return {
      key,
      type: 'building',
      name: t(`building.${key}.name`),
      instance: BUILDING[key]
    };
  });
});

const weaponItems = computed(() => {
  return Object.values(WEAPON_KEY).map(key => {
    return {
      key,
      type: 'weapon',
      name: t(`weapon.${key}.name`),
      instance: WEAPON[key]
    };
  });
});

const selectedItem = ref<
  AVAILABLE_VEHICLE_TYPES | AVAILABLE_BUILDING_TYPES | AVAILABLE_WEAPON_TYPES
>();

// const getType = (item: typeof Vehicle | typeof Building | typeof Weapon) => {
const getType = (
  item:
    | AVAILABLE_VEHICLE_TYPES
    | AVAILABLE_BUILDING_TYPES
    | AVAILABLE_WEAPON_TYPES
) => {
  if (item.TYPE === 'vehicle') {
    return SHOP_ITEM_TYPE.VEHICLE;
  } else if (item.TYPE === 'building') {
    return SHOP_ITEM_TYPE.BUILDING;
  } else if (item.TYPE === 'weapon') {
    return SHOP_ITEM_TYPE.WEAPON;
  }
  return null;
};

const canSell = computed(() => {
  const type = selectedItem.value && getType(selectedItem.value);
  const ItemClass = selectedItem.value;
  return (
    selectedItem.value &&
    type &&
    [SHOP_ITEM_TYPE.BUILDING, SHOP_ITEM_TYPE.WEAPON].includes(type) &&
    selectedItem.value &&
    ItemClass &&
    core.currentPlayer?.city.buildings.some(
      building => building instanceof ItemClass
    )
  );
});

// eslint-disable-next-line complexity
const onClickBuy = () => {
  playSfx(SFX.BUTTON_2_CLICK);
  try {
    if (!core.currentPlayer || !selectedItem.value) {
      throw new Error('No player or item selected');
    }
    const Class = selectedItem.value;
    switch (getType(selectedItem.value)) {
      case SHOP_ITEM_TYPE.VEHICLE:
        core.currentPlayer.city.buyVehicle(
          new (Class as AVAILABLE_VEHICLE_TYPES)()
        );
        break;
      case SHOP_ITEM_TYPE.BUILDING:
        core.currentPlayer.city.buyBuilding(
          new (Class as AVAILABLE_BUILDING_TYPES)()
        );
        break;
      case SHOP_ITEM_TYPE.WEAPON:
        core.currentPlayer.city.buyWeapon(
          new (Class as AVAILABLE_WEAPON_TYPES)()
        );
        break;
    }
    playSfx(SFX.BUY_SELL);
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case ERROR_MESSAGE.MAX_VEHICLES_REACHED:
          screenAlert.value?.show(t('view.shop.alert.max_vehicles'));
          break;
        case ERROR_MESSAGE.NOT_ENOUGH_CREDITS:
          screenAlert.value?.show(t('view.shop.alert.not_enough_credits'));
          break;
        case ERROR_MESSAGE.NO_VEHICLE_FACTORY:
          screenAlert.value?.show(t('view.shop.alert.no_vehicle_factory'));
          break;
        case ERROR_MESSAGE.NO_WEAPON_FACTORY:
          screenAlert.value?.show(t('view.shop.alert.no_weapon_factory'));
          break;

        default:
          console.error(error);
          break;
      }
    } else {
      console.error('Unbekannter Fehler', error);
    }
  }
};
const onClickSell = () => {
  playSfx(SFX.BUTTON_2_CLICK);
  playSfx(SFX.BUY_SELL);

  const Class = selectedItem.value;
  if (!Class) {
    throw new Error('No item selected');
  }
  switch (getType(Class)) {
    case SHOP_ITEM_TYPE.BUILDING:
      core.currentPlayer?.city.sellBuilding(
        core.currentPlayer.city.buildings.filter(
          building => building instanceof Class
        )[0]
      );
      break;
    case SHOP_ITEM_TYPE.WEAPON:
      core.currentPlayer?.city.sellWeapon(
        core.currentPlayer.city.weapons.filter(
          weapon => weapon instanceof Class
        )[0]
      );
      break;
  }
};
</script>

<style lang="postcss" scoped>
.mc-view-shop {
  position: relative;
  width: 100%;
  height: 100%;
}

.mc-view-shop-content {
  & .items {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    width: 100%;
  }

  & .weapon {
    position: absolute;
    top: 16px;
    left: 0;
    display: flex;
    justify-content: center;
    width: 202px;
    height: 78px;
    padding-top: 6px;
  }

  & .buttons {
    position: absolute;
    top: 2px;
    right: 12px;
    bottom: 2px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
  }
}
</style>
