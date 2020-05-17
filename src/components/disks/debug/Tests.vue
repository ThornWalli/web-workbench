<template>
  <div class="wb-disks-debug-tests">
    <div class="splitter">
      <div>
        <div class="slider">
          <wb-radial-slider />
        </div>
      </div>
      <div>
        <wb-button-wrapper>
          <wb-button label="toggle theme-color" @click="onClickToggleThemeColor" />
        </wb-button-wrapper>
      </div>
    </div>
  </div>
</template>

<script>

import WbRadialSlider from '@/components/environments/atoms/RadialSlider';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: {
    WbButton,
    WbButtonWrapper,
    WbRadialSlider
  },

  mixins: [
    MixinWindowComponent
  ],

  data () {
    return {
      model: {
        toggle: false
      }
    };
  },
  methods: {
    onClickToggleThemeColor () {
      document.querySelector('[name="theme-color"]').setAttribute('content', this.toggle ? '#ff0000' : '#00ff00');
      this.toggle = !this.toggle;
    }
  }

};
</script>

<style lang="postcss">
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
