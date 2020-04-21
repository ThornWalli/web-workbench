<template>
  <li class="wb-env-atom-context-menu-separator">
    <span />
  </li>
</template>

<story
  name="Separator"
  group="Environments/Atoms/ContextMenu"
  knobs="{}">

  <Item />
</story>

<style lang="postcss">
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
      background: var(--workbenchColor_3);
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
