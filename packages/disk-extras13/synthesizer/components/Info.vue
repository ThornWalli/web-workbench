<template>
  <div class="wb-disks-debug-synthesizer-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>
// import { toRef } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';
import useWindow from '@web-workbench/core/composables/useWindow';

// import contextMenu from '../contextMenu';

export default {
  components: {
    AtomMarkdown
  },

  props: { model: { type: Object, required: true } },

  setup() {
    const windowContext = useWindow();
    // const model = toRef(props, 'model');
    // windowContext.setContextMenu(contextMenu, { model });
    return { windowContext };
  },

  data() {
    return {
      content: [
        '# Synthesizer',
        'Simple synthesizer with notes view and midi api support.',
        '',
        'Version: **0.1**  \nCreated by **Thorn-Welf Walli**',
        '',
        'Thanks to:',
        '- [Tone.js](https://tonejs.github.io/)',
        '- [WEBMIDI.js](https://webmidijs.org/)'
      ].join('\n')
    };
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-debug-synthesizer-info {
  min-width: 280px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
