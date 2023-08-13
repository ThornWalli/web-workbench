<template>
  <div class="wb-disks-debug-tests">
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

import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbFormFieldRangeSlider
  },

  props: {
    ...windowProps
  },
  emits: [...windowEmits],

  setup(props, context) {
    return useWindow(props, context);
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
        name: 'fieldRangeSlider',
        model: this.model,
        max: 255,
        min: 0,
        step: 1,
        handleSize: 0.2,
        directionVertical: true
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
