<template>
  <div
    class="wb-env-element-aspect-ratio-preview"
    :class="{
      portrait: dimension?.x < dimension?.y,
      landscape: dimension?.x > dimension?.y,
      square: dimension?.x === dimension?.y
    }"
    :style="{
      '--aspect-ratio-x': dimension?.x,
      '--aspect-ratio-y': dimension?.y
    }">
    <div>
      <div></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IPoint, Point } from '@js-basics/vector';

defineProps<{
  dimension: (IPoint | Point) & number;
}>();
</script>

<script lang="ts">
export enum COLOR_SELECT_SIZE {
  CUSTOM = 0,
  SMALL = 8,
  SEMI = 12,
  MEDIUM = 16,
  LARGE = 24,
  XLARGE = 32,
  XXLARGE = 48
}
</script>

<style lang="postcss" scoped>
.wb-env-element-aspect-ratio-preview {
  --color-background: var(
    --color-disks-web-paint-aspect-ratio-preview-background,
    #000
  );
  --color-foreground: var(
    --color-disks-web-paint-aspect-ratio-preview-foreground,
    #fff
  );

  .style-filled & {
    --color-background: var(
      --color-disks-web-paint-aspect-ratio-preview-filled-background,
      #fff
    );
    --color-foreground: var(
      --color-disks-web-paint-aspect-ratio-preview-filled-foreground,
      #000
    );
  }

  padding: var(--default-element-margin);
  background: var(--color-background);

  & > div {
    position: relative;
    width: 100%;
    height: 100%;

    & > div {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      aspect-ratio: var(--aspect-ratio-x) / var(--aspect-ratio-y);
      background: var(--color-foreground);
      transform: translate(-50%, -50%);
    }
  }

  &.portrait {
    & > div {
      & > div {
        width: auto;
        height: 100%;
      }
    }
  }
}
</style>
