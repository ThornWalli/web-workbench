
<template>
  <page :no-disk="true" />
</template>

<script setup>

import { useHead } from '#imports';
import Page from '@/components/Page';

useHead({
  title: 'Debug'
});

</script>

