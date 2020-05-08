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

import { ipoint } from '@js-basics/vector';
import { PointerA, CURSOR_TYPES } from '@/web-workbench/classes/Cursor';
import domEvents from '@/web-workbench/services/domEvents';
import { touchEvent } from '@/web-workbench/services/dom';
import SvgCursorPointer1 from '@/assets/svg/cursor/pointer.svg?vue-template';
import SvgCursorPointer2 from '@/assets/svg/cursor/pointer_mooncity.svg?vue-template';
import SvgCursorWait from '@/assets/svg/cursor/wait.svg?vue-template';
import SvgCursorCrosshair from '@/assets/svg/cursor/crosshair.svg?vue-template';

export default {
  components: {
  },
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
    }
  },
  data () {
    return {
      position: ipoint(),
      subscribtions: null,
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
      return Object.assign(this.cursor.getVars().reduce((result, name) => { result[`--${name}`] = this.cursor[String(name)]; return result; }, {}), {
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
    this.subscribtions = [
      domEvents.getPointerMove().subscribe(this.onPointerMove)
    ];
  },
  destroyed () {
    this.subscribtions.forEach(subscribtion => !subscribtion.unsubscribe());
  },
  methods: {
    onPointerMove (e) {
      touchEvent(e);
      global.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = global.requestAnimationFrame(() => {
        this.position = ipoint(() => Math.min(Math.max(ipoint(e) - this.parentLayout.position, 0), this.parentLayout.size));
      });
    }
  }
};
</script>

<style lang="postcss">
.wb-env-atom-cursor {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 900;
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
