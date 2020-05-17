<template>
  <div
    class="wb-env-atom-markdown"
    v-html="parsedContent"
  />
</template>

<script>

import marked from 'marked';

export default {
  props: {
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
  },
  computed: {
    parsedContent () {
      return marked(this.content);
    }
  }
};
</script>

<style lang="postcss">
:root {
  --color__markdown__typo__selection: #000;
  --color__markdown__typo__headlinePrimary: #fff;
  --color__markdown__typo__headlineSecondary: #fa5;
  --color__markdown__typo__strong: #fa5;
  --color__markdown__typo__strongEm: #fff;
  --color__markdown__typo__link: #fa5;
  --color__markdown__typo__linkHover: #fff;
  --color__markdown__typo__del: #000;
  --color__markdown__typo__line: #fff;
  --color__markdown__typo__blockquoteBackground: #fa5;
  --color__markdown__typo__blockquoteText: #000;
  --color__markdown__typo__codeBackground: #fff;
  --color__markdown__typo__codeText: #000;
  --color__markdown__typo__codeSelection: #fa5;
  --font__markdown__typo__headlinePrimary: var(--workbenchFont_topaz);
  --font__markdown__typo__headlineSecondary: var(--workbenchFont_topaz);
  --font__markdown__typo__text: var(--workbenchFont_topaz);
  --font__markdown__typo__code: var(--workbenchFont_topaz);
  --font__markdown__typo__blockquote: var(--workbenchFont_topaz);
  --font_size__markdown: 16;
}

.wb-env-atom-markdown {
  --font_size: 16;

  font-size: calc(var(--font_size__markdown) * 1px);

  & * {
    font-family: var(--font__markdown__typo__text);
    font-size: 1em;
    font-weight: normal;
    letter-spacing: normal;
  }

  &,
  & :not(input) {
    user-select: text;

    &::selection {
      color: var(--color__markdown__typo__selection);
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
    font-family: var(--font__markdown__typo__headlinePrimary);
    font-size: 2em;
    color: var(--color__markdown__typo__headlinePrimary);
    letter-spacing: calc(2 / var(--font_size) * 1rem);

    &:first-child {
      margin-top: 0;
    }
  }

  & h2 {
    font-family: var(--font__markdown__typo__headlineSecondary);
    font-size: 2em;
    color: var(--color__markdown__typo__headlineSecondary);
    letter-spacing: calc(2 / var(--font_size) * 1em);
  }

  & h3 {
    font-family: var(--font__markdown__typo__headlinePrimary);
    font-size: calc(24 / var(--font_size) * 1em);
    color: var(--color__markdown__typo__headlinePrimary);
    letter-spacing: calc(1.5 / var(--font_size) * 1em);
  }

  & h4 {
    font-family: var(--font__markdown__typo__headlineSecondary);
    font-size: 1em;
    color: var(--color__markdown__typo__headlineSecondary);
    letter-spacing: calc(1.5 / var(--font_size) * 1em);
  }

  & h5 {
    font-family: var(--font__markdown__typo__headlinePrimary);
    font-size: 1em;
    color: var(--color__markdown__typo__headlinePrimary);
    letter-spacing: calc(1.5 / var(--font_size) * 1em);
  }

  & h6 {
    font-family: var(--font__markdown__typo__headlineSecondary);
    color: var(--color__markdown__typo__headlineSecondary);
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
    color: var(--color__markdown__typo__strong);

    & em {
      color: var(--color__markdown__typo__strongEm);
    }
  }

  & a {
    color: var(--color__markdown__typo__link);
    text-decoration: none;

    &::after {
      font-size: 1em;
      content: "\00a0- [Link]";
    }

    &:hover {
      &,
      &::after {
        color: var(--color__markdown__typo__linkHover);
      }
    }
  }

  & del {
    color: var(--color__markdown__typo__del);
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
    background: var(--color__markdown__typo__line);
    border: none;
  }

  & blockquote {
    padding: 1em;
    font-style: italic;
    color: var(--color__markdown__typo__blockquoteText);
    background: var(--color__markdown__typo__blockquoteBackground);

    & strong,
    & b {
      color: var(--color__markdown__typo__blockquoteText);
    }
  }

  & code {
    display: inline-block;
    padding: calc(5 / var(--font_size) * 1em) calc(5 / var(--font_size) * 1em);
    margin: calc(5 / var(--font_size) * 1em) 0;
    line-height: calc(22 / var(--font_size) * 1em);
    color: var(--color__markdown__typo__codeText);
    white-space: pre;
    background: var(--color__markdown__typo__codeBackground);

    &::selection {
      color: var(--color__markdown__typo__codeSelection);
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
</style>
