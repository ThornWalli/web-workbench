<template>
  <div class="wb-disks-workbench13-document-editor-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import { toRef } from 'vue';
import useWindow, { props as windowProps, emits as windowEmits } from '@/composables/useWindow';
import { getDocumentModelValue } from '@/web-workbench/disks/workbench13/utils';
import AtomMarkdown from '@/components/environments/atoms/Markdown';

import contextMenu from '@/web-workbench/disks/workbench13/documentEditor/contextMenu';

export default {
  components: {
    AtomMarkdown
  },

  props: {
    ...windowProps,
    model: {
      type: Object,
      default () {
        return { value: getDocumentModelValue() };
      }
    }
  },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const window = useWindow(props, context);
    window.setContextMenu(contextMenu, { model: model.value });
    return window;
  },

  data () {
    return {
      content: [
        '# Document Editor', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
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
