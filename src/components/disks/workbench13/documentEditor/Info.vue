<template>
  <div class="wb-disks-workbench13-document-editor-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import ContextMenuItems from '@/web-workbench/classes/ContextMenuItems';
import { getDocumentModelValue } from '@/web-workbench/disks/workbench13/utils';
import AtomMarkdown from '@/components/environments/atoms/Markdown';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/documentEditor/contextMenu';

export default {
  components: {
    AtomMarkdown
  },
  mixins: [
    MixinWindowComponent
  ],

  props: {
    model: {
      type: Object,
      default () {
        return { value: getDocumentModelValue() };
      }
    }
  },

  data () {
    return {
      content: [
        '# Document Editor', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  },
  computed: {
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
    }
  }
};

</script>

<style lang="postcss">
.wb-disks-workbench13-document-editor-info {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
