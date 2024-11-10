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
        :disabled="canAttack"
        color="red"
        size="small"
        :label="t('weapon_attack.button.attack')"
        border />
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

const weaponKeys = ref(Object.values(WEAPON_KEY));

const { core } = useCore();

const selectedWeapon = ref(null);
const selectedPlayer = ref(null);

const canAttack = computed(() => {
  return (
    !selectedPlayer.value &&
    core.currentPlayer.city.weapons.filter(
      weapon => weapon.key === selectedWeapon.value
    ).length < 1
  );
});

const getWeaponCount = key => {
  return core.currentPlayer.city.weapons.filter(weapon => weapon.key === key)
    .length;
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
