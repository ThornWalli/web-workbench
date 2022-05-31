<template>
  <div v-if="visible" class="wb-env-atom-storage-bar" :style="style">
    <div>
      <div class="storage-bar__icon storage-bar__icon__full">
        <svg-storage-bar-full />
      </div>
      <span class="storage-bar__size">
        <span class="storage-bar__size__helper" />
      </span>

      <div class="storage-bar__icon storage-bar__icon__empty">
        <svg-storage-bar-empty />
      </div>
    </div>
  </div>
</template>

<script>
import SvgStorageBarFull from '@/assets/svg/control/storage_size_full.svg?vue-template';
import SvgStorageBarEmpty from '@/assets/svg/control/storage_size_empty.svg?vue-template';

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

<style lang="postcss">
:root {
  --color__storageBar__background: #000;
  --color__storageBar__border: #fff;
  --color__storageBar__sizeHelper: #fa5;
  --color__storageBar__icon: #fff;
}
</style>

<style lang="postcss" scoped>
.wb-env-atom-storage-bar {
  /* ### */

  --bar-height: 100%;

  @nest #root > & {
    position: absolute;
    top: 0;
    left: 0;
  }

  width: 12px;
  height: 100%;
  background-color: var(--color__storageBar__background);

  & > div {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }

  & .storage-bar__size {
    position: relative;
    flex: 1 100%;
  }

  & .storage-bar__size__helper {
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
    height: calc(var(--bar-height) * 100%);
    background-color: var(--color__storageBar__sizeHelper);
  }

  & .storage-bar__icon {
    & span {
      display: block;
    }

    & svg {
      display: block;
      margin: 0 auto;

      & * {
        fill: var(--color__storageBar__icon);
      }
    }
  }

  & .storage-bar__icon__empty,
  & .storage-bar__icon__full {
    flex: 1 auto;
  }

  & .storage-bar__icon__empty {
    padding-top: 2px;
    padding-bottom: 2px;
  }

  & .storage-bar__icon__full {
    padding-top: 2px;
    padding-bottom: 2px;
  }
}
</style>
