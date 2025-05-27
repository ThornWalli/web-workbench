<template>
  <div class="wb-disks-debug-markdown">
    <element-markdown
      :font-family="FONT_FAMILIES_FLAT[FONT_FAMILY.MONOSPACE]"
      :content="content" />
  </div>
</template>
<script lang="ts" setup>
import ElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';
import { ref } from 'vue';
import markdown from '../../markdown.md?raw';

import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../types';
import contextMenu from '../contextMenu';
import {
  FONT_FAMILIES_FLAT,
  FONT_FAMILY
} from '@web-workbench/disk-workbench13/documentEditor/utils';
const content = ref(markdown);

const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu } = useWindow();

setContextMenu(contextMenu, { model: $props.model });
</script>

<style lang="postcss" scoped>
.wb-disks-debug-markdown {
  min-width: 380px;
  height: 100%;
  padding: var(--default-element-margin);
}
</style>
