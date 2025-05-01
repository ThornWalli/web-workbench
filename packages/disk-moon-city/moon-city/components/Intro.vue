<template>
  <div
    ref="rootEl"
    class="mc-intro"
    :class="{ hide: isHidden, animate }"
    @click="onClick"
    @transitionstart="onTransitionstart"
    @transitionend="onTransitionend">
    <img src="../assets/graphics/intro/default.png" alt="Moon City" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const $props = defineProps({
  hidden: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 3000
  },
  delay: {
    type: Number,
    default: 1000
  }
});

let _resolve = null;
let timeout;

const onClick = () => {
  window.clearTimeout(timeout);
  isHidden.value = true;
};

const animate = ref(false);
const rootEl = ref(null);
const onTransitionstart = e => {
  if (e.target === rootEl.value && e.propertyName === 'opacity') {
    animate.value = true;
  }
};
const onTransitionend = e => {
  if (e.target === rootEl.value && e.propertyName === 'opacity') {
    window.setTimeout(
      () => {
        if (_resolve) {
          _resolve();
        }
        _resolve = null;
        animate.value = false;
      },
      isHidden.value ? 450 : 0
    );
  }
};
const isHidden = ref($props.hidden);
const start = async () => {
  const { promise, resolve } = Promise.withResolvers();
  await show();
  window.clearTimeout(timeout);
  _resolve = resolve;
  timeout = window.setTimeout(async () => {
    isHidden.value = true;
  }, $props.duration);
  return promise;
};

const show = () => {
  const { promise, resolve } = Promise.withResolvers();
  _resolve = resolve;
  window.setTimeout(async () => {
    isHidden.value = false;
  }, $props.delay);
  return promise;
};

defineExpose({
  start
});
</script>

<style lang="postcss" scoped>
.mc-intro {
  transition: opacity 0.4s steps(4);

  &.hide {
    opacity: 0;
  }

  &.animate {
    pointer-events: none;
  }

  & img {
    display: block;
    width: 100%;
  }
}
</style>
