<template>
  <li class="wb-env-atom-context-menu-separator">
    <span />
  </li>
</template>

<style lang="postcss" scoped>
.wb-env-atom-context-menu-separator {
  --color__background: var(--color__contextMenuSeparator__background, #05a);

  & span {
    display: block;
    width: 100%;
    height: 2px;

    &::before {
      display: block;
      width: 100%;
      height: 100%;
      content: "";
      background: var(--color__background);
    }

    .wb-atom-context-menu > li > & {
      &::before {
        height: 1em;
      }
    }

    .wb-atom-context-menu .wb-atom-context-menu & {
      width: 100%;

      &::before {
        width: 100%;
        height: 2px;
      }
    }
  }
}
</style>
