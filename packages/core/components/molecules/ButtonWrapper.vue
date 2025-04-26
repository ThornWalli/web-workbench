<template>
  <div class="wb-env-molecule-button-wrapper" :class="styleClasses">
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const $props = defineProps({
  full: {
    type: Boolean,
    required: false,
    default: false
  },
  align: {
    type: String,
    required: false,
    validate: (value: string) => {
      return ['center', 'left', 'right', 'outer'].includes(value);
    },
    default: 'left' // center, left, right, outer
  },
  direction: {
    type: String,
    required: false,
    validate: (value: string) => {
      return ['horizontal', 'vertical'].includes(value);
    },
    default: 'horizontal'
  }
});

const styleClasses = computed(() => {
  return {
    [`direction-${$props.direction}`]: true,
    [`align-${$props.align}`]: true,
    full: $props.full
  };
});
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

  &.direction-vertical {
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

  &.direction-horizontal {
    white-space: nowrap;

    &.align-left {
      & > div {
        justify-content: flex-start;
      }
    }

    &.align-center {
      & > div {
        justify-content: center;
      }
    }

    &.align-right {
      & > div {
        justify-content: flex-end;
      }
    }

    &.align-outer {
      & > div {
        justify-content: space-between;
      }
    }

    &.full {
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
