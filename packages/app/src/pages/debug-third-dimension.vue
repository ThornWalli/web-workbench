<template>
  <div class="test-page">
    <client-only>
      <test />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const Test = defineAsyncComponent(
  () => import('@web-workbench/disk-third-dimension/third-dimension/Test.vue')
);
</script>

<style lang="postcss" scoped>
.test-page {
  position: fixed;
  top: 0;
  left: 0;

  /* display: flex;
  align-items: center;
  justify-content: center; */
  width: 100%;
  height: 100%;
}
</style>
