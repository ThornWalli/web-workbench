<template>
  <div
    class="mc-alert-bar"
    :class="{ active: active, [`color-${color}`]: color, start, end }"
    @click="onClick">
    <div class="content" @animationend="onAnimationEnd">
      <mc-text block color="red" :content="content" />
    </div>
  </div>
</template>

<script setup>
import McText from './Text.vue';
import { COLOR } from '../utils/color';
import { nextTick } from 'vue';
import useAudioControl from '../composables/useAudioControl';

defineProps({
  color: {
    type: String,
    default: COLOR.LIGHT_GREEN,
    validator: value => [COLOR.LIGHT_GREEN].includes(value)
  },
  start: {
    type: Boolean,
    default: false
  },
  end: {
    type: Boolean,
    default: false
  }
});

const onAnimationEnd = () => {
  nextTick(() => {
    active.value = false;
  });
};

const { playSfx } = useAudioControl();

const active = ref(false);
const content = ref('');

defineExpose({
  show: message => {
    content.value = message;
    active.value = true;
    playSfx('error');
  }
});
</script>

<style lang="postcss" scoped>
.mc-alert-bar {
  display: flex;
  display: none;

  --border-color: var(--mc-color-white);

  &.start {
    &::before {
      flex: 0 0 2px;
      height: 18px;
      content: '';
      background: var(--mc-color-white);
    }
  }

  &.end {
    &::after {
      flex: 0 0 2px;
      height: 18px;
      content: '';
      background: var(--mc-color-white);
    }
  }

  & .content {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    justify-content: space-between;
    background-color: #223;
    border: solid var(--mc-color-white) 2px;
    border-width: 2px 0;
  }

  & .start,
  & .end,
  & .content {
    animation: border-color 1s 1;
    animation-play-state: paused;
    animation-timing-function: steps(6);
  }

  & .start,
  & .end {
    animation-name: background;
  }

  &.active {
    display: block;

    & .start,
    & .end,
    & .content {
      animation-play-state: running;
    }
  }
}

@keyframes background {
  0% {
    border-color: white;
  }

  50% {
    border-color: lightgreen;
  }

  100% {
    border-color: green;
  }
}

@keyframes border-color {
  0% {
    border-color: white;
  }

  50% {
    border-color: lightgreen;
  }

  100% {
    border-color: green;
  }
}
</style>
