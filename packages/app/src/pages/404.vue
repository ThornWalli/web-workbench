<template>
  <page force-no-disk />
</template>

<script setup>
import { useHead } from '#imports';
import Page from '@/components/Page';

useHead({
  title: 'Debug'
});
</script>
