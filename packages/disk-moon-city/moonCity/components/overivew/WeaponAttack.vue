<template>
  <div class="mc-overview-weapon-attack">
    <div class="weapons">
      <mc-weapon-attack-item
        v-for="key in weaponKeys"
        :key="key"
        v-model="selectedWeapon"
        :disabled="disabled"
        :value="key"
        :count="getWeaponCount(key)"
        :name="t(`weapon.${key}.shortName`)" />
    </div>
    <mc-target-map
      v-model="selectedPlayer"
      :disabled="disabled"
      :current-player="core.currentPlayer"
      :players="core.players" />
    <div class="button">
      <mc-button
        :disabled="disabled"
        color="red"
        size="small"
        :label="t('weapon_attack.button.attack')"
        border
        @click="onClickButton" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import McWeaponAttackItem from './weaponAttack/Item.vue';
import McTargetMap from '../TargetMap.vue';
import McButton from '../Button.vue';

import { ref } from 'vue';

import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n';
import type Player from '../../classes/Player';
import { ERROR_MESSAGES } from './types';
import { WEAPON_KEY } from '../../types';
import type Weapon from '../../classes/Weapon';

const { t } = useI18n();
const { core } = useCore();

export type EmitShoot = { error?: Error; player?: Player; weapon?: Weapon };

const $emit = defineEmits<{
  (e: 'shoot', payload: EmitShoot): void;
}>();

const weaponKeys = ref(Object.values(WEAPON_KEY));

const selectedWeapon = ref<string>();
const selectedPlayer = ref<Player>();

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

const getWeaponCount = (key: string) => {
  return core.currentPlayer?.city.getWeaponsByKey(key).length;
};

const onClickButton = () => {
  if (!core.currentPlayer || !selectedWeapon.value) {
    throw new Error('currentPlayer or selectedWeapon is undefined');
  }

  const player = selectedPlayer.value;

  let error = null;
  if (player === core.currentPlayer) {
    error = new Error(ERROR_MESSAGES.MISSING_SAME_PLAYER);
  } else if (!player) {
    error = new Error(ERROR_MESSAGES.MISSING_SELECTED_PLAYER);
  } else if (!selectedWeapon.value) {
    error = new Error(ERROR_MESSAGES.MISSING_SELECTED_WEAPON);
  } else if (!getWeaponCount(selectedWeapon.value)) {
    error = new Error(ERROR_MESSAGES.MISSING_WEAPON_AMMUNITION);
  }

  const weapon = core.currentPlayer.city.getWeaponsByKey(
    selectedWeapon.value
  )[0];

  $emit(
    'shoot',
    error
      ? { error }
      : {
          player,
          weapon
        }
  );
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
