<template>
  <div class="mc-view-overview">
    <teleport to="#layout_content_1">
      <mc-frame-overview-primary>
        <mc-overview-vehicle-arrives
          v-if="roundStart && !skipVehicleArrives"
          v-model="arrived"
          :vehicles="vehicles" />
        <mc-map v-else ref="map">
          <mc-alert-bar ref="mapAlert" />
        </mc-map>
        <mc-overview-weapon-attack
          :disabled="controlsLocked"
          @shoot="onWeaponAttackShoot" />
      </mc-frame-overview-primary>
    </teleport>
    <teleport to="#layout_content_2">
      <mc-frame-overview-secondary>
        <mc-overview-garage
          ref="garage"
          :disabled="controlsLocked"
          @change:selected-item="onChangeSelectedItemGarage" />
      </mc-frame-overview-secondary>
    </teleport>
    <teleport to="#layout_screen">
      <transition name="fade">
        <mc-overview-city-attack v-if="currentAttackShoot" ref="cityAttack" />
      </transition>
      <mc-overview-round-start
        v-if="!currentAttackShoot && roundStart && arrived"
        @round-start="() => $emit('round-start')" />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import McFrameOverviewPrimary from '../frame/OverviewPrimary.vue';
import McFrameOverviewSecondary from '../frame/OverviewSecondary.vue';

import McMap from '../Map.vue';
import McOverviewWeaponAttack, {
  type EmitShoot
} from '../overivew/WeaponAttack.vue';
import McOverviewGarage from '../overivew/Garage.vue';
import McOverviewRoundStart from '../overivew/RoundStart.vue';
import McOverviewVehicleArrives from '../overivew/VehicleArrives.vue';
import McAlertBar from '../AlertBar.vue';
import McOverviewCityAttack from '../overivew/CityAttack.vue';

import { computed, inject, nextTick, ref, watch } from 'vue';
import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n';
import type WeaponAttackResult from '../../classes/attackResult/WeaponAttackResult';
import { ERROR_MESSAGES } from '../overivew/types';

const { core } = useCore();
const { t } = useI18n();

const vehicles = computed(() => core.currentPlayer?.city.vehicles || []);

const mapAlert = ref<typeof McAlertBar>();
const map = ref<typeof McMap>();
const cityAttack = ref<typeof McOverviewCityAttack>();

const currentAttackShoot = ref<WeaponAttackResult>();

const lockControls = inject<(lock?: boolean) => void>(
  'lockControls',
  () => ({})
);
const controlsLocked = inject('controlsLocked', ref(false));

async function onWeaponAttackShoot(options: EmitShoot) {
  const { promise, resolve } = Promise.withResolvers<undefined>();
  garage.value?.reset();
  lockControls(true);

  if (!core.currentPlayer) {
    throw new Error('Current player is not defined');
  }

  const { player, weapon, error } = options;
  if (!error) {
    if (!player) {
      throw new Error('Player is not defined');
    }
    if (!weapon) {
      throw new Error('Weapon is not defined');
    }
    core.currentPlayer.city.useWeapon(weapon);
    const result = await core.currentPlayer.city.weaponAttack(player, weapon);
    currentAttackShoot.value = undefined;
    nextTick(async () => {
      await map.value?.weaponShoot({ player, weapon });
      currentAttackShoot.value = result;
      nextTick(async () => {
        if (!cityAttack.value) {
          throw new Error('City attack is not defined');
        }
        const { shoot } = await cityAttack.value.prepareWeaponShoot(result);
        window.setTimeout(async () => {
          await shoot();
          resolve(undefined);
        }, 1000);
      });
    });
  } else {
    let message = t('weapon_attack.alert.error');
    switch (error.message) {
      case ERROR_MESSAGES.MISSING_SAME_PLAYER:
        message = t('weapon_attack.alert.missing_same_player');
        break;
      case ERROR_MESSAGES.MISSING_SELECTED_PLAYER:
        message = t('weapon_attack.alert.missing_selected_player');
        break;
      case ERROR_MESSAGES.MISSING_SELECTED_WEAPON:
        message = t('weapon_attack.alert.missing_selected_weapon');
        break;
      case ERROR_MESSAGES.MISSING_WEAPON_AMMUNITION:
        message = t('weapon_attack.alert.missing_weapon_ammunition', {
          overrides: { weapon: t(`weapon.${weapon}.shortName`) }
        });
        break;
      default:
        console.error(error);
        message = error.message;
        break;
    }
    mapAlert.value?.show(message);
    resolve(undefined);
  }
  await promise;
  lockControls(false);
}

const onChangeSelectedItemGarage = () => {
  currentAttackShoot.value = undefined;
};

const arrived = ref(false);
const garage = ref<typeof McOverviewGarage>();
const $props = defineProps<{
  skipVehicleArrives: boolean;
  roundStart: boolean;
}>();

watch(
  () => $props.roundStart,
  value => {
    if (value) {
      if (garage.value) {
        garage.value.reset();
      }
      if ($props.skipVehicleArrives) {
        arrived.value = true;
      }
    }
  },
  { immediate: true }
);

defineEmits<{
  (e: 'round-start'): void;
}>();
</script>

<style lang="postcss" scoped>
.mc-map {
  position: absolute;
  top: 26px;
  left: 14px;
}

.mc-overview-vehicle-arrives {
  position: absolute;
  top: 26px;
  left: 14px;
}

.mc-overview-weapon-attack {
  position: absolute;
  top: 288px;
  left: 8px;
}

.fade-enter-active {
  transition: opacity 0.2s steps(2);
}

.fade-leave-active {
  transition: opacity 0.2s steps(2);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
