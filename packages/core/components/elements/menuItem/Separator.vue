<template>
  <li class="wb-env-element-context-menu-separator">
    <span />
  </li>
</template>

<style lang="postcss" scoped>
.wb-env-element-context-menu-separator {
  --color-background: var(--color-context-menu-separator-background, #05a);

  display: flex;
  align-items: center;

  & span {
    display: block;
    width: 100%;
    height: 2px;
    background: var(--color-background);
  }

  .wb-element-context-menu & {
    & span {
      width: 2px;
      height: calc(100% - 4px);
    }
  }

  .wb-element-context-menu .wb-element-context-menu & {
    & span {
      width: 100%;
      height: 2px;
    }
  }
}
</style>
