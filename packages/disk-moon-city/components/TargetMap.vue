<template>
  <div
    class="mc-target-map"
    :class="{ selected: playerIndex > -1 }"
    :data-player="playerIndex">
    <div>
      <base-button
        v-for="(player, i) in players"
        :key="i"
        class="player"
        :class="{ ['player-' + (i + 1)]: true }"
        @click="onClick(player)"></base-button>
      <div class="handler handler-x"></div>
      <div class="handler handler-y"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import Player from '../classes/Player';
import BaseButton from './base/Button.vue';
import useAudioControl from '../composables/useAudioControl';

const $props = defineProps({
  currentPlayerSelect: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Player,
    default: null
  },
  index: {
    type: Number,
    default: 1
  },
  currentPlayer: {
    type: Player,
    default: null
  },
  players: {
    type: Array,
    default: () => [{}, {}, {}, {}]
  }
});

const { playSfx } = useAudioControl();

const $emit = defineEmits(['update:model-value']);

const playerIndex = computed(() => {
  return $props.players.indexOf($props.modelValue);
});

watch(
  () => $props.modelValue,
  () => {
    playSfx('button_4_click');
  }
);

const onClick = player => {
  if (
    $props.currentPlayerSelect ||
    (!$props.currentPlayerSelect && $props.currentPlayer !== player)
  ) {
    $emit('update:model-value', player !== $props.modelValue ? player : null);
  }
};
</script>

<style lang="postcss" scoped>
.mc-target-map {
  position: relative;
  box-sizing: border-box;
  width: 62px;
  height: 62px;
  padding: calc((62px - 54px) / 2);
  background: url('../assets/graphics/target-map/frame.png');
  background-size: contain;

  & > div {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background: url('../assets/graphics/target-map/background.png');
    background-size: contain;
  }

  & .player {
    position: absolute;
    width: 12px;
    height: 12px;
    background: transparent;
    background-size: contain;

    &.player-1 {
      top: 2px;
      left: 2px;
      background-image: url('../assets/graphics/target-map/player/1.png');
    }

    &.player-2 {
      top: 2px;
      left: 40px;
      background-image: url('../assets/graphics/target-map/player/2.png');
    }

    &.player-3 {
      top: 40px;
      left: 2px;
      background-image: url('../assets/graphics/target-map/player/3.png');
    }

    &.player-4 {
      top: 40px;
      left: 40px;
      background-image: url('../assets/graphics/target-map/player/4.png');
    }
  }

  & .handler {
    position: absolute;
    pointer-events: none;
    background: var(--mc-color-white);
    opacity: 0;
    transition:
      opacity 0.2s steps(3),
      top 0.2s steps(3),
      left 0.2s steps(3);

    &.handler-x {
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
    }

    &.handler-y {
      top: 0;
      left: 50%;
      width: 2px;
      height: 100%;
    }
  }

  &.selected {
    & .handler {
      opacity: 1;
    }
  }

  &[data-player='0'] {
    & .handler-x {
      top: 8px;
    }

    & .handler-y {
      left: 8px;
    }
  }

  &[data-player='1'] {
    & .handler-x {
      top: 8px;
    }

    & .handler-y {
      left: 44px;
    }
  }

  &[data-player='2'] {
    & .handler-x {
      top: 44px;
    }

    & .handler-y {
      left: 8px;
    }
  }

  &[data-player='3'] {
    & .handler-x {
      top: 44px;
    }

    & .handler-y {
      left: 44px;
    }
  }
}
</style>
