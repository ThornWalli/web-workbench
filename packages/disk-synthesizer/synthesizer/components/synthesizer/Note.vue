<template>
  <span
    v-if="isPaused"
    :class="{
      selected: selected
    }"
    class="pause"
    :data-duration="duration"
    @click="$emit('click', $event, { name })">
    <span />
  </span>
  <i
    v-else
    class="note"
    :style="style"
    :class="styleClasses"
    :data-duration="duration"
    :data-name="name"
    @click="$emit('click', $event, { name })">
    <svg-note />
  </i>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';
import SvgNote from '../../assets/svg/note.svg?component';
import { getNoteScaleIndex } from '../../utils/note';
import { computed } from 'vue';

const DIMENSION = ipoint(27, 33);

const $props = defineProps({
  last: {
    type: Object,
    default: null
  },
  next: {
    type: Object,
    default: null
  },
  name: {
    type: String,
    default: 'C4'
  },
  duration: {
    type: [String, Number],
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
});

const $emit = defineEmits<{
  (e: 'click', event: MouseEvent, note: { name: string }): void;
}>();

const isPaused = computed(() => {
  return /^[\d.]+$/.test(String($props.duration));
});
const extend = computed(() => {
  return $props.name && getNoteScaleIndex($props.name) !== 0;
});
const style = computed(() => {
  return {
    '--position': $props.position,
    ...DIMENSION.toCSSVars('dimension')
  };
});
const styleClasses = computed(() => {
  return {
    selected: $props.selected,
    bindings: $props.bindings,
    dot: $props.name?.includes('.'),
    extend: extend.value,
    pause: !$props.name,
    'has-next': hasNext.value,
    'has-last': hasLast.value
  };
});
const hasNext = computed(() => {
  return (
    $props.next?.name === $props.name &&
    $props.next?.duration === $props.duration
  );
});
const hasLast = computed(() => {
  return (
    $props.last?.name === $props.name &&
    $props.last?.duration === $props.duration
  );
});
</script>

<style lang="postcss" scoped>
.pause {
  --color-foreground: #fff;

  display: flex;
  align-items: center;
  width: 100%;

  &::before,
  &::after {
    display: block;
    width: 2px;
    height: 20px;
    content: '';
    background: var(--color-foreground);
  }

  &.selected {
    filter: invert();
  }

  & span {
    display: block;
    width: 100%;
    height: 2px;
    background: var(--color-foreground);
  }
}

.note {
  display: flex;

  /* width: 100%; */
  height: calc(var(--dimension-note-y) * 1px);

  &.extend {
    & :deep(.extend) {
      display: block;

      /* & > * {
        display: none;

        &:nth-child(3) {
          display: block;
        }
      } */
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
    &[data-duration^='1n'],
    &[data-duration^='1m'] {
      & :deep() {
        & .whole-pause {
          display: block;
        }
      }
    }

    &[data-duration^='2m'] {
      & :deep() {
        & .double-pause {
          display: block;
        }
      }
    }

    &[data-duration^='2n'],
    &[data-duration^='2t'] {
      & :deep() {
        & .half-pause {
          display: block;
        }
      }
    }

    &[data-duration^='4n'],
    &[data-duration^='4t'] {
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

    &[data-duration^='8n'],
    &[data-duration^='8t'] {
      & :deep() {
        & .divide-pause,
        & .line,
        & .divide-pause > .line1 {
          display: block;
        }
      }
    }

    &[data-duration^='16n'],
    &[data-duration^='16t'] {
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

    &[data-duration^='32n'],
    &[data-duration^='32t'] {
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

    &[data-duration^='64n'],
    &[data-duration^='64t'] {
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
    &[data-duration^='1n'],
    &[data-duration^='1m'] {
      & :deep() {
        & .whole,
        & .foreground {
          display: block;
        }
      }
    }

    &[data-duration^='2m'] {
      & :deep() {
        & .whole,
        & .foreground,
        & .double {
          display: block;
        }
      }
    }

    &[data-duration^='2n'],
    &[data-duration^='2t'] {
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

    &[data-duration^='4n'],
    &[data-duration^='4t'] {
      & :deep() {
        & .divide,
        & .line {
          display: block;
        }
      }
    }

    &[data-duration^='8n'],
    &[data-duration^='8t'] {
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

    &[data-duration^='16n'],
    &[data-duration^='16t'] {
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

    &[data-duration^='32n'],
    &[data-duration^='32t'] {
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

    &[data-duration^='64n'],
    &[data-duration^='64t'] {
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
