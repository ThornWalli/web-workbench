<template>
  <div
    class="wb-env-screen-power-button"
    :class="styleClasses"
    :aria-label="active ? `Turn Off` : `Turn On`">
    <div class="background">
      <i class="light" />
      <button @click="onClickBackground" />
    </div>
    <button class="foreground" @click="onClickForeground">
      <i class="light" />
      <span>{{ label }}</span>
      <svg-screen-panel-power />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue';
import SvgScreenPanelPower from '../../assets/svg/screen/panel/power.svg?component';

const $props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Power'
  }
});

const $emit = defineEmits<{
  (e: 'click', value: Event): void;
}>();

const broken = ref(false);
const clickCounter = ref(0);

const styleClasses = computed(() => {
  return {
    active: $props.active,
    broken: broken.value
  };
});

onUnmounted(() => {
  window.clearTimeout(timeout);
});

let timeout: number;
function onClickForeground(e: Event) {
  if (!broken.value) {
    if (clickCounter.value >= 10) {
      broken.value = true;
    } else {
      onClick(e);
      clickCounter.value++;
    }
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      clickCounter.value = 0;
    }, 500);
  }
}

function onClickBackground(e: Event) {
  onClick(e);
}

function onClick(e: Event) {
  $emit('click', e);
}
</script>

<style lang="postcss" scoped>
.wb-env-screen-power-button {
  width: 66px;
  height: 70px;
  pointer-events: auto;
  touch-action: manipulation;

  & button {
    width: 100%;
    height: 100%;
    padding: 0;
    appearance: none;
    outline: none;
    background: transparent;
    border: none;
  }

  & > div,
  & > button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  & .foreground {
    /* display: none; */
    background: #aaa69d;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      background: #000;
      opacity: 0;
      transition: opacity 175ms ease;
      will-change: opacity;
    }
  }

  &.broken {
    & .foreground {
      box-shadow: 0 0 3px rgb(0 0 0 / 40%);
      transform: translateY(50%) translateX(20%) rotate(-20deg);
      transition:
        transform 0.2s linear,
        box-shadow 0.2s linear;
    }
  }

  &:not(.broken) {
    & .foreground {
      box-shadow: 0 0 3px rgb(0 0 0 / 0%);
      transition: transform 0.1s linear;

      &:active {
        transform: scale(0.95);

        &::after {
          opacity: 0.1;
        }
      }
    }
  }

  & .background > button {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 18px;
    background: rgb(0 0 0 / 50%);
    border-radius: 3px;
    box-shadow:
      inset 0 0 3px rgb(0 0 0 / 100%),
      0 0 6px rgb(0 0 0 / 40%);
    transform: translate(-50%, -50%);

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      content: '';
      background: rgb(0 0 0 / 50%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }

  & span {
    position: absolute;
    bottom: 22px;
    left: calc(50% + (1 / 11 * 1em));
    display: block;
    font-family: Verdana, Geneva, sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #000;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: calc(0.5 / 11 * 1em);
    opacity: 0.5;
    transform: translateX(-50%);
  }

  & svg {
    position: absolute;
    bottom: 8px;
    left: calc(50% - 5px);
    width: 10px;
    opacity: 0.5;
  }

  & .background > .light {
    position: absolute;
    top: 11px;
    left: 50%;
    box-sizing: content-box;
    width: 9px;
    height: 9px;
    background-color: rgb(255 255 200);
    border: solid rgb(0 0 0 / 60%) 1px;
    border-radius: 50%;
    box-shadow:
      inset 0 0 4px rgb(0 0 0 / 50%),
      rgb(0 0 0 / 20%) 0 0 7px 1px,
      inset rgb(255 255 200) 0 0 9px,
      rgb(255 255 200 / 50%) 0 2px 12px;
    transform: translateX(-50%);
    transition:
      background-color 0.2s linear,
      box-shadow 0.2s linear;
  }

  & .foreground > .light {
    position: absolute;
    top: 12px;
    left: 50%;
    width: 18px;
    height: 9px;
    background-color: #f00;
    box-shadow:
      inset 0 0 4px rgb(0 0 0 / 50%),
      rgb(0 0 0 / 20%) 0 -1px 7px 1px,
      inset #441313 0 -1px 9px,
      rgb(255 0 0 / 50%) 0 2px 12px;
    transform: translateX(-50%);
    transition:
      background-color 0.2s linear,
      box-shadow 0.2s linear;
  }

  &:not(.active) {
    & .background > .light {
      background: gray;
      box-shadow:
        inset 0 0 4px rgb(0 0 0 / 100%),
        rgb(0 0 0 / 20%) 0 0 7px 1px,
        inset rgb(255 255 200) 0 0,
        rgb(255 255 200 / 0%) 0 2px 12px;
    }
  }

  &:not(.active),
  &.active.broken {
    & .foreground > .light {
      background: darkred;
      box-shadow:
        inset 0 0 4px rgb(0 0 0 / 100%),
        rgb(0 0 0 / 20%) 0 -1px 7px 1px,
        inset #441313 0 -1px,
        rgb(255 0 0 / 0%) 0 2px 12px;
    }
  }
}
</style>
