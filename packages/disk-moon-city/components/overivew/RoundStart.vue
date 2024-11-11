<template>
  <mc-log-drawer
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

const { core } = useCore();

const currentLog = computed(() => core.currentPlayer.currentLog);

defineEmits(['round-start']);
</script>
