<template>
  <li class="wb-env-atom-context-menu-separator">
    <span />
  </li>
</template>

<style lang="postcss">

:root {
  --color__contextMenuSeparator__background: #05a;
}

.wb-env-atom-context-menu-separator {
  & span {
    display: block;
    width: 100%;
    height: 2px;

    &::before {
      display: block;
      width: 100%;
      height: 100%;
      content: "";
      background: var(--color__contextMenuSeparator__background);
    }

    .wb-atom-context-menu > li > & {
      &::before {
        height: 1em;
      }
    }

    @nest .wb-atom-context-menu .wb-atom-context-menu & {
      width: 100%;

      &::before {
        width: 100%;
        height: 2px;
      }
    }
  }
}
</style>
