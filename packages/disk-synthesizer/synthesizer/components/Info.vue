<template>
  <div class="wb-disks-debug-synthesizer-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown.vue';

const content = ref(
  [
    '# Synthesizer',
    'Simple synthesizer with notes view and midi api support.',
    '',
    'Version: **0.1**  \nCreated by **Thorn-Welf Walli**',
    '',
    'Thanks to:',
    '- [Tone.js](https://tonejs.github.io/)',
    '- [WEBMIDI.js](https://webmidijs.org/)'
  ].join('\n')
);
</script>

<style lang="postcss" scoped>
.wb-disks-debug-synthesizer-info {
  min-width: 280px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
