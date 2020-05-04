<template>
  <div class="wb-disks-mooncity-view" :class="styleClasses">
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
  props: {
    styleType: {
      type: String,
      default () {
        return null;
      }
    }
  },
  computed: {
    styleClasses () {
      return {
        [`view--${this.styleType}`]: !!this.styleType
      };
    }
  }
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

  & .view-position-2-2 {
    position: absolute;
    top: 208px;
    left: 288px;
    width: 352px;
    height: 114px;

    /* padding: 12px;
    padding-right: 10px; */
    background: url('~assets/disks/mooncity/img/view_2_2_spacer.png');
  }

  &.view--main {
    & .view-position-1-1 {
      /* empty */
    }
  }
}
</style>

