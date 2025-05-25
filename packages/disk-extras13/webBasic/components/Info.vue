<template>
  <div class="wb-disks-extras13-web-basic-info">
    <element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import ElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';
import { ref } from 'vue';

const content = ref<string>(
  ['# WebBasic', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'].join(
    '\n'
  )
);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-basic-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
