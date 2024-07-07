<template>
  <div class="wb-disks-workbench13-calculator-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';
import ContextMenuItems from '@web-workbench/core/classes/ContextMenuItems';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    AtomMarkdown
  },

  setup() {
    const windowContext = useWindow();
    windowContext.setContextMenu(contextMenu);
    return windowContext;
  },

  data() {
    return {
      content: [
        '# Calculator',
        'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  },
  computed: {
    contextMenu() {
      return new ContextMenuItems(contextMenu, { core: this.core });
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-calculator-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
