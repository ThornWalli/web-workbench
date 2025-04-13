<template>
  <i class="wb-env-atom-cursor" :style="style" :class="styleClasses">
    <component :is="svg" />
  </i>
</template>

<script setup>
import { ipoint, IPoint } from '@js-basics/vector';
import { touchEvent } from '../../services/dom';
import { PointerA, CURSOR_TYPES } from '../../classes/Cursor';
import domEvents from '../../services/domEvents';

import SvgCursorPointer1 from '../../assets/svg/cursor/pointer.svg?component';
import SvgCursorPointerMoonCity from '../../assets/svg/cursor/pointer_mooncity.svg?component';
import SvgCursorWait from '../../assets/svg/cursor/wait.svg?component';
import SvgCursorCrosshair from '../../assets/svg/cursor/crosshair.svg?component';
import { computed, onMounted, onUnmounted, ref } from 'vue';

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
      return ipoint();
    }
  }
});

const position = ref(ipoint());
const subscriptions = ref(null);
const animationFrame = ref(null);

const svg = computed(() => {
  return {
    [CURSOR_TYPES.POINTER_1]: SvgCursorPointer1,
    [CURSOR_TYPES.POINTER_MOONCITY]: SvgCursorPointerMoonCity,
    [CURSOR_TYPES.WAIT]: SvgCursorWait,
    [CURSOR_TYPES.CROSSHAIR]: SvgCursorCrosshair
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
  subscriptions.value = [domEvents.getPointerMove().subscribe(onPointerMove)];
});

onUnmounted(() => {
  subscriptions.value.forEach(subscription => !subscription.unsubscribe());
});

const onPointerMove = e => {
  touchEvent(e);
  window.cancelAnimationFrame(animationFrame.value);
  animationFrame.value = window.requestAnimationFrame(() => {
    position.value = ipoint(() =>
      Math.round(
        Math.min(
          Math.max(ipoint(e) - $props.parentLayout.position - $props.offset, 0),
          $props.parentLayout.size
        )
      )
    );
  });
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-cursor {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  user-select: none;
  transform: translate(var(--position-x, 50%), var(--position-y, 50%));

  & svg {
    display: block;
  }

  &.cursor-crosshair {
    & svg {
      transform: translate(-50%, -50%);

      & :deep(.crosshair-center) {
        fill: var(--color, #000);

        /* transform: scale(var(--size)) translate(-50%, -50%); */
        transform: translate(1px, 1px)
          translate(
            calc(50% + -50% * var(--size)),
            calc(50% + -50% * var(--size))
          )
          scale(var(--size));

        /* transform-origin: center; */
      }
    }
  }
}
</style>
