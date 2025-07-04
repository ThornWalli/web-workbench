<template>
  <div v-if="visible" class="wb-env-element-storage-bar" :style="style">
    <div>
      <div class="icon full">
        <svg-storage-bar-full />
      </div>
      <span class="size">
        <span class="helper" />
      </span>

      <div class="icon empty">
        <svg-storage-bar-empty />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvgStorageBarFull from '../../assets/svg/control/storage_size_full.svg?component';
import SvgStorageBarEmpty from '../../assets/svg/control/storage_size_empty.svg?component';
import { computed } from 'vue';

const $props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  value: {
    type: Number,
    default: 0.8
  }
});

const style = computed(() => {
  return {
    '--bar-height': Math.min($props.value, 1)
  };
});
</script>

<style lang="postcss" scoped>
.wb-env-element-storage-bar {
  --color-background: var(--color-storage-bar-background, #000);
  --color-border: var(--color-storage-bar-border, #fff);
  --color-size-helper: var(--color-storage-bar-size-helper, #fa5);
  --color-icon: var(--color-storage-bar-icon, #fff);
  --bar-height: 100%;

  #root > & {
    position: absolute;
    top: 0;
    left: 0;
  }

  width: 12px;
  height: 100%;
  background-color: var(--color-background);

  & > div {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }

  & .size {
    position: relative;
    flex: 1 100%;
  }

  & .size > .helper {
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
    height: calc(var(--bar-height) * 100%);
    background-color: var(--color-size-helper);
  }

  & .icon {
    & span {
      display: block;
    }

    & svg {
      display: block;
      margin: 0 auto;

      & :deep(*) {
        fill: var(--color-icon);
      }
    }

    &.empty,
    &.full {
      flex: 1 auto;
      padding-top: 2px;
      padding-bottom: 2px;
    }
  }
}
</style>
