<template>
  <div class="mc-frame-stats-primary">
    <mc-target-map
      v-model="selectedPlayer"
      current-player-select
      :current-player="core.currentPlayer"
      :players="core.players" />

    <div class="title">
      <mc-text :content="t('view.stats.title')" glossy color="dark-yellow" />
    </div>

    <base-button
      class="mercenaries-buy"
      :disabled="
        core.currentPlayer.city.attackControl.isAttack(selectedPlayer.value)
      "
      @click="onClickSpy">
      <mc-label
        type="inset"
        color="dark-yellow"
        text-glossy
        class="label"
        content="Spion kaufen" />
      <mc-label
        type="inset"
        color="gray"
        class="price"
        :content="fillTextStart('', 5, '0')" />
    </base-button>

    <div class="city-info">
      <div>
        <mc-label
          text-glossy
          color="dark-yellow"
          :content="t('view.stats.label.population')"
          merge />
        <mc-label
          color="gray"
          :content="
            fillTextStart(
              core.currentPlayer.city.getStorageValue(STORAGE_TYPE.HUMAN),
              5,
              '0'
            )
          "
          text-background />
      </div>
      <div>
        <mc-label
          text-glossy
          color="dark-yellow"
          :content="t('view.stats.label.security_service')"
          merge />
        <mc-label
          color="gray"
          :content="
            fillTextStart(core.currentPlayer.city.securityService.value, 5, '0')
          "
          text-background />
      </div>
      <div>
        <mc-label
          text-glossy
          color="dark-yellow"
          :content="t('view.stats.label.mercenaries')"
          merge />
        <mc-label
          color="gray"
          :content="
            fillTextStart(core.currentPlayer.city.mercenary.value, 5, '0')
          "
          text-background />
      </div>
      <div>
        <mc-label
          text-glossy
          color="dark-yellow"
          :content="t('view.stats.label.mineral_ore')"
          merge />
        <mc-label
          color="gray"
          :content="
            fillTextStart(
              core.currentPlayer.city.getStorageValue(STORAGE_TYPE.MINERAL_ORE),
              5,
              '0'
            )
          "
          text-background />
      </div>
      <div>
        <mc-label
          text-glossy
          color="dark-yellow"
          :content="t('view.stats.label.energy_transfer')"
          merge />
        <mc-label
          color="gray"
          :content="
            fillTextStart(
              core.currentPlayer.city.getProductionValue(
                STORAGE_TYPE.ENERGY_TRANSFER
              ),
              5,
              '0'
            )
          "
          text-background />
      </div>
      <div>
        <mc-label
          text-glossy
          color="dark-yellow"
          :content="t('view.stats.label.vehicle_count')"
          merge />
        <mc-label
          color="gray"
          :content="
            fillTextStart(core.currentPlayer.city.vehicles.length, 5, '0')
          "
          text-background />
      </div>
      <div>
        <mc-label
          text-glossy
          :content="t('view.stats.label.total_capital')"
          color="yellow"
          merge />
        <mc-label
          color="gray"
          :content="fillTextStart(core.currentPlayer.city.credits, 7, '0')"
          text-background />
      </div>
      <div>
        <mc-label
          :content="
            t(
              `view.stats.label.city_size.${core.currentPlayer.city.getSizeIndex()}`
            )
          "
          merge
          background="black" />
        <mc-label
          :content="getMoodSmmilie(core.currentPlayer.city.resident.mood)"
          background="black" />
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../base/Button.vue';

import McText from '../Text.vue';
import McLabel from '../Label.vue';
import McTargetMap from '../TargetMap.vue';

import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n';
import useAudioControl from '../../composables/useAudioControl';
import { ref } from 'vue';
import { ATTACK_TYPE, STORAGE_TYPE } from '../../utils/keys';
import { fillTextStart } from '../../utils/string';

const { core } = useCore();
const { playSfx } = useAudioControl();
const { t } = useI18n();

const selectedPlayer = ref(core.currentPlayer);

const onClickSpy = () => {
  if (selectedPlayer.value && selectedPlayer.value !== core.currentPlayer) {
    core.currentPlayer.city.attackControl.setAttack(
      ATTACK_TYPE.SPY,
      selectedPlayer.value
    );
    playSfx('buy_sell');
  } else {
    playSfx('error');
  }
};

const getMoodSmmilie = value => {
  if (value < -0.5) {
    return `>:-(`;
  } else if (value < -0.2) {
    return `:-(`;
  } else if (value < 0.2) {
    return `:-|`;
  } else if (value < 0.6) {
    return `:-)`;
  } else {
    return `:-D`;
  }
};
</script>

<style lang="postcss" scoped>
.mc-frame-stats-primary {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/stats-content-1.png');
  background-size: contain;

  & .mc-target-map {
    position: absolute;
    top: 28px;
    left: 109px;
    box-shadow: 2px 2px 0 black;
  }

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
}
</style>
