<template>
  <form class="wb-env-molecule-form" @submit="onSubmit">
    <slot>Form Content</slot>
  </form>
</template>

<script>
export default {
  methods: {
    onSubmit (e) {
      e.preventDefault();
      this.$emit('submit', e);
    }
  }
};
</script>

<style lang="postcss">
:root {
  --color__form__fieldsetBorder: #fa5;
}

.wb-env-molecule-form {
  width: 100%;

  & fieldset {
    padding: var(--default-element-margin) calc(var(--default-element-margin) * 2);
    border: solid var(--color__form__fieldsetBorder) 2px;

    & legend {
      padding: 0 10px;
      line-height: 1;
    }
  }

  & > p {
    margin: var(--default-element-margin);
  }

  & > hr,
  & > .wb-env-atom-button-wrapper,
  & > [class*=".wb-env-atom-form-field"] {
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
