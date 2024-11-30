<template>
  <div class="mc-map">
    <mc-map-city
      v-for="(player, index) in players"
      :key="index"
      :style="positions[index].toCSSVars('position')"
      :index="index"
      :selected="player === core.currentPlayer"
      :destroyed="player.killed" />
    <slot></slot>
    <div
      v-if="currentWeapon"
      class="weapon"
      :data-type="currentWeapon.key"
      :class="{
        attack: !!targetPosition
      }"
      :style="{
        ...positions[0].toCSSVars('position'),
        ...targetPosition?.toCSSVars('target-position')
      }"
      @animationend="onAnimationend">
      <div></div>
    </div>
  </div>
</template>

<script setup>
import McMapCity from './map/City.vue';
import useCore from '../composables/useCore.js';
import { computed } from 'vue';
import { ipoint } from '@js-basics/vector';
import useAudioControl from '../composables/useAudioControl.js';
import { WEAPON_KEY } from '../utils/keys.js';

const { playSfx } = useAudioControl();

const { core } = useCore();

const players = computed(() => [
  ...core.players,
  ...Array(4 - core.players.length)
    .fill()
    .map(() => ({ killed: true }))
]);

/**
 * @type {import('vue').Ref<import('../classes/Weapon.js').default>}
 */
const currentWeapon = ref(null);
const targetPosition = ref(null);

let _resolve;
const weaponShoot = ({ player, weapon }) => {
  const { promise, resolve } = Promise.withResolvers();
  console.log('Weaponw shoot', { player, weapon }, positions[player.index]);

  if (WEAPON_KEY.SATELLITE_LASER === weapon.key) {
    playSfx('sat_laser');
  } else {
    playSfx('rocket');
  }

  currentWeapon.value = weapon;
  _resolve = resolve;
  window.setTimeout(() => {
    targetPosition.value = positions[player.index];
  }, 200);
  return promise;
};

defineExpose({ weaponShoot });

const positions = [
  ipoint(10, 10),
  ipoint(180, 10),
  ipoint(10, 152),
  ipoint(180, 152)
];

const onAnimationend = () => {
  targetPosition.value = null;
  console.log('Animation end');
  _resolve();
};
</script>

<style lang="postcss" scoped>
.mc-map {
  position: relative;
  display: flex;
  width: 260px;
  height: 232px;
  background: url('../assets/graphics/background/map.png');
  background-size: contain;

  & .mc-map-city {
    position: absolute;
    top: calc(var(--position-y) * 1px);
    left: calc(var(--position-x) * 1px);
  }

  & :deep(.mc-alert-bar) {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }

  & .weapon {
    &[data-type='rocket'],
    &[data-type='search_rocket'] {
      position: absolute;
      top: calc(var(--position-y) * 1px);
      left: calc(var(--position-x) * 1px);
      width: 70px;
      height: 70px;
      pointer-events: none;
      transition:
        top 0.6s cubic-bezier(0.32, 0, 0.67, 0),
        left 0.6s cubic-bezier(0.32, 0, 0.67, 0);

      &.attack {
        top: calc(var(--target-position-y) * 1px);
        left: calc(var(--target-position-x) * 1px);

        & > div {
          background: url('../assets/graphics/attack/rocket.png');
          background-size: 500% 100%;
          animation: weapon-rocket 0.6s;
          animation-timing-function: steps(5);
          animation-delay: 0.6s;
          animation-iteration-count: 1;
        }
      }

      & > div {
        position: relative;
        top: 15px;
        left: 15px;
        display: block;
        width: 40px;
        height: 40px;
      }
    }

    &[data-type='satellite_laser'] {
      position: absolute;
      top: calc(var(--position-y) * 1px);
      left: calc(var(--position-x) * 1px);
      width: 70px;
      height: 70px;
      pointer-events: none;
      opacity: 0;

      &.attack {
        top: calc(var(--target-position-y) * 1px);
        left: calc(var(--target-position-x) * 1px);
        display: block;
        opacity: 1;

        & > div {
          background: url('../assets/graphics/attack/laser.png');
          background-size: 500% 100%;
          animation: weapon-rocket 1.3s;
          animation-timing-function: steps(5);

          /* animation-delay: 1s; */
          animation-iteration-count: 1;
        }
      }

      & > div {
        position: relative;
        top: 15px;
        left: 15px;
        display: block;
        width: 40px;
        height: 40px;
      }
    }
  }
}

@keyframes weapon-rocket {
  0% {
    background-position: 0% 0;
  }

  100% {
    background-position: -500% 0;
  }
}
</style>
