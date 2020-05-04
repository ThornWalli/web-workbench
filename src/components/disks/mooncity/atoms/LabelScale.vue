<template>
  <label
    class="wb-disks-mooncity-atoms-label-scale"
    :class="styleClasses"
    :style="style"
  >
    <span class="label-scale__scale">
      <span class="label-scale__value">
        <span class="label-scale__helper" />
      </span>
    </span>
  </label>
</template>

<script>
export default {
  props: {
    warning: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    }

  },
  computed: {

    style () {
      return {
        '--value': this.value
      };
    },

    styleClasses () {
      return {
        'label-scale--warning': this.warning
      };
    }

  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atoms-label-scale {
  --values: 0.5;
  --color__scale__background: #9c4500;
  --color__scale__helper: #cecfce;
  --color__scale__warning: #ce0000;

  position: relative;
  display: block;
  min-width: 30px;
  height: 18px;
  padding: 2px;
  background: #212031;
  border: solid #8c8a9c 2px;
  border-top-color: #8c8a9c;
  border-right-color: #424552;
  border-bottom-color: #424552;
  border-left-color: #636573;

  & .label-scale__scale {
    display: block;
    width: 100%;
    height: 100%;
    background: var(--color__scale__background);

    & .label-scale__value {
      display: block;
      float: none !important;
      width: calc(var(--values) * 100%);
      min-width: 0%;
      max-width: 100%;
      height: 100%;
      background: #de9a10;

      & .label-scale__helper {
        position: relative;
        top: -4px;
        z-index: 2;
        box-sizing: content-box;
        display: block;
        float: right;
        height: 100%;
        padding: 4px 0;
        border-right: solid var(--color__scale__helper) 2px;
      }
    }

  }

  &.label-scale--warning {
    & .label-scale__scale {
      & .label-scale__value {
        position: relative;
        background: var(--color__scale__warning);

        &::before {
          position: absolute;
          width: 100%;
          height: 100%;
          content: "";
          animation-name: animation__mooncity__atoms__labelScale__warning;
          animation-duration: 2s;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;

        }

      }
    }
  }
}

@keyframes animation__mooncity__atoms__labelScale__warning {
  0% {
    /* empty  */
  }

  50% {
    background: rgba(255, 255, 255, 0.45);
  }

  100% {
    background: rgba(255, 255, 255, 0);
  }

}
</style>
