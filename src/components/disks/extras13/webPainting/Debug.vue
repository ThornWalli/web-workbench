<template>
  <wb-form class="wb-disks-extras13-web-painting-debug">
    <!-- Global Bounds: {{ model.globalBounds }}<br>
    Display: {{ (model.display || {}).id }}<br>

    Brush Select: {{ model.brushSelect }}<br>
    Tool Select: {{ model.toolSelect }}<br>
    Color Select: {{ model.colorSelect }} -->

    <div v-if="model.display">
      <!-- Display Bounds: {{ model.display.bounds.min }} | {{ model.display.bounds.max }}<br>

      Display Size: {{ model.display.size }}<br> -->
      Display Offset: {{ model.display.offset }}<br>
      Canvas N. Size: {{ model.display.canvasLayout.naturalSize }}<br>
      Canvas Position: {{ model.display.canvasLayout.position }}<br>
      Zoom Factor: {{ model.display.zoomFactor }}<br>
      Zoom Position: {{ model.display.zoomPosition }}<br>
      Max Zoom Factor: {{ model.display.maxZoomFactor }}<br>
      Zoom Bounds: {{ model.display.zoomBounds.min }} | {{ model.display.zoomBounds.max }}<br>
    </div>

    <!-- Model Primary Color: {{ (model || {}).primaryColor }}<br>
    Model Secondary Color: {{ (model || {}).secondaryColor }}<br>
    Primary Color: {{ (model.brush || {}).primaryColor }}<br>
    Secondary Color: {{ (model.brush || {}).secondaryColor }}<br>
    {{ model.displaySplit }} -->

    <!-- <fieldset>
      <legend>
        Display: {{ model.displayId }}
      </legend>
      <wb-button style-type="secondary" v-bind="removeButton" />
      <!-- {{{mixin "atoms/button/secondary" title="Remove" hook="debugDisplayRemove"}}} -->
    <!-- <div>
      <wb-textbox v-bind="fields.zoom" :model="model" />
      <wb-button style-type="primary" v-bind="applyButton" />
 {{{mixin "atoms/field/textbox" value=zoom label="Zoom" hook="debugDisplayZoomInput" placeholder="1"}}}
        {{{mixin "atoms/button/primary" title="Apply" hook="debugDisplayZoomFactorApply"}}}
    </div>
    </fieldset>  -->
  </wb-form>
</template>

<script>

import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbTextbox from '@/components/environments/atoms/formField/Textbox';

export default {

  components: {
    WbForm, WbTextbox, WbButton
  },

  props: {
    model: {
      type: Object,
      default () {
        return {
        };
      }
    }
    // model: {
    //   type: Object,
    //   default () {
    //     return {
    //       displayId: 0,
    //       zoom: 0
    //     };
    //   }
    // }
  },

  data () {
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

<style lang="postcss">

.wb-disks-extras13-web-painting-debug {
  --color__webPaintingDebug__background: #0055ad;
  --color__webPaintingDebug__fieldsetBorder: #fff;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483648;
  padding: 10px;
  background: var(--color__webPaintingDebug__background);

  & fieldset {
    border: solid var(--color__webPaintingDebug__fieldsetBorder) 2px;

    & legend {
      padding: 0 10px;
    }
  }
}

.wb-disks-extras13-web-painting + .wb-disks-extras13-web-painting-debug {
  margin-top: 25px;
}
</style>
