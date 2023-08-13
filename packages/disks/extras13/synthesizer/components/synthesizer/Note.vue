<template>
  <i
    class="note"
    :style="style"
    :class="styleClasses"
    :data-time="time"
    :data-note="note"
    @click="$emit('click', $event, { time, note })">
    <svg-note />
  </i>
</template>

<script>
import { ipoint } from '@js-basics/vector';
import SvgNote from '../../assets/svg/note.svg?component';

export const DIMENSION = ipoint(27, 33);

export default {
  components: {
    SvgNote
  },
  props: {
    last: {
      type: Object,
      default: null
    },
    next: {
      type: Object,
      default: null
    },
    note: {
      type: String,
      default: 'C4'
    },
    time: {
      type: String,
      default: '1n'
    },
    bindings: {
      type: Boolean,
      default: false
    },
    position: {
      type: Number,
      default: 0
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    extend() {
      return this.note && /([a-z]{2}).*/.test(this.note.toLowerCase());
    },
    style() {
      return {
        '--position': this.position,
        ...DIMENSION.toCSSVars('dimension')
      };
    },
    styleClasses() {
      return {
        selected: this.selected,
        bindings: this.bindings,
        dot: this.note?.includes('.'),
        extend: this.extend,
        pause: !this.note,
        'has-next': this.hasNext,
        'has-last': this.hasLast
      };
    },

    hasNext() {
      return this.next?.note === this.note && this.next?.time === this.time;
    },
    hasLast() {
      return this.last?.note === this.note && this.last?.time === this.time;
    }
  }
};
</script>

<style lang="postcss" scoped>
.note {
  display: flex;

  /* width: 100%; */
  height: calc(var(--dimension-note-y) * 1px);

  &.extend {
    & :deep(.extend) {
      display: block;
    }
  }

  &.selected {
    filter: invert();
  }

  & svg {
    fill: #fff;

    & :deep() {
      /* empty */

      & .double-pause,
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

      & .bindings > * {
        display: none;
      }

      & .double,
      & .whole,
      & .divide,
      & .extend,
      & .dot {
        display: none;
      }

      & .foreground {
        display: none;
        fill: #05a !important;
      }
    }
  }

  &.pause {
    &[data-time^='1n'],
    &[data-time^='1m'] {
      & :deep() {
        & .whole-pause {
          display: block;
        }
      }
    }

    &[data-time^='2m'] {
      & :deep() {
        & .double-pause {
          display: block;
        }
      }
    }

    &[data-time^='2n'] {
      & :deep() {
        & .half-pause {
          display: block;
        }
      }
    }

    &[data-time^='4n'] {
      & :deep() {
        & .divide-pause,
        & .line,
        & .divide-pause > .line1 {
          display: block;
        }

        & > svg {
          transform: scaleX(-1);
        }
      }
    }

    &[data-time^='8n'] {
      & :deep() {
        & .divide-pause,
        & .line,
        & .divide-pause > .line1 {
          display: block;
        }
      }
    }

    &[data-time^='16n'] {
      transform: translateY(50%);

      & :deep() {
        & .divide-pause,
        & .line,
        & .divide-pause > .line1,
        & .divide-pause > .line2 {
          display: block;
        }
      }
    }

    &[data-time^='32n'] {
      transform: translateY(75%);

      & :deep() {
        & .divide-pause,
        & .line,
        & .divide-pause > .line1,
        & .divide-pause > .line2,
        & .divide-pause > .line3 {
          display: block;
        }
      }
    }

    &[data-time^='64n'] {
      transform: translateY(100%);

      & :deep() {
        & .divide-pause,
        & .line,
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
    &[data-time^='1n'],
    &[data-time^='1m'] {
      & :deep() {
        & .whole,
        & .foreground {
          display: block;
        }
      }
    }

    &[data-time^='2m'] {
      & :deep() {
        & .whole,
        & .foreground,
        & .double {
          display: block;
        }
      }
    }

    &[data-time^='2n'] {
      & :deep() {
        & .divide,
        & .line {
          display: block;
        }

        & .foreground {
          display: block;
        }
      }
    }

    &[data-time^='4n'] {
      & :deep() {
        & .divide,
        & .line {
          display: block;
        }
      }
    }

    &[data-time^='8n'] {
      & :deep() {
        & .divide,
        & .line,
        & .lines > .line1 {
          display: block;
        }
      }

      &.bindings {
        &.has-next {
          & :deep() {
            & .lines > .line1 {
              display: none;
            }

            & .bindings {
              & .bind1-right {
                display: block;
              }
            }
          }
        }

        &.has-last {
          & :deep() {
            & .lines > .line1 {
              display: none;
            }

            & .bindings {
              & .bind1-left {
                display: block;
              }
            }
          }
        }
      }
    }

    &[data-time^='16n'] {
      & :deep() {
        & .divide,
        & .line,
        & .lines > .line1,
        & .lines > .line2 {
          display: block;
        }
      }

      &.bindings {
        &.has-next {
          & :deep() {
            & .lines > .line1,
            & .lines > .line2 {
              display: none;
            }

            & .bindings {
              & .bind1-right,
              & .bind2-right {
                display: block;
              }
            }
          }
        }

        &.has-last {
          & :deep() {
            & .lines > .line1,
            & .lines > .line2 {
              display: none;
            }

            & .bindings {
              & .bind1-left,
              & .bind2-left {
                display: block;
              }
            }
          }
        }
      }
    }

    &[data-time^='32n'] {
      & :deep() {
        & .divide,
        & .line,
        & .lines > .line1,
        & .lines > .line2,
        & .lines > .line3 {
          display: block;
        }
      }

      &.bindings {
        &.has-next {
          & :deep() {
            & .lines > .line1,
            & .lines > .line2,
            & .lines > .line3 {
              display: none;
            }

            & .bindings {
              & .bind1-right,
              & .bind2-right,
              & .bind3-right {
                display: block;
              }
            }
          }
        }

        &.has-last {
          & :deep() {
            & .lines > .line1,
            & .lines > .line2,
            & .lines > .line3 {
              display: none;
            }

            & .bindings {
              & .bind1-left,
              & .bind2-left,
              & .bind3-left {
                display: block;
              }
            }
          }
        }
      }
    }

    &[data-time^='64n'] {
      & :deep() {
        & .divide,
        & .line,
        & .lines > .line1,
        & .lines > .line2,
        & .lines > .line3,
        & .lines > .line4 {
          display: block;
        }
      }

      &.bindings {
        &.has-next {
          & :deep() {
            & .lines > .line1,
            & .lines > .line2,
            & .lines > .line3,
            & .lines > .line4 {
              display: none;
            }

            & .bindings {
              & .bind1-right,
              & .bind2-right,
              & .bind3-right,
              & .bind4-right {
                display: block;
              }
            }
          }
        }

        &.has-last {
          & :deep() {
            & .lines > .line1,
            & .lines > .line2,
            & .lines > .line3,
            & .lines > .line4 {
              display: none;
            }

            & .bindings {
              & .bind1-left,
              & .bind2-left,
              & .bind3-left,
              & .bind4-left {
                display: block;
              }
            }
          }
        }
      }
    }
  }
}
</style>
