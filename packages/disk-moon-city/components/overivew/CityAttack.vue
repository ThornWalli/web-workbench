<template>
  <div
    v-if="active"
    class="mc-overview-city-attack"
    :style="{
      '--color': COLOR_VALUE[PLAYER_COLORS[currentResult?.fromPlayer.index]]
    }"
    :class="{
      [`player-${currentResult?.toPlayer.index + 1}`]: currentResult
    }">
    <div
      v-if="shieldValue !== undefined"
      class="shield"
      :class="{ attack: shieldAttack }"
      :style="{
        '--shield-diff': shieldRangeValue?.diff,
        '--shield-value': shieldValue
      }">
      <div @transitionend="onTransitionendShield"></div>
    </div>
    <div class="buildings">
      <div
        v-for="({ attack, hide }, index) in buildings"
        :key="`${index}`"
        class="building"
        :class="{ attack, hide }">
        <div @animationend="onTransitionendBuilding"></div>
      </div>
    </div>
    <div class="ground">
      <div>
        <mc-text color="dark-blue" embed block :content="message" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, computed, ref } from 'vue';
import McText from '../Text.vue';
import useAudioControl from '../../composables/useAudioControl';
import { COLOR_VALUE, PLAYER_COLORS } from '../../utils/color';

const { playSfx } = useAudioControl();

const LIMIT_BUILDING = 5;

const shieldAttack = ref(false);
const hasShield = ref(false);

/**
 * @type {import('vue').Ref<ShieldEntry[]>}
 */
const shieldList = ref([]);

/**
 * @type {import('vue').Ref<ShieldEntry>}
 */
const shieldRangeValue = ref(null);

const buildingList = ref([]);
const totalBuildings = ref([]);
const preparedBuildingList = ref([]);

const active = ref(false);
const hasHit = ref(true);

/**
 * @type {import('vue').Ref<import('../../classes/attackResult/WeaponAttackResult.js').default>}
 */
const currentResult = ref(null);

let _resolve;

const totalBuildingsDestroyed = computed(() => {
  return totalBuildings.value.filter(building => building.attacked);
});

const message = computed(() => {
  if (hasHit.value && totalBuildingsDestroyed.value.length) {
    return `Es wurde(n) ${totalBuildingsDestroyed.value.length} Bauerwek getroffen !`;
  } else if (!hasHit.value) {
    return 'Kein Treffer !';
  }
  return null;
});

const buildings = computed(() => {
  const buildings = buildingList.value.slice(0, LIMIT_BUILDING);
  console.log(
    'xxxx',
    currentResult.value.toPlayer.city.buildings.length,
    buildings.length,
    '=',
    currentResult.value.toPlayer.city.buildings.length - buildings.length
  );
  const result = buildings.concat(
    Array(
      Math.min(
        currentResult.value.toPlayer.city.buildings.length,

        Math.max(LIMIT_BUILDING - buildings.length, 0)
      )
    )
      .fill()
      .map(() => {
        return {
          hide: false
        };
      })
  );

  result.push(
    ...Array(Math.max(LIMIT_BUILDING - result.length, 0))
      .fill()
      .map(() => {
        return {
          hide: true
        };
      })
  );
  return result;
});

const availableBuildings = computed(() => {
  return buildingList.value.filter(building => !building.attacked);
});

const reset = async () => {
  const { promise, resolve } = Promise.withResolvers();
  shieldAttack.value = false;
  hasShield.value = false;
  shieldList.value = [];
  shieldRangeValue.value = null;
  buildingList.value = [];
  totalBuildings.value = [];
  preparedBuildingList.value = [];
  hasHit.value = true;
  nextTick(() => {
    window.setTimeout(() => {
      resolve();
    }, 200);
  });
  return promise;
};

