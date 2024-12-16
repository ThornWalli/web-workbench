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

<script setup>
import McFrameOverviewPrimary from '../frame/OverviewPrimary.vue';
import McFrameOverviewSecondary from '../frame/OverviewSecondary.vue';

import McMap from '../Map.vue';
import McOverviewWeaponAttack from '../overivew/WeaponAttack.vue';
import McOverviewGarage from '../overivew/Garage.vue';
import McOverviewRoundStart from '../overivew/RoundStart.vue';
import McOverviewVehicleArrives from '../overivew/VehicleArrives.vue';
import McAlertBar from '../AlertBar.vue';
import McOverviewCityAttack from '../overivew/CityAttack.vue';

import { inject, nextTick, watch } from 'vue';
import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n.js';

const { core } = useCore();
const { t } = useI18n();

const vehicles = computed(() => core.currentPlayer.city.vehicles);

const mapAlert = ref(null);
const map = ref(null);
const cityAttack = ref(null);

const currentAttackShoot = ref(null);
/**
 *
 * @param options {{
 *  player: import('../../classes/Player.js').default,
 * weapon: import('../../classes/Weapon.js').default,
 * next: () => void
 * }}
 */

const lockControls = inject('lockControls', () => ({}));
const controlsLocked = inject('controlsLocked', ref(false));

async function onWeaponAttackShoot(options = {}) {
  const { promise, resolve } = Promise.withResolvers();
  garage.value.reset();
  lockControls(true);

  const { player, weapon, error } = options;
  if (!error) {
    core.currentPlayer.city.useWeapon(weapon);
    const result = await core.currentPlayer.city.weaponAttack(player, weapon);
    currentAttackShoot.value = null;
    nextTick(async () => {
      await map.value.weaponShoot({ player, weapon });
      currentAttackShoot.value = result;
      nextTick(async () => {
        const { shoot } = await cityAttack.value.prepareWeaponShoot(result);
        window.setTimeout(async () => {
          await shoot();
          resolve();
        }, 1000);
      });
    });
  } else {
    let message = t('weapon_attack.alert.error');
    switch (error.message) {
      case 'missing_same_player':
        message = t('weapon_attack.alert.missing_same_player');
        break;
      case 'missing_selected_player':
        message = t('weapon_attack.alert.missing_selected_player');
        break;
      case 'missing_selected_weapon':
        message = t('weapon_attack.alert.missing_selected_weapon');
        break;
      case 'missing_weapon_ammunition':
        message = t('weapon_attack.alert.missing_weapon_ammunition', {
          overrides: { weapon: t(`weapon.${weapon}`).shortName }
        });
        break;
      default:
        console.error(error);
        message = error.message;
        break;
    }
    mapAlert.value.show(message);
    resolve();
  }
  await promise;
  lockControls(false);
}

const onChangeSelectedItemGarage = () => {
  currentAttackShoot.value = null;
};

const arrived = ref(false);
const garage = ref(null);
const $props = defineProps({
  skipVehicleArrives: {
    type: Boolean,
    default: false
  },
  roundStart: {
    type: Boolean,
    default: false
  }
});

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

defineEmits(['round-start']);
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
