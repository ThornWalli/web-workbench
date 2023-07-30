<template>
  <div
    class="wb-env-atom-markdown"
    v-html="parsedContent"
  />
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';

const options = {
  prefix: 'prefix-'
};
marked.use(gfmHeadingId(options));

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
  --color__selection: var(--color__markdown__typo__selection, #000);
  --color__headlinePrimary: var(--color__markdown__typo__headlinePrimary, #fff);
  --color__headlineSecondary: var(--color__markdown__typo__headlineSecondary, #fa5);
  --color__strong: var(--color__markdown__typo__strong, #fa5);
  --color__strongEm: var(--color__markdown__typo__strongEm, #fff);
  --color__link: var(--color__markdown__typo__link, #fa5);
  --color__linkHover: var(--color__markdown__typo__linkHover, #fff);
  --color__del: var(--color__markdown__typo__del, #000);
  --color__line: var(--color__markdown__typo__line, #fff);
  --color__blockquoteBackground: var(--color__markdown__typo__blockquoteBackground, #fa5);
  --color__blockquoteText: var(--color__markdown__typo__blockquoteText, #000);
  --color__codeBackground: var(--color__markdown__typo__codeBackground, #fff);
  --color__codeText: var(--color__markdown__typo__codeText, #000);
  --color__codeSelection: var(--color__markdown__typo__codeSelection, #fa5);

  /* font */
  --font__headlinePrimary: var(--font__markdown__typo__headlinePrimary, var(--workbenchFont_topaz));
  --font__headlineSecondary: var(--font__markdown__typo__headlineSecondary, var(--workbenchFont_topaz));
  --font__text: var(--font__markdown__typo__text, var(--workbenchFont_topaz));
  --font__code: var(--font__markdown__typo__code, var(--workbenchFont_topaz));
  --font__blockquote: var(--font__markdown__typo__blockquote, var(--workbenchFont_topaz));
  --font_size: var(--font_size__markdown, 16);

  font-size: calc(var(--font_size__markdown) * 1px);

  & :deep(){
    & * {
      font-family: var(--font__text);
      font-size: 1em;
      font-weight: normal;
      letter-spacing: normal;
    }

    &,
    & :not(input) {
      user-select: text;

      &::selection {
        color: var(--color__selection);
        text-shadow: none;
        background: transparent;
      }
    }

    /* START Markup RESET */
    & h1,
    & h2,
    & h3,
    & h4,
    & h5,
    & h6 {
      padding: 0;
      margin: 0;
      font-weight: bold;
      line-height: normal;
    }

    & p,
    & ul,
    & ol {
      padding: 0;
      margin: 0;
    }

    /* END Markup RESET */
    & h1 {
      margin: calc(20 / var(--font_size) * 1em / 2) 0;
      margin-bottom: calc(5 / var(--font_size) * 1em / 2);
      font-family: var(--font__headlinePrimary);
      font-size: 2em;
      color: var(--color__headlinePrimary);
      letter-spacing: calc(2 / var(--font_size) * 1rem);

      &:first-child {
        margin-top: 0;
      }
    }

    & h2 {
      font-family: var(--font__headlineSecondary);
      font-size: 2em;
      color: var(--color__headlineSecondary);
      letter-spacing: calc(2 / var(--font_size) * 1em);
    }

    & h3 {
      font-family: var(--font__headlinePrimary);
      font-size: calc(24 / var(--font_size) * 1em);
      color: var(--color__headlinePrimary);
      letter-spacing: calc(1.5 / var(--font_size) * 1em);
    }

    & h4 {
      font-family: var(--font__headlineSecondary);
      font-size: 1em;
      color: var(--color__headlineSecondary);
      letter-spacing: calc(1.5 / var(--font_size) * 1em);
    }

    & h5 {
      font-family: var(--font__headlinePrimary);
      font-size: 1em;
      color: var(--color__headlinePrimary);
      letter-spacing: calc(1.5 / var(--font_size) * 1em);
    }

    & h6 {
      font-family: var(--font__headlineSecondary);
      color: var(--color__headlineSecondary);
      letter-spacing: calc(1.5 / var(--font_size) * 1em);
    }

    & h5,
    & h6 {
      font-size: 1em;
    }

    & h2,
    & h3,
    & h4,
    & h5,
    & h6 {
      margin: calc(5 / var(--font_size) * 1em) 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    & strong,
    & b {
      font-weight: bold;
      color: var(--color__strong);

      & em {
        color: var(--color__strongEm);
      }
    }

    & a {
      color: var(--color__link);
      text-decoration: none;

      &::after {
        font-size: 1em;
        content: "\00a0- [Link]";
      }

      &:hover {
        &,
        &::after {
          color: var(--color__linkHover);
        }
      }
    }

    & del {
      color: var(--color__del);
      text-decoration: none;
    }

    & p {
      margin: calc(10 / var(--font_size) * 1em) 0;
      line-height: calc(20 / var(--font_size) * 1em);

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    & ul {
      margin: calc(20 / var(--font_size) * 1em) 0;
    }

    & ol {
      padding-left: calc(40 / var(--font_size) * 1em);
      margin: calc(20 / var(--font_size) * 1em) 0;
    }

    & li {
      margin: calc(5 / var(--font_size) * 1em) 0;
    }

    & ul li {
      position: relative;
      padding-left: 1em;
      line-height: 1;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        content: "-";
      }
    }

    & hr {
      height: calc(4 / var(--font_size) * 1em);
      margin: 0 calc(-1 / var(--font_size) * 1em);
      background: var(--color__line);
      border: none;
    }

    & blockquote {
      padding: 1em;
      font-style: italic;
      color: var(--color__blockquoteText);
      background: var(--color__blockquoteBackground);

      & strong,
      & b {
        color: var(--color__blockquoteText);
      }
    }

    & code {
      display: inline-block;
      padding: calc(5 / var(--font_size) * 1em) calc(5 / var(--font_size) * 1em);
      margin: calc(5 / var(--font_size) * 1em) 0;
      line-height: calc(22 / var(--font_size) * 1em);
      color: var(--color__codeText);
      white-space: pre;
      background: var(--color__codeBackground);

      &::selection {
        color: var(--color__codeSelection);
      }
    }

    & pre {
      margin: calc(20 / var(--font_size) * 1em) 0;

      &::before {
        display: inline-block;
        margin-bottom: 0.5em;
        content: "Code:";
      }

      & > code {
        display: block;
        padding: calc(5 / var(--font_size) * 1em);
        margin: 0;
        white-space: pre;
        user-select: auto;
      }
    }

    & table {
      & th,
      & td {
        padding: calc(5 / var(--font_size) * 1em) calc(10 / var(--font_size) * 1em);
        line-height: normal;
      }

      & th {
        font-style: italic;
      }
    }
  }
}
</style>
