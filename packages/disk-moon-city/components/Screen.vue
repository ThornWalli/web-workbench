<template>
  <div class="mc-screen">
    <transition name="screen-change" mode="out-in">
      <div
        :key="changeKey"
        class="content"
        :class="{ background: !!backgroundImage }"
        :style="{
          '--background-image': backgroundImage && `url('${backgroundImage}')`
        }">
        <slot name="default"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  changeKey: {
    type: String,
    default: ''
  },
  backgroundImage: {
    type: String,
    default: ''
  }
});
</script>

<style lang="postcss" scoped>
.mc-screen {
  position: relative;
  width: 100%;
  height: 100%;

  & img {
    display: block;
    width: 100%;
  }

  & .content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 2px;
    overflow: hidden;

    &.background {
      background: var(--background-image);
      background-size: contain;
    }

    & .row,
    & :deep(.row),
    & .col,
    & :deep(.col) {
      display: flex;
    }

    & .row,
    & :deep(.row) {
      /* width: calc(100% + 2px); */

      & :deep(.mc-text:last-child > div) {
        width: calc(100% - 2px);
        margin-right: -2px;
      }
    }

    & .spacer,
    & :deep(.spacer) {
      flex: 1;
    }
  }

  & :deep(.mc-text:not(.embed)) {
    padding-right: 0;
    padding-left: 0;

    & .mc-text-canvas {
      top: 2px;
      left: 0;
    }
  }

  & :deep(.mc-alert-bar) {
    position: absolute;
    right: 2px;
    bottom: 2px;
    left: 2px;
  }
}

/* screen-change */

.screen-change-enter-active,
.screen-change-leave-active {
  transition: opacity 0.2s;
  transition-timing-function: steps(5);
}

.screen-change-leave-active {
  transition-duration: 0.1s;
}

.screen-change-enter-from,
.screen-change-leave-to {
  opacity: 0;
}
</style>
