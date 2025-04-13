<template>
  <div class="wb-disks-debug-tests">
    <div>
      !"\#$%&'()*+,-./0123456789:;&lt;=&gt;?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»…ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ
    </div>
    <wb-form-field-range-slider v-bind="fieldRangeSlider" label-top />

    <div class="splitter">
      <div>
        <pre>{{ model }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import WbFormFieldRangeSlider from '@web-workbench/core/components/atoms/formField/RangeSlider';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbFormFieldRangeSlider
  },

  setup() {
    return useWindow();
  },

  data() {
    return {
      model: {
        fieldRangeSlider: false
      }
    };
  },

  computed: {
    fieldRangeSlider() {
      return {
        styleType: 'color-select',
        max: 255,
        min: 0,
        step: 1,
        handleSize: 0.2,
        directionVertical: true,
        modelValue: this.model.fieldRangeSlider,
        'onUpdate:model-value': value => (this.model.fieldRangeSlider = value)
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-debug-tests {
  min-width: 380px;
  height: 100%;

  & .slider {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & > * {
      width: 120px;
      height: 120px;
    }
  }

  & .splitter {
    display: flex;
    height: 100%;

    & > div {
      position: relative;
      flex: 1;
      height: 100%;
    }
  }
}
</style>
