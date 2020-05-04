<template>
  <form class="wb-disks-mooncity-molecule-user-creation" @submit="onSubmit">
    <span class="user-creation__head">- C O M L O G -</span>
    <div v-if="userIndex < 0" class="user-creation__user-count">
      <span>Anzahl der Spieler ? :</span><input ref="inputCount" v-model="userCount" type="text" pattern="[1-4]" size="1">
    </div>

    <div v-if="userIndex > -1" class="user-creation__user-name" :style="`--user-color: ${user.color};`">
      <span>Spieler : {{ user.index }}</span>

      <span>Bitte geben Sie ihren Namen ein :</span>
      <input
        ref="inputName"
        v-model="userNames[userIndex]"
        type="text"
        maxlength="10"
        size="1"
      >
    </div>
  </form>
</template>

<script>

import { COLORS } from '@/web-workbench/disks/mooncity/utils';
const USER_COLOR = [
  'gray', 'green', 'red', 'blue', 'yellow'
];

export default {
  data () {
    return {
      userNames: [],
      userCount: null,
      userIndex: -1
    };
  },
  computed: {
    user () {
      return {
        color: COLORS[String(USER_COLOR[this.userIndex + 1])],
        index: this.userIndex + 1
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
      if (this.userIndex < this.userCount) {
        this.userIndex++;
        this.$nextTick(() => {
          this.$refs.inputName.focus();
        });
      }
      console.log(this.userNames);
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-molecule-user-creation {
  --user-color: --mooncity__color__gray;

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

  & .user-creation__head {
    display: block;
    margin-top: 40px;
    margin-bottom: 30px;
    line-height: 1;
    color: var(--mooncity__color__blue);
    text-align: center;
  }

  & .user-creation__user-count {
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

  & .user-creation__user-name {
    color: var(--user-color);
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
