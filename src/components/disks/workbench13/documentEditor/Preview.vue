<template>
  <div class="wb-disks-workbench13-document-editor-preview" :style="style">
    <wb-markdown v-if="model.value.type === 'markdown'" :content="model.value.content" />
    <div v-if="model.value.type === 'html'" v-html="model.value.content" />
  </div>
</template>

<script>

import { PROPERTY, getDocumentModelValue } from '../../../../web-workbench/disks/workbench13/utils';
import ContextMenuItems from '../../../../web-workbench/classes/ContextMenuItems';
import WbMarkdown from '@/components/environments/atoms/Markdown';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/documentEditor/contextMenu';

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
          value: getDocumentModelValue()
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

  emits: [
    'refresh'
  ],
  data () {
    return {
      windowsModule: this.core.modules.windows
    };
  },
  computed: {
    style () {
      const fontFamily = this.model.value[PROPERTY.FONT_FAMILY];
      return {
        '--font_size__markdown': `${this.model.value[PROPERTY.FONT_SIZE]}`,
        '--font__markdown__typo__headlinePrimary': fontFamily,
        '--font__markdown__typo__headlineSecondary': fontFamily,
        '--font__markdown__typo__text': fontFamily,
        '--font__markdown__typo__code': fontFamily,
        '--font__markdown__typo__blockquote': fontFamily
      };
    },
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
      this.$nextTick(() => {
        this.$emit('refresh', { scroll: true });
      });
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor-preview {
  padding: var(--default-element-margin);
}
</style>
