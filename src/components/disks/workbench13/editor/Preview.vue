<template>
  <div class="wb-disks-workbench13-editor-preview">
    <wb-markdown v-if="model.value.type === 'markdown'" :content="model.value.content" />
    <div v-if="model.value.type === 'html'" v-html="model.value.content" />
  </div>
</template>

<script>

import ContextMenuItems from '../../../../web-workbench/classes/ContextMenuItems';
import WbMarkdown from '@/components/environments/atoms/Markdown';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/editor/contextMenu';

export default {
  components: {
    WbMarkdown
  },
  mixins: [
    MixinWindowComponent
  ],
  props: {
    model: {
      type: Object,
      default () {
        return {
          value: ''
        };
      }
    },
    parentFocused: {
      type: Boolean,
      default: false
    },
    core: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      windowsModule: this.core.modules.windows
    };
  },
  computed: {
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
    },
    value () {
      return this.model.value;
    }
  },
  watch: {
    value () {
      this.refresh();
    }
  },
  methods: {
    refresh () {
      this.$emit('refresh', { scroll: true });
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-workbench13-editor-preview {
  padding: var(--default-element-margin);
}
</style>
