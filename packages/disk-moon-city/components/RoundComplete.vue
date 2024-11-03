<template>
  <div class="mc-round-complete">
    <mc-text-drawer
      v-if="lines"
      :key="currentType"
      prompt
      start-align="bottom"
      animate
      :lines="lines"
      @complete="onCompleteTextDrawer" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import McTextDrawer from './TextDrawer.vue';
import useCore from '../composables/useCore';
import { LINE_GROUP } from '../classes/RoundComplete';
const { core } = useCore();

const $emit = defineEmits(['complete']);

const types = [LINE_GROUP.VEHICLE, LINE_GROUP.GENERAL];
const currentType = ref(types.shift());

const lines = computed(() => {
  return core.currentPlayer.currentLog?.lines
    .filter(line => line.group === currentType.value)
    .reduce((acc, { lines }) => {
      acc.push(...lines);
      return acc;
    }, [])
    .concat({
      ok: true
    });
});

const onComplete = () => {
  $emit('complete');
};

const onCompleteTextDrawer = () => {
  const type = types.shift();
  if (type) {
    currentType.value = type;
  } else {
    onComplete();
  }
};

if (!core.currentPlayer.currentLog) {
  onComplete();
}
</script>

<style lang="postcss" scoped>
.mc-overview-round-complete {
  /* empty */
}
</style>
