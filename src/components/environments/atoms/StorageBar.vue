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

<story
  name="StorageSize"
  group="Environments/Atoms"
  knobs="{}">
  <StorageSize />
</story>

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
        '--atom-storage-bar-height': Math.min(this.value, 1)
      };
    }
  }
};
</script>

<style lang="postcss">
.wb-env-atom-storage-bar {
  --atom-storage-bar-height: 100%;

  @nest #root > & {
    position: absolute;
    top: 0;
    left: 0;
  }

  width: 12px;
  height: 100%;
  background-color: var(--workbenchColor_2);
  border-right: solid #fff 2px;

  & > div {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
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
    height: calc(var(--atom-storage-bar-height) * 100%);
    background-color: var(--workbenchColor_4);
  }

  & .storage-bar__icon {
    & span {
      display: block;
    }

    & svg {
      display: block;
      margin: 0 auto;

      & * {
        fill: var(--workbenchColor_1);
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
