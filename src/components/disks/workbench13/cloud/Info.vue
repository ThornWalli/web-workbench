<template>
  <div class="wb-disks-workbench13-cloud-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import AtomMarkdown from '@/components/environments/atoms/Markdown';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/cloud/contextMenu';
import ContextMenuItems from '../../../../web-workbench/classes/ContextMenuItems';

export default {
  components: {
    AtomMarkdown
  },
  mixins: [
    MixinWindowComponent
  ],
  data () {
    return {
      content: [
        '# Cloud', 'Connect to a Firebase storage.  \n', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
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

<style lang="postcss">
.wb-disks-workbench13-cloud-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
