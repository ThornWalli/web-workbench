<template>
  <div class="mc-frame-attack-primary">
    <div v-if="core.currentPlayer" class="recruitment-items">
      <mc-recruitment-item
        v-bind="core.currentPlayer.city.securityService.toJSON()"
        :type="RECRUITMENT_TYPE.SECURITY_SERVICE"
        @recruit="onRecruit(RECRUITMENT_TYPE.SECURITY_SERVICE)"
        @training="onTraining(RECRUITMENT_TYPE.SECURITY_SERVICE)" />
      <mc-recruitment-item
        v-bind="core.currentPlayer.city.soldier.toJSON()"
        :type="RECRUITMENT_TYPE.SOLDIER"
        @recruit="onRecruit(RECRUITMENT_TYPE.SOLDIER)"
        @training="onTraining(RECRUITMENT_TYPE.SOLDIER)" />
      <mc-recruitment-item
        v-bind="core.currentPlayer.city.mercenary.toJSON()"
        :type="RECRUITMENT_TYPE.MERCENARY"
        @recruit="onRecruit(RECRUITMENT_TYPE.MERCENARY)"
        @training="onTraining(RECRUITMENT_TYPE.MERCENARY)" />
    </div>

    <div v-if="city" class="attack">
      <div>
        <div class="items">
          <base-button @click="onClickAttack(ATTACK_TYPE.ATTACK_CITY)">
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="t('view.attack.label.attack_city') + '    -'"
              merge />
            <mc-label
              color="gray"
              :model-value="isAttack(ATTACK_TYPE.ATTACK_CITY)"
              :content="
                fillTextStart(
                  String(city.attackControl.getCosts(ATTACK_TYPE.ATTACK_CITY)),
                  4,
                  '0'
                )
              "
              text-background
              selectable />
          </base-button>
          <base-button @click="onClickAttack(ATTACK_TYPE.FACTORY_SABOTAGE)">
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="t('view.attack.label.factory_sabotage') + '    -'"
              merge />
            <mc-label
              color="gray"
              :model-value="isAttack(ATTACK_TYPE.FACTORY_SABOTAGE)"
              :content="
                fillTextStart(
                  String(
                    city.attackControl.getCosts(ATTACK_TYPE.FACTORY_SABOTAGE)
                  ),
                  4,
                  '0'
                )
              "
              text-background
              selectable />
          </base-button>
          <base-button
            @click="onClickAttack(ATTACK_TYPE.POWER_STATION_SABOTAGE)">
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="t('view.attack.label.power_station_sabotage') + ' -'"
              merge />
            <mc-label
              color="gray"
              :model-value="isAttack(ATTACK_TYPE.POWER_STATION_SABOTAGE)"
              :content="
                fillTextStart(
                  String(
                    city.attackControl.getCosts(
                      ATTACK_TYPE.POWER_STATION_SABOTAGE
                    )
                  ),
                  4,
                  '0'
                )
              "
              text-background
              selectable />
          </base-button>
        </div>
        <mc-target-map
          v-model="selectedPlayer"
          :current-player="core.currentPlayer"
          :players="core.players" />
      </div>
      <div>
        <div class="items">
          <base-button
            @click="onClickAttack(ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER)">
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="
                t('view.attack.label.destroy_energy_transmitter') + ' -'
              "
              merge />
            <mc-label
              color="gray"
              :model-value="isAttack(ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER)"
              :content="
                fillTextStart(
                  String(
                    city.attackControl.getCosts(
                      ATTACK_TYPE.DESTROY_ENERGY_TRANSMITTER
                    )
                  ),
                  4,
                  '0'
                )
              "
              text-background
              selectable />
          </base-button>
          <base-button @click="onClickAttack(ATTACK_TYPE.DAMAGE_VEHICLE)">
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="t('view.attack.label.damage_vehicle') + '    -'"
              merge />
            <mc-label
              color="gray"
              :model-value="isAttack(ATTACK_TYPE.DAMAGE_VEHICLE)"
              :content="
                fillTextStart(
                  String(
                    city.attackControl.getCosts(ATTACK_TYPE.DAMAGE_VEHICLE)
                  ),
                  4,
                  '0'
                )
              "
              text-background
              selectable />
          </base-button>
          <div>
            <mc-label
              type="glossy"
              text-glossy
              color="red"
              :content="t('view.attack.label.costs_total') + '           :'"
              merge />
            <mc-label
              text-background
              color="gray"
              :content="fillTextStart(totalCosts, 5, '0')" />
          </div>
        </div>
      </div>
    </div>

    <teleport to="#layout_screen">
      <mc-screen>
        <mc-alert-bar ref="screenAlert" />
      </mc-screen>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import BaseButton from '../base/Button.vue';
import McLabel from '../Label.vue';
import McTargetMap from '../TargetMap.vue';
import McRecruitmentItem from '../attack/RecruitmentItem.vue';
import McScreen from '../Screen.vue';
import McAlertBar from '../AlertBar.vue';

import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n';
import useAudioControl from '../../composables/useAudioControl';

import { ERROR_MESSAGE } from '../../classes/City';
import { ATTACK_TYPE, RECRUITMENT_TYPE } from '../../types';
import { fillTextStart } from '../../utils/string';
import { SFX } from '../../utils/sounds';

const screenAlert = ref<typeof McAlertBar>();

