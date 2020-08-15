<template>
  <div class="wb-disks-workbench13-document-reader" :style="style">
    <div class="document-reader__content">
      <div ref="scrollContainer" class="document-reader__content__scroll" @scroll="onScroll">
        <wb-markdown :content="pageContent" />
      </div>
    </div>
    <div class="document-reader__pagination">
      <div class="document-reader__pagination__frame document-reader__pagination__current" @pointerdown="onPointerDownPrev">
        <span>{{ currentPage + 1 }}</span>
      </div>
      <div v-if="scrollValue > 0" class="document-reader__pagination__frame document-reader__pagination__scroll_up" @pointerdown="onPointerDownScrollUp" @pointerup="onPointerUp">
        <i><svg-scrollbar-small-arrow /></i>
      </div>
      <div class="document-reader__pagination__spacer" />
      <div v-if="scrollValue < 1" class="document-reader__pagination__frame document-reader__pagination__scroll_down" @pointerdown="onPointerDownScrollDown" @pointerup="onPointerUp">
        <i><svg-scrollbar-small-arrow /></i>
      </div>
    </div>
    <svg-note-corner v-if="currentPage > 0" class="document-reader__corner document-reader__corner_left" @pointerdown="onPointerDownPrev" />
    <svg-note-corner v-if="currentPage < content.length-1" class="document-reader__corner document-reader__corner_right" @pointerdown="onPointerDownNext" />
  </div>
</template>

<script>

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/documentReader/contextMenu';
import SvgNoteCorner from '@/assets/svg/window/note_corner.svg?vue-template';
import WbMarkdown from '@/components/environments/atoms/Markdown';
import SvgScrollbarSmallArrow from '@/assets/svg/window/scrollbar_small_arrow.svg?vue-template';
import scrollBar from '@/web-workbench/services/dom';
import { PROPERTY, getDocumentModelValue } from '../../../web-workbench/disks/workbench13/utils';
import ContextMenuItems from '../../../web-workbench/classes/ContextMenuItems';

export default {
  components: { SvgNoteCorner, SvgScrollbarSmallArrow, WbMarkdown },
  mixins: [
    MixinWindowComponent
  ],

  props: {
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
        '--font_size__markdown': `${this.model.value[PROPERTY.FONT_SIZE]}`,
        '--font__markdown__typo__headlinePrimary': fontFamily,
        '--font__markdown__typo__headlineSecondary': fontFamily,
        '--font__markdown__typo__text': fontFamily,
        '--font__markdown__typo__code': fontFamily,
        '--font__markdown__typo__blockquote': fontFamily
      };
    },
    pageContent () {
      return this.content[this.currentPage];
    },
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
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
      if (this.model.fsItem) {
        this.windowOptions.title = this.model.fsItem.name + ' - Document Reader';
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
      global.clearInterval(this.clickInterval);
    },

    intervalClick (cb) {
      global.clearInterval(this.clickInterval);
      this.clickInterval = setInterval(cb, 125);
    },
    onScroll (e) {
      e.preventDefault();
      this.scrollValue = this.$refs.scrollContainer.scrollTop / (this.$refs.scrollContainer.scrollHeight - this.$refs.scrollContainer.offsetHeight);
    }
  }

};
</script>

<style lang="postcss">
.wb-disks-workbench13-document-reader {
  --color__markdown__typo__headlinePrimary: #000;
  --color__markdown__typo__headlineSecondary: #000;
  --color__markdown__typo__strong: #000;
  --color__markdown__typo__strongEm: #000;
  --color__markdown__typo__link: #fa5;
  --color__markdown__typo__linkHover: #000;
  --color__markdown__typo__del: #ccc;
  --color__markdown__typo__line: #ccc;
  --color__markdown__typo__blockquoteBackground: #fa5;
  --color__markdown__typo__blockquoteText: #000;
  --color__markdown__typo__codeBackground: #000;
  --color__markdown__typo__codeText: #ccc;
  --color__markdown__typo__codeSelection: #fa5;
  --font__markdown__typo__headlinePrimary: sans-serif;
  --font__markdown__typo__headlineSecondary: sans-serif;
  --font__markdown__typo__text: sans-serif;
  --font__markdown__typo__code: sans-serif;
  --font__markdown__typo__blockquote: sans-serif;

  position: relative;
  min-width: 380px;
  height: 100%;
  padding: 2px;

  & .document-reader__pagination {
    position: absolute;
    top: 2px;
    right: 2px;
    bottom: 18px;
    display: flex;
    flex-direction: column;
    width: 13px;
  }

  & .document-reader__corner {
    position: absolute;
    bottom: 2px;
    left: 2px;

    &.document-reader__corner_right {
      right: 16px;
      left: auto;
      transform: scale(-1, 1);
    }
  }

  & .document-reader__content {
    position: absolute;
    top: 2px;
    right: 16px;
    bottom: 2px;
    left: 2px;
    padding: 2px 4px;
    padding-right: 0;
    overflow: hidden;
    color: #000;
    background: #fff;
  }

  & .document-reader__content__scroll {
    width: calc(100% + (var(--scroll-bar-size) * 1px));
    height: 100%;
    padding-right: 2px;
    padding-bottom: 16px;
    overflow-x: unset;
    overflow-y: scroll;
  }

  & .document-reader__pagination__frame {
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

  & .document-reader__pagination__spacer {
    flex: 1;
  }

  & .document-reader__pagination__scroll_down {
    & i {
      transform: scale(-1);
      transform-origin: center;
    }
  }

}
</style>
