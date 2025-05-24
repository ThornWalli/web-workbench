<template>
  <div class="frame-start">
    <mc-text
      :color="COLOR.BLUE"
      class="title"
      :align="TEXT_ALIGN.CENTER"
      content="- C O M L O G -" />
    <form
      v-if="players.length < playerCount"
      :key="players.length"
      @submit="onSubmitPlayeName">
      <div class="head">
        <mc-text
          :color="currentPlayerColor"
          :align="TEXT_ALIGN.CENTER"
          :content="`Spieler : ${players.length + 1}`" />
        <mc-text
          :color="currentPlayerColor"
          :align="TEXT_ALIGN.CENTER"
          :content="`Bitte geben sie ihren namen ein:`" />
      </div>
      <mc-input-text
        v-model="playerName"
        :size="15"
        color="white"
        border-color="white"
        :maxlength="15"
        auto-focus />
    </form>
    <form v-else-if="playerCount < 1" @submit="onSubmitPlayerCount">
      <div class="head">
        <mc-text :color="COLOR.DARK_YELLOW" content="Anzahl der Spieler ? :" />
      </div>
      <mc-input-number
        v-model="tmpPlayerCount"
        :size="3"
        :min="1"
        :max="4"
        align="center"
        border
        :color="COLOR.RED"
        hide-caret
        auto-focus />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { COLOR, PLAYER_COLORS } from '../../utils/color';
import McText, { TEXT_ALIGN } from '../Text.vue';
import McInputText from '../input/Text.vue';
import McInputNumber from '../input/Number.vue';
import useAudioControl from '../../composables/useAudioControl';
import { SFX } from '../../utils/sounds';

const { playSfx } = useAudioControl();

const tmpPlayerCount = ref(0);
const playerCount = ref(0);
const playerName = ref('');
const $emit = defineEmits<{
  (e: 'complete', payload: { players: string[] }): void;
}>();

const currentPlayerColor = computed(() => {
  return PLAYER_COLORS[players.value.length];
});

const onSubmitPlayerCount = (e: Event) => {
  e.preventDefault();
  playerCount.value = tmpPlayerCount.value;
  playSfx(SFX.BUTTON_1_CLICK);
};
const players = ref<string[]>([]);

const onSubmitPlayeName = (e: Event) => {
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

  /* align-items: center;
  justify-content: center; */
  width: 100%;

  & .mc-text {
    padding: 0;
  }

  & > form {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    justify-content: center;
  }

  & .title {
    margin-top: 40px;
    margin-bottom: 30px;
  }

  & .head {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
