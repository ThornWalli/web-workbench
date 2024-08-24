<template>
  <wb-form class="wb-disks-extras13-web-painting-debug">
    <!-- Global Bounds: {{ model.globalBounds }}<br>
    Display: {{ (model.display || {}).id }}<br>

    Brush Select: {{ model.brushSelect }}<br>
    Tool Select: {{ model.toolSelect }}<br>
    Color Select: {{ model.colorSelect }} -->

    <div v-if="model.display">
      Display Offset: {{ model.display.offset }}<br />
      Canvas N. Size: {{ model.display.canvasLayout.naturalSize }}<br />
      Canvas Position: {{ model.display.canvasLayout.position }}<br />
      Zoom Factor: {{ model.display.zoomFactor }}<br />
      Zoom Position: {{ model.display.zoomPosition }}<br />
      Max Zoom Factor: {{ model.display.maxZoomFactor }}<br />
      Zoom Bounds: {{ model.display.zoomBounds.min }} |
      {{ model.display.zoomBounds.max }}<br />
    </div>
  </wb-form>
</template>

<script>
import WbForm from '@web-workbench/core/components/molecules/Form';

export default {
  components: {
    WbForm
  },

  props: {
    model: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      fields: {
        zoom: {
          label: 'Zoom',
          name: 'zoom'
        }
      },
      removeButton: { label: 'Remove' },
      applyButton: {
        label: 'Apply'
      }
    };
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-debug {
  --color-web-painting-debug-background: #05a;
  --color-web-painting-debug-fieldset-border: #fff;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483648;
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
