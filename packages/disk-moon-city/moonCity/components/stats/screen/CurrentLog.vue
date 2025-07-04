<template>
  <mc-screen class="mc-stats-screen-current-log">
    <mc-log-drawer v-if="log" :log="log" loop />
  </mc-screen>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import McScreen from '../../Screen.vue';
import McLogDrawer from '../../LogDrawer.vue';
import useCore from '../../../composables/useCore';

const { core } = useCore();

const log = computed(() => core.currentPlayer?.currentLog);
</script>
