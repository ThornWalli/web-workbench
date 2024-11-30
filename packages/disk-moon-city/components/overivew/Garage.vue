<template>
  <div class="mc-overview-garage" :class="{ disabled }">
    <div class="items">
      <mc-garage-item
        v-for="(item, index) in items"
        :key="index"
        :empty="item.empty"
        :disabled="disabled"
        :name="
          t(`vehicle.${item.key}.name`, { default: t('garage.item.empty') })
        "
        :armor="item.armor"
        :max-armor="item.maxArmor"
        :selected="selectedItem === item"
        :repairing="item.repairing"
        @select="onSelect(item)"
        @repair="onRepair(item)" />
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

<script setup>
import { ref, watch } from 'vue';
import McGarageItem from './garage/Item.vue';
import McGarageScreen from './garage/Screen.vue';
import McButton from '../Button.vue';
import McAlertBar from '../AlertBar.vue';
import useAudioControl from '../../composables/useAudioControl';
import useCore from '../../composables/useCore';
import useI18n from '../../composables/useI18n';
import { ERROR_MESSAGE } from '../../classes/City';

const { core } = useCore();
const { playSfx } = useAudioControl();

const screenAlert = ref(null);

const items = computed(() => [
  ...core.currentPlayer.city.vehicles,
  ...Array(4 - core.currentPlayer.city.vehicles.length)
    .fill()
    .map(() => {
      return { empty: true, name: t('garage.item.empty') };
    })
]);

const selectedItem = ref(null);

const $emit = defineEmits(['change:selected-item']);

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

const onSelect = item => {
  if (selectedItem.value === item) {
    selectedItem.value = null;
  } else {
    selectedItem.value = item;
  }
  playSfx('button_2_click');
};

const onRepair = item => {
  item.repair = true;
};

const { t } = useI18n();

const onClickRepair = () => {
  playSfx('button_2_click');

  try {
    if (selectedItem.value) {
      core.currentPlayer.city.repairVehicle(selectedItem.value);
      playSfx('buy_sell');
    }
  } catch (error) {
    switch (error.message) {
      case ERROR_MESSAGE.VEHICLE_IS_NOT_DAMAGED:
        screenAlert.value.show(t('garage.alert.vehicle_okay'));
        break;
      case ERROR_MESSAGE.NO_VEHICLE_FACTORY:
        screenAlert.value.show(t('garage.alert.no_vehicle_factory'));
        break;
    }
  }
};

const onClickSell = () => {
  playSfx('button_2_click');
  playSfx('buy_sell');

  if (selectedItem.value) {
    core.currentPlayer.city.sellVehicle(selectedItem.value);
    selectedItem.value = null;
  }
};

defineExpose({
  reset: () => {
    selectedItem.value = null;
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
