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

<script lang="ts" setup>
import { computed, defineAsyncComponent, onUnmounted, ref, watch } from 'vue';
import { CONFIG_NAMES } from '@web-workbench/core/classes/Core/types';
import useWindow from '@web-workbench/core/composables/useWindow';
import { CURSOR_TYPES } from '@web-workbench/core/classes/Cursor';
import type Core from '@web-workbench/core/classes/Core';

const rootEl = ref<HTMLElement | null>();

const $props = defineProps<{
  core: Core;
}>();

const core = ref<Core>($props.core);

const { isReady } = useWindow();
const ready = ref<boolean>(false);

const volume = computed<number>(() => {
  return (
    core.value?.config?.observable[CONFIG_NAMES.SCREEN_CONFIG].soundVolume || 1
  );
});

const component = defineAsyncComponent(() => import('./App.vue'));

watch(
  () => isReady.value,
  () => {
    core.value.modules.screen?.cursor.setCurrent(CURSOR_TYPES.POINTER_MOONCITY);
    ready.value = true;
  }
);
onUnmounted(() => {
  core.value.modules.screen?.cursor.setCurrent(undefined);
});
</script>

<style lang="postcss" scoped>
.wb-disks-mooncity-app-wrapper {
  position: absolute;
  inset: 0;
  background-color: black;
}
</style>
