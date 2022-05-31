<template>
  <div class="wb-disks-extras13-web-basic-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import { getBasicDefaultModelValue } from '@/web-workbench/disks/extras13/utils';
import AtomMarkdown from '@/components/environments/atoms/Markdown';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import ContextMenuItems from '@/web-workbench/classes/ContextMenuItems';
import contextMenu from '@/web-workbench/disks/extras13/webBasic/contextMenu';

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
        return {
          value: getBasicDefaultModelValue()
        };
      }
    }
  },

  data () {
    return {
      content: [
        '# WebBasic', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
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

<style lang="postcss" scoped>
.wb-disks-extras13-web-basic-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
