<template>
  <transition :name="'text-drawer-change'" mode="out-in">
    <mc-text-drawer
      v-if="lines"
      :key="currentType"
      class="mc-log-drawer"
      :animate="animate"
      :lines="lines"
      prompt
      @complete="onCompleteTextDrawer" />
  </transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import McTextDrawer from './TextDrawer.vue';
import RoundLog from '../classes/RoundLog';
import { LINE_GROUP } from '../types';
import { CONSOLE_ALIGN } from '../observables/roundComplete/types';
import type { ConsoleGroupLines } from '../observables/roundComplete/types';

const $emit = defineEmits<{
  (e: 'complete'): void;
}>();

const $props = defineProps({
  animate: {
    type: Boolean,
    default: false
  },
  loop: {
    type: Boolean,
    default: false
  },
  log: {
    type: RoundLog,
    default: null
  },
  animatePageChange: {
    type: Boolean,
    default: true
  }
});

const filterEmptyGroups = computed(() => {
  return ($props.log?.lines || []).filter(({ lines }) => lines.length);
});

const availableTypes = computed(() => {
  const groups = filterEmptyGroups.value.map(({ group }) => group);
  return Object.values(LINE_GROUP).filter(key => groups.includes(key));
});

const types = ref<LINE_GROUP[]>([]);
const resetTypes = () => {
  types.value = [...availableTypes.value];
};

resetTypes();

const currentType = ref();

onMounted(() => {
  currentType.value = types.value.shift();
});

const lines = computed<ConsoleGroupLines>(() => {
  const lines: ConsoleGroupLines = [];

  if (!$props.log) {
    lines.push(
      { spacer: true },
      {
        class: 'blinking-error',
        align: CONSOLE_ALIGN.CENTER,
        color: 'dark-red',
        content: 'Es ist kein log verfügbar!'
      },
      { spacer: true }
    );
  }

  lines.push(
    ...filterEmptyGroups.value
      .filter(line => line.group === currentType.value)
      .reduce<ConsoleGroupLines>((acc, { lines }) => {
        acc.push(...lines);
        return acc;
      }, [])
  );

  if (!$props.animate) {
    lines.push({ spacer: true });
  }

  lines.push({
    ok: true
  });

  return lines;
});

const onCompleteTextDrawer = () => {
  if (!types.value.length && $props.loop) {
    resetTypes();
  }
  const type = types.value.shift();
  if (type) {
    currentType.value = type;
  } else {
    $emit('complete');
  }
};
</script>

<style lang="postcss" scoped>
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
