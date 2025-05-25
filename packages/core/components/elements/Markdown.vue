<template>
  <div class="wb-env-element-markdown" :style="style" v-html="parsedContent" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { marked } from 'marked';
import {
  FONT_FAMILY,
  MODULAR_SCALE,
  MODULAR_SCALE_VALUES,
  FONT_FAMILIES_FLAT
} from '@web-workbench/disk-workbench13/documentEditor/utils';
// import { mangle } from 'marked-mangle';

const renderer = new marked.Renderer();
renderer.link = function (...args) {
  const link = marked.Renderer.prototype.link.apply(this, args);
  return link.replace('<a', "<a target='_blank'");
};

marked.setOptions({
  renderer
});

const style = computed(() => {
  const fontFamily = $props.fontFamily || defaultFontFamily;
  return {
    '--modular-scale':
      MODULAR_SCALE_VALUES[$props.modularScale || defaultModularScale],
    '--font-markdown-typo-headline-primary': fontFamily,
    '--font-markdown-typo-headline-secondary': fontFamily,
    '--font-markdown-typo-text': fontFamily,
    '--font-markdown-typo-code': fontFamily,
    '--font-markdown-typo-blockquote': fontFamily,
    '--font-size-markdown': $props.fontSize || defaultFontSize,
    '--font-line-height-markdown': $props.lineHeight || defaultLineHeight
  };
});

// marked.use(mangle());

const defaultModularScale = MODULAR_SCALE.MINOR_SECOND;
const defaultFontFamily = FONT_FAMILIES_FLAT[FONT_FAMILY.AMIGA_TOPAZ_13];
const defaultFontSize = 16;
const defaultLineHeight = 1.2;

const $props = defineProps<{
  content?: string;
  modularScale?: MODULAR_SCALE;
  fontFamily?: `${FONT_FAMILY}`;
  fontSize?: number;
  lineHeight?: number;
}>();

// content: String(changelogContent),
//       fontFamily: FONT_FAMILES[FONT_TYPES.Monospace]['Lucida Console'],
//       fontSize: 14

const parsedContent = computed(() => marked($props.content || ''));
</script>

