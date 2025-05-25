<template>
  <component
    :is="tag || defaultTag"
    class="wb-env-element-form-field"
    :class="styleClasses">
    <div>
      <span
        v-if="!hideLabel && currentLabel && currentAlign === ALIGN.LEFT"
        class="label colon"
        :class="{ required }">
        <slot name="label">{{ currentLabel }}</slot>
      </span>
      <slot
        v-bind="{
          required,
          id,
          fluid
        }" />
      <label
        v-if="!hideLabel && currentLabel && currentAlign === ALIGN.RIGHT"
        :for="id"
        class="label">
        <slot name="label">{{ currentLabel }}</slot>
      </label>
    </div>
    <slot name="after" />
  </component>
</template>

<script lang="ts" setup>
import { computed, useId } from 'vue';

const id = useId();

const defaultLabelAlign = ALIGN.LEFT;
const defaultTag = 'div';
const defaultLabel = 'FormField Label';

const $props = defineProps<{
  embed?: boolean;
  hideLabel?: boolean;
  labelTop?: boolean;
  labelAlign?: ALIGN | `${ALIGN}`;
  tag?: string;
  label?: string;
  fluid?: boolean;
  required?: boolean;
}>();

const currentAlign = computed(() => {
  return $props.labelAlign || defaultLabelAlign;
});
const currentLabel = computed(() => {
  return $props.label || defaultLabel;
});

// const $props = defineProps({
//   embed: {
//     type: Boolean,
//     default: false
//   },

//   hideLabel: {
//     type: Boolean,
//     default: false
//   },

//   labelTop: {
//     type: Boolean,
//     default: false
//   },

//   labelAlign: {
//     type: String,
//     default: 'left'
//   },

//   tag: {
//     type: String,
//     default: 'div'
//   },
//   label: {
//     type: String,
//     default: 'FormField Label'
//   }
// });

const styleClasses = computed(() => {
  return {
    embed: $props.embed,
    'label-top': $props.labelTop
  };
});
</script>

<script lang="ts">
export enum ALIGN {
  LEFT = 'left',
  RIGHT = 'right'
}
</script>

<style lang="postcss" scoped>
.wb-env-element-form-field {
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

      /* padding-top: 10px; */
      line-height: 1;
      vertical-align: top;

      &.colon::after {
        content: ':';
      }

      &.required::before {
        margin-left: 5px;
        content: '*';
      }
    }
  }

  &:not(.label-top) {
    & > div {
      align-items: center;
    }
  }

  &.label-top {
    & > div {
      flex-direction: column;
      gap: 5px;

      & > * {
        display: block;
        width: 100%;
      }

      & > .label {
        padding-top: 0;
      }
    }
  }

  &.fluid {
    & > div {
      height: 100%;
    }
  }
}
</style>
