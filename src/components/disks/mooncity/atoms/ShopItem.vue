<template>
  <label class="wb-disks-mooncity-atom-shop-item" :style="style" :class="styleClasses">
    <input v-model="model[name]" type="radio" :name="name" :value="value">
    <span />
  </label>
</template>

<script>

// const VEHICLES = {

//   GRABBER: 'grabber',
//   SHRIMP: 'shrimp',
//   BIRDY: 'birdy',
//   SPIDER: 'spider',
//   HAWK: 'hawk',
//   PHANTOM: 'phantom',
//   THUNDER: 'thunder',
//   BIG_PLUNDER: 'big_plunder'

//   // &.vehicle-grabber button {
//   //   background-position: -192px 0;
//   // }

//   // &.vehicle-shrimp button {
//   //   background-position: -256px 0;
//   // }

//   // &.vehicle-birdy button {
//   //   background-position: -320px 0;
//   // }

//   // &.vehicle-spider button {
//   //   background-position: -384px 0;
//   // }

//   // &.vehicle-hawk button {
//   //   background-position: -448px 0;
//   // }

//   // &.vehicle-phantom button {
//   //   background-position: -512px 0;
//   // }

//   // &.vehicle-thunder button {
//   //   background-position: -576px 0;
//   // }

//   // &.vehicle-bigPlunder button {
//   //   background-position: -640px 0;
//   // }
// };

export default {
  props: {
    model: {
      type: Object,
      default () {
        return {
          name: null
        };
      }
    },
    index: {
      type: Number,
      default: 0
    },
    value: {
      type: [
        String, Object
      ],
      default: null
    },
    type: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: 'name'
    }
  },
  computed: {
    style () {
      return { '--index': this.index };
    },
    styleClasses () {
      return {
        [`shop-item--${this.type}`]: this.type
      };
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atom-shop-item {
  display: block;
  padding: 0;
  border: none;
  outline: none;
  -webkit-appearance: none;

  --index: 0;
  --selected: 0;

  &.shop-item--vehicle {
    &,
    & *,
    & > span::before {
      background-image: url('~assets/disks/mooncity/img/vehicle.png');
    }
  }

  &.shop-item--building {
    &,
    & *,
    & > span::before {
      background-image: url('~assets/disks/mooncity/img/building.png');
    }
  }

  &.shop-item--weapon {
    &,
    & *,
    & > span::before {
      background-image: url('~assets/disks/mooncity/img/weapon.png');
    }

  }

  &:hover {
    --selected: 1;
  }

  &,
  & > span,
  & > span::before {
    background-repeat: no-repeat;
    background-position: 0 0;
  }

  & > span {
    display: block;
    width: 64px;
    height: 64px;
    background-position: calc((3 + var(--index)) * -64px) 0;

    &::before {
      display: block;
      width: 100%;
      height: 100%;
      content: "";
      background-position: calc(-64px * (1 + var(--selected))) 0;
    }

  }
}
</style>
