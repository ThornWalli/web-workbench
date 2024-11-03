<template>
  <div class="mc-view-overview">
    <teleport to="#layout_content_1">
      <mc-frame-overview-primary />
    </teleport>
    <teleport to="#layout_content_2">
      <mc-frame-overview-secondary>
        <mc-overview-garage ref="garage" />
      </mc-frame-overview-secondary>
    </teleport>
    <teleport to="#layout_screen">
      <mc-round-conmplete v-if="roundStart" @complete="$emit('round-start')" />
    </teleport>
  </div>
</template>

<script setup>
import McFrameOverviewPrimary from '../frame/OverviewPrimary.vue';
import McFrameOverviewSecondary from '../frame/OverviewSecondary.vue';
import McRoundConmplete from '../RoundComplete.vue';
import McOverviewGarage from '../overivew/Garage.vue';
import { watch } from 'vue';

const garage = ref(null);
const $props = defineProps({
  roundStart: {
    type: Boolean,
    default: false
  }
});

watch(
  () => $props.roundStart,
  () => {
    if (garage.value) {
      garage.value.unselect();
    }
  }
);

defineEmits(['round-start']);
</script>
