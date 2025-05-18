<template>
  <div class="wb-disks-debug-chars">
    <atom-markdown
      :font-family="FONT_FAMILIES_FLAT[FONT_FAMILY.AMIGA_TOPAZ_13]"
      :content="content" />
  </div>
</template>
<script lang="ts" setup>
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown.vue';
import { ref } from 'vue';
import chars from '../chars.md?raw';
import {
  FONT_FAMILIES_FLAT,
  FONT_FAMILY
} from '@web-workbench/disk-workbench13/documentEditor/utils';

const content = ref(chars);
</script>

<style lang="postcss" scoped>
.wb-disks-debug-chars {
  min-width: 380px;
  height: 100%;
  padding: var(--default-element-margin);
}
</style>
