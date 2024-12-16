<template>
  <mc-log-drawer
    v-if="currentLog"
    class="mc-overview-round-start"
    :log="currentLog"
    global-click
    prompt
    start-align="bottom"
    animate
    @complete="$emit('round-start')" />
</template>

<script setup>
import McLogDrawer from '../LogDrawer.vue';
import useCore from '../../composables/useCore';
import { onMounted } from 'vue';

const { core } = useCore();

const currentLog = computed(() => core.currentPlayer.currentLog);
onMounted(() => {
  if (!currentLog.value) {
    $emit('round-start');
  }
});
const $emit = defineEmits(['round-start']);
</script>
