<template>
  <div class="wb-disks-workbench13-calculator-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import ContextMenuItems from '../../../../web-workbench/classes/ContextMenuItems';
import AtomMarkdown from '@/components/environments/atoms/Markdown';

import useWindow, { props as windowProps, emits as windowEmits } from '@/composables/useWindow';
import contextMenu from '@/web-workbench/disks/workbench13/calculator/contextMenu';

export default {
  components: {
    AtomMarkdown
  },

  props: { ...windowProps },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu);
    return windowContext;
  },

  data () {
    return {
      content: [
        '# Calculator', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  },
  computed: {
    contextMenu () {
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
