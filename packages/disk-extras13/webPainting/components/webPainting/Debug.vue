<template>
  <wb-form class="wb-disks-extras13-web-painting-debug">
    <!-- Global Bounds: {{ modelValue.globalBounds }}<br>
    Display: {{ (modelValue.display || {}).id }}<br>
-->
    <div>
      Brush Select: {{ modelValue.brushSelect }}<br />
      Tool Select: {{ modelValue.toolSelect }}<br />
      Color Select: {{ modelValue.colorSelect }}
    </div>
    <div v-if="modelValue.display">
      Display Offset: {{ modelValue.display.offset }}<br />
      Canvas N. Size: {{ modelValue.display.canvasLayout.naturalSize }}<br />
      Canvas Position: {{ modelValue.display.canvasLayout.position }}<br />
      Zoom Factor: {{ modelValue.display.zoomFactor }}<br />
      Zoom Position: {{ modelValue.display.zoomPosition }}<br />
      Max Zoom Factor: {{ modelValue.display.maxZoomFactor }}<br />
      Zoom Bounds: {{ modelValue.display.zoomBounds.min }} |
      {{ modelValue.display.zoomBounds.max }}<br />
    </div>
  </wb-form>
</template>

<script lang="ts" setup>
import WbForm from '@web-workbench/core/components/fragments/Form.vue';

defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-debug {
  --color-web-painting-debug-background: #05a;
  --color-web-painting-debug-fieldset-border: #fff;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483648;
  display: flex;
  padding: 10px;
  background: var(--color-web-painting-debug-background);

  & fieldset {
    border: solid var(--color-web-painting-debug-fieldset-border) 2px;

    & legend {
      padding: 0 10px;
    }
  }
}

.wb-disks-extras13-web-painting + .wb-disks-extras13-web-painting-debug {
  margin-top: 25px;
}
</style>
