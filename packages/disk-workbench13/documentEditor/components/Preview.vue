<template>
  <div class="wb-disks-workbench13-document-editor-preview" :style="style">
    <wb-markdown
      v-if="model.value.type === 'markdown'"
      :content="model.value.content" />
    <div v-if="model.value.type === 'html'" v-html="model.value.content" />
  </div>
</template>

<script>
import { toRef } from 'vue';
import WbMarkdown from '@web-workbench/core/components/atoms/Markdown';

import contextMenu from '../contextMenu';
import { PROPERTY, getDefaultDocumentModel } from '../index';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbMarkdown
  },

  props: {
    model: {
      type: Object,
      default() {
        return {
          value: getDefaultDocumentModel()
        };
      }
    }
  },
  emits: ['refresh'],

  setup(props) {
    const model = toRef(props, 'model');
    const windowContext = useWindow();
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

  data() {
    return {
      windowsModule: this.core.modules.windows
    };
  },
  computed: {
    style() {
      const fontFamily = this.model.value[PROPERTY.FONT_FAMILY];
      return {
        '--font-size-markdown': `${this.model.value[PROPERTY.FONT_SIZE]}`,
        '--font-markdown-typo-headline-primary': fontFamily,
        '--font-markdown-typo-headline-secondary': fontFamily,
        '--font-markdown-typo-text': fontFamily,
        '--font-markdown-typo-code': fontFamily,
        '--font-markdown-typo-blockquote': fontFamily
      };
    },
    value() {
      return this.model.value;
    }
  },
  watch: {
    value() {
      this.refresh();
    }
  },
  methods: {
    refresh() {
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
