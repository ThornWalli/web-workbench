<template>
  <div class="wb-disks-workbench13-document-editor">
    <atom-input-text name="content" :options="inputTextOptions" :model="model.value" @refresh="onRefreshInputText" />
  </div>
</template>

<script>

import { toRef } from 'vue';
import useWindow, { props as windowProps, emits as windowEmits } from '@/composables/useWindow';
import { CONFIG_NAMES, getDocumentModelValue } from '@/web-workbench/disks/workbench13/utils';
import AtomInputText from '@/components/environments/atoms/InputText';

import contextMenu from '@/web-workbench/disks/workbench13/documentEditor/contextMenu';

export default {
  components: {
    AtomInputText
  },

  props: {
    ...windowProps,
    model: {
      type: Object,
      default () {
        return {
          fsItem: null,
          value: getDocumentModelValue()
        };
      }
    }
  },
  emits: [
    ...windowEmits, 'refresh'
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    windowContext.preserveContextMenu();
    return windowContext;
  },

  computed: {
    inputTextOptions () {
      return {
        focused: this.parentFocused
      };
    },
    showPreview () {
      return this.core.config.observable[CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW];
    }
  },

  watch: {
    'model.value' () {
      this.$nextTick(() => {
        this.$emit('refresh', { scroll: true });
      });
    },
    showPreview (value) {
      this.model.actions.togglePreview(value);
    }
  },

  mounted () {
    if (this.showPreview) {
      this.model.actions.togglePreview();
    }
  },
  methods: {
    onRefreshInputText () {
      this.$emit('refresh', { scroll: true });
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor {
  padding: var(--default-element-margin);
}
</style>
