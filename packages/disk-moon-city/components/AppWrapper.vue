<template>
  <div ref="rootEl" class="wb-disks-mooncity-app-wrapper">
    <component
      :is="component"
      v-if="rootEl && ready"
      :volume="volume"
      :absolute="rootEl"
      :native-cursor="false" />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onUnmounted, ref, watch } from 'vue';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/utils';
import useWindow from '@web-workbench/core/composables/useWindow';
import { CURSOR_TYPES } from '@web-workbench/core/classes/Cursor';

const rootEl = ref(null);

const { isReady, core } = useWindow();
const ready = ref(false);

const volume = computed(() => {
  return (
    core?.config?.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG].soundVolume || 1
  );
});

const component = defineAsyncComponent(() => import('./App.vue'));

watch(
  () => isReady.value,
  () => {
    core.value.modules.screen.cursor.setCurrent(CURSOR_TYPES.POINTER_MOONCITY);
    ready.value = true;
  }
);
onUnmounted(() => {
  core.modules.screen.cursor.setCurrent(null);
});
</script>

<style lang="postcss" scoped>
.wb-disks-mooncity-app-wrapper {
  position: absolute;
  inset: 0;
  background-color: black;
}
</style>
