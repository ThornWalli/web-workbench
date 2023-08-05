<template>
  <fieldset>
    <legend>Record</legend>
    {{ notes.map(({note}) => note).join(' ') }}
  </fieldset>
</template>

<script>
export default {
  props: {
    notes: {
      type: Array,
      default () {
        return [];
      }
    }
  }
};
</script>
