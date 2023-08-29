<template>
  <li class="wb-env-atom-context-menu-separator">
    <span />
  </li>
</template>

<style lang="postcss" scoped>
.wb-env-atom-context-menu-separator {
  --color-background: var(--color-context-menu-separator-background, #05a);

  display: flex;
  align-items: center;

  & span {
    display: block;
    width: 100%;
    height: 2px;
    background: var(--color-background);

    /* .wb-atom-context-menu > li > & {
      &::before {
        height: 1em;
      }
    } */

    /* .wb-atom-context-menu & {
      width: 2px;
      height: 1em;

      &::before {
        width: 100%;
        height: 1em;
      }
    } */
  }

  .wb-atom-context-menu & {
    & span {
      width: 2px;
      height: calc(100% - 4px);
    }
  }

  .wb-atom-context-menu .wb-atom-context-menu & {
    & span {
      width: 100%;
      height: 2px;
    }
  }
}
</style>
