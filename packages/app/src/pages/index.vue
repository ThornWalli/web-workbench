<template>
  <div>
    <page :start-command="startCommand" />
  </div>
</template>

<script setup>
import Page from '@/components/Page';
import { useRoute, ref } from '#imports';

const route = useRoute();

const startCommand = ref(route.query['start-command'] || undefined);
</script>
