<template>
  <mc-screen class="mc-stats-screen-last-log">
    <mc-log-drawer :log="log" loop />
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import McScreen from '../../Screen.vue';
import McLogDrawer from '../../LogDrawer.vue';
import useCore from '../../../composables/useCore';

const { core } = useCore();

const log = computed(() => core.currentPlayer.lastLog);
</script>
