<template>
  <div class="wb-disks-workbench13-document-reader" :style="style">
    <div class="content">
      <div ref="scrollContainer" class="content-scroll" @scroll="onScroll">
        <wb-markdown :content="pageContent" />
      </div>
    </div>
    <div class="pagination">
      <div class="pagination-frame pagination-current" @pointerdown="onPointerDownPrev">
        <span>{{ currentPage + 1 }}</span>
      </div>
      <div v-if="scrollValue > 0" class="pagination-frame pagination-scroll_up" @pointerdown="onPointerDownScrollUp" @pointerup="onPointerUp">
        <i><svg-scrollbar-small-arrow /></i>
      </div>
      <div class="pagination-spacer" />
      <div v-if="scrollValue < 1" class="pagination-frame pagination-scroll-down" @pointerdown="onPointerDownScrollDown" @pointerup="onPointerUp">
        <i><svg-scrollbar-small-arrow /></i>
      </div>
    </div>
    <svg-note-corner v-if="currentPage > 0" class="corner corner_left" @pointerdown="onPointerDownPrev" />
    <svg-note-corner v-if="currentPage < content.length-1" class="corner corner-right" @pointerdown="onPointerDownNext" />
  </div>
</template>

<script>

import { toRaw, toRef } from 'vue';
import WbMarkdown from '@web-workbench/core/components/atoms/Markdown';
import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import { PROPERTY, getDocumentModelValue } from '@web-workbench/disks/workbench13/utils';
import scrollBar from '@web-workbench/core/services/dom';
import contextMenu from '../documentReader/contextMenu';
import SvgNoteCorner from '../assets/svg/note_corner.svg?component';
import SvgScrollbarSmallArrow from '../assets/svg/scrollbar_small_arrow.svg?component';

export default {
  components: { SvgNoteCorner, SvgScrollbarSmallArrow, WbMarkdown },

  props: {
    ...windowProps,
    windowOptions: {
      type: Object,
      default () {
        return {};
      }
    },
    model: {
      type: Object,
      default () {
        return {
          fsItem: null,
          value: getDocumentModelValue()
        };
      }
    }
  },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    windowContext.preserveContextMenu();
    return windowContext;
  },

  data () {
    return {
      content: [],
      currentPage: 0,
      clickInterval: null,
      scrollValue: 0
    };
  },

  computed: {
    style () {
      const fontFamily = this.model.value[PROPERTY.FONT_FAMILY];
      return {
        '--scroll-bar-size': `${scrollBar.size}`,
        '--font-size-markdown': `${this.model.value[PROPERTY.FONT_SIZE]}`,
        '--font-markdown-typo-headline-primary': fontFamily,
        '--font-markdown-typo-headline-secondary': fontFamily,
        '--font-markdown-typo-text': fontFamily,
        '--font-markdown-typo-code': fontFamily,
        '--font-markdown-typo-blockquote': fontFamily
      };
    },
    pageContent () {
      return this.content[this.currentPage];
    },
    fsItem () {
      return this.fsItem && toRaw(this.model.fsItem);
    }
  },
  watch: {
    currentPage () {
      this.$refs.scrollContainer.scrollTop = 0;
    },
    model: {
      deep: true,
      handler () {
        this.refreshContent();
      }
    }
  },
  mounted () {
    this.refreshContent();
  },
  methods: {
    refreshContent () {
      if (this.fsItem) {
        this.windowOptions.title = this.fsItem.name + ' - Document Reader';
      }
      const content = this.model.value.content;
      const pages = content.split(/\[PAGE\][\n]+/);
      this.currentPage = 0;
      this.content = pages;
    },
    onPointerDownPrev () {
      this.currentPage = Math.max(this.currentPage - 1, 0);
    },
    onPointerDownNext () {
      this.currentPage = Math.min(this.currentPage + 1, this.content.length - 1);
    },

    onPointerDownScrollUp () {
      this.intervalClick(() => {
        this.$refs.scrollContainer.scrollTop = Math.max(this.$refs.scrollContainer.scrollTop - 20, 0);
      });
    },
    onPointerDownScrollDown () {
      this.intervalClick(() => {
        this.$refs.scrollContainer.scrollTop = Math.min(this.$refs.scrollContainer.scrollTop + 20, this.$refs.scrollContainer.scrollHeight);
      });
    },

    onPointerUp () {
      window.clearInterval(this.clickInterval);
    },

    intervalClick (cb) {
      window.clearInterval(this.clickInterval);
      this.clickInterval = setInterval(cb, 125);
    },
    onScroll (e) {
      e.preventDefault();
      this.scrollValue = this.$refs.scrollContainer.scrollTop / (this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.offsetHeight);
    }
  }

};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-reader {
  --color-markdown-typo-headline-primary: #000;
  --color-markdown-typo-headline-secondary: #000;
  --color-markdown-typo-strong: #000;
  --color-markdown-typo-strong-em: #000;
  --color-markdown-typo-link: #fa5;
  --color-markdown-typo-link-hover: #000;
  --color-markdown-typo-del: #ccc;
  --color-markdown-typo-line: #ccc;
  --color-markdown-typo-blockquote-background: #fa5;
  --color-markdown-typo-blockquote-text: #000;
  --color-markdown-typo-code-background: #000;
  --color-markdown-typo-code-text: #ccc;
  --color-markdown-typo-code-selection: #fa5;
  --font-markdown-typo-headline-primary: sans-serif;
  --font-markdown-typo-headline-secondary: sans-serif;
  --font-markdown-typo-text: sans-serif;
  --font-markdown-typo-code: sans-serif;
  --font-markdown-typo-blockquote: sans-serif;

  position: relative;
  min-width: 380px;
  height: 100%;
  padding: 2px;

  & .pagination {
    position: absolute;
    top: 2px;
    right: 2px;
    bottom: 18px;
    display: flex;
    flex-direction: column;
    width: 13px;
  }

  & .corner {
    position: absolute;
    bottom: 2px;
    left: 2px;

    &.corner-right {
      right: 16px;
      left: auto;
      transform: scale(-1, 1);
    }
  }

  & .content {
    position: absolute;
    inset: 2px 16px 2px 2px;
    padding: 2px 4px;
    padding-right: 0;
    overflow: hidden;
    color: #000;
    background: #fff;
  }

  & .content-scroll {
    width: calc(100% + (var(--scroll-bar-size) * 1px));
    height: 100%;
    padding-right: 2px;
    padding-bottom: 16px;
    overflow-x: unset;
    overflow-y: scroll;
  }

  & .pagination-frame {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 26px;
    border: solid #fff;
    border-width: 2px 1px;

    & svg {
      fill: #fff;
    }

  }

  & .pagination-spacer {
    flex: 1;
  }

  & .pagination-scroll-down {
    & i {
      transform: scale(-1);
      transform-origin: center;
    }
  }

}
</style>
