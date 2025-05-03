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

<script setup>
import McWeaponAttackItem from './weaponAttack/Item.vue';
import McTargetMap from '../TargetMap.vue';
import McButton from '../Button.vue';

import { ref } from 'vue';
import { WEAPON_KEY } from '../../utils/keys';

import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n';

const { t } = useI18n();
const { core } = useCore();

const $emit = defineEmits(['shoot', 'alert']);

const weaponKeys = ref(Object.values(WEAPON_KEY));

const selectedWeapon = ref(null);
const selectedPlayer = ref(null);

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

const getWeaponCount = key => {
  return core.currentPlayer.city.getWeaponsByKey(key).length;
};

const onClickButton = () => {
  let error = null;
  if (selectedPlayer.value === core.currentPlayer) {
    error = new Error('missing_same_player');
  } else if (!selectedPlayer.value) {
    error = new Error('missing_selected_player');
  } else if (!selectedWeapon.value) {
    error = new Error('missing_selected_weapon');
  } else if (!getWeaponCount(selectedWeapon.value)) {
    error = new Error('missing_weapon_ammunition');
  }

  $emit(
    'shoot',
    error
      ? { error }
      : {
          player: selectedPlayer.value,
          weapon: core.currentPlayer.city.getWeaponsByKey(
            selectedWeapon.value
          )[0]
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
