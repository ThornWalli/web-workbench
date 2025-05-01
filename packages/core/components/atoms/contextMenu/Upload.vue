<template>
  <li class="wb-env-atom-context-menu-upload">
    <div class="inner">
      <span class="title">{{ title }}</span>
      <span v-if="hotKey" class="hotkey">
        <svg-control-context-input-hotkey /> {{ hotKey }}
      </span>
      <input :accept="accept" type="file" @change="onChange" />
    </div>
  </li>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted } from '#imports';
import { Subscription } from 'rxjs';
import domEvents from '../../../services/domEvents';
import SvgControlContextInputHotkey from '../../../assets/svg/control/context_item_hotkey.svg?component';

const $props = defineProps({
  title: { type: String, default: 'Item Title' },
  hotKey: { type: String, default: null },
  action: { type: Function, default: null },
  accept: { type: String, default: 'application/json' }
});
const $emit = defineEmits<{
  (e: 'files' | 'update:model-value', value: File[]): void;
}>();

const subscription = new Subscription();

onMounted(() => {
  nextTick(() => {
    if ($props.hotKey) {
      subscription.add(
        domEvents.keyDown.subscribe(e => {
          if (
            domEvents.cmdActive &&
            $props.hotKey?.charCodeAt(0) === e.keyCode
          ) {
            $props.action();
          }
        })
      );
    }
  });
});

onUnmounted(() => {
  subscription.unsubscribe();
});

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement | undefined;
  if (target && e instanceof InputEvent) {
    const files = Array.from(
      ((e.dataTransfer || e.target) as HTMLInputElement | DataTransfer).files ||
        []
    );
    target.value = '';
    if ($props.action) {
      $props.action(files);
    } else {
      $emit('files', files);
      $emit('update:model-value', files);
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-context-menu-upload {
  position: relative;

  --color-background: var(--color-context-menu-item-background, #fff);
  --color-hotkey: var(--color-context-menu-item-hotkey, #05a);
  --color-title: var(--color-context-menu-item-label, #05a);

  & > .inner {
    display: flex;
    flex-flow: row wrap;
    flex-wrap: nowrap;
    justify-content: flex-end;
    width: 100%;
    height: 20px;
    padding: 3px 4px;
    padding-bottom: 0;
    line-height: 16px;
    color: var(--label);
    white-space: nowrap;
    text-decoration: none;
    appearance: none;
    outline: none;
    background: var(--color-background);
    border: none;

    & > .title {
      display: block;
      flex: 1;
      color: var(--color-title);
      text-align: left;
    }

    & > .hotkey {
      display: inline-block;

      /* float: right; */
      justify-content: flex-end;
      padding-left: 10px;

      & svg {
        position: relative;
        top: -1px;
        display: inline-block;

        & :deep(.svg-primary) {
          fill: var(--color-hotkey);
        }
      }
    }
  }

  & input {
    position: absolute;
    inset: 0;
    opacity: 0;
  }

  .wb-atom-context-menu & {
    &:not(.disabled):hover > .inner,
    &:not(.disabled):active > .inner,
    &:not(.disabled).force-visible > .inner {
      /* padding-bottom: 1px; */
      filter: var(--filter-default);
    }
  }
}
</style>
