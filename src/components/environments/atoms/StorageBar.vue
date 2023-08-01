<template>
  <div v-if="visible" class="wb-env-atom-storage-bar" :style="style">
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

<script>
import SvgStorageBarFull from '@/assets/svg/control/storage_size_full.svg?component';
import SvgStorageBarEmpty from '@/assets/svg/control/storage_size_empty.svg?component';

export default {
  components: {
    SvgStorageBarFull, SvgStorageBarEmpty
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    value: {
      type: Number,
      default: 0.8
    }
  },

  computed: {
    style () {
      return {
        '--bar-height': Math.min(this.value, 1)
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-storage-bar {
  --color__background: var(--color__storageBar__background, #000);
  --color__border: var(--color__storageBar__border, #fff);
  --color__sizeHelper: var(--color__storageBar__sizeHelper, #fa5);
  --color__icon: var(--color__storageBar__icon, #fff);
  --bar-height: 100%;

  #root > & {
    position: absolute;
    top: 0;
    left: 0;
  }

  width: 12px;
  height: 100%;
  background-color: var(--color__background);

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
    background-color: var(--color__sizeHelper);
  }

  & .icon {
    & span {
      display: block;
    }

    & svg {
      display: block;
      margin: 0 auto;

      & :deep(*) {
        fill: var(--color__icon);
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
