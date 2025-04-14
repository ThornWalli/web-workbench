<template>
  <page force-no-disk />
</template>

<script setup lang="ts">
import { useHead } from '#imports';
import Page from '@/components/Page.vue';

useHead({
  title: 'Debug'
});
</script>
