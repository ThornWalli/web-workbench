<template>
  <component :is="tag" class="wb-env-atom-form-field" :class="styleClasses">
    <div>
      <span v-if="!hideLabel && label" class="label">
        <slot name="label">{{ label }}</slot>
      </span>
      <slot />
    </div>
    <slot name="after" />
  </component>
</template>

<script setup>
import { computed } from 'vue';

const $props = defineProps({
  embed: {
    type: Boolean,
    default: false
  },

  hideLabel: {
    type: Boolean,
    default: false
  },

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
});

const styleClasses = computed(() => {
  return {
    embed: $props.embed,
    'label-top': $props.labelTop
  };
});
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  gap: var(--default-element-margin);
  align-items: center;
  line-height: 1;

  &:not(.embed) {
    margin: var(--default-element-margin);
  }

  & > div {
    display: flex;
    flex: 1;
    flex-wrap: nowrap;
    gap: 0 20px;

    & > * {
      flex: 1;
    }

    & > .label {
      flex: 0;
      min-width: 80px;
      padding-top: 10px;
      line-height: 1;
      vertical-align: top;

      &::after {
        content: ':';
      }
    }
  }

  &.label-top {
    & > div {
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
}
</style>
