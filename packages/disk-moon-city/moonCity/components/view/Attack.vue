<template>
  <div class="mc-view-attack">
    <teleport to="#layout_content_1">
      <mc-frame-attack-primary />
    </teleport>
    <teleport to="#layout_content_2">
      <mc-frame-attack-secondary />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import McFrameAttackPrimary from '../frame/AttackPrimary.vue';
import McFrameAttackSecondary from '../frame/AttackSecondary.vue';
</script>
