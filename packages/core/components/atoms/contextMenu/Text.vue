<template>
  <li class="wb-env-atom-context-menu-text">
    <div class="inner">
      <span class="title">{{ text }}</span>
    </div>
  </li>
</template>

<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: ''
  }
});
</script>

<style lang="postcss" scoped>
.wb-env-atom-context-menu-text {
  --color-background: var(--color-context-menu-item-background, #fff);

  & > .inner {
    display: flex;
    flex-flow: row wrap;
    flex-wrap: nowrap;
    justify-content: flex-end;
    width: 100%;
    height: 20px;
    padding: 3px 4px;
    padding-bottom: 0;
    line-height: 16px;
    color: var(--label);
    white-space: nowrap;
    text-decoration: none;
    appearance: none;
    outline: none;
    background: var(--color-background);
    border: none;

    & > .title {
      display: block;
      flex: 1;
      text-align: left;
    }
  }
}
</style>
