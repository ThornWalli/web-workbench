<template>
  <div class="page-debug-boing">
    <client-only>
      <standalone />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const Standalone = defineAsyncComponent(
  () => import('@web-workbench/disk-extras13/boing/components/Standalone.vue')
);
</script>

<style lang="postcss" scoped>
.page-debug-boing {
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
