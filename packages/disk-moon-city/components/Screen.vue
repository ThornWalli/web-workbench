<template>
  <div class="mc-screen">
    <img v-if="backgroundImage" :src="backgroundImage" />
    <div class="content">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
}
</style>
