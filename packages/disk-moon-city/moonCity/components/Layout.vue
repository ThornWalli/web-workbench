<template>
  <div
    ref="rootEl"
    :class="{ hide, animate }"
    class="mc-layout"
    @transitionstart="onTransitionstart"
    @transitionend="onTransitionend">
    <div class="frame frame-1"><slot name="name" /></div>
    <div class="frame frame-2"><slot name="credits" /></div>
    <div class="frame frame-3"><slot name="date" /></div>
    <div class="frame frame-4"><slot name="round" /></div>
    <div class="frame frame-5"><slot name="audio" /></div>
    <div id="layout_content_1" class="frame frame-6">
      <slot name="content-1" />
    </div>
    <div id="layout_screen" class="frame frame-7">
      <slot name="screen" />
    </div>
    <div id="layout_content_2" class="frame frame-8">
      <slot name="content-2" />
    </div>
    <div class="frame frame-9">
      <slot name="menu" />
    </div>
    <div class="frame frame-10"><slot name="button" /></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const $props = defineProps({
  hidden: {
    type: Boolean,
    default: false
  }
});

const animate = ref<boolean>(false);
const rootEl = ref<HTMLElement | null>();
const onTransitionstart = (e: TransitionEvent) => {
  if (e.target === rootEl.value && e.propertyName === 'transform') {
    animate.value = true;
  }
};
const onTransitionend = (e: TransitionEvent) => {
  if (e.target === rootEl.value && e.propertyName === 'transform') {
    window.setTimeout(
      () => {
        if (typeof _resolve === 'function') {
          _resolve();
        }
        _resolve = undefined;
        animate.value = false;
      },
      hide.value ? 450 : 0
    );
  }
};

const hide = ref($props.hidden);
let _resolve: CallableFunction | undefined;
defineExpose({
  show: () => {
    const { promise, resolve } = Promise.withResolvers();
    _resolve = resolve;
    hide.value = false;
    return promise;
  },
  hide: () => {
    const { promise, resolve } = Promise.withResolvers();
    _resolve = resolve;
    hide.value = true;
    return promise;
  }
});
</script>

<style lang="postcss" scoped>
.mc-layout {
  position: relative;
  width: 640px;
  min-width: 640px;
  height: 400px;
  min-height: 400px;
  background: var(--mc-color-black) url('../assets/graphics/layout/main.png');
  background-repeat: no-repeat;
  background-size: contain;
  -webkit-font-smoothing: auto;
  transition:
    transform 0.35s ease-in-out,
    opacity 0.35s ease-in-out;

  &.hide {
    opacity: 0;
    transform: translateY(-100%);
  }

  &.animate {
    pointer-events: none;
  }

  & .frame {
    position: absolute;
    display: flex;
  }

  & .frame-1 {
    top: 6px;
    left: 16px;
    width: 124px;
    height: 14px;
  }

  & .frame-2 {
    top: 6px;
    left: 150px;
    width: 134px;
    height: 14px;
  }

  & .frame-3 {
    top: 6px;
    left: 294px;
    width: 134px;
    height: 14px;
  }

  & .frame-4 {
    top: 6px;
    left: 438px;
    width: 60px;
    height: 14px;
  }

  & .frame-5 {
    top: 6px;
    left: 508px;
    width: 72px;
    height: 14px;
  }

  & .frame-6 {
    top: 26px;
    left: 0;
    width: 288px;
    height: 374px;
  }

  & .frame-7 {
    top: 52px;
    left: 304px;
    width: 322px;
    height: 154px;
  }

  & .frame-8 {
    top: 234px;
    left: 288px;
    width: 352px;
    height: 114px;
  }

  & .frame-9 {
    top: 350px;
    left: 292px;
    width: 348px;
    height: 50px;
  }

  & .frame-10 {
    top: 0;
    right: 0;
    width: 34px;
    height: 36px;
  }
}
</style>
