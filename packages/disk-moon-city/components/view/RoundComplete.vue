<template>
  <div class="mc-view-round-complete">
    <teleport to="#layout_screen">
      <mc-round-conmplete @complete="$emit('round-start')" />
    </teleport>
  </div>
</template>

<script setup>
import McRoundConmplete from '../RoundComplete.vue';

defineEmits(['round-start']);
</script>
