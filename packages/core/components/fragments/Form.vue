<template>
  <form class="wb-env-fragment-form" @submit="onSubmit">
    <slot>Form Content</slot>
  </form>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'submit', value: Event): void;
}>();

const onSubmit = (e: Event) => {
  e.preventDefault();
  emit('submit', e);
};
</script>

<style lang="postcss" scoped>
.wb-env-fragment-form {
  --color-fieldset-border: var(--color-form-fieldset-border, #fa5);

  width: 100%;

  & fieldset {
    padding: var(--default-element-margin)
      calc(var(--default-element-margin) * 2);
    border: solid var(--color-fieldset-border) 2px;

    & legend {
      padding: 0 10px;
      line-height: 1;
    }
  }

  & > p {
    margin: var(--default-element-margin);
  }

  & > hr,
  & > .wb-env-element-button-wrapper,
  & > [class*='.wb-env-element-form-field'] {
    margin: var(--default-element-margin) 2px;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
