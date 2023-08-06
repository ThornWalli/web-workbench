<template>
  <i
    class="note"
    :style="style"
    :class="styleClasses"
    :data-time="time"
    :data-note="note"
  >
    <svg-note />
  </i>
</template>

<script>

import { ipoint } from '@js-basics/vector';
import SvgNote from '../../assets/svg/note.svg?component';

export const DIMENSION = ipoint(26, 33);

export default {
  components: {
    SvgNote
  },
  props: {
    note: {
      type: String,
      default: 'C4'
    },
    time: {
      type: String,
      default: '1n'
    }
  },
  computed: {
    extend () {
      return this.note && /([a-z]{2}).*/.test(this.note.toLowerCase());
    },
    style () {
      return { ...DIMENSION.toCSSVars('dimension') };
    },
    styleClasses () {
      return {
        extend: this.extend,
        pause: !this.note
      };
    }
  }
};

</script>

<style lang="postcss" scoped>

.note {
  display: flex;
  width: 100%;
  height: calc(var(--dimension-note-y) * 1px);

    &.extend {
      & :deep(.extend) {
        display: block;
      }
    }

  & svg {
    fill: #fff;

      & :deep() {
        /* empty */

        & .whole-pause,
        & .half-pause,
        & .divide-pause {
          display: none;
        }

        & .divide-pause > *,
        & .whole-pause > * {
          display: none;
        }

        & .lines > * {
          display: none;
        }

        & .bindings {
          display: none;
        }

        & .whole {
          display: none;
        }

        & .divide {
        display: none;
        }

        & .extend {
          display: none;
        }

        & .foreground {
          display: none;
          fill: #05a !important;
        }

      }
  }

  &.pause {
    &[data-time="1n"] {
      & :deep() {
        & .whole-pause {
          display: block;
        }
      }
    }

    &[data-time="2n"] {
      & :deep() {
        & .half-pause {
          display: block;
        }
      }
    }

    &[data-time="4n"] {
      & :deep() {
        & .divide-pause, & .line,
        & .divide-pause > .line1 {
          display: block;
        }

        transform:scaleX(-1)
      }
    }

    &[data-time="8n"] {
      & :deep() {
        & .divide-pause, & .line,
        & .divide-pause > .line1 {
          display: block;
        }
      }
    }

    &[data-time="16n"] {
      transform: translateY(50%);

      & :deep() {
        & .divide-pause, & .line,
        & .divide-pause > .line1,
        & .divide-pause > .line2 {
          display: block;
        }
      }
    }

    &[data-time="32n"] {
      transform: translateY(75%);

      & :deep() {
        & .divide-pause, & .line,
        & .divide-pause > .line1,
        & .divide-pause > .line2,
        & .divide-pause > .line3 {
          display: block;
        }
      }
    }

    &[data-time="64n"] {
      transform: translateY(100%);

      & :deep() {
        & .divide-pause, & .line,
        & .divide-pause > .line1,
        & .divide-pause > .line2,
        & .divide-pause > .line3,
        & .divide-pause > .line4 {
          display: block;
        }
      }
    }
  }

  &:not(.pause) {
    &[data-time="1n"] {
      & :deep() {
        & .whole, & .foreground {
          display: block;
        }
      }
    }

    &[data-time="2n"] {
      & :deep() {
        & .divide, & .line {
          display: block;
        }

        & .foreground {
          display: block;
        }
      }
    }

    &[data-time="4n"] {
      & :deep() {
        & .divide, & .line {
          display: block;
        }
      }
    }

    &[data-time="8n"] {
      & :deep() {
        & .divide, & .line,
        & .lines > .line1 {
          display: block;
        }
      }
    }

    &[data-time="16n"] {
      & :deep() {
        & .divide, & .line,
        & .lines > .line1,
        & .lines > .line2 {
          display: block;
        }
      }
    }

    &[data-time="32n"] {
      & :deep() {
        & .divide, & .line,
        & .lines > .line1,
        & .lines > .line2,
        & .lines > .line3 {
          display: block;
        }
      }
    }

    &[data-time="64n"] {
      & :deep() {
        & .divide, & .line,
        & .lines > .line1,
        & .lines > .line2,
        & .lines > .line3,
        & .lines > .line4 {
          display: block;
        }
      }
    }
  }

}

</style>
