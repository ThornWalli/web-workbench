<template>
  <div class="mc-view-stats">
    <teleport to="#layout_content_1">
      <mc-frame-stats-primary />
    </teleport>
    <teleport to="#layout_content_2">
      <mc-frame-stats-secondary />
    </teleport>
  </div>
</template>

<script setup>
import McFrameStatsPrimary from '../frame/StatsPrimary.vue';
import McFrameStatsSecondary from '../frame/StatsSecondary.vue';
</script>
