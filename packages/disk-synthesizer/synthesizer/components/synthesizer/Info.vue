<template>
  <div class="info">
    <span v-for="[title, value] in items" :key="title">
      {{ title }}: <strong>{{ value }}</strong>
    </span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  items: {
    type: Array as () => [string, string][],
    default: () => [
      ['Item A', 'Value A'],
      ['Item B', 'Value B'],
      ['Item C', 'Value C'],
      ['Item D', 'Value D']
    ]
  }
});
</script>

<style lang="postcss" scoped>
.info {
  --color-info-background: var(--color-synthesizer-info-background, #fff);
  --color-info-color: var(--color-synthesizer-info-background, #05a);

  /* display: flex; */
  gap: 0;
  width: 100%;
  padding: 2px;
  padding-bottom: 0;
  color: var(--color-info-color);

  /* line-height: 1; */
  background: var(--color-info-background);

  & span {
    line-height: 16px;

    &:not(:last-child) {
      &::after {
        display: inline-block;
        margin: 0 5px;
        content: '|';
      }
    }
  }
}
</style>
