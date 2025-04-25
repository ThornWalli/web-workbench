<template>
  <page force-no-disk />
</template>

<script lang="ts" setup>
import { useHead } from '#imports';
import Page from '@/components/Page.vue';

useHead({
  title: 'Debug'
});
</script>
