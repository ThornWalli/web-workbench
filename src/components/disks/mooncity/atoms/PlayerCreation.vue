<template>
  <form class="wb-disks-mooncity-atom-player-creation" @submit="onSubmit">
    <span class="player-creation__head">- C O M L O G -</span>
    <div v-if="playerIndex < 0" class="player-creation__player-count">
      <span>Anzahl der Spieler ? :</span><input ref="inputCount" v-model="playerCount" type="text" pattern="[1-4]" size="1">
    </div>

    <div v-if="playerIndex > -1" class="player-creation__player-name" :style="`--player-color: ${player.color};`">
      <span>Spieler : {{ player.index }}</span>

      <span>Bitte geben Sie ihren Namen ein :</span>
      <input
        ref="inputName"
        v-model="playerNames[playerIndex]"
        type="text"
        maxlength="10"
        size="1"
      >
    </div>
  </form>
</template>

<script>

import { COLORS } from '@/web-workbench/disks/mooncity/utils';
const PLAYER_COLOR = [
  'gray', 'green', 'red', 'blue', 'yellow'
];

export default {
  data () {
    return {
      playerNames: [],
      playerCount: null,
      playerIndex: -1
    };
  },
  computed: {
    player () {
      return {
        color: COLORS[String(PLAYER_COLOR[this.playerIndex + 1])],
        index: this.playerIndex + 1
      };
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.inputCount.focus();
    });
  },
  methods: {
    onSubmit (e) {
      e.preventDefault();
      if (this.playerIndex < this.playerCount) {
        this.playerIndex++;
        this.$nextTick(() => {
          this.$refs.inputName.focus();
        });
      }
      console.log(this.playerNames);
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atom-player-creation {
  --player-color: --mooncity__color__gray;

  & input {
    min-width: 0;
    padding: 2px;
    font-size: 10px;
    line-height: 10px;
    color: #ce0000;
    text-align: left;
    background: transparent;
    border: 2px solid rgb(0, 138, 206);
    outline: none;
  }

  & .player-creation__head {
    display: block;
    margin-top: 40px;
    margin-bottom: 30px;
    line-height: 1;
    color: var(--mooncity__color__blue);
    text-align: center;
  }

  & .player-creation__player-count {
    color: var(--mooncity__color__orange);
    text-align: center;

    & span {
      display: block;
      margin-bottom: 6px;
      line-height: 1;
    }

    & input {
      width: 30px;
      margin: 0 auto;
      text-align: center;
    }
  }

  & .player-creation__player-name {
    color: var(--player-color);
    text-align: center;

    & span {
      display: block;
      margin-bottom: 10px;
      line-height: 1;
    }

    & input {
      width: 200px;
      margin: 0 auto;
      color: var(--mooncity__color__white);
      text-align: center;
      border: none;
    }
  }

}
</style>
