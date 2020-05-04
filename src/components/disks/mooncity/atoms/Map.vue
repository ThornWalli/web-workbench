<template>
  <div class="wb-disks-mooncity-atom-map">
    <div v-for="(city, index) in cities" :key="index" class="map__city" :data-index="index" :disabled="city.disabled">
      <div class="city-image">
        <div class="bar" />
      </div>
    </div>
    <div class="map__weapon" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      laserWeapon: false,
      cities: [
        {
          disabled: true
        },
        {
        },
        {
        },
        {
        }
      ]
    };
  },
  computed: {
    styleClasses () {
      return {
        'map--weapon-laser': this.laserWeapon
      };
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atom-map {
  width: 260px;
  height: 232px;
  background: url('~assets/disks/mooncity/img/main_map_attack.png');

  --weapon: 0;

  &.map--weapon-laser {
    --weapon: 1;

    & .map__city {
      position: absolute;
      display: block;
      width: 70px;
      height: 70px;
      background: url('~assets/disks/mooncity/img/main_map_city.png');
      background-position: 0 0;

      &.selected {
        &::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: "";
          border: solid 2px transparent;
          animation-name: select-animation;
          animation-duration: 2s;
          animation-timing-function: ease;
          animation-iteration-count: infinite;

          @keyframes select-animation {
            0% {
              border-color: rgba(255, 255, 255, 0);
            }

            50% {
              border-color: rgba(255, 255, 255, 0.5);
            }

            100% {
              border-color: rgba(255, 255, 255, 0);
            }

          }

        }
      }

      &[data-index="0"] {
        top: 8px;
        left: 8px;
        background-position: 0 0;
      }

      &[data-index="1"] {
        top: 8px;
        right: 8px;
        background-position: -70px 0;
      }

      &[data-index="2"] {
        bottom: 8px;
        left: 8px;
        background-position: -140px 0;
      }

      &[data-index="3"] {
        right: 8px;
        bottom: 8px;
        background-position: -210px 0;
      }

      &[disabled] {
        &::after {
          display: block;
          width: 100%;
          height: 100%;
          content: '';
          background: url('~assets/disks/mooncity/img/main_map_city.png');
          background-position: 0 -70px;
        }

        &[data-index="0"]::after {
          background-position: 0 -70px;
        }

        &[data-index="1"]::after {
          background-position: -70px -70px;
        }

        &[data-index="2"]::after {
          background-position: -140px -70px;
        }

        &[data-index="3"]::after {
          background-position: -210px -70px;
        }

      }

    }

    & .map__weapon {
      position: absolute;
      top: 0;
      left: 0;
      width: 70px;
      height: 70px;
      pointer-events: none;
      visibility: hidden;
      background: url('~assets/disks/mooncity/img/main_map_city_attack.png');
      background-repeat: no-repeat;
      background-position-y: calc(var(--weapon * -70px));

      &[data-state='0'] {
        background-position-x: 0;
      }

      &[data-state='1'] {
        background-position-x: -70px;
      }

      &[data-state='2'] {
        background-position-x: -140px;
      }

      &[data-state='3'] {
        background-position-x: -210px;
      }

      &[data-state='4'] {
        background-position-x: -280px;
      }

      &[data-state='5'] {
        background-position-x: 70px;

      }
    }
  }
}
</style>
