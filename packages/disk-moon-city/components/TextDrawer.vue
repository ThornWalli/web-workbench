<template>
  <div
    class="mc-text-drawer"
    :class="{ [`start-align-${startAlign}`]: true }"
    @click="onPointerDown">
    <wrapper-component :lines="currentLines" />
  </div>
</template>

<script setup>
import { defineComponent, markRaw, onMounted, onUnmounted, ref } from 'vue';
import McText from './Text.vue';
import {
  bufferCount,
  concatMap,
  from,
  fromEvent,
  Observable,
  of,
  Subscription,
  toArray
} from 'rxjs';
import useAudioControl from '../composables/useAudioControl';
import useI18n from '../composables/useI18n';
import { nextTick } from 'process';

const { t } = useI18n();
const { playSfx } = useAudioControl();

const currentLines = ref([]);
const resolver = ref(null);
const $emit = defineEmits(['complete']);

const $props = defineProps({
  loop: {
    type: Boolean,
    default: false
  },
  lines: {
    type: Array,
    default() {
      return [
        ...Array(11)
          .fill()
          .map((_, i) => ({ content: i + 1 }))
      ];
    }
  },
  prompt: {
    type: Boolean,
    default: false
  },
  animate: {
    type: Boolean,
    default: false
  },
  startAlign: {
    type: String,
    default: START_ALIGN.TOP
  }
});

const onPointerDown = e => {
  e.preventDefault();
  resolver.value && resolver.value();
  return false;
};

const subscription = new Subscription();

onMounted(() => {
  if ($props.prompt) {
    subscription.add(
      fromEvent(document, 'mousedown').subscribe(onPointerDown),
      fromEvent(document, 'touchstart').subscribe(onPointerDown)
    );
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

function parseLines(lines) {
  let last = null;
  return lines.reduce((result, line) => {
    if (Array.isArray(line)) {
      result.push({
        component: 'div',
        data: {
          lines: parseLines(line)
        }
      });
      last = 'row';
    } else {
      result.push({
        component: markRaw(McText),
        data: { ...line, sibling: last === 'text', embed: false }
      });
      last = 'text';
    }
    return result;
  }, []);
}

const startLog = () => {
  const total = $props.lines.length;
  let count = 0;
  const MAX_LINES = 10;
  const isPrompt = $props.prompt;
  const hasPages = total > MAX_LINES + 1 && total / MAX_LINES > 1;
  return from($props.lines).pipe(
    hasPages ? bufferCount(MAX_LINES) : source => source.pipe(toArray()),
    concatMap(lines => {
      count += lines.length;
      let prompt = count !== total;
      const hasNext = lines.length === MAX_LINES && count !== total;
      if (hasNext || $props.loop) {
        if (!hasNext) {
          lines.push(...Array(MAX_LINES - lines.length).fill({}));
        }
        lines.push({
          class: 'next-animation',
          content: t('text_drawer.label.next'),
          color: 'yellow'
        });
      }

      return of(lines).pipe(
        concatMap(lines => {
          currentLines.value = [];
          return from(parseLines(lines)).pipe(
            $props.animate
              ? concatMap(line => {
                  return new Promise(resolve => {
                    setTimeout(() => {
                      nextTick(() => {
                        resolve(line);
                      });
                    }, 125);
                  });
                })
              : source => source,
            concatMap(async line => {
              await playSfx('text_drawer_write');
              currentLines.value.push(line);
            }),
            toArray()
          );
        }),
        concatMap(() => {
          playSfx('text_drawer_end');
          if ($props.loop && !prompt) {
            return new Observable(observer => {
              resolver.value = () => {
                observer.next();
              };
            }).pipe(concatMap(() => startLog()));
          } else if (prompt) {
            return new Promise(resolve => {
              resolver.value = () => {
                resolve();
              };
            });
          } else {
            return Promise.resolve();
          }
        })
      );
    }),
    toArray(),
    concatMap(() => {
      if (isPrompt) {
        currentLines.value.push(
          ...parseLines([
            {
              content: t('text_drawer.label.ok'),
              color: 'green',
              class: 'ok-animation'
            }
          ])
        );

        return new Promise(resolve => {
          resolver.value = () => {
            playSfx('text_drawer_end');
            resolve();
          };
        });
      } else {
        return Promise.resolve();
      }
    })
  );
};

onMounted(() => {
  startLog().subscribe({
    complete: () => {
      $emit('complete');
    }
  });
});
</script>

<script>
export const START_ALIGN = {
  TOP: 'top',
  BOTTOM: 'bottom'
};

const WrapperComponent = defineComponent({
  props: {
    column: {
      type: Boolean,
      default: false
    },
    lines: {
      type: Array,
      default: null
    }
  },
  render() {
    return this.lines.map(line => {
      if (line.data.spacer) {
        return h('div', { class: 'spacer' });
      } else if (line.data.lines) {
        return h(line.component, { class: this.column ? 'col' : 'row' }, [
          h(WrapperComponent, { column: true, lines: line.data.lines })
        ]);
      } else {
        return h(line.component, line.data);
      }
    });
  }
});
</script>

<style lang="postcss" scoped>
.mc-text-drawer {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  height: 100%;

  & > * {
    pointer-events: none;
  }

  & .row,
  & :deep(.row),
  & .col,
  & :deep(.col) {
    display: flex;
  }

  & .row,
  & :deep(.row) {
    width: 100%;
    min-height: 14px;
  }

  & .spacer,
  & :deep(.spacer) {
    flex: 1;
  }

  &.start-align-top {
    justify-content: flex-start;
  }

  &.start-align-bottom {
    justify-content: flex-end;
  }
}

:deep(.next-animation) {
  & > div {
    animation: next 1s infinite;
    animation-timing-function: steps(6);
  }
}

:deep(.ok-animation) {
  & > div {
    animation: ok 1s infinite;
    animation-timing-function: steps(6);
  }
}

@keyframes next {
  0% {
    color: var(--mc-color-white);
  }

  9% {
    color: var(--mc-color-white);
  }

  10% {
    color: var(--mc-color-yellow);
  }

  100% {
    color: var(--mc-color-black);
  }
}

@keyframes ok {
  0% {
    color: var(--mc-color-white);
  }

  9% {
    color: var(--mc-color-white);
  }

  10% {
    color: var(--mc-color-green);
  }

  100% {
    color: var(--mc-color-black);
  }
}
</style>