const prepare = async ({ shieldExists, shield, buildings }) => {
  let { promise, resolve } = Promise.withResolvers();
  buildingList.value = [];
  window.requestAnimationFrame(async () => {
    preparedBuildingList.value = getPreparedBuildingList(buildings);
    buildingList.value = preparedBuildingList.value.shift() || [];

    if (shield[0] > 0) {
      shieldList.value = getShieldList(shield);
      shieldValue.value = shieldList.value[0].start;
      shieldRangeValue.value = shieldList.value[0];
      console.log({ shieldList: shieldList.value.map(v => v.toJSON()) });
    }
    hasShield.value = shieldExists;

    nextTick(() => {
      resolve();
    });
  });
  return promise;
};

/**
 *
 * @param result {import('../../classes/Player').WeaponShootResult}
 */
const prepareWeaponShoot = async result => {
  currentResult.value = result;
  const buildings = prepareBuildings(result.buildings);
  await reset();
  await prepare({ ...result, buildings });

  let hit = false;
  active.value = true;
  const shoot = async () => {
    if (shieldRangeValue.value && shieldRangeValue.value.diff > 0) {
      await attackShields();
      hit = true;
    }
    totalBuildings.value = buildings;
    if (buildings.length > 0) {
      let { promise, resolve } = Promise.withResolvers();
      _resolve = resolve;
      attackBuilding();
      hit = true;
      await promise;
    }
    hasHit.value = hit;
    console.log('complete', { result });
  };
  return { shoot };
};

const attackShields = () => {
  const { promise, resolve } = Promise.withResolvers();
  if (shieldList.value.length > 0) {
    _resolve = resolve;
    window.setTimeout(() => {
      attackShield();
    }, 200);
  }
  return promise;
};

const attackBuilding = () => {
  const value = availableBuildings.value[0];
  value.attack = true;
};

const onTransitionendBuilding = () => {
  console.log('onTransitionendBuilding', shieldAttack.value);
  const building = availableBuildings.value.find(({ attack }) => attack);

  if (building.destroyed) {
    building.hide = true;
  }
  building.attack = false;
  building.attacked = true;
  if (availableBuildings.value.length) {
    nextTick(() => {
      attackBuilding();
    });
  } else if (preparedBuildingList.value.length) {
    buildingList.value = preparedBuildingList.value.shift();
    nextTick(() => {
      attackBuilding();
    });
  } else {
    _resolve();
  }
};

const shieldValue = ref();
const attackShield = () => {
  shieldRangeValue.value = shieldList.value.shift();
  shieldValue.value = shieldRangeValue.value.start;
  window.setTimeout(() => {
    nextTick(() => {
      nextTick(() => {
        console.log('tesdddt', shieldRangeValue.value.diff * 8);
        Array(Math.round(shieldRangeValue.value.diff * 8))
          .fill()
          .reduce(result => {
            return result.then(async () => {
              const { promise, resolve } = Promise.withResolvers();
              window.setTimeout(() => resolve(), 150);
              await promise;
              return playSfx('city_shield_tick').promise;
            });
          }, Promise.resolve());

        shieldAttack.value = true;
        shieldValue.value = shieldRangeValue.value.end;
      });
    });
  }, 200);
};

const onTransitionendShield = () => {
  console.log('onTransitionendShield', shieldAttack.value);
  shieldAttack.value = false;
  if (shieldList.value.length) {
    shieldRangeValue.value = 0;

    nextTick(() => {
      attackShield();
    });
  } else {
    _resolve();
  }
};

const prepareBuildings = buildings => {
  return buildings.map(building => ({
    attack: false,
    attacked: false,
    hide: false,
    ...building
  }));
};

const getPreparedBuildingList = buildings => {
  return buildings.reduce((result, building) => {
    if ((result[result.length - 1]?.length || 0) % LIMIT_BUILDING === 0) {
      result.push([]);
    }
    result[result.length - 1].push(building);
    return result;
  }, []);
};

class ShieldEntry {
  constructor({ start, end } = { start: 1, end: 0 }) {
    this.start = start;
    this.end = end;
  }

