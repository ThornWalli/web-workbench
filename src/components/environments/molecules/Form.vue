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
.wb-env-molecule-form {
  width: 100%;

  & fieldset {
    padding: var(--default-element-margin) calc(var(--default-element-margin) * 2);
    border: solid var(--workbenchColor_4) 2px;

    & legend {
      padding: 0 10px;
      line-height: 1;

      /* background: $workbenchColor_4; */

      /* color: white; */
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
