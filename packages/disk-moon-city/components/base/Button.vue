<template>
  <button
    :class="{ pressed }"
    @click="onPointerDown"
    @pointerup="onPointerLeave"
    @pointerleave="onPointerLeave">
    <slot />
  </button>
</template>

<script setup>
const pressed = ref(false);

const onPointerDown = () => {
  pressed.value = true;
};
const onPointerLeave = () => {
  pressed.value = false;
};
</script>

<style lang="postcss" scoped>
button {
  display: inline-block;
  padding: 0;
  margin: 0;
  font-size: 0;
  cursor: inherit;
  background: none;
  border: none;

  &[disabled] {
    pointer-events: none;
  }
}
</style>
