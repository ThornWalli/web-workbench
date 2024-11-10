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

<script setup>
import { computed, onMounted } from 'vue';
import McTextDrawer from './TextDrawer.vue';
import RoundLog from '../classes/RoundLog';
import { LINE_GROUP } from '../classes/RoundComplete';

const $emit = defineEmits(['complete']);

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

// const lines = computed(() => {
//   // const city = core.currentPlayer.city;
//   console.log('currentLog', core.currentPlayer.currentLog);
//   return [
//     [
//       { content: 'Log - Runde: ', color: 'dark-yellow' },
//       { content: String(core.round).padStart(3, '0'), color: 'white' }
//     ],
//     {
//       content: ''.padEnd(40, '-'),
//       color: 'white'
//     },
//     { spacer: true },
//     core.currentPlayer.currentLog.lines
//   ];
// });

const filterEmptyGroups = computed(() => {
  return ($props.log?.lines || []).filter(({ lines }) => lines.length);
});

const availableTypes = computed(() => {
  const groups = filterEmptyGroups.value.map(({ group }) => group);
  return Object.values(LINE_GROUP).filter(key => groups.includes(key));
});

const types = ref([]);
const resetTypes = () => {
  types.value = [...availableTypes.value];
};

resetTypes();

const currentType = ref();

onMounted(() => {
  currentType.value = types.value.shift();
});

const lines = computed(() => {
  if (!$props.log) {
    return [
      { spacer: true },
      {
        class: 'blinking-error',
        align: 'center',
        color: 'dark-red',
        content: 'Es ist kein log verfügbar!'
      },
      { spacer: true }
    ];
  }
  return filterEmptyGroups.value
    .filter(line => line.group === currentType.value)
    .reduce((acc, { lines }) => {
      acc.push(...lines);
      return acc;
    }, [])
    .concat(
      [
        !$props.animate && { spacer: true },
        {
          ok: true
        }
      ].filter(Boolean)
    );
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
