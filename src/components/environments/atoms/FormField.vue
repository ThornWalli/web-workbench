<template>
  <div :is="tag" class="wb-env-atom-form-field" :class="styleClasses">
    <span
      v-if="label"
      class="field__label"
    ><slot name="label">{{ label }}</slot></span>
    <slot />
  </div>
</template>

<script>
export default {

  props: {

    labelTop: {
      type: Boolean,
      default: false
    },

    tag: {
      type: String,
      default: 'div'
    },
    label: {
      type: String,
      default: 'FormField Label'
    }

  },

  computed: {
    styleClasses () {
      return {
        'form-field--label-top': this.labelTop
      };
    }
  }

};
</script>

<style lang="postcss">
.wb-env-atom-form-field {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  margin: 5px;

  @nest fieldset > & {
    margin: 0;
  }

  line-height: 1;

  & > * {
    flex: 1;
  }

  & > .field__label {
    flex: 0;
    min-width: 100px;
    padding-top: 10px;
    line-height: 1;
    vertical-align: top;

    &::after {
      content: ":";
    }
  }

  &.form-field--label-top {
    & > * {
      display: block;
      width: 100%;
    }

    & > .field__label {
      padding-top: 0;
      margin-bottom: 5px;
    }
  }
}
</style>
