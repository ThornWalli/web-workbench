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
}

.wb-env-atom-markdown {
  & * {
    font-family: var(--font__markdown__typo__text);
    font-size: 16px;
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
    font-weight: normal;
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
    margin: 20px 0;
    margin-bottom: 5px;
    font-family: var(--font__markdown__typo__headlinePrimary);
    font-size: 32px;
    color: var(--color__markdown__typo__headlinePrimary);
    letter-spacing: 2px;

    &:first-child {
      margin-top: 0;
    }
  }

  & h2 {
    font-family: var(--font__markdown__typo__headlineSecondary);
    font-size: 32px;
    color: var(--color__markdown__typo__headlineSecondary);
    letter-spacing: 2px;
  }

  & h3 {
    font-family: var(--font__markdown__typo__headlinePrimary);
    font-size: 24px;
    color: var(--color__markdown__typo__headlinePrimary);
    letter-spacing: 1.5px;
  }

  & h4 {
    font-family: var(--font__markdown__typo__headlineSecondary);
    font-size: 16px;
    color: var(--color__markdown__typo__headlineSecondary);
    letter-spacing: 1.5px;
  }

  & h5 {
    font-family: var(--font__markdown__typo__headlinePrimary);
    font-size: 16px;
    color: var(--color__markdown__typo__headlinePrimary);
    letter-spacing: 1.5px;
  }

  & h6 {
    font-family: var(--font__markdown__typo__headlineSecondary);
    color: var(--color__markdown__typo__headlineSecondary);
    letter-spacing: 1.5px;
  }

  & h5,
  & h6 {
    font-size: 16px;
  }

  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin: 5px 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  & strong,
  & b {
    font-weight: normal;
    color: var(--color__markdown__typo__strong);

    & em {
      color: var(--color__markdown__typo__strongEm);
    }
  }

  & a {
    color: var(--color__markdown__typo__link);
    text-decoration: none;

    &::after {
      font-size: 16px;
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
    margin: 10px 0;
    line-height: 20px;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  & ul,
  & ol {
    margin: 20px 0;
  }

  & li {
    margin: 5px 0;
  }

  & ul li {
    position: relative;
    padding-left: 1rem;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: "-";
    }
  }

  & hr {
    height: 4px;
    margin: 0 -1px;
    background: var(--color__markdown__typo__line);
    border: none;
  }

  & blockquote {
    padding: 1rem;
    font-style: italic;
    color: var(--color__markdown__typo__blockquoteText);
    background: var(--color__markdown__typo__blockquoteBackground);
  }

  & code {
    display: inline-block;
    padding: 5px 2px;
    line-height: 22px;
    color: var(--color__markdown__typo__codeText);
    white-space: pre;
    background: var(--color__markdown__typo__codeBackground);

    &::selection {
      color: var(--color__markdown__typo__codeSelection);
    }
  }

  & pre {
    margin: 20px 0;

    &::before {
      display: inline-block;
      margin-bottom: 0.5em;
      content: "Code:";
    }

    & > code {
      display: block;
      padding: 5px;
      margin: 0;
      white-space: pre;
      user-select: auto;
    }
  }

  & table {
    & th,
    & td {
      padding: 5px 10px;
      line-height: normal;
    }

    & th {
      font-style: italic;
    }
  }
}
</style>
