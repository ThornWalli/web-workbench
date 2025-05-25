<template>
  <article
    :id="id"
    class="wb-disks-workbench13-guest-book-entry"
    :class="{ selected, unpublished: !published }"
    @click="onClick">
    <header>
      <div class="meta">
        <div v-if="selectable" class="info">
          <wb-env-element-form-field-checkbox
            :id="id"
            :value="id"
            :model-value="modelValue"
            name="guest-book-entry"
            embed
            :label="id"
            hide-label />
        </div>
        <span class="author">{{ author }}</span>
        <span class="spacer"></span>
        <span class="date">{{ formatDate('H:I:S D.M.Y', date) }}</span>
      </div>
      <div class="subject">{{ subject }}</div>
    </header>
    <p class="message">{{ message }}</p>
  </article>
</template>

<script lang="ts" setup>
import { formatDate } from '@web-workbench/core/utils/string';
import WbEnvElementFormFieldCheckbox from '@web-workbench/core/components/elements/formField/Checkbox.vue';
import { computed } from 'vue';

const $props = defineProps<{
  selectable: boolean;
  published: boolean;
  modelValue?: string[];
  id: string;
  author: string;
  date: number;
  subject: string;
  message: string;
}>();

const selected = computed(() => {
  return $props.modelValue?.includes($props.id);
});

const $emit = defineEmits<{
  (e: 'update:model-value', value: string[]): void;
}>();

function onClick() {
  if ($props.selectable) {
    if ($props.modelValue?.includes($props.id)) {
      $emit(
        'update:model-value',
        $props.modelValue.filter(item => item !== $props.id)
      );
    } else {
      $emit('update:model-value', [...($props.modelValue || []), $props.id]);
    }
  }
}
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-guest-book-entry {
  display: flex;
  flex-direction: column;
  gap: var(--default-element-margin);
  padding: var(--default-element-margin);
  color: var(--workbench-color-1);
  background-color: var(--workbench-color-3);
  box-shadow: 2px 2px 0 2px var(--workbench-color-2);

  &button {
    appearance: none;
    background: none;
    border: none;
  }

  & .subject {
    margin: var(--default-element-margin) 0;
  }

  &.unpublished {
    color: var(--workbench-color-2);
  }

  &:not(:last-child) {
    padding-bottom: calc(2 * var(--default-element-margin));
    border-bottom: 2px solid var(--workbench-color-4);
  }

  &.selected {
    background-color: var(--workbench-color-4);
  }

  & header {
    display: flex;
    flex-direction: column;
    gap: var(--default-element-margin);
    width: 100%;
  }

  & .meta {
    display: flex;
    gap: calc(var(--default-element-margin) * 2);

    & .spacer {
      flex: 1;
    }

    & .info {
      display: flex;
      gap: var(--default-element-margin);
      align-items: center;
    }
  }
}
</style>
