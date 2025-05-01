<template>
  <div class="wb-disks-workbench13-document-reader" :style="style">
    <div class="content">
      <div ref="scrollContainerEl" class="content-scroll" @scroll="onScroll">
        <wb-markdown :content="pageContent" />
      </div>
    </div>
    <div class="pagination">
      <div
        class="pagination-frame pagination-current"
        @pointerdown="onPointerDownPrev">
        <span>{{ currentPage + 1 }}</span>
      </div>
      <div
        v-if="scrollValue > 0"
        class="pagination-frame pagination-scroll_up"
        @pointerdown="onPointerDownScrollUp"
        @pointerup="onPointerUp">
        <i><svg-scrollbar-small-arrow /></i>
      </div>
      <div class="pagination-spacer" />
      <div
        v-if="scrollValue < 1"
        class="pagination-frame pagination-scroll-down"
        @pointerdown="onPointerDownScrollDown"
        @pointerup="onPointerUp">
        <i><svg-scrollbar-small-arrow /></i>
      </div>
    </div>
    <svg-note-corner
      v-if="currentPage > 0"
      class="corner corner_left"
      @pointerdown="onPointerDownPrev" />
    <svg-note-corner
      v-if="currentPage < content.length - 1"
      class="corner corner-right"
      @pointerdown="onPointerDownNext" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import WbMarkdown from '@web-workbench/core/components/atoms/Markdown.vue';
import scrollBar from '@web-workbench/core/services/dom';
import SvgNoteCorner from '../assets/svg/note_corner.svg?component';
import SvgScrollbarSmallArrow from '../assets/svg/scrollbar_small_arrow.svg?component';

import useWindow from '@web-workbench/core/composables/useWindow';
import { getDefaultDocumentModel } from '../../documentEditor/utils';
import { PROPERTY } from '../../documentEditor/types';
import contextMenu from '../contextMenu';

const scrollContainerEl = ref<HTMLInputElement | null>(null);

const $props = defineProps({
  model: {
    type: Object,
    default() {
      return {
        fsItem: null,
        value: getDefaultDocumentModel()
      };
    }
  }
});

const { setContextMenu, ...windowContext } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const content = ref([]);
const currentPage = ref(0);
let clickInterval: number;
const scrollValue = ref(0);

const style = computed(() => {
  const fontFamily = $props.model.value[PROPERTY.FONT_FAMILY];
  return {
    '--scroll-bar-size': `${scrollBar.size}`,
    '--font-size-markdown': `${$props.model.value[PROPERTY.FONT_SIZE]}`,
    '--font-markdown-typo-headline-primary': fontFamily,
    '--font-markdown-typo-headline-secondary': fontFamily,
    '--font-markdown-typo-text': fontFamily,
    '--font-markdown-typo-code': fontFamily,
    '--font-markdown-typo-blockquote': fontFamily
  };
});

const pageContent = computed(() => content.value[currentPage.value]);

watch(
  () => currentPage.value,
  () => {
    if (scrollContainerEl.value) {
      scrollContainerEl.value.scrollTop = 0;
    }
  }
);

watch(
  () => $props.model,
  () => {
    refreshContent();
  },
  { deep: true }
);

onMounted(() => {
  refreshContent();
});

function refreshContent() {
  if ($props.model.fsItem) {
    windowContext.window.value.options.title =
      $props.model.fsItem.name + ' - Document Reader';
  }
  const contentValue = $props.model.value.content;
  const pages = contentValue.split(/\[PAGE\][\n]+/);
  currentPage.value = 0;
  content.value = pages;
}

function onPointerDownPrev() {
  currentPage.value = Math.max(currentPage.value - 1, 0);
}

function onPointerDownNext() {
  currentPage.value = Math.min(currentPage.value + 1, content.value.length - 1);
}

function onPointerDownScrollUp() {
  intervalClick(() => {
    if (scrollContainerEl.value) {
      scrollContainerEl.value.scrollTop = Math.max(
        scrollContainerEl.value.scrollTop - 20,
        0
      );
    }
  });
}

function onPointerDownScrollDown() {
  intervalClick(() => {
    if (scrollContainerEl.value) {
      scrollContainerEl.value.scrollTop = Math.min(
        scrollContainerEl.value.scrollTop + 20,
        scrollContainerEl.value.scrollHeight
      );
    }
  });
}

function onPointerUp() {
  window.clearInterval(clickInterval);
}

function intervalClick(cb: CallableFunction) {
  window.clearInterval(clickInterval);
  clickInterval = window.setInterval(cb, 125);
}

function onScroll(e: Event) {
  if (scrollContainerEl.value) {
    e.preventDefault();
    scrollValue.value =
      scrollContainerEl.value.scrollTop /
      (scrollContainerEl.value.scrollHeight -
        scrollContainerEl.value.offsetHeight);
  }
}
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
