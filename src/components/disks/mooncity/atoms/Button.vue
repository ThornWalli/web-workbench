<template>
  <button class="wb-disks-mooncity-atoms-button" :class="styleClasses" :disabled="disabled" @click="onClick">
    {{ label }}
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Label'
    },
    styleType: {
      type: String,
      default: null
    }
  },
  computed: {
    styleClasses () {
      return {
        [`button--${this.styleType}`]: this.styleType
      };
    }
  },
  methods: {
    onClick () {
      this.$emit('click');
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atoms-button {
  --selected: 0;

  display: block;
  padding: 0;
  margin: 0;
  line-height: 1;
  color: #de9a10;
  border: none;
  -webkit-appearance: none;

  &[disabled] {
    padding: inherit !important;
    color: #888 !important;
    background-position: 0 0 !important;
  }

  &:hover {
    --selected: 1;
  }

  &.button--vehicle-cargo {
    width: 104px;
    height: 32px;
    background: url('~assets/disks/mooncity/img/controls/button_flat_medium.png');
    background-position-y: calc(var(--selected) * -32px);
    box-shadow: 2px 2px 0 rgb(51, 51, 51);
  }

  &.button--main-button {
    width: 34px;
    height: 36px;
    padding: 0;
    margin: 0;
    background: url("~assets/disks/mooncity/img/main_button.png");
    border: none;
    outline: none;
    appearance: none;
  }

}
</style>
