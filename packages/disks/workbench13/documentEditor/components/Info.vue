<template>
  <div class="wb-disks-workbench13-document-editor-info">
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
import { getDefaultDocumentModel } from '../index';

export default {
  components: {
    AtomMarkdown
  },

  props: {
    ...windowProps,
    model: {
      type: Object,
      default() {
        return { value: getDefaultDocumentModel() };
      }
    }
  },
  emits: [...windowEmits],

  setup(props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

  data() {
    return {
      content: [
        '# Document Editor',
        'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor-info {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
