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
    <p ref="messageEl" class="message" v-html="message"></p>
  </article>
</template>

<script lang="ts" setup>
import { formatDate } from '@web-workbench/core/utils/string';
import WbEnvElementFormFieldCheckbox from '@web-workbench/core/components/elements/formField/Checkbox.vue';
import { computed, onMounted, ref } from 'vue';

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

const messageEl = ref<HTMLElement | null>(null);
function prepareLinks() {
  if (messageEl.value) {
    const urlRegex =
      // eslint-disable-next-line security/detect-unsafe-regex
      /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9\-\\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g;

    messageEl.value.innerHTML = $props.message.replace(
      urlRegex,
      function (url) {
        let fullUrl = url;
        if (!url.match(/^(https?:\/\/)/i) && url.match(/^(www\.)/i)) {
          fullUrl = 'http://' + url;
        } else if (
          !url.match(/^(https?:\/\/)/i) &&
          // eslint-disable-next-line security/detect-unsafe-regex
          url.match(/[a-zA-Z0-9\-\\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/)
        ) {
          fullUrl = 'http://' + url;
        }
        return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      }
    );
  }
}

onMounted(() => {
  prepareLinks();
});
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
  --color-background: var(--color-disks-extras13-guest-book-background, #05a);
  --color-foreground: var(--color-disks-extras13-guest-book-foreground, #fff);
  --color-unpublished-background: var(
    --color-disks-extras13-guest-book-unpublished-background,
    #000
  );
  --color-unpublished-foreground: var(
    --color-disks-extras13-guest-book-unpublished-foreground,
    #fff
  );
  --color-selected-background: var(
    --color-disks-extras13-guest-book-selected-background,
    #fa5
  );
  --color-selected-foreground: var(
    --color-disks-extras13-guest-book-selected-foreground,
    #000
  );
  --color-author: var(--color-disks-extras13-guest-book-author, #fa5);
  --color-link: var(--color-disks-extras13-guest-book-link, #fa5);

  display: flex;
  flex-direction: column;
  gap: var(--default-element-margin);
  padding: calc(var(--default-element-margin) * 2);
  color: var(--color-foreground);
  background-color: var(--color-background);
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
    color: var(--color-unpublished-foreground);
    background-color: var(--color-unpublished-background);
  }

  &.selected {
    color: var(--color-selected-foreground);
    background-color: var(--color-selected-background);
  }

  & header {
    display: flex;
    flex-direction: column;
    gap: var(--default-element-margin);
    width: 100%;
  }

  & .author {
    color: var(--color-author);
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

  & .message {
    & :deep(a) {
      color: var(--color-link);
    }
  }
}
</style>
