<template>
  <i
    class="wb-env-atom-cursor"
    :style="style"
    :class="styleClasses"
  >
    <component :is="svg" />
  </i>
</template>

<script>

import { ipoint, IPoint } from '@js-basics/vector';
import { PointerA, CURSOR_TYPES } from '@/web-workbench/classes/Cursor';
import domEvents from '@/web-workbench/services/domEvents';
import { touchEvent } from '@/web-workbench/services/dom';
import SvgCursorPointer1 from '@/assets/svg/cursor/pointer.svg?component';
import SvgCursorPointer2 from '@/assets/svg/cursor/pointer_mooncity.svg?component';
import SvgCursorWait from '@/assets/svg/cursor/wait.svg?component';
import SvgCursorCrosshair from '@/assets/svg/cursor/crosshair.svg?component';

export default {
  props: {
    parentLayout: {
      type: Object,
      default () {
        return {
          position: ipoint(5, 5)
        };
      }
    },
    cursor: {
      type: Object,
      default () {
        return new PointerA();
      }
    },
    offset: {
      type: IPoint,
      default () {
        return ipoint();
      }
    }
  },
  data () {
    return {
      position: ipoint(),
      subscriptions: null,
      animationFrame: null
    };
  },
  computed: {
    svg () {
      return {
        [CURSOR_TYPES.POINTER_1]: SvgCursorPointer1,
        [CURSOR_TYPES.POINTER_2]: SvgCursorPointer2,
        [CURSOR_TYPES.WAIT]: SvgCursorWait,
        [CURSOR_TYPES.CROSSHAIR]: SvgCursorCrosshair
      }[this.cursor.name];
    },
    style () {
      return Object.assign(this.cursor.toCSSVars(), {
        '--position-x': `${this.position.x}px`,
        '--position-y': `${this.position.y}px`
      });
    },
    styleClasses () {
      return {
        [`cursor--${this.cursor.name}`]: this.cursor.name
      };
    }
  },
  mounted () {
    this.subscriptions = [
      domEvents.getPointerMove().subscribe(this.onPointerMove)
    ];
  },
  unmounted () {
    this.subscriptions.forEach(subscription => !subscription.unsubscribe());
  },
  methods: {
    onPointerMove (e) {
      touchEvent(e);
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = window.requestAnimationFrame(() => {
        this.position = ipoint(() => Math.round(Math.min(Math.max(ipoint(e) - this.parentLayout.position - this.offset, 0), this.parentLayout.size)));
      });
    }
  }
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

  &.cursor--crosshair {
    & svg {
      transform: translate(-50%, -50%);

      & .crosshair__center {
        fill: var(--focusColor, #000);

        /* transform: scale(var(--focusSize)) translate(-50%, -50%); */
        transform: translate(1px, 1px) translate(calc(50% + -50% * var(--focusSize)), calc(50% + -50% * var(--focusSize))) scale(var(--focusSize));

        /* transform-origin: center; */
      }

    }
  }

}
</style>
