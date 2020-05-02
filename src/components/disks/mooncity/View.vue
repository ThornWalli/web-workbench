<template>
  <div class="wb-disks-mooncity-view">
    <div v-if="$slots['view-1-1']" class="view-position-1-1">
      <slot name="view-1-1" />
    </div>
    <div v-if="$slots['view-2-1']" class="view-position-2-1">
      <slot name="view-2-1" />
    </div>
    <div v-if="$slots['view-2-2']" class="view-position-2-2">
      <slot name="view-2-2" />
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="postcss">
.wb-disks-mooncity-view {
  position: relative;

  & .view-position-2-1 {
    position: absolute;
    top: 26px;
    left: 304px;
    width: 322px;
    height: 154px;
  }
}
</style>
