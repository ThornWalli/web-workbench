<template>
  <div class="mc-overview-garage" :class="{ disabled }">
    <div class="items">
      <mc-garage-item
        v-for="(item, index) in vehicleItems"
        :key="index"
        :disabled="disabled"
        :name="t(`vehicle.${item.key}.name`)"
        :armor="item.armor"
        :max-armor="item.maxArmor"
        :selected="selectedItem === item"
        :repairing="item.repairing"
        @select="onSelect(item)" />
      <mc-garage-item
        v-for="(item, index) in emptyItems"
        :key="index"
        :name="item.name"
        :empty="item.empty"
        :disabled="disabled" />
    </div>
    <div class="buttons">
      <mc-button
        :disabled="disabled || !selectedItem || selectedItem.repairing"
        :label="t('garage.button.repair')"
        @click="onClickRepair" />
      <mc-button
        :disabled="disabled || !selectedItem"
        :label="t('garage.button.sell')"
        @click="onClickSell" />
    </div>
    <teleport to="#layout_screen">
      <mc-garage-screen v-if="selectedItem" :vehicle="selectedItem">
        <mc-alert-bar ref="screenAlert" />
      </mc-garage-screen>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import McGarageItem from './garage/Item.vue';
import McGarageScreen from './garage/Screen.vue';
import McButton from '../Button.vue';
import McAlertBar from '../AlertBar.vue';
import useAudioControl from '../../composables/useAudioControl';
import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n';
import { ERROR_MESSAGE } from '../../classes/City';
import { SFX } from '../../utils/sounds';
import type Vehicle from '../../classes/Vehicle';

const { core } = useCore();
const { playSfx } = useAudioControl();

const screenAlert = ref<typeof McAlertBar>();

const vehicleItems = computed(() => [
  ...(core.currentPlayer?.city.vehicles || [])
]);

const emptyItems = computed(() => {
  return Array(4 - (core.currentPlayer?.city.vehicles.length || 0))
    .fill(undefined)
    .map(() => {
      return { empty: true, name: t('garage.item.empty') };
    });
});

const selectedItem = ref<Vehicle>();

const $emit = defineEmits<{
  (e: 'change:selected-item', value: Vehicle | undefined): void;
}>();

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

watch(
  () => selectedItem.value,
  value => {
    $emit('change:selected-item', value);
  }
);

const onSelect = (item: Vehicle) => {
  if (selectedItem.value === item) {
    selectedItem.value = undefined;
  } else {
    selectedItem.value = item;
  }
  playSfx(SFX.BUTTON_2_CLICK);
};

const { t } = useI18n();

const onClickRepair = () => {
  playSfx(SFX.BUTTON_2_CLICK);

  try {
    if (selectedItem.value) {
      core.currentPlayer?.city.repairVehicle(selectedItem.value);
      playSfx(SFX.BUY_SELL);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      switch (error.message) {
        case ERROR_MESSAGE.VEHICLE_IS_NOT_DAMAGED:
          screenAlert.value?.show(t('garage.alert.vehicle_okay'));
          break;
        case ERROR_MESSAGE.NO_VEHICLE_FACTORY:
          screenAlert.value?.show(t('garage.alert.no_vehicle_factory'));
          break;
      }
    }
  }
};

const onClickSell = () => {
  playSfx(SFX.BUTTON_2_CLICK);
  playSfx(SFX.BUY_SELL);

  if (selectedItem.value && core.currentPlayer) {
    core.currentPlayer.city.sellVehicle(selectedItem.value);
    selectedItem.value = undefined;
  }
};

defineExpose({
  reset: () => {
    selectedItem.value = undefined;
  }
});
</script>

<style lang="postcss" scoped>
.mc-overview-garage {
  display: flex;
  justify-content: space-between;
  width: 100%;

  & .items {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  & .buttons {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    align-items: flex-end;
    justify-content: center;
  }
}
</style>
