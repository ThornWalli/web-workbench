<template>
  <li class="wb-env-element-context-menu-upload">
    <div class="inner">
      <span v-if="item.title" class="title">{{ item.title }}</span>
      <span v-if="hotKey" class="hotkey">
        <!-- <svg-control-context-input-hotkey
          v-if="hotKey.alt || hotKey.ctrl || hotKey.cmd" /> -->
        <svg-control-context-input-shift v-if="hotKey.shift" />
        <svg-control-context-input-option v-if="!isMac && hotKey.alt" />
        <svg-control-context-input-alt v-else-if="hotKey.alt" />
        <svg-control-context-input-control-osx
          v-if="isMac && (hotKey.ctrl || hotKey.meta)" />
        <svg-control-context-input-control
          v-else-if="hotKey.ctrl || hotKey.meta" />
        <span>{{ hotKey.title }}</span>
      </span>
      <input
        ref="inputEl"
        :accept="currentAccept"
        :multiple="item.multiple"
        type="file"
        @change="onChange" />
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { nextTick, onMounted, onUnmounted } from '#imports';
import { Subscription } from 'rxjs';
import domEvents from '../../../services/domEvents';
// import SvgControlContextInputHotkey from '../../../assets/svg/control/context_item_hotkey.svg?component';
import SvgControlContextInputShift from '../../../assets/svg/control/context_item_shift.svg?component';
import SvgControlContextInputAlt from '../../../assets/svg/control/context_item_alt.svg?component';
import SvgControlContextInputControl from '../../../assets/svg/control/context_item_control.svg?component';
import SvgControlContextInputControlOsx from '../../../assets/svg/control/context_item_control_osx.svg?component';
import SvgControlContextInputOption from '../../../assets/svg/control/context_item_option.svg?component';
import type { MenuItemUpload } from '@web-workbench/core/classes/MenuItem';
import type Core from '@web-workbench/core/classes/Core';
import { isMacOS } from '@web-workbench/core/services/dom';

const isMac = ref(isMacOS());
const defaultAccept = 'application/json';

const inputEl = ref<HTMLInputElement>();

const closeContextMenu = inject('closeContextMenu', () => void 0);
defineExpose({ closeContextMenu });

const $props = defineProps<{
  core?: Core;
  item: MenuItemUpload;
}>();

const hotKey = computed(() => $props.item.hotKey);

const currentAccept = computed(() => {
  if (Array.isArray($props.item.accept)) {
    return $props.item.accept.join(',');
  }
  return $props.item.accept || defaultAccept;
});

const $emit = defineEmits<{
  (e: 'files' | 'update:model-value', value: File[]): void;
}>();

const subscription = new Subscription();

onMounted(() => {
  nextTick(() => {
    if ($props.item.hotKey && $props.item.action) {
      subscription.add(
        domEvents.keyDown$.subscribe(e => {
          if (
            $props.item.hotKey &&
            domEvents.resolveHotKey($props.item.hotKey, e)
          ) {
            inputEl.value?.click();
          }
        })
      );
    }
  });
});

onUnmounted(() => {
  subscription.unsubscribe();
});

const onChange = async (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    const files = Array.from(
      (
        (e instanceof InputEvent ? e.dataTransfer : e.target) as
          | HTMLInputElement
          | DataTransfer
      ).files || []
    );
    e.target.value = '';
    if (typeof $props.item.action === 'function') {
      try {
        await $props.item.action({ files, closeContextMenu });
      } catch (error) {
        console.error(error);
        $props.core?.errorObserver.next(error as Error);
      }
    } else {
      $emit('files', files);
      $emit('update:model-value', files);
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-element-context-menu-upload {
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
      display: flex;
      gap: 5px;
      align-items: center;
      justify-content: flex-end;
      padding-left: 10px;
      font-family: var(--font-family-workbench-topaz-block);

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

  .wb-element-context-menu & {
    &:not(.disabled):hover > .inner,
    &:not(.disabled):active > .inner,
    &:not(.disabled).force-visible > .inner {
      /* padding-bottom: 1px; */
      filter: var(--filter-default);
    }
  }
}
</style>
