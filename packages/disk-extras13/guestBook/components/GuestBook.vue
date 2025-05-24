<template>
  <div ref="rootEl" class="wb-disks-workbench13-guest-book">
    <wb-env-markdown :content="introContent" />
    <wb-env-button-wrapper>
      <wb-env-button
        style-type="primary"
        label="Write Entry…"
        @click="onClickWriteEntry" />
    </wb-env-button-wrapper>
    <wb-separator />
    <section>
      <wb-env-markdown :content="listContent" />
      <div class="entries">
        <guest-book-entry
          v-for="(item, index) in preparedEntries"
          :key="index"
          :selectable="!model.isLocked"
          v-bind="item"
          :model-value="model.selectedEntries"
          @update:model-value="onUpdateModelValue" />
        <div v-if="preparedEntries.length < 1" class="empty">
          This guestbook is still empty…
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../types';
import WbEnvMarkdown from '@web-workbench/core/components/atoms/Markdown.vue';
import WbEnvButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper.vue';
import WbEnvButton from '@web-workbench/core/components/atoms/Button.vue';
import WbSeparator from '@web-workbench/core/components/atoms/Separator.vue';
import GuestBookEntry from './guestBook/Entry.vue';
import { computed } from 'vue';

const $props = defineProps<{
  model: Model;
  introContent: string;
  listContent: string;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

function onClickWriteEntry() {
  $props.model.actions?.writeEntry();
}

function onUpdateModelValue(value: string[]) {
  $props.model.actions?.setSelectedEntries(value);
}

const preparedEntries = computed(() => {
  return Array.from(
    $props.model.entries.filter(
      item => !$props.model.isLocked || item.published
    )
  ).sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    } else if (a.date < b.date) {
      return 1;
    }
    return 0;
  });
});
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-guest-book {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: calc(2 * var(--default-element-margin));
  padding: calc(2 * var(--default-element-margin));

  & section {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: calc(2 * var(--default-element-margin));
  }

  & .entries {
    display: flex;
    flex-direction: column;
    gap: calc(2 * var(--default-element-margin));
  }

  & .empty {
    padding: calc(2 * var(--default-element-margin));
    font-style: italic;
    color: var(--workbench-color-4);
    text-align: center;
  }
}
</style>
