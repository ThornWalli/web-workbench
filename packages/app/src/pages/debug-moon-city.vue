<template>
  <div>
    <client-only>
      <app
        :debug="'debug' in $route.query"
        :debug-content="'debug-content' in $route.query"
        :intro="false" />
    </client-only>
  </div>
</template>

<script setup>
import { useRoute } from '#imports';
import App from '@web-workbench/disk-moon-city/components/App.vue';
const $route = useRoute();
</script>
