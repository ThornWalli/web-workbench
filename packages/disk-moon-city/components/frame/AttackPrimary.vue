<template>
  <div class="mc-frame-stats-primary">
    <!-- <mc-target-map
      v-model="selectedPlayer"
      :current-player="core.currentPlayer"
      :players="core.players" /> -->

    <!-- <div class="title">
      <mc-text :content="t('view.stats.title')"  color="dark-yellow" />
    </div>

    <base-button class="mercenaries-buy" @click="onClickMercenariesBuy">
      <mc-label
        type="inset"
        color="dark-yellow"

        class="label"
        content="Spion kaufen" />
      <mc-label type="inset" color="gray" class="price" content="0000" />
    </base-button> -->
    <div class="recruitment-items">
      <mc-recruitment-item :type="RECRUITMENT_TYPE.SECURITY_SERVICE" />
      <mc-recruitment-item :type="RECRUITMENT_TYPE.SOLDIER" />
      <mc-recruitment-item :type="RECRUITMENT_TYPE.MERCENARY" />
    </div>

    <div class="attack">
      <div>
        <div class="items">
          <base-button>
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="t('view.attack.label.attack_city') + '    -'"
              merge />
            <mc-label color="gray" content="0000" text-background selectable />
          </base-button>
          <base-button>
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="t('view.attack.label.factory_sabotage') + '    -'"
              merge />
            <mc-label color="gray" content="0000" text-background selectable />
          </base-button>
          <base-button>
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="t('view.attack.label.power_station_sabotage') + ' -'"
              merge />
            <mc-label color="gray" content="0000" text-background selectable />
          </base-button>
        </div>
        <mc-target-map
          v-model="selectedPlayer"
          :current-player="core.currentPlayer"
          :players="core.players" />
      </div>
      <div>
        <div class="items">
          <base-button>
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="
                t('view.attack.label.destroy_energy_transmitter') + ' -'
              "
              merge />
            <mc-label color="gray" content="0000" text-background selectable />
          </base-button>
          <base-button>
            <mc-label
              type="glossy"
              text-glossy
              color="yellow"
              :content="t('view.attack.label.vehicle_damage') + '    -'"
              merge />
            <mc-label color="gray" content="0000" text-background selectable />
          </base-button>
          <base-button>
            <mc-label
              type="glossy"
              text-glossy
              color="red"
              :content="t('view.attack.label.costs_total') + '            :'"
              merge />
            <mc-label color="gray" content="0000" text-background />
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../base/Button.vue';

import McLabel from '../Label.vue';
import McTargetMap from '../TargetMap.vue';

import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n';
// import useAudioControl from '../../composables/useAudioControl';
import { ref } from 'vue';

import McRecruitmentItem from '../attack/RecruitmentItem.vue';
import { RECRUITMENT_TYPE } from '../../utils/keys';

const { core } = useCore();
// const { playSfx } = useAudioControl();
const { t } = useI18n();

const selectedPlayer = ref(core.currentPlayer);

// const onClickMercenariesBuy = () => {
//   playSfx('buy_sell');
// };
</script>

<style lang="postcss" scoped>
.mc-frame-stats-primary {
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
