<template>
  <wb-form
    ref="rootEl"
    class="wb-disks-workbench13-guest-book-form"
    @submit="onSubmit">
    <wb-markdown :content="content" />
    <wb-form-field-textfield label-top v-bind="fieldAuthor" />
    <wb-form-field-textfield label-top v-bind="fieldSubject" />
    <wb-form-field-textarea fluid label-top v-bind="fieldMessage" />
    <wb-button-wrapper>
      <wb-button style-type="primary" label="Write Entry…" type="submit" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import WbForm from '@web-workbench/core/components/molecules/Form.vue';
import WbFormFieldTextarea from '@web-workbench/core/components/atoms/formField/Textarea.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/atoms/formField/Textfield.vue';
import WbButtonWrapper from '@web-workbench/core/components/molecules/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/atoms/Button.vue';
import type { Entry, EntryContent, Model } from '../types';

import WbMarkdown from '@web-workbench/core/components/atoms/Markdown.vue';

const { core } = useWindow();

const content = ref(`## We’re glad you stopped by!
Feel free to leave us a few words – greetings, thoughts, wishes, or feedback. Your message brings our guestbook to life!`);

const $props = defineProps<{
  model: Model;
  originEntry?: Entry;
}>();

const currentModel = reactive<EntryContent>({
  subject: $props.originEntry?.subject || '',
  message: $props.originEntry?.message || '',
  author: $props.originEntry?.author || ''
});

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const rootEl = ref<HTMLInputElement | null>(null);

const fieldAuthor = computed(() => {
  return {
    required: false,
    label: 'Your Name',
    id: 'author',
    name: 'author',
    modelValue: currentModel.author,
    'onUpdate:model-value': (value: string) => {
      currentModel.author = value;
    },
    placeholder: 'Your Name?'
  };
});

const fieldSubject = computed(() => {
  return {
    required: false,
    label: 'Subject',
    id: 'subject',
    name: 'subject',
    modelValue: currentModel.subject,
    'onUpdate:model-value': (value: string) => {
      currentModel.subject = value;
    },
    placeholder: 'What is your message about?'
  };
});

const fieldMessage = computed(() => {
  return {
    required: false,
    label: 'Message',
    id: 'message',
    name: 'message',
    modelValue: currentModel.message,
    'onUpdate:model-value': (value: string) => {
      currentModel.message = value;
    },
    placeholder: 'What would you like to share?'
  };
});

async function onSubmit() {
  const emptyFields = [];
  if (!currentModel.author) {
    emptyFields.push('author');
  }
  if (!currentModel.subject) {
    emptyFields.push('subject');
  }
  if (!currentModel.message) {
    emptyFields.push('message');
  }
  if (emptyFields.length > 0) {
    const message = `Please fill in the following fields: ${emptyFields.join(', ')}`;
    await core.executeCommand(`openDialog "${message}"`);
    return;
  }

  if ($props.originEntry) {
    $props.model.actions?.editEntry(currentModel, $props.originEntry);
  } else {
    $props.model.actions?.addEntry(currentModel);
  }
}
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-guest-book-form {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: calc(320px);
  height: 100%;
  min-height: calc(160px);
  padding: var(--default-element-margin);
  padding-bottom: calc(var(--default-element-margin) * 3);

  & .wb-env-atom-markdown {
    padding: var(--default-element-margin);
  }

  & .wb-env-atom-form-field-textarea {
    flex: 1;
  }
}
</style>
