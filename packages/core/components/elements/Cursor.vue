<template>
  <i
    v-for="(svg, index) in svgs"
    :key="index"
    :data-index="index"
    class="wb-env-element-cursor"
    :style="style"
    :class="styleClasses">
    <component :is="svg" />
  </i>
</template>

<script lang="ts" setup>
import { IPoint, ipoint } from '@js-basics/vector';
import type { NormalizedPointerEvent } from '../../services/dom';
import { PointerA, CURSOR_TYPES } from '../../classes/Cursor';
import domEvents from '../../services/domEvents';

import SvgCursorPointer1 from '../../assets/svg/cursor/pointer.svg?component';
import SvgCursorPointerMoonCity from '../../assets/svg/cursor/pointer_mooncity.svg?component';
import SvgCursorWait from '../../assets/svg/cursor/wait.svg?component';
import SvgCursorCrosshairPrimary from '../../assets/svg/cursor/crosshair_primary.svg?component';
import SvgCursorCrosshairSecondary from '../../assets/svg/cursor/crosshair_secondary.svg?component';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Subscription } from 'rxjs';

const $props = defineProps({
  parentLayout: {
    type: Object,
    default() {
      return {
        position: ipoint(5, 5)
      };
    }
  },
  cursor: {
    type: Object,
    default() {
      return new PointerA();
    }
  },
  offset: {
    type: IPoint,
    default() {
      return ipoint(0, 0);
    }
  }
});

const position = ref(ipoint(0, 0));
const subscriptions = new Subscription();
let animationFrame: number;

const svgs = computed(() => {
  return {
    [CURSOR_TYPES.POINTER_1]: [SvgCursorPointer1],
    [CURSOR_TYPES.POINTER_MOONCITY]: [SvgCursorPointerMoonCity],
    [CURSOR_TYPES.WAIT]: [SvgCursorWait],
    [CURSOR_TYPES.CROSSHAIR]: [
      SvgCursorCrosshairPrimary,
      SvgCursorCrosshairSecondary
    ]
  }[$props.cursor.name];
});

const style = computed(() => {
  return Object.assign($props.cursor.toCSSVars(), {
    '--position-x': `${position.value.x}px`,
    '--position-y': `${position.value.y}px`
  });
});

const styleClasses = computed(() => {
  return {
    [`cursor-${$props.cursor.name}`]: $props.cursor.name
  };
});

onMounted(() => {
  subscriptions.add(domEvents.pointerMove$.subscribe(onPointerMove));
});

onUnmounted(() => {
  subscriptions.unsubscribe();
});

const onPointerMove = (e: NormalizedPointerEvent) => {
  window.cancelAnimationFrame(animationFrame);
  animationFrame = window.requestAnimationFrame(() => {
    const offset = $props.offset as IPoint & number;
    position.value = ipoint(() =>
      Math.round(
        Math.min(
          Math.max(ipoint(e.x, e.y) - $props.parentLayout.position - offset, 0),
          $props.parentLayout.size
        )
      )
    );
  });
};
</script>

<style lang="postcss" scoped>
.wb-env-element-cursor {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--dimension-x) * 1px);
  height: calc(var(--dimension-y) * 1px);
  pointer-events: none;
  user-select: none;
  transform: translate(var(--position-x, 50%), var(--position-y, 50%));
  transform-origin: left top;

  & svg {
    position: absolute;
    top: 0;
    left: 0;
    display: block;

    &:first-child {
      position: relative;
    }
  }

  &.cursor-crosshair {
    &[data-index='0'] {
      mix-blend-mode: exclusion;
    }

    & svg {
      top: 0;
      left: 0;
      fill: white;
      transform: translate(-50%, -50%);

      & :deep(.crosshair-center) {
        fill: var(--color, #000);
        transform: translate(1px, 1px)
          translate(
            calc(50% + -50% * var(--size)),
            calc(50% + -50% * var(--size))
          )
          scale(var(--size));
      }
    }
  }
}
</style>
