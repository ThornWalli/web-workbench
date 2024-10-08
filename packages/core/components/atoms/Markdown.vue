<template>
  <div class="wb-env-atom-markdown" v-html="parsedContent" />
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';

const renderer = new marked.Renderer();
renderer.link = function () {
  const link = marked.Renderer.prototype.link.apply(this, arguments);
  return link.replace('<a', "<a target='_blank'");
};

marked.setOptions({
  renderer
});
marked.use({
  mangle: false
});

const props = defineProps({
  content: {
    type: String,
    required: false,
    default: '# Headline  <p>Hello World</p>'
  },
  fontFamily: {
    type: String,
    required: false,
    default: null
  }
});

const parsedContent = computed(() => marked(props.content));
</script>

<style lang="postcss" scoped>
.wb-env-atom-markdown {
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

  font-size: calc(var(--font-size-markdown) * 1px);

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
  & :deep(h1),
  & :deep(h2),
  & :deep(h3),
  & :deep(h4),
  & :deep(h5),
  & :deep(h6) {
    padding: 0;
    margin: 0;
    font-weight: bold;
    line-height: normal;
  }

  & :deep(p),
  & :deep(ul),
  & :deep(ol) {
    padding: 0;
    margin: 0;
  }

  /* END Markup RESET */
  & :deep(h1) {
    margin: calc(20 / var(--font-size) * 1em / 2) 0;
    margin-bottom: calc(5 / var(--font-size) * 1em / 2);
    font-family: var(--font-headline-primary);
    font-size: 2em;
    color: var(--color-headline-primary);
    letter-spacing: calc(2 / var(--font-size) * 1rem);

    &:first-child {
      margin-top: 0;
    }
  }

  & :deep(h2) {
    font-family: var(--font-headline-secondary);
    font-size: 2em;
    color: var(--color-headline-secondary);
    letter-spacing: calc(2 / var(--font-size) * 1em);
  }

  & :deep(h3) {
    font-family: var(--font-headline-primary);
    font-size: calc(24 / var(--font-size) * 1em);
    color: var(--color-headline-primary);
    letter-spacing: calc(1.5 / var(--font-size) * 1em);
  }

  & :deep(h4) {
    font-family: var(--font-headline-secondary);
    font-size: 1em;
    color: var(--color-headline-secondary);
    letter-spacing: calc(1.5 / var(--font-size) * 1em);
  }

  & :deep(h5) {
    font-family: var(--font-headline-primary);
    font-size: 1em;
    color: var(--color-headline-primary);
    letter-spacing: calc(1.5 / var(--font-size) * 1em);
  }

  & :deep(h6) {
    font-family: var(--font-headline-secondary);
    color: var(--color-headline-secondary);
    letter-spacing: calc(1.5 / var(--font-size) * 1em);
  }

  & :deep(h5),
  & :deep(h6) {
    font-size: 1em;
  }

  & :deep(h2),
  & :deep(h3),
  & :deep(h4),
  & :deep(h5),
  & :deep(h6) {
    margin: calc(5 / var(--font-size) * 1em) 0;

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

    &:hover {
      &,
      &::after {
        color: var(--color-link-hover);
      }
    }
  }

  & :deep(del) {
    color: var(--color-del);
    text-decoration: none;
  }

  & :deep(p) {
    margin: calc(10 / var(--font-size) * 1em) 0;
    line-height: calc(20 / var(--font-size) * 1em);

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  & :deep(ul) {
    margin: calc(20 / var(--font-size) * 1em) 0;
  }

  & :deep(ol) {
    padding-left: calc(40 / var(--font-size) * 1em);
    margin: calc(20 / var(--font-size) * 1em) 0;
  }

  & :deep(li) {
    margin: calc(5 / var(--font-size) * 1em) 0;
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
    padding: calc(5 / var(--font-size) * 1em);
    margin: calc(5 / var(--font-size) * 1em) 0;
    line-height: calc(22 / var(--font-size) * 1em);
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
