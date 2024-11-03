<template>
  <div class="frame-start">
    <mc-text color="blue" class="title">- C O M L O G -</mc-text>
    <form
      v-if="players.length < playerCount"
      :key="players.length"
      @submit="onSubmitPlayeName">
      <div class="head">
        <mc-text :color="currentPlayerColor" style="text-align: center">
          Spieler : {{ players.length + 1 }}
        </mc-text>
        <mc-text :color="currentPlayerColor" style="text-align: center">
          Bitte geben sie ihren namen ein:
        </mc-text>
      </div>
      <mc-input-text
        v-model="playerName"
        :size="15"
        color="white"
        border-color="white"
        auto-focus />
    </form>
    <form v-else-if="playerCount < 1" @submit="onSubmitPlayerCount">
      <div class="head">
        <mc-text color="dark-yellow"> Anzahl der Spieler ? : </mc-text>
      </div>
      <mc-input-number
        v-model="tmpPlayerCount"
        :size="3"
        :min="1"
        :max="4"
        align="center"
        border
        hide-caret />
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import McText from '../Text';
import McInputText from '../input/Text';
import McInputNumber from '../input/Number';
import { PLAYER_COLORS } from '../../utils/color';
import useAudioControl from '../../composables/useAudioControl';

const { playSfx } = useAudioControl();

const tmpPlayerCount = ref(0);
const playerCount = ref(0);
const playerName = ref('');
const $emit = defineEmits(['complete']);

const currentPlayerColor = computed(() => {
  return PLAYER_COLORS[players.value.length];
});

const onSubmitPlayerCount = e => {
  e.preventDefault();
  playerCount.value = tmpPlayerCount.value;
  playSfx('button_1_click');
};
const players = ref([]);

const onSubmitPlayeName = e => {
  e.preventDefault();
  players.value.push(playerName.value || 'Nobody');
  playerName.value = '';
  if (players.value.length >= playerCount.value) {
    $emit('complete', { players: players.value });
  }
};
</script>

<style lang="postcss" scoped>
.frame-start {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  & > form {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    justify-content: center;
  }

  & .title {
    margin-bottom: 30px;
  }

  & .head {
    display: flex;
    flex-direction: column;
  }
}
</style>
