<template>
  <component :is="tag" class="wb-env-atom-form-field" :class="styleClasses">
    <span
      v-if="label"
      class="label"
    ><slot name="label">{{ label }}</slot></span>
    <slot />
  </component>
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
        'label-top': this.labelTop
      };
    }
  }

};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field {
  position: relative;
  display: flex;
  flex-wrap: nowrap;

  /* align-items: flex-start; */
  margin: var(--default-element-margin);
  line-height: 1;

  & > * {
    flex: 1;
  }

  & > .label {
    flex: 0;
    min-width: 100px;
    padding-top: 10px;
    line-height: 1;
    vertical-align: top;

    &::after {
      content: ":";
    }
  }

  &.label-top {
    flex-direction: column;

    & > * {
      display: block;
      width: 100%;
    }

    & > .label {
      padding-top: 0;
      margin-bottom: 5px;
    }
  }
}
</style>
