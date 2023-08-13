<template>
  <div class="wb-disks-debug-synthesizer-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>
import { toRef } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';
import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';
import contextMenu from '../contextMenu';

export default {
  components: {
    AtomMarkdown
  },

  props: { ...windowProps, model: { type: Object, required: true } },
  emits: [...windowEmits],

  setup(props, context) {
    const windowContext = useWindow(props, context);
    const model = toRef(props, 'model');
    windowContext.setContextMenu(contextMenu, { model });
    return { windowContext };
  },

  data() {
    return {
      content: [
        '# Synthesizer',
        'Version: **0.1**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-debug-synthesizer-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
