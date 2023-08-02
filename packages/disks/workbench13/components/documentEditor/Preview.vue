<template>
  <div class="wb-disks-workbench13-document-editor-preview" :style="style">
    <wb-markdown v-if="model.value.type === 'markdown'" :content="model.value.content" />
    <div v-if="model.value.type === 'html'" v-html="model.value.content" />
  </div>
</template>

<script>

import { toRef } from 'vue';
import WbMarkdown from '@web-workbench/core/components/atoms/Markdown';
import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import contextMenu from '../../documentEditor/contextMenu';
import { PROPERTY, getDocumentModelValue } from '../../utils';

export default {
  components: {
    WbMarkdown
  },

  props: {
    ...windowProps,
    model: {
      type: Object,
      default () {
        return {
          value: getDocumentModelValue()
        };
      }
    }
  },
  emits: [
    ...windowEmits, 'refresh'
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

  data () {
    return {
      windowsModule: this.core.modules.windows
    };
  },
  computed: {
    style () {
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