  get diff() {
    return this.start - this.end;
  }

  toJSON() {
    return {
      start: this.start,
      end: this.end,
      diff: this.diff
    };
  }
}
// [2.6, 1.7]
// 2.6 - 1.7 = 0.9
// 2.6 % 1 = 0.6
/**
 * @param {[number, number]} range
 * @result {Array<ShieldEntry>[]}
 */
const getShieldList = range => {
  const [start, end] = range;
  if (start === end) {
    return [new ShieldEntry({ start: 1, end: 1 })];
  }
  const shields = Array(Math.ceil(Math.ceil(start) - Math.floor(end)) || 1)
    .fill()
    .map(() => new ShieldEntry());

  shields[0].start = start % 1 || 1;
  shields[shields.length - 1].end = end % 1;
  return shields;
};

defineExpose({
  prepareWeaponShoot,
  reset
});
</script>

<style lang="postcss" scoped>
.mc-overview-city-attack {
  --color: white;
  --shield-height: 30px;
  --shield-background: url('../../assets/graphics/city-attack/shield/1.png');
  --building-background: url('../../assets/graphics/city-attack/building/1.png');

  position: relative;
  width: 100%;
  height: 100%;
  color: var(--color);

  &.player-1 {
    --shield-background: url('../../assets/graphics/city-attack/shield/1.png');
    --building-background: url('../../assets/graphics/city-attack/building/1.png');
  }

  &.player-2 {
    --shield-background: url('../../assets/graphics/city-attack/shield/2.png');
    --building-background: url('../../assets/graphics/city-attack/building/2.png');
  }

  &.player-3 {
    --shield-background: url('../../assets/graphics/city-attack/shield/3.png');
    --building-background: url('../../assets/graphics/city-attack/building/3.png');
  }

  &.player-4 {
    --shield-background: url('../../assets/graphics/city-attack/shield/4.png');
    --building-background: url('../../assets/graphics/city-attack/building/4.png');
  }

  & .shield {
    position: absolute;
    bottom: 110px;
    left: 4px;
    width: 312px;
    height: 30px;

    &.attack {
      & > div {
        transition: height calc((var(--shield-diff)) * 8 * 0.15s) linear;
      }
    }

    & > div {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: calc(100% * (var(--shield-value)));

      /* height: calc(
        100% * var(--shield-start-value) - 100% *
          (var(--shield-start-value) - var(--shield-end-value))
      ); */
      background: var(--shield-background);
      background-position: bottom;
      background-size: cover;
    }
  }

  & .building {
    position: relative;

    &::after {
      display: block;
      width: 34px;
      height: 34px;
      content: '';
      background: var(--building-background);
      background-size: contain;
    }

    & div {
      position: absolute;
      inset: 0;
      display: block;
      visibility: hidden;
      content: '';
      background: currentColor;
    }

    &.hide {
      visibility: hidden;
    }

    &.attack {
      & div {
        visibility: visible;
        animation: building-attack 0.4s linear;
        animation-timing-function: steps(6);
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
      }
    }
  }

  & .ground {
    position: absolute;
    bottom: 18px;
    left: 4px;
    width: 314px;
    height: 34px;
    background: url('../../assets/graphics/city-attack/ground.png');
    background-size: contain;

    & > div {
      position: absolute;
      inset: 6px 2px 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }

  & .buildings {
    position: absolute;
    bottom: 52px;
    left: 4px;
    display: flex;
    gap: 6px;
    justify-content: center;
    width: 314px;
  }
}

@keyframes shield-attack {
  0% {
    height: 100%;
  }

  100% {
    height: 0%;
  }
}

@keyframes building-attack {
  0% {
    color: var(--mc-color-white);
  }

  9% {
    color: var(--mc-color-white);
  }

  10% {
    color: var(--color);
  }

  100% {
    color: var(--mc-color-black);
  }
}
</style>
