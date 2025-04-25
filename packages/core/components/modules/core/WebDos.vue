<template>
  <wb-components-console
    :show-introduction="false"
    :delimiter-prefix="''"
    :start-commands="command"
    :core="core"
    class="wb-module-core-web-dos"
    :pre-rows="rows"
    @start-commands-complete="onStartCommandsComplete" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import WbComponentsConsole from '../../Console.vue';
import useWindow from '@web-workbench/core/composables/useWindow';
import useCore from '@web-workbench/core/composables/useCore';

const { core } = useCore();

defineProps({
  command: {
    type: String,
    default: null
  }
});

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

useWindow();

const rows = ref([
  `Make by Lammpee ${new Date().getFullYear()}`,
  `Release ${core.value?.version}`
]);

function onStartCommandsComplete() {
  window.setTimeout(
    () => {
      $emit('close');
    },
    1000 * (2 + Math.floor(Math.random() * 3))
  );
}
</script>

<style lang="postcss" scoped>
.wb-module-core-web-dos {
  min-width: 320px;
}
</style>
