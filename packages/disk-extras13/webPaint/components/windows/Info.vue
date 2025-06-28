<template>
  <div class="wb-disks-extras13-web-paint-info">
    <element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../../types';
import contextMenu from '../../contextMenu';

const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const content = ref(
  ['# WebPaint', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'].join(
    '\n'
  )
);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
