<template>
  <div ref="rootEl" class="wb-disks-extras13-web-painting">
    <div
      v-if="ready"
      class="displays"
      :class="`display-${model.app.displays.length}`">
      <display
        v-for="(display, index) in model.app.displays"
        :key="index"
        :display="display"
        :app="model.app" />
    </div>
    <sidebar v-if="ready" :app="model.app" />
    <div id="debugWrapper" class="debug">
      <!-- <pre>
        {{ model.app.options.select }}
      </pre> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../types';
import Display from './Display.vue';
import Sidebar from './Sidebar.vue';
import { onMounted, ref } from 'vue';

const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu, preserveContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();

const ready = ref(false);
onMounted(async () => {
  await $props.model.app.ready;
  ready.value = true;
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting {
  --color-web-painting-border: #fff;
  --scroll-bar-size: 0;

  position: relative;
  display: block;
  width: 100%;
  height: 100%;

  &,
  & * {
    cursor: none;
  }

  & .sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;
  }

  & .debug {
    position: absolute;
    right: 0;
    bottom: 0;
    color: lime;
    background-color: black;

    & :deep(pre) {
      font-family: var(--font-bit-font);
      font-size: 8px;
      line-height: 12px;
    }
  }

  & .displays {
    position: absolute;
    top: 0;
    right: 50px;
    left: 0;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2px;
    height: 100%;
    background-color: var(--workbench-color-1);
    border-right-width: 0;

    & .wb-disks-extras13-web-painting-display {
      width: 100%;
      height: 100%;
    }

    &.display-2 {
      grid-template-columns: repeat(1, 1fr);
    }

    &.display-3 {
      grid-template-columns: repeat(2, 1fr);

      & :nth-child(3) {
        grid-column: 1 / 3;
      }
    }

    &.display-4 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
