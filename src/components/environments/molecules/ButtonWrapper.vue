<template>
  <div class="wb-env-molecule-button-wrapper" :class="styleClasses">
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    full: {
      type: Boolean,
      required: false,
      default: false
    },
    align: {
      type: String,
      required: false,
      default: 'left' // center, left, right, outer

    },
    direction: {
      type: String,
      required: false,
      default: 'horizontal' // horizontal, vertical
    }
  },
  computed: {
    styleClasses () {
      return {
        [`button-wrapper--direction-${this.direction}`]: true,
        [`button-wrapper--align-${this.align}`]: true,
        'button-wrapper--full': this.full
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-molecule-button-wrapper {
  --margin: var(--default-element-margin);

  margin: 0 var(--margin);

  .wb-env-molecule-form > & {
    margin: calc(var(--default-element-margin) * 2);
  }

  & > div {
    display: flex;
      gap: var(--margin);

    & > * {
      display: block;
    }
  }

  &.button-wrapper--direction-vertical {
    & > div {
      flex-direction: column;
      height: 100%;

      & > * {
        width: 100%;
        height: 100%;
        margin-bottom: var(--margin);

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  &.button-wrapper--direction-horizontal {
    white-space: nowrap;

    &.button-wrapper--align-left {
      & > div {
        justify-content: flex-start;
      }
    }

    &.button-wrapper--align-center {
      & > div {
        justify-content: center;
      }
    }

    &.button-wrapper--align-right {
      & > div {
        justify-content: flex-end;
      }
    }

    &.button-wrapper--align-outer {
      & > div {
        justify-content: space-between;
      }
    }

    &.button-wrapper--full {
      & > div {
        display: flex;

        & :deep(> *) {
          flex: 1 100%;
        }
      }
    }
  }
}
</style>
