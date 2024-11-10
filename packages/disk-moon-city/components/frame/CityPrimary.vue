<template>
  <div class="mc-frame-city-primary">
    <mc-city-screen />
    <div class="info">
      <div>
        <mc-label
          shadow
          text-glossy
          color="green"
          :content="t('view.city.primary.label.population')" />
        <mc-label
          shadow
          text-glossy
          color="white"
          :content="
            String(
              core.currentPlayer.city.getStorageValue(STORAGE_TYPE.HUMANS)
            ).padStart(6, '0')
          " />
      </div>
      <div>
        <mc-label
          shadow
          text-glossy
          color="green"
          :content="t('view.city.primary.label.security_service')" />
        <mc-label
          shadow
          text-glossy
          color="white"
          :content="
            String(
              core.currentPlayer.city.getStorageValue(
                STORAGE_TYPE.SECURITY_SERVICE
              )
            ).padStart(6, '0')
          " />
      </div>
      <div>
        <mc-label
          :model-value="core.currentPlayer.city.recruitResidents"
          shadow
          text-glossy
          color="blue"
          selectable
          :content="t('view.city.primary.label.recruit_residents')"
          @update:model-value="onUpdateRecruitResidents" />
        <mc-label
          shadow
          text-glossy
          color="white"
          :content="`-${String(core.currentPlayer.city.recruitResidentsCost).padStart(5, '0')}`" />
      </div>
    </div>
    <div class="info-2">
      <div>
        <div class="input">
          <mc-label
            type="embed"
            shadow
            text-glossy
            color="yellow"
            :content="t('view.city.primary.label.distribution_food')" />
          <mc-input-stepper
            :model-value="core.currentPlayer.city.distributionFood"
            shadow
            :step="1"
            :max="City.MAX_DISTRIBUTION_FOOD"
            @update:model-value="onUpdateDistributionFood" />
          <mc-input-stepper
            :model-value="core.currentPlayer.city.distributionFood"
            shadow
            :step="-1"
            :min="City.MIN_DISTRIBUTION_FOOD"
            subtract
            @update:model-value="onUpdateDistributionFood" />
        </div>
        <mc-label
          shadow
          text-glossy
          color="white"
          :content="
            '-' +
            String(core.currentPlayer.city.distributionFood).padStart(5, '0')
          " />
      </div>
      <div>
        <div class="input">
          <mc-label
            type="embed"
            shadow
            text-glossy
            color="yellow"
            :content="t('view.city.primary.label.distribution_energy')" />
          <mc-input-stepper
            :model-value="core.currentPlayer.city.distributionEnergy"
            shadow
            :step="1"
            :max="City.MAX_DISTRIBUTION_ENERGY"
            @update:model-value="onUpdateDistributionEnergy" />
          <mc-input-stepper
            :model-value="core.currentPlayer.city.distributionEnergy"
            shadow
            :step="-1"
            :min="City.MIN_DISTRIBUTION_ENERGY"
            subtract
            @update:model-value="onUpdateDistributionEnergy" />
        </div>
        <mc-label
          shadow
          text-glossy
          color="white"
          :content="
            '-' +
            String(core.currentPlayer.city.distributionEnergy).padStart(5, '0')
          " />
      </div>
      <div>
        <div class="input">
          <mc-label
            type="embed"
            shadow
            text-glossy
            color="yellow"
            :content="t('view.city.primary.label.taxes')" />
          <mc-input-stepper
            :model-value="core.currentPlayer.city.taxes"
            shadow
            :step="1"
            :max="City.MAX_TAXES_CREDITS"
            @update:model-value="onUpdateTaxes" />
          <mc-input-stepper
            :model-value="core.currentPlayer.city.taxes"
            shadow
            :step="-1"
            :min="City.MIN_TAXES_CREDITS"
            subtract
            @update:model-value="onUpdateTaxes" />
        </div>
        <mc-label
          shadow
          text-glossy
          color="white"
          :content="
            '-%' + String(core.currentPlayer.city.taxes).padStart(4, '0')
          " />
      </div>
    </div>
  </div>
</template>

<script setup>
import McCityScreen from '../CityScreen.vue';
import McLabel from '../Label.vue';
import McInputStepper from '../input/Stepper.vue';

import useCore from '../../composables/useCore';
import City from '../../classes/City';
import useI18n from '../../composables/useI18n';
import useAudioControl from '../../composables/useAudioControl';
import { STORAGE_TYPE } from '../../utils/keys';

const { core } = useCore();
const { playSfx } = useAudioControl();
const { t } = useI18n();

const onUpdateDistributionFood = value => {
  core.currentPlayer.city.setDistributionFood(value);
};
const onUpdateDistributionEnergy = value => {
  core.currentPlayer.city.setDistributionEnergy(value);
};

const onUpdateTaxes = value => {
  core.currentPlayer.city.setTaxes(value);
};

const onUpdateRecruitResidents = () => {
  if (!core.currentPlayer.city.recruitResidents) {
    playSfx('buy_sell');
    core.currentPlayer.city.setRecruitResidents();
  }
};
</script>

<style lang="postcss" scoped>
.mc-frame-city-primary {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/city-content-1.png');
  background-size: contain;

  & .mc-map {
    position: absolute;
    top: 25px;
    left: 16px;
  }

  & .input {
    display: flex;
    gap: 6px;
  }

  & .info {
    position: absolute;
    top: 202px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    /* justify-content: center; */
    width: 248px;
    height: 72px;
    padding: 0;
    padding-top: 4px;
    padding-right: 4px;

    & > div {
      display: flex;
      justify-content: space-between;

      & > .mc-label:first-child {
        width: 165px;
      }
    }
  }

  & .info-2 {
    position: absolute;
    top: 284px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 248px;
    height: 76px;
    padding: 0;
    padding-top: 4px;
    padding-right: 4px;

    & > div {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