const { core } = useCore();
const { playSfx } = useAudioControl();
const { t } = useI18n();

/**
 * @type {import('vue').Ref<import('../../classes/Player').default>}
 */
const selectedPlayer = ref();
const city = computed(() => core?.currentPlayer?.city);

const totalCosts = computed(() => {
  return (
    (core &&
      selectedPlayer.value?.city.attackControl.getTotalCosts(
        core.currentPlayer
      )) ||
    0
  );
});

const onRecruit = (type: RECRUITMENT_TYPE) => {
  if (!core.currentPlayer) {
    throw new Error('no player selected');
  }
  const city = core.currentPlayer.city;
  try {
    let result = false;
    switch (type) {
      case RECRUITMENT_TYPE.SECURITY_SERVICE:
        result = city.setRecruitSecurityService();
        break;
      case RECRUITMENT_TYPE.SOLDIER:
        result = city.setRecruitSoldier();
        break;
      case RECRUITMENT_TYPE.MERCENARY:
        result = city.setRecruitMercenary();
        break;
    }
    if (result) {
      playSfx(SFX.BUY_SELL);
    }
  } catch (error) {
    if (!(error instanceof Error)) {
      console.error(error);
      return;
    }
    switch (error.message) {
      case ERROR_MESSAGE.NOT_ENOUGH_CREDITS:
        screenAlert.value?.show(t('view.attack.alert.not_enough_credits'));
        break;
      case ERROR_MESSAGE.NOT_ENOUGH_BARRACKS:
        screenAlert.value?.show(t('view.attack.alert.not_enough_barracks'));
        break;

      default:
        console.error(error);
        break;
    }
  }
};

const onTraining = (type: RECRUITMENT_TYPE) => {
  if (!core.currentPlayer) {
    throw new Error('no player selected');
  }
  const city = core.currentPlayer.city;
  try {
    switch (type) {
      case RECRUITMENT_TYPE.SECURITY_SERVICE:
        city.setTrainingSecurityService();
        break;

      case RECRUITMENT_TYPE.SOLDIER:
        city.setTrainingSoldier();
        break;

      case RECRUITMENT_TYPE.MERCENARY:
        city.setTrainingMercenary();
        break;
    }
    playSfx(SFX.BUY_SELL);
  } catch (error) {
    if (!(error instanceof Error)) {
      console.error(error);
      return;
    }
    switch (error.message) {
      case ERROR_MESSAGE.NOT_ENOUGH_CREDITS:
        screenAlert.value?.show(t('view.attack.alert.not_enough_credits'));
        break;
      case ERROR_MESSAGE.NOT_ENOUGH_EMPLOYEES:
        screenAlert.value?.show(t('view.attack.alert.not_enough_employees'));
        break;

      default:
        console.error(error);
        break;
    }
  }
};

const onClickAttack = async (type: ATTACK_TYPE) => {
  try {
    if (isAttack(type)) {
      throw new Error('is_attack');
    } else if (!selectedPlayer.value) {
      throw new Error('no_player_selected');
    } else {
      await core.currentPlayer?.city.employeeAttack(type, selectedPlayer.value);
      playSfx(SFX.BUY_SELL);
    }
  } catch (error) {
    if (!(error instanceof Error)) {
      console.error(error);
      return;
    }
    switch (error.message) {
      case 'no_player_selected':
        screenAlert.value?.show(t('view.attack.alert.no_player_selected'));
        break;

      case 'is_attack':
        screenAlert.value?.show(t('view.attack.alert.is_attack'));
        break;

      case 'not_implemented':
        screenAlert.value?.show(t('not_implemented'));
        break;

      default:
        console.error(error);
        break;
    }
  }
};

const isAttack = (type: ATTACK_TYPE) => {
  return core.currentPlayer?.city.attackControl.isAttack(
    type,
    selectedPlayer.value
  );
};
</script>

<style lang="postcss" scoped>
.mc-frame-attack-primary {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/attack-content-1.png');
  background-size: contain;

  /* & .mc-target-map {
    position: absolute;
    top: 28px;
    left: 109px;
    box-shadow: 2px 2px 0 black;
  } */

  & .city-info {
    position: absolute;
    top: 188px;
    left: 38px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 202px;

    & > div {
      display: flex;
      justify-content: space-between;
    }
  }

  & .mercenaries-buy {
    position: absolute;
    top: 130px;
    left: 58px;
    display: flex;
    gap: 6px;
    justify-content: center;
    width: 164px;
  }

  & .title {
    position: absolute;
    top: 4px;
    left: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 156px;
    height: 18px;
  }

  & .recruitment {
    position: absolute;
    top: 6px;
    left: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 280px;

    & > div {
      display: flex;
      justify-content: space-between;
    }
  }

  & .recruitment-items {
    position: absolute;
    top: 6px;
    left: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 2px;
  }

  /* & .attack-items {
    position: absolute;
    top: 244px;
    left: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 280px;
    height: 126px;
    padding: 2px;
  } */

  & .attack {
    position: absolute;
    top: 244px;
    left: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 280px;
    height: 126px;
    padding: 2px;

    & > div {
      display: flex;
      flex: 1;
      gap: 4px;

      &:first-child {
        & .items {
          gap: 4px;
        }
      }
    }

    & .items {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 2px;
      width: 100%;

      & > * {
        display: flex;
        flex: 1;
      }
    }
  }
}
</style>
