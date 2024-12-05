<template>
  <div
    class="mc-text-drawer"
    :class="{ [`start-align-${startAlign}`]: true }"
    @click="onPointerDown">
    <transition name="text-drawer-change" mode="out-in">
      <div :key="test">
        <wrapper-component :lines="currentLines" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  computed,
  defineComponent,
  markRaw,
  onMounted,
  onUnmounted,
  ref,
  nextTick
} from 'vue';
import McText from './Text.vue';
import {
  concatMap,
  from,
  fromEvent,
  map,
  Observable,
  Subscription,
  tap,
  toArray
} from 'rxjs';
import useAudioControl from '../composables/useAudioControl';
import useI18n from '../composables/useI18n';
import { fillTextStart } from '../utils/string';
const test = computed(() => String(currentPage.value));
const { t } = useI18n();
const { playSfx } = useAudioControl();

const currentLines = ref([]);
const resolver = ref(null);
const $emit = defineEmits(['complete']);

const locked = ref(false);

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
  globalClick: {
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
  if ($props.globalClick) {
    subscription.add(
      fromEvent(document, 'mousedown').subscribe(onPointerDown),
      fromEvent(document, 'touchstart').subscribe(onPointerDown)
    );
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

function parseLines(lines, keyPrefix = '') {
  let last = null;
  return lines.reduce((result, line, index) => {
    if (Array.isArray(line)) {
      result.push({
        component: 'div',
        data: {
          key: `${keyPrefix}-${index}`,
          lines: parseLines(line, keyPrefix)
        }
      });
      last = 'row';
    } else {
      result.push({
        component: markRaw(McText),
        data: {
          key: `${keyPrefix}-${index}`,
          ...line,
          sibling: last === 'text',
          embed: false
        }
      });
      last = 'text';
    }
    return result;
  }, []);
}

const MAX_LINES = 10;

const preparePages = lines => {
  // pages by break
  const breakPages = lines.reduce(
    (result, line) => {
      if (line.break) {
        result.push([]);
      } else {
        result[result.length - 1].push(line);
      }
      return result;
    },
    [[]]
  );

  const pages = breakPages.reduce((result, page) => {
    if (page.length > MAX_LINES) {
      const pages = page.reduce((result, line, index) => {
        if (index % MAX_LINES === 0) {
          result.push([]);
        }
        result[result.length - 1].push(line);
        return result;
      }, []);
      result.push(...pages);
    } else {
      result.push(page);
    }
    return result;
  }, []);

  return pages;
};

const currentPage = ref(0);

const start = () => {
  const pages = preparePages($props.lines);
  const hasPages = pages.length > 1;
  return from(pages).pipe(
    concatMap((lines, index) => {
      locked.value = true;
      const hasNext = index < pages.length - 1 && hasPages;
      currentPage.value = index;

      if ((hasNext || $props.loop) && hasPages) {
        if (MAX_LINES - lines.length && !lines.find(line => line.spacer)) {
          lines.push({ spacer: true });
          // lines.push(...Array(MAX_LINES - lines.length).fill({}));
        }
        lines.push([
          {
            class: 'blinking-yellow',
            content: t('text_drawer.label.next'),
            color: 'yellow',
            background: true
          },
          { spacer: true },
          {
            content: `${fillTextStart(index + 1, 2, '0')} / ${fillTextStart(pages.length, 2, '0')}`,
            color: 'white',
            background: true
          }
        ]);
      }

      currentLines.value = [];
      return from(parseLines(lines, String(index))).pipe(
        writeLine($props.animate),
        end(hasNext),
        toArray(),
        prompt(hasNext),
        tap(() => playSfx('text_drawer_end'))
      );
    })
  );
};

const end = hasNext => source =>
  source.pipe(
    concatMap(() => {
      if ($props.loop && !hasNext) {
        return new Observable(observer => {
          locked.value = false;
          resolver.value = () => {
            observer.next();
          };
        }).pipe(
          tap(() => playSfx('text_drawer_end')),
          concatMap(() => start())
        );
      } else if (hasNext) {
        const { promise, resolve } = Promise.withResolvers();
        locked.value = false;
        resolver.value = resolve;
        return promise;
      } else {
        return Promise.resolve();
      }
    })
  );

const prompt = hasNext => source =>
  source.pipe(
    concatMap(() => {
      if (!hasNext && $props.prompt) {
        currentLines.value.push(
          ...parseLines([
            {
              content: t('text_drawer.label.ok'),
              color: 'green',
              class: 'ok-animation'
            }
          ])
        );

        const { promise, resolve } = Promise.withResolvers();

        locked.value = false;
        resolver.value = resolve;

        return promise;
      } else {
        return Promise.resolve();
      }
    })
  );

onMounted(() => {
  start().subscribe({
    complete: () => {
      $emit('complete');
    }
  });
});

const writeLine = animate => source => {
  if (animate) {
    source = source.pipe(
      concatMap(line => {
        const { promise, resolve } = Promise.withResolvers();
        setTimeout(() => {
          nextTick(() => {
            resolve(line);
          });
        }, 125);
        return promise;
      }),
      concatMap(line => playSfx('text_drawer_write').promise.then(() => line))
    );
  }
  return source.pipe(
    map(line => {
      currentLines.value.push(line);
      return line;
    }),
    toArray()
  );
};
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
  --write-valign: flex-start;

  width: 100%;
  height: 100%;
  padding: 0 2px;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 0;
    justify-content: var(--write-valign);
    height: 100%;
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

    /* padding-right: 2px; */
  }

  & .spacer,
  & :deep(.spacer) {
    flex: 1;
  }

  &.start-align-top {
    --write-valign: flex-start;
  }

  &.start-align-bottom {
    --write-valign: flex-end;
  }
}

:deep(.blinking-yellow) {
  & > div {
    animation: blinking-yellow 1s infinite;
    animation-timing-function: steps(6);
  }
}

:deep(.blinking-red) {
  & > div {
    animation: blinking-red 1s infinite;
    animation-timing-function: steps(6);
  }
}

:deep(.blinking-blue) {
  & > div {
    animation: blinking-blue 1s infinite;
    animation-timing-function: steps(6);
  }
}

:deep(.blinking-error) {
  & > div {
    animation: blinking-error 1s infinite;
    animation-timing-function: steps(6);
  }
}

:deep(.blinking-successfully) {
  & > div {
    animation: blinking-successfully 1s infinite;
    animation-timing-function: steps(6);
  }
}

:deep(.blinking-unsuccessful) {
  & > div {
    animation: blinking-unsuccessful 1s infinite;
    animation-timing-function: steps(6);
  }
}

:deep(.ok-animation) {
  & > div {
    animation: ok 1s infinite;
    animation-timing-function: steps(6);
  }
}

.text-drawer-change-enter-active,
.text-drawer-change-leave-active {
  transition: opacity 0.2s;
  transition-timing-function: steps(5);
}

.text-drawer-change-leave-active {
  transition-duration: 0.1s;
}

.text-drawer-change-enter-from,
.text-drawer-change-leave-to {
  opacity: 0;
}
</style>
