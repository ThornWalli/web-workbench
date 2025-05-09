<template>
  <div class="mc-view-overview">
    <teleport to="#layout_content_1">
      <mc-frame-city-primary />
    </teleport>
    <teleport to="#layout_content_2">
      <mc-frame-city-secondary />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import McFrameCityPrimary from '../frame/CityPrimary.vue';
import McFrameCitySecondary from '../frame/CitySecondary.vue';
</script>
