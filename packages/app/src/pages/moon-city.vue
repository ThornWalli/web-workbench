<template>
  <div>
    <client-only>
      <app :debug="true" :intro="false" />
    </client-only>
  </div>
</template>

<script setup>
import App from '@web-workbench/disk-moon-city/components/App.vue';
</script>
