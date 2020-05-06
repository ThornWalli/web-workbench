<template>
  <div class="wb-disks-debug-tests">
    <wb-button-wrapper>
      <wb-button label="toggle theme-color" @click="onClickToggleThemeColor" />
    </wb-button-wrapper>
  </div>
</template>

<script>

import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: {
    WbButton,
    WbButtonWrapper
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

}
</style>