<style lang="postcss" scoped>
.wb-env-element-markdown {
  --color-selection: var(--color-markdown-typo-selection, #000);
  --color-headline-primary: var(--color-markdown-typo-headline-primary, #fff);
  --color-headline-secondary: var(
    --color-markdown-typo-headline-secondary,
    #fa5
  );
  --color-strong: var(--color-markdown-typo-strong, #fa5);
  --color-strong-em: var(--color-markdown-typo-strong-em, #fff);
  --color-link: var(--color-markdown-typo-link, #fa5);
  --color-link-hover: var(--color-markdown-typo-link-hover, #fff);
  --color-del: var(--color-markdown-typo-del, #000);
  --color-line: var(--color-markdown-typo-line, #fff);
  --color-blockquote-background: var(
    --color-markdown-typo-blockquote-background,
    #fa5
  );
  --color-blockquote-text: var(--color-markdown-typo-blockquote-text, #000);
  --color-code-background: var(--color-markdown-typo-code-background, #fff);
  --color-code-text: var(--color-markdown-typo-code-text, #000);
  --color-code-selection: var(--color-markdown-typo-code-selection, #fa5);

  .style-filled & {
    --color-selection: var(
      --color-markdown-typo-filled-selection,
      var(--color-markdown-typo-selection, #000)
    );
    --color-headline-primary: var(
      --color-markdown-typo-filled-headline-primary,
      var(--color-markdown-typo-headline-primary, #fff)
    );
    --color-headline-secondary: var(
      --color-markdown-typo-filled-headline-secondary,
      var(--color-markdown-typo-headline-secondary, #fa5)
    );
    --color-strong: var(
      --color-markdown-typo-filled-strong,
      var(--color-markdown-typo-strong, #fa5)
    );
    --color-strong-em: var(
      --color-markdown-typo-filled-strong-em,
      var(--color-markdown-typo-strong-em, #fff)
    );
    --color-link: var(
      --color-markdown-typo-filled-link,
      var(--color-markdown-typo-link, #fa5)
    );
    --color-link-hover: var(
      --color-markdown-typo-filled-link-hover,
      var(--color-markdown-typo-link-hover, #fff)
    );
    --color-del: var(
      --color-markdown-typo-filled-del,
      var(--color-markdown-typo-del, #000)
    );
    --color-line: var(
      --color-markdown-typo-filled-line,
      var(--color-markdown-typo-line, #fff)
    );
    --color-blockquote-background: var(
      --color-markdown-typo-filled-blockquote-background,
      var(--color-markdown-typo-blockquote-background, #fa5)
    );
    --color-blockquote-text: var(
      --color-markdown-typo-filled-blockquote-text,
      var(--color-markdown-typo-blockquote-text, #000)
    );
    --color-code-background: var(
      --color-markdown-typo-filled-code-background,
      var(--color-markdown-typo-code-background, #fff)
    );
    --color-code-text: var(
      --color-markdown-typo-filled-code-text,
      var(--color-markdown-typo-code-text, #000)
    );
    --color-code-selection: var(
      --color-markdown-typo-filled-code-selection,
      var(--color-markdown-typo-code-selection, #fa5)
    );
  }

  /* font */
  --font-headline-primary: var(
    --font-markdown-typo-headline-primary,
    var(--font-workbench-topaz)
  );
  --font-headline-secondary: var(
    --font-markdown-typo-headline-secondary,
    var(--font-workbench-topaz)
  );
  --font-text: var(--font-markdown-typo-text, var(--font-workbench-topaz));
  --font-code: var(--font-markdown-typo-code, var(--font-workbench-topaz));
  --font-blockquote: var(
    --font-markdown-typo-blockquote,
    var(--font-workbench-topaz)
  );
  --font-size: var(--font-size-markdown, 16);
  --font-line-height: var(--font-line-height-markdown, 1.2);
  --font-ratio: var(--modular-scale, 1);

  /* modular scale */
  --font-paragraph: 1;
  --font-h6: calc(var(--font-paragraph) * var(--font-ratio));
  --font-h5: calc(var(--font-h6) * var(--font-ratio));
  --font-h4: calc(var(--font-h5) * var(--font-ratio));
  --font-h3: calc(var(--font-h4) * var(--font-ratio));
  --font-h2: calc(var(--font-h3) * var(--font-ratio));
  --font-h1: calc(var(--font-h2) * var(--font-ratio));
  --gap: calc(1em / 2 * var(--font-line-height));

  font-size: calc(var(--font-size-markdown, 16) * 1px);

  & :deep(*) {
    font-family: var(--font-text);
    font-size: 1em;
    font-weight: normal;
    letter-spacing: normal;
  }

  &,
  & :deep(:not(input)) {
    user-select: text;

    &::selection {
      color: var(--color-selection);
      text-shadow: none;
      background: transparent;
    }
  }

  /* START Markup RESET */

  & :deep(img) {
    display: block;
    max-width: 512px;
  }

  & :deep(p),
  & :deep(ul),
  & :deep(ol) {
    padding: 0;
    margin: 0;
  }

  /* END Markup RESET */
  & :deep(h1) {
    --font-size: var(--font-h1);

    font-family: var(--font-headline-primary);
    color: var(--color-headline-primary);
  }

  & :deep(h2) {
    --font-size: var(--font-h2);

    font-family: var(--font-headline-secondary);
    color: var(--color-headline-secondary);
  }

  & :deep(h3) {
    --font-size: var(--font-h3);

    font-family: var(--font-headline-primary);
    color: var(--color-headline-primary);
  }

  & :deep(h4) {
    --font-size: var(--font-h4);

    font-family: var(--font-headline-secondary);
    color: var(--color-headline-secondary);
  }

  & :deep(h5) {
    --font-size: var(--font-h5);

    font-family: var(--font-headline-primary);
    color: var(--color-headline-primary);
  }

  & :deep(h6) {
    --font-size: var(--font-h6);

    font-family: var(--font-headline-secondary);
    color: var(--color-headline-secondary);
  }

  & :deep(h1),
  & :deep(h2),
  & :deep(h3),
  & :deep(h4),
  & :deep(h5),
  & :deep(h6) {
    padding: 0;
    margin: 0;
    margin: calc(var(--gap) / var(--font-size)) 0;
    font-size: calc(var(--font-size) * 1em);
    font-weight: bold;
    line-height: normal;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  & :deep(strong),
  & :deep(b) {
    font-weight: bold;
    color: var(--color-strong);

    & em {
      color: var(--color-strong-em);
    }
  }

  & :deep(a) {
    color: var(--color-link);
    text-decoration: none;

    &::after {
      font-size: 1em;
      content: '\00a0- [Link]';
    }

    &[href^='mailto:'] {
      background: red;

      &::after {
        content: '\00a0- [Mail]';
      }
    }

    &:hover {
      &,
      &::after {
        color: var(--color-link-hover);
      }
    }
  }

  & :deep(a[href^='mailto:']) {
    &::after {
      content: '\00a0- [Mail]';
    }
  }

  /* & :deep(del) {
    color: var(--color-del);
  } */

  & :deep(p) {
    margin: calc(10 / var(--font-size) * 1em) 0;
    line-height: var(--font-line-height);

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  & :deep(ul) {
    margin: calc(var(--gap) / var(--font-size)) 0;
  }

  & :deep(ol) {
    padding-left: calc(40 / var(--font-size) * 1em);
    margin: calc(var(--gap) / var(--font-size)) 0;
  }

  & :deep(li) {
    margin: calc(5 / 16 * 1em) 0;
  }

  & :deep(ul) li {
    position: relative;
    padding-left: 1em;
    line-height: 1;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: '-';
    }
  }

  & :deep(hr) {
    height: calc(4 / var(--font-size) * 1em);
    margin: 0 calc(-1 / var(--font-size) * 1em);
    background: var(--color-line);
    border: none;
  }

  & :deep(blockquote) {
    padding: 1em;
    font-style: italic;
    color: var(--color-blockquote-text);
    background: var(--color-blockquote-background);

    & strong,
    & b {
      color: var(--color-blockquote-text);
    }
  }

  & :deep(code) {
    display: inline-block;
    padding: calc(4 / 16 * 1em) calc(8 / 16 * 1em);
    line-height: normal;
    color: var(--color-code-text);
    white-space: pre;
    background: var(--color-code-background);

    &::selection {
      color: var(--color-code-selection);
    }
  }

  & :deep(pre) {
    margin: calc(20 / var(--font-size) * 1em) 0;

    &::before {
      display: inline-block;
      margin-bottom: 0.5em;
      content: 'Code:';
    }

    & > code {
      display: block;
      padding: calc(5 / var(--font-size) * 1em);
      margin: 0;
      white-space: pre;
      user-select: auto;
    }
  }

  & :deep(table) {
    & th,
    & td {
      padding: calc(5 / var(--font-size) * 1em)
        calc(10 / var(--font-size) * 1em);
      line-height: normal;
    }

    & th {
      font-style: italic;
    }
  }
}
</style>
