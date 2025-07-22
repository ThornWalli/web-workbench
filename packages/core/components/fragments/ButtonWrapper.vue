<template>
  <div
    class="wb-env-fragment-button-wrapper"
    :class="styleClasses"
    :style="{
      '--columns': columns
    }">
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const defaultAlign = ALIGN.LEFT;
const defaultDirection = DIRECTION.HORIZONTAL;

const defaultType = 'flex';

const $props = defineProps<{
  full?: boolean;
  align?: `${ALIGN}`;
  direction?: `${DIRECTION}`;
  embed?: boolean;
  type?: 'grid' | 'flex';
  columns?: number;
}>();

const styleClasses = computed(() => {
  return {
    [`align-${$props.align || defaultAlign}`]: true,
    [`direction-${$props.direction || defaultDirection}`]: true,
    [`type-${$props.type || defaultType}`]: true,
    full: $props.full ?? false,
    embed: $props.embed ?? false
  };
});
</script>

<script lang="ts">
export enum ALIGN {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  OUTER = 'outer'
}

export enum DIRECTION {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}
</script>

<style lang="postcss" scoped>
.wb-env-fragment-button-wrapper {
  --margin: var(--default-element-margin);

  /* margin: 0 var(--margin); */

  &:not(.embed) {
    .wb-env-fragment-form > & {
      margin: calc(var(--default-element-margin) * 2);
    }
  }

  &.embed {
    .wb-env-fragment-form > & {
      margin-top: calc(var(--default-element-margin) * 2);
    }
  }

  &.type-flex {
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
      align-items: center;
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

  &.type-grid {
    & > div {
      display: grid;
      gap: var(--default-element-margin);
    }

    &.direction-vertical {
      & > div {
        grid-template-columns: 1fr;
      }
    }

    &.direction-horizontal {
      & > div {
        grid-template-columns: repeat(var(--columns, 3), auto);
      }
    }
  }
}
</style>
