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

<script lang="ts" setup>
import McLogDrawer from '../LogDrawer.vue';
import useCore from '../../composables/useCore';
import { computed, onMounted } from 'vue';

const { core } = useCore();

const currentLog = computed(() => core.currentPlayer?.currentLog);
onMounted(() => {
  if (!currentLog.value) {
    $emit('round-start');
  }
});
const $emit = defineEmits<{
  (e: 'round-start'): void;
}>();
</script>
