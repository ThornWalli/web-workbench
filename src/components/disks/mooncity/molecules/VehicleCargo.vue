<template>
  <div
    class="wb-disks-mooncity-molecule-vehicle-cargo"
  >
    {{ selectedVehicle }}
    <div>
      <ul>
        <li v-for="(vehicle, index) in preparedVehicles" :key="index">
          <mc-atom-label-set class="vehicle-cargo__vehicle__label" is-flat v-bind="vehicle" :model="this" name="selectedVehicle" />
          <i />
          <mc-atom-label-scale :disabled="vehicle.disabled" class="vehicle-cargo__vehicle__status" />
          <i />
          <mc-atom-label-set
            :disabled="vehicle.disabled"
            class="vehicle-cargo__vehicle__selected"
            is-flat
            is-static
            :label="null"
            :model="this"
            name="selectedVehicle"
          />
        </li>
      </ul>
    </div>
    <div class="vehicle-cargo__buttons">
      <mc-atom-button style-type="vehicle-cargo" v-bind="buttonRepair" />
      <mc-atom-button style-type="vehicle-cargo" v-bind="buttonSell" />
    </div>
  </div>
</template>

<script>
import McAtomButton from '../atoms/Button';
import McAtomLabelSet from '../atoms/LabelSet';
import McAtomLabelScale from '../atoms/LabelScale';
export default {
  components: {
    McAtomButton, McAtomLabelSet, McAtomLabelScale
  },

  data () {
    return {
      selectedVehicle: null,
      vehicles: [
        { name: 'Grabber' }
      ],
      repairLabel: 'Reparieren',
      sellLabel: 'Verkaufen'
    };
  },

  computed: {
    preparedVehicles () {
      return this.vehicles.map((vehicle) => {
        return {
          label: vehicle.name,
          labelColor: 'gold',
          checkboxColor: 'green'
        };
      }).concat(Array(4 - this.vehicles.length).fill({
        label: 'Kein Sucher !',
        labelColor: 'darkGold',
        disabled: true
      }));
    },
    buttonRepair () {
      return {
        label: this.repairLabel
      };
    },
    buttonSell () {
      return {
        label: this.sellLabel,
        disabled: true
      };
    }
  }

};
</script>

<style lang="postcss">
.wb-disks-mooncity-molecule-vehicle-cargo {
  display: flex;

  & > div {
    flex: 0 0 50%;
  }

  & ul li {
    display: flex;
    width: 100%;
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  & .vehicle-cargo__vehicle__label {
    width: 136px;

  }

  & .vehicle-cargo__vehicle__status {
    width: 56px;

  }

  /* & .vehicle-cargo__vehicle__selected {

  } */

  & .vehicle-cargo__buttons {
    margin-left: 10px;

    & > * {
      margin-bottom: 16px;
    }
  }

  & li {
    & > i {
      position: relative;
      top: 5px;
      display: block;
      width: 6px;
      height: 8px;
      background: url('~assets/disks/mooncity/img/horizontal_line_background.png');
    }
  }

}
</style>
