<template>
  <div class="wb-disks-workbench13-clock-info">
    <element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import ElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import { ref } from 'vue';
import type { Model } from '../types';

const { setContextMenu } = useWindow();

const $props = defineProps<{
  model: Model;
}>();

setContextMenu(contextMenu, { model: $props.model });

const content = ref(
  ['# Clock', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'].join('\n')
);
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-clock-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
