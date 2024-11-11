<template>
  <div class="mc-overview-weapon-attack">
    <div class="weapons">
      <mc-weapon-attack-item
        v-for="key in weaponKeys"
        :key="key"
        v-model="selectedWeapon"
        :value="key"
        :count="getWeaponCount(key)"
        :name="t(`weapon.${key}.shortName`)" />
    </div>
    <mc-target-map
      v-model="selectedPlayer"
      :current-player="core.currentPlayer"
      :players="core.players" />
    <div class="button">
      <mc-button
        color="red"
        size="small"
        :label="t('weapon_attack.button.attack')"
        border
        @click="onClickButton" />
    </div>
  </div>
</template>

<script setup>
import McWeaponAttackItem from './weaponAttack/Item.vue';
import McTargetMap from '../TargetMap.vue';
import McButton from '../Button.vue';

import { ref } from 'vue';
import { WEAPON_KEY } from '../../utils/keys.js';

import useCore from '../../composables/useCore.js';
import useI18n from '../../composables/useI18n.js';

const { t } = useI18n();
const { core } = useCore();

const $emit = defineEmits(['shoot', 'alert']);

const weaponKeys = ref(Object.values(WEAPON_KEY));

const selectedWeapon = ref(null);
const selectedPlayer = ref(null);

const getWeaponCount = key => {
  return core.currentPlayer.city.getWeaponsByKey(key).length;
};

const onClickButton = () => {
  if (selectedPlayer.value === core.currentPlayer) {
    $emit('alert', t('weapon_attack.alert.missing_same_player'));
  } else if (!selectedPlayer.value) {
    $emit('alert', t('weapon_attack.alert.missing_selected_player'));
  } else if (!selectedWeapon.value) {
    $emit('alert', t('weapon_attack.alert.missing_selected_weapon'));
  } else if (!getWeaponCount(selectedWeapon.value)) {
    $emit(
      'alert',
      t('weapon_attack.alert.missing_weapon_ammunition', {
        overrides: { weapon: t(`weapon.${selectedWeapon.value}`).shortName }
      })
    );
  } else {
    $emit('shoot', {
      player: selectedPlayer.value,
      weapon: core.currentPlayer.city.getWeaponsByKey(selectedWeapon.value)[0]
    });
  }
};
</script>

<style lang="postcss" scoped>
.mc-overview-weapon-attack {
  display: flex;
  gap: 4px;
  width: 271px;
  height: 78px;
  padding: 4px;

  & .weapons {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  & .mc-target-map {
    position: relative;
    top: 2px;
  }

  & .button {
    position: relative;
    top: 2px;
    left: 0;
  }
}
</style>
