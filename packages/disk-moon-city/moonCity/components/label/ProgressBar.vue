<template>
  <div
    class="mc-label-progress-bar"
    :class="{ [`type-${type || defaultType}`]: true }"
    :style="{
      '--min': min || defaultMin,
      '--value': value || defaultValue
    }">
    <div class="content">
      <div
        :class="{
          warning:
            isTypeDefault && (value || defaultValue) <= (min || defaultMin)
        }"
        class="bar" />
      <div v-if="isTypeDefault" class="handler" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const defaultType = 'default';
const defaultMin = 1 / 3;
const defaultValue = 0;

const $props = defineProps<{
  type?: 'default' | 'inset';
  value?: number;
  min?: number;
}>();

const isTypeDefault = computed(() => $props.type === 'default');
</script>

<style lang="postcss" scoped>
.mc-label-progress-bar {
  position: relative;
  display: flex;

  &.type-inset {
    width: 94px;
    height: 6px;

    & .content {
      & .bar {
        width: 94px;
        height: 6px;
        background: #667;

        &::before {
          left: 0;
          display: block;
          width: calc(var(--value) * 100%);
          height: 100%;
          content: '';
          background-color: var(--mc-color-red);
        }
      }
    }
  }

  .mc-label & {
    align-self: center;
    margin: 2px;
  }

  &.type-default {
    width: 56px;
    height: 18px;

    &::before {
      flex: 0 0 4px;
      height: 18px;
      content: '';
      background: url('../../assets/graphics/label/progress-bar/frame/start.png');
      background-size: contain;
    }

    &::after {
      flex: 0 0 4px;
      height: 18px;
      content: '';
      background: url('../../assets/graphics/label/progress-bar/frame/end.png');
      background-size: contain;
    }

    & .content {
      box-sizing: border-box;
      display: flex;
      flex: 1;
      height: 18px;
      padding: 2px 0;
      background: url('../../assets/graphics/label/progress-bar/frame/fill.png');
      background-size: contain;

      & .bar {
        position: absolute;
        inset: 4px;
        height: 10px;
        background-color: var(--mc-color-dark-orange);

        &::before {
          left: 0;
          display: block;
          width: calc(var(--value) * 100%);
          height: 100%;
          content: '';
          background-color: var(--mc-color-orange);
        }

        &.warning {
          &::before {
            animation: warning 1.2s infinite;
            animation-timing-function: steps(4);
          }
        }
      }

      & .handler {
        position: absolute;
        top: 0;
        left: calc(var(--min) * 100%);
        width: 2px;
        height: 18px;
        background: url('../../assets/graphics/label/progress-bar/frame/handler.png');
        background-size: contain;
      }
    }
  }
}

@keyframes warning {
  0% {
    background-color: var(--mc-color-light-green);
  }

  50% {
    background-color: var(--mc-color-red);
  }

  100% {
    background-color: var(--mc-color-black);
  }
}
</style>
