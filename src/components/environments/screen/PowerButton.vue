<template>
  <div
    class="wb-env-screen-power-button"
    :class="styleClasses"
  >
    <div class="power-button__background">
      <i class="power-button__background__light" />
      <button class="test" @click="onClickBackground" />
    </div>
    <button class="power-button__foreground" @click="onClickForeground">
      <i class="power-button__foreground__light" />
      <span>POWER</span>
      <svg-screen-power />
    </button>
  </div>
</template>

<script>
import SvgScreenPower from '@/assets/svg/screen/power.svg?vue-template';
export default {
  components: {
    SvgScreenPower
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      broken: false,
      clickCounter: 0
    };
  },
  computed: {
    styleClasses () {
      return {
        'js--active': this.active,
        'js--broken': this.broken
      };
    }
  },
  methods: {
    onClickBackground (e) {
      this.onClick(e);
    },
    onClickForeground (e) {
      if (!this.broken) {
        if (this.clickCounter >= 10) {
          this.broken = true;
        } else {
          this.onClick(e);
          this.clickCounter++;
        }
        global.clearTimeout(this.timeout);
        this.timeout = global.setTimeout(() => {
          this.clickCounter = 0;
        }, 500);
      }
    },
    onClick (e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style lang="postcss">

.wb-env-screen-power-button {
  width: 66px;
  height: 70px;
  pointer-events: auto;
  touch-action: manipulation;

  & button {
    width: 100%;
    height: 100%;
    padding: 0;
    background: transparent;
    border: none;
    outline: none;
    appearance: none;
  }

  & > div,
  & > button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  & .power-button__foreground {
    /* display: none; */
    background: #aaa69d;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: "";
      background: #000;
      opacity: 0;
      transition: opacity 175ms ease;
      will-change: opacity;
    }
  }

  &.js--broken {
    & .power-button__foreground {
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
      transition: transform 0.2s linear, box-shadow 0.2s linear;
      transform: translateY(50%) translateX(20%) rotate(-20deg);
    }
  }

  &:not(.js--broken) {
    & .power-button__foreground {
      box-shadow: 0 0 3px rgba(0, 0, 0, 0);
      transition: transform 0.1s linear;

      &:active {
        transform: scale(0.95);

        &::after {
          opacity: 0.1;
        }
      }

    }
  }

  & .test {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 18px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 1), 0 0 6px rgba(0, 0, 0, 0.4);
    transform: translate(-50%, -50%);

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      content: "";
      background: rgba(0, 0, 0, 0.5);
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
    left: 50%;
    width: 10px;
    opacity: 0.5;
    transform: translateX(-50%);
  }

  & .power-button__background__light {
    position: absolute;
    top: 11px;
    left: 50%;
    box-sizing: content-box;
    width: 9px;
    height: 9px;
    background-color: rgb(255, 255, 200);
    border: solid rgba(0, 0, 0, 0.6) 1px;
    border-radius: 50%;
    box-shadow:
      inset 0 0 4px rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.2) 0 0 7px 1px,
      inset rgb(255, 255, 200) 0 0 9px,
      rgba(255, 255, 200, 0.5) 0 2px 12px;
    transition: background-color 0.2s linear, box-shadow 0.2s linear;
    transform: translateX(-50%);
  }

  & .power-button__foreground__light {
    position: absolute;
    top: 12px;
    left: 50%;
    width: 18px;
    height: 9px;
    background-color: #f00;
    box-shadow:
      inset 0 0 4px rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.2) 0 -1px 7px 1px,
      inset #441313 0 -1px 9px,
      rgba(255, 0, 0, 0.5) 0 2px 12px;
    transition: background-color 0.2s linear, box-shadow 0.2s linear;
    transform: translateX(-50%);
  }

  &:not(.js--active) {
    & .power-button__background__light {
      background: gray;
      box-shadow:
        inset 0 0 4px rgba(0, 0, 0, 1),
        rgba(0, 0, 0, 0.2) 0 0 7px 1px,
        inset rgb(255, 255, 200) 0 0,
        rgba(255, 255, 200, 0) 0 2px 12px;
    }
  }

  &:not(.js--active),
  &.js--active.js--broken {
    & .power-button__foreground__light {
      background: darkred;
      box-shadow:
        inset 0 0 4px rgba(0, 0, 0, 1),
        rgba(0, 0, 0, 0.2) 0 -1px 7px 1px,
        inset #441313 0 -1px,
        rgba(255, 0, 0, 0) 0 2px 12px;
    }
  }

}
</style>

